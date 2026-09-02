import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import cors from "cors";
import multer from "multer";
import * as _pdfParse from "pdf-parse";
// pdf-parse@1 uses `export =` (CJS). Under moduleResolution:bundler the
// runtime default is on .default when transpiled by tsx/esbuild.
const pdfParse = (_pdfParse as unknown as { default: typeof _pdfParse }).default ?? _pdfParse;
import mammoth from "mammoth";

// Initialize Firebase Admin for token verification
// credential: applicationDefault() uses ADC — works on Cloud Run (metadata server)
// and locally when GOOGLE_APPLICATION_CREDENTIALS is set.
initializeApp({
  projectId: "teak-proton-470603-c0",
  credential: applicationDefault(),
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Auth verification middleware
const verifyAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Gemini Chat Endpoint
app.post("/api/chat", verifyAuth, async (req, res) => {
  const data = (req.body && typeof req.body === 'object') ? req.body : {};
  const { messages, systemInstruction } = data;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid messages format" });
    return;
  }

  const models = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash-lite",
  ];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: messages,
        config: {
          systemInstruction,
        },
      });

      res.json({ text: response.text });
      return;
    } catch (error: any) {
      const status = error.status || error.response?.status;
      if (status === 503 || status === 429 || status === 404 || status === 400) {
        console.warn(`Model ${model} failed with status ${status}, trying next...`);
        continue;
      }
      console.error("Non-recoverable error generating content:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
      return;
    }
  }

  res.status(500).json({ error: "All models failed" });
});

// ──────────────────────────────────────────────────────────────────────────────
// SOP Extraction Endpoint
// Accepts a PDF or DOCX file upload (multipart/form-data) and returns the
// extracted plain text. Files are kept in memory only — never persisted.
// ──────────────────────────────────────────────────────────────────────────────

const sopUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB hard cap
});

const EXTRACT_ALLOWED_MIMES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const EXTRACT_ALLOWED_EXTS = new Set([".pdf", ".docx"]);

app.post("/api/extract-sop", verifyAuth, sopUpload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file received." });
    return;
  }

  // Validate extension
  const ext = "." + (file.originalname.split(".").pop() ?? "").toLowerCase();
  if (!EXTRACT_ALLOWED_EXTS.has(ext)) {
    res.status(400).json({ error: "Unsupported file type. Only PDF and DOCX are accepted." });
    return;
  }

  // Validate MIME (double-check against extension)
  if (!EXTRACT_ALLOWED_MIMES.has(file.mimetype)) {
    res.status(400).json({ error: "File MIME type does not match expected format." });
    return;
  }

  try {
    let extractedText: string;

    if (ext === ".pdf") {
      const result = await pdfParse(file.buffer);
      extractedText = result.text;
    } else {
      // .docx
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    }

    if (!extractedText.trim()) {
      res.status(422).json({
        error: "The file was processed but no readable text was found. The document may be image-only or password-protected. Please paste the SOP content manually.",
      });
      return;
    }

    res.json({ text: extractedText });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("SOP extraction failed:", msg);
    res.status(500).json({
      error: "Text extraction failed. The file may be corrupted or password-protected. Please paste the SOP content manually.",
    });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// WORKFORCE Analysis Endpoint
// System instruction is SERVER-CONTROLLED. The client cannot provide or override it.
// SOP content, executable source, and system instruction are never returned to
// the browser in any error or success path.
// ──────────────────────────────────────────────────────────────────────────────

/** Required top-level keys that every valid analysis response must contain. */
const REQUIRED_ANALYSIS_KEYS: ReadonlyArray<string> = [
  "metadata",
  "business",
  "inputs",
  "execution",
  "deployment",
  "dependencies",
  "technical",
  "outputs",
  "security",
  "knowledge_gaps",
  "recommendations",
];

/**
 * Server-side system instruction for the WORKFORCE analysis engine.
 * Never exposed to the client.
 */
const ANALYSIS_SYSTEM_INSTRUCTION = `You are the WORKFORCE Evidence-Grounded Automation Analysis Engine.

Your task is to analyze an automation given three inputs:
1. Activity Context  — metadata/context only, NOT implementation evidence.
2. SOP              — intended/business behavior, NOT proof of implementation.
3. Executable Source — PRIMARY evidence for actual technical implementation.

CORE RULES — strictly follow every rule below:
- Distinguish facts from assumptions at all times.
- Executable Source is the primary evidence for actual behavior (runtime parameters, dependencies, tools, external systems, APIs, workflow, error handling, outputs, security, etc.).
- Activity Context maps directly only to: metadata.app_name, metadata.activity_name, inputs.documents, execution.command, execution.scheduler, deployment.server_path.
- SOP is used only for business purpose, scope, business_process, sop_steps, business_rules.
- Never infer implementation facts from Activity Context or SOP alone.
- Analyze actual execution flow, not a source code inventory. Exclude dead/unused/unreachable code where determinable.
- Never invent facts. If a fact cannot be evidenced, state it as unknown/not evidenced.
- Absence of evidence does NOT automatically mean a gap, limitation, defect, or recommendation.
- Resolve technical behavior into operational meaning only when evidence supports it.
- Sensitive values (credentials, tokens, secrets, internal identifiers) must be replaced with [REDACTED].

RESPONSE FORMAT:
Return ONLY a single valid JSON object. No explanation, no markdown, no code fences.
The JSON object MUST contain exactly these top-level keys:
{
  "metadata": {},
  "business": {},
  "inputs": {},
  "execution": {},
  "deployment": {},
  "dependencies": {},
  "technical": {},
  "outputs": {},
  "security": {},
  "knowledge_gaps": [],
  "recommendations": []
}

Sub-field guidance:
- metadata: app_name, activity_name, description, version, language, entrypoint, analysis_timestamp, document_history
- business: purpose, scope, business_process, sop_steps, business_rules, assumptions, limitations
- inputs: documents, runtime_parameters
- execution: command, scheduler
- deployment: server_path
- dependencies: configuration_files, environment_variables, languages, tools, external_systems, apis
- technical: workflow (actual execution steps evidenced from source), calculations, validations, error_handling
- outputs: generated_files, notifications, reports
- security: findings based on evidenced implementation only
- knowledge_gaps: array of strings — information that is relevant but cannot be determined from available sources
- recommendations: array of strings — only when supported by actual evidence-based findings

For required fields with no available evidence, use an informative placeholder string, not null or empty array.
knowledge_gaps and recommendations MUST be JSON arrays (may be empty arrays if nothing applies).`;

/**
 * Build the analysis prompt from the three inputs.
 * The prompt is constructed server-side; the client never sees it.
 */
function buildAnalysisPrompt(
  activityContext: Record<string, unknown>,
  sopContent: string,
  executableSource: string,
): string {
  return [
    "=== ACTIVITY CONTEXT ===",
    JSON.stringify(activityContext, null, 2),
    "",
    "=== SOP CONTENT ===",
    sopContent,
    "",
    "=== EXECUTABLE SOURCE ===",
    executableSource,
  ].join("\n");
}

/**
 * Strip optional markdown code fences that some models wrap JSON in.
 * e.g.  ```json\n{...}\n```  →  {...}
 */
function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
}

/**
 * Validate that a parsed object contains all required analysis keys and
 * that knowledge_gaps and recommendations are arrays.
 */
function validateAnalysisShape(obj: Record<string, unknown>): string | null {
  for (const key of REQUIRED_ANALYSIS_KEYS) {
    if (!(key in obj)) {
      return `Missing required key: ${key}`;
    }
  }
  if (!Array.isArray(obj.knowledge_gaps)) {
    return "knowledge_gaps must be an array";
  }
  if (!Array.isArray(obj.recommendations)) {
    return "recommendations must be an array";
  }
  return null; // valid
}

app.post("/api/analyze", verifyAuth, async (req, res) => {
  // ── 1. Input validation ────────────────────────────────────────────────────
  const body = (req.body && typeof req.body === "object") ? req.body : {};
  const { activityContext, sopContent, executableSource } = body;

  if (
    activityContext === null ||
    typeof activityContext !== "object" ||
    Array.isArray(activityContext)
  ) {
    res.status(400).json({ error: "Invalid analysis request." });
    return;
  }
  if (typeof sopContent !== "string" || sopContent.trim().length === 0) {
    res.status(400).json({ error: "Invalid analysis request." });
    return;
  }
  if (typeof executableSource !== "string" || executableSource.trim().length === 0) {
    res.status(400).json({ error: "Invalid analysis request." });
    return;
  }

  // ── 2. Build prompt server-side ────────────────────────────────────────────
  const prompt = buildAnalysisPrompt(
    activityContext as Record<string, unknown>,
    sopContent,
    executableSource,
  );

  // ── 3. Call Gemini with model fallback ─────────────────────────────────────
  const models = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash-lite",
  ];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        },
      });

      const rawText: string = response.text ?? "";

      // ── 4. Parse response ──────────────────────────────────────────────────
      let parsed: unknown;
      try {
        parsed = JSON.parse(stripCodeFences(rawText));
      } catch {
        console.error("Analysis: JSON parse failed for model", model);
        // Try next model — the response may be malformed
        continue;
      }

      // Must be a non-null, non-array object
      if (
        parsed === null ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        console.error("Analysis: parsed response is not a plain object, model", model);
        continue;
      }

      const parsedObj = parsed as Record<string, unknown>;

      // ── 5. Structural validation ───────────────────────────────────────────
      const validationError = validateAnalysisShape(parsedObj);
      if (validationError) {
        console.error("Analysis: structural validation failed —", validationError, "— model", model);
        continue;
      }

      // ── 6. Return only the analysis JSON — never raw text, inputs, or keys ─
      res.json({ analysisJson: parsedObj });
      return;

    } catch (error: any) {
      const status = error.status || error.response?.status;
      if (status === 503 || status === 429 || status === 404 || status === 400) {
        console.warn(`Analysis: model ${model} failed with status ${status}, trying next...`);
        continue;
      }
      // Non-recoverable SDK/network error — do not leak details
      console.error("Analysis: non-recoverable error —", error?.message ?? "unknown");
      res.status(500).json({ error: "Analysis could not be completed. Please try again." });
      return;
    }
  }

  // All models exhausted
  res.status(500).json({ error: "Analysis could not be completed. Please try again." });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
