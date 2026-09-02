import React, { useEffect, useRef, useState } from "react";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Terminal,
  Upload,
  X,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { ActivityContext } from "../types";
import { pdf } from "@react-pdf/renderer";
import ExportTemplatePDF from "../../pdf-core/ExportTemplatePDF.jsx";
import { adaptWorkforceToPdf, WorkforceAnalysisJson } from "../lib/pdfAdapter";

// ── Types ──────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  metadata: unknown;
  business: unknown;
  inputs: unknown;
  execution: unknown;
  deployment: unknown;
  dependencies: unknown;
  technical: unknown;
  outputs: unknown;
  security: unknown;
  knowledge_gaps: unknown;
  recommendations: unknown;
}

// ── Analysis section definitions ───────────────────────────────────────────────

const ANALYSIS_SECTIONS: {
  id: keyof AnalysisResult;
  label: string;
  description: string;
}[] = [
    { id: "metadata", label: "Metadata", description: "Automation identity, language, entrypoint, and analysis timestamp." },
    { id: "business", label: "Business", description: "Purpose, scope, SOP steps, business rules, and operational context." },
    { id: "inputs", label: "Inputs", description: "Referenced documents and evidenced runtime parameters." },
    { id: "execution", label: "Execution", description: "Invocation command and scheduler configuration." },
    { id: "deployment", label: "Deployment", description: "Server path and operational deployment location." },
    { id: "dependencies", label: "Dependencies", description: "Configuration files, environment variables, tools, APIs, and external systems." },
    { id: "technical", label: "Technical", description: "Evidenced execution workflow, calculations, validations, and error handling." },
    { id: "outputs", label: "Outputs", description: "Generated files, notifications, and reports." },
    { id: "security", label: "Security", description: "Security findings based on evidenced implementation." },
    { id: "knowledge_gaps", label: "Knowledge Gaps", description: "Information relevant to the automation that cannot be determined from available sources." },
    { id: "recommendations", label: "Recommendations", description: "Evidence-based recommendations for improvement." },
  ];

// ── Empty activity context ─────────────────────────────────────────────────────

const EMPTY_CONTEXT: ActivityContext = {
  app_name: "",
  activity_name: "",
  sop_link: "",
  server_path: "",
  command: "",
  scheduler: "",
};

// ── SectionPanel ───────────────────────────────────────────────────────────────

interface SectionPanelProps {
  /** sectionId instead of key — key is a React internal and must not appear in props. */
  sectionId: string;
  label: string;
  description: string;
  value: unknown;
}

function SectionPanel({ sectionId, label, description, value }: SectionPanelProps) {
  const [open, setOpen] = useState(false);
  const isEmpty = value === undefined || value === null;
  const headingId = `section-heading-${sectionId}`;

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        type="button"
        id={`section-btn-${sectionId}`}
        aria-expanded={open}
        aria-controls={`section-body-${sectionId}`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-600"
      >
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              "w-2 h-2 rounded-full shrink-0",
              isEmpty ? "bg-zinc-700" : "bg-emerald-500"
            )}
            aria-hidden="true"
          />
          <span id={headingId} className="text-sm font-semibold text-zinc-200">
            {label}
          </span>
          <span className="hidden sm:inline text-xs text-zinc-500">{description}</span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id={`section-body-${sectionId}`}
          role="region"
          aria-labelledby={headingId}
          className="px-5 py-4 border-t border-zinc-800 bg-zinc-950/60"
        >
          {isEmpty ? (
            <p className="text-xs text-zinc-600 italic">
              No analysis data yet. Run an analysis to populate this section.
            </p>
          ) : (
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-words font-mono leading-relaxed">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

// ── FormField ──────────────────────────────────────────────────────────────────

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "url";
}

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-zinc-400 uppercase tracking-widest"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-colors"
      />
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}

// ── TextareaField ──────────────────────────────────────────────────────────────

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  required?: boolean;
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 8,
  required,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-zinc-400 uppercase tracking-widest"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-required={required}
        className="bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-colors resize-y font-mono leading-relaxed"
      />
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}

// ── FileUploadZone ─────────────────────────────────────────────────────────────

type ArtifactKind = "sop" | "bash";

interface AcceptSpec {
  label: string;
  mimeTypes: string;
  extensions: string[];
}

const ACCEPT_SPECS: Record<ArtifactKind, AcceptSpec> = {
  sop: {
    label: "PDF / DOCX / TXT / MD",
    mimeTypes:
      "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown",
    extensions: [".pdf", ".docx", ".txt", ".md"],
  },
  bash: {
    label: ".sh / .bash",
    mimeTypes: "text/x-sh,application/x-sh,text/plain",
    extensions: [".sh", ".bash"],
  },
};

interface FileUploadZoneProps {
  id: string;
  kind: ArtifactKind;
  file: File | null;
  onFile: (f: File | null) => void;
  required?: boolean;
}

function FileUploadZone({ id, kind, file, onFile, required }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const spec = ACCEPT_SPECS[kind];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
    if (!spec.extensions.includes(ext)) return;
    onFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const Icon = kind === "sop" ? FileText : Terminal;

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden native input — required forwarded here so browser validates */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={spec.mimeTypes}
        required={required && !file}
        aria-required={required}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Icon className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm text-zinc-200 truncate font-medium">{file.name}</p>
              <p className="text-[11px] text-zinc-600">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Remove ${file.name}`}
            onClick={() => {
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Upload ${spec.label} file`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-colors",
            isDragging
              ? "border-zinc-500 bg-zinc-900/60"
              : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30"
          )}
        >
          <Upload className="w-6 h-6 text-zinc-600" aria-hidden="true" />
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              Drop file here or{" "}
              <span className="text-zinc-200 font-semibold underline underline-offset-2">
                browse
              </span>
            </p>
            <p className="text-[11px] text-zinc-600 mt-0.5">Accepted: {spec.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SourceArtifactField ────────────────────────────────────────────────────────
// Upload zone (primary) + optional text paste fallback

interface SourceArtifactFieldProps {
  uploadId: string;
  pasteId: string;
  kind: ArtifactKind;
  file: File | null;
  pasteText: string;
  onFile: (f: File | null) => void;
  onPaste: (v: string) => void;
  required?: boolean;
}

function SourceArtifactField({
  uploadId,
  pasteId,
  kind,
  file,
  pasteText,
  onFile,
  onPaste,
  required,
}: SourceArtifactFieldProps) {
  // Auto-reveal textarea when pasteText is populated externally (e.g. after extraction)
  const [showPaste, setShowPaste] = useState(() => pasteText.trim() !== "");
  useEffect(() => {
    if (pasteText.trim() !== "") setShowPaste(true);
  }, [pasteText]);

  const spec = ACCEPT_SPECS[kind];
  const fallbackLabel = spec.label.split(" / ")[0];

  return (
    <div className="space-y-3">
      <FileUploadZone
        id={uploadId}
        kind={kind}
        file={file}
        onFile={onFile}
        required={required && !showPaste}
      />
      <button
        type="button"
        onClick={() => setShowPaste((v) => !v)}
        className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
      >
        {showPaste ? "Hide text input" : `Can't upload? Paste ${fallbackLabel} content instead`}
      </button>
      {showPaste && (
        <TextareaField
          id={pasteId}
          label=""
          value={pasteText}
          onChange={onPaste}
          placeholder={kind === "sop" ? "Paste SOP content here…" : "Paste executable source code here…"}
          rows={kind === "sop" ? 10 : 14}
          required={required && !file}
        />
      )}
    </div>
  );
}

// ── SectionHeading ─────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  required?: boolean;
}

function SectionHeading({ id, title, subtitle, required }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
        {title}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </h2>
      {subtitle && <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AnalysisWorkspace() {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [activityContext, setActivityContext] = useState<ActivityContext>(EMPTY_CONTEXT);

  // Source artifacts — file upload (primary) + text paste (fallback)
  const [sopFile, setSopFile] = useState<File | null>(null);
  const [sopPasteText, setSopPasteText] = useState("");
  const [bashFile, setBashFile] = useState<File | null>(null);
  const [bashPasteText, setBashPasteText] = useState("");

  // SOP extraction state — tracks async server-side extraction for PDF/DOCX
  const [sopExtractState, setSopExtractState] = useState<
    "idle" | "extracting" | { error: string }
  >("idle");

  // ── UI state ────────────────────────────────────────────────────────────────
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const hasSop = sopFile !== null || sopPasteText.trim() !== "";
  const hasBash = bashFile !== null || bashPasteText.trim() !== "";

  const updateContext = (field: keyof ActivityContext) => (value: string) => {
    setActivityContext((prev) => ({ ...prev, [field]: value }));
  };

  // ── handleSopFile ──────────────────────────────────────────────────────────
  // Called by SourceArtifactField when the user picks a SOP file.
  // - .txt / .md  → read client-side via File.text(), no server round-trip.
  // - .pdf / .docx → POST to /api/extract-sop, populate sopPasteText with result.
  // Analysis is NOT triggered automatically.
  const handleSopFile = async (f: File | null) => {
    setSopFile(f);
    setSopExtractState("idle");

    if (!f) {
      // User cleared the file
      return;
    }

    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();

    if (ext === ".txt" || ext === ".md") {
      // Client-side text read — no network call needed
      try {
        const text = await f.text();
        setSopPasteText(text);
      } catch {
        setSopExtractState({ error: "Could not read the file. Please paste the SOP content manually." });
      }
      return;
    }

    // PDF or DOCX — server-side extraction
    setSopExtractState("extracting");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setSopExtractState({ error: "You must be signed in to extract SOP content." });
        return;
      }
      const idToken = await currentUser.getIdToken();

      const formData = new FormData();
      formData.append("file", f);

      const response = await fetch("/api/extract-sop", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });

      const data = await response.json() as { text?: string; error?: string };

      if (!response.ok || !data.text) {
        setSopExtractState({
          error: data.error ?? "Extraction failed. Please paste the SOP content manually.",
        });
        return;
      }

      setSopPasteText(data.text);
      setSopExtractState("idle");
    } catch {
      setSopExtractState({
        error: "A network error occurred during extraction. Please paste the SOP content manually.",
      });
    }
  };

  const canSubmit =
    activityContext.app_name.trim() !== "" &&
    activityContext.activity_name.trim() !== "" &&
    hasSop &&
    hasBash &&
    !isAnalyzing;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // ── 1. Resolve executableSource (bash file → text, or paste fallback) ──
      let executableSource = bashPasteText;
      if (bashFile) {
        executableSource = await bashFile.text();
      }
      if (!executableSource.trim()) {
        setAnalysisError("Bash script content is empty. Please upload a file or paste content.");
        return;
      }

      // ── 2. Resolve sopContent ─────────────────────────────────────────────
      // For PDF/DOCX: handleSopFile already extracted text into sopPasteText.
      // For txt/md:   handleSopFile already read text into sopPasteText.
      // For any file type that slipped through without extraction, fall back
      // to file.text() as a last resort (plain-text readable files only).
      let sopContent = sopPasteText;
      if (!sopContent.trim() && sopFile) {
        try {
          sopContent = await sopFile.text();
        } catch {
          // ignore — empty sopContent will surface the error below
        }
      }
      if (!sopContent.trim()) {
        setAnalysisError("SOP content is empty. Please upload a SOP file or paste content using the text input.");
        return;
      }

      // ── 3. Get Firebase ID token ───────────────────────────────────────────
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setAnalysisError("You must be signed in to run an analysis.");
        return;
      }
      const idToken = await currentUser.getIdToken(/* forceRefresh */ true);

      // ── 4. Call /api/analyze ───────────────────────────────────────────────
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          activityContext,
          sopContent,
          executableSource,
        }),
      });

      if (!response.ok) {
        // Surface only a generic message — do not expose request body in errors
        setAnalysisError(
          response.status === 401
            ? "Authentication failed. Please sign in and try again."
            : response.status === 413
            ? "The request payload is too large. Please reduce the size of the SOP or script content."
            : "Analysis could not be completed. Please try again."
        );
        return;
      }

      const data = await response.json() as { analysisJson?: AnalysisResult };

      if (!data.analysisJson) {
        setAnalysisError("The server returned an unexpected response. Please try again.");
        return;
      }

      setAnalysisResult(data.analysisJson);
    } catch {
      // Do not log or expose request content
      setAnalysisError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!analysisResult) return;
    try {
      setIsGeneratingPdf(true);
      setPdfError(null);
      const adaptedDoc = adaptWorkforceToPdf(analysisResult as unknown as WorkforceAnalysisJson);
      const element = React.createElement(ExportTemplatePDF, { doc: adaptedDoc });

      // React 19 Reconciler compatibility:
      // In React 19, container reconciliation is concurrent/asynchronous.
      // Calling toBlob() immediately before container.document mounts causes:
      // "TypeError: Cannot read properties of null (reading 'props')"
      const instance = pdf();
      await new Promise<void>((resolve) => {
        let isDone = false;
        const checkDone = () => {
          if (!isDone && (instance as any).container?.document) {
            isDone = true;
            resolve();
          }
        };

        (instance as any).on?.("change", checkDone);
        (instance as any).updateContainer(element, checkDone);

        // Polling fallback to catch when reconciler commits
        const interval = setInterval(() => {
          if ((instance as any).container?.document) {
            clearInterval(interval);
            checkDone();
          }
        }, 25);

        // Safety timeout
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 5000);
      });

      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const rawMeta = (analysisResult as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
      const appName = String(rawMeta?.app_name || "Automation").replace(/[^a-zA-Z0-9_-]/g, "_");
      const activityName = String(rawMeta?.activity_name || "Activity").replace(/[^a-zA-Z0-9_-]/g, "_");
      link.href = url;
      link.download = `FSD_${appName}_${activityName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("PDF generation failed:", err);
      console.error("PDF error detail:", msg);
      setPdfError(`PDF Error: ${msg.slice(0, 120)}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 md:px-10 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to Dashboard"
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" aria-hidden="true" />
          </button>
          <div>
            <span className="text-sm font-bold text-white tracking-wide">Analysis Workspace</span>
            <span className="hidden md:inline ml-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
              WORKFORCE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-400 font-bold">
            Gemini Active
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* ── Page title ────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Automation Analysis</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Provide activity information, upload your source artifacts, and fill in the automation
            context. The engine will produce an evidence-grounded structured analysis.
          </p>
        </div>

        {/* ── Input form ────────────────────────────────────────────────────── */}
        <form
          id="analysis-form"
          onSubmit={handleAnalyze}
          aria-label="Automation analysis form"
          className="space-y-10"
        >
          {/* ── 1. Activity Information ──────────────────────────────────────── */}
          <section aria-labelledby="activity-info-heading">
            <SectionHeading
              id="activity-info-heading"
              title="1 · Activity Information"
              subtitle="Identity metadata for this automation activity."
            />
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                id="app-name"
                label="App Name"
                value={activityContext.app_name}
                onChange={updateContext("app_name")}
                placeholder="e.g. MYADS"
                required
              />
              <FormField
                id="activity-name"
                label="Activity Name"
                value={activityContext.activity_name}
                onChange={updateContext("activity_name")}
                placeholder="e.g. Check Log Transaction"
                required
              />
            </div>
          </section>

          {/* ── 2. Source Artifacts ──────────────────────────────────────────── */}
          <section aria-labelledby="source-artifacts-heading">
            <SectionHeading
              id="source-artifacts-heading"
              title="2 · Source Artifacts"
              subtitle="Upload your SOP document and Bash script. These are the primary inputs for the analysis engine. Text paste is available as a fallback."
              required
            />
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-8">
              {/* SOP Document */}
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                  SOP Document
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  <span className="ml-2 normal-case font-normal text-zinc-600">
                    — business purpose, scope, and operational steps
                  </span>
                </p>
                <SourceArtifactField
                  uploadId="sop-file"
                  pasteId="sop-paste"
                  kind="sop"
                  file={sopFile}
                  pasteText={sopPasteText}
                  onFile={handleSopFile}
                  onPaste={setSopPasteText}
                  required
                />

                {/* SOP extraction status — shown only for PDF/DOCX uploads */}
                {sopExtractState === "extracting" && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-2 text-xs text-zinc-400"
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                    <span>Extracting SOP text from file…</span>
                  </div>
                )}
                {typeof sopExtractState === "object" && "error" in sopExtractState && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-2 text-xs text-amber-400"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{sopExtractState.error}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-800/60" />

              {/* Bash Script */}
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                  Bash Script
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  <span className="ml-2 normal-case font-normal text-zinc-600">
                    — primary evidence for all technical analysis conclusions
                  </span>
                </p>
                <SourceArtifactField
                  uploadId="bash-file"
                  pasteId="bash-paste"
                  kind="bash"
                  file={bashFile}
                  pasteText={bashPasteText}
                  onFile={setBashFile}
                  onPaste={setBashPasteText}
                  required
                />
              </div>
            </div>
          </section>

          {/* ── 3. Automation Context ─────────────────────────────────────────── */}
          <section aria-labelledby="automation-context-heading">
            <SectionHeading
              id="automation-context-heading"
              title="3 · Automation Context"
              subtitle="Explicit metadata used for direct field mapping only — not as implementation evidence."
            />
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                id="sop-link"
                label="SOP Confluence Link"
                value={activityContext.sop_link}
                onChange={updateContext("sop_link")}
                placeholder="https://confluence.example.com/sop/..."
                type="url"
              />
              <FormField
                id="server-path"
                label="Server / Automation Path"
                value={activityContext.server_path}
                onChange={updateContext("server_path")}
                placeholder="e.g. /apps/itsmops/myads/checklog_transaction"
              />
              <FormField
                id="command"
                label="Command"
                value={activityContext.command}
                onChange={updateContext("command")}
                placeholder="e.g. sh automation.sh <MSISDN>"
              />
              <FormField
                id="scheduler"
                label="Scheduler"
                value={activityContext.scheduler}
                onChange={updateContext("scheduler")}
                placeholder="e.g. 0 */5 * * *"
                hint="Cron expression or human-readable schedule, if applicable."
              />
            </div>
          </section>

          {/* ── Submit ───────────────────────────────────────────────────────── */}
          <div className="space-y-4 pt-2">
            {analysisError && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" aria-hidden="true" />
                <p className="text-sm text-red-300">{analysisError}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-700 uppercase tracking-widest font-bold">
                Evidence-grounded · Gemini-powered · Secure
              </p>
              <button
                id="analyze-btn"
                type="submit"
                form="analysis-form"
                disabled={!canSubmit}
                aria-busy={isAnalyzing}
                className={clsx(
                  "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all",
                  canSubmit
                    ? "bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    Analyze Automation
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ── Analysis Result Workspace ──────────────────────────────────────── */}
        <section aria-labelledby="analysis-result-heading">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2
                id="analysis-result-heading"
                className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500"
              >
                Analysis Result
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Structured output across 11 evidence-grounded sections.
              </p>
            </div>
            {analysisResult && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
                    aria-hidden="true"
                  />
                  Analysis Complete
                </span>
                <button
                  type="button"
                  id="generate-pdf-btn"
                  onClick={handleGeneratePdf}
                  disabled={isGeneratingPdf}
                  aria-busy={isGeneratingPdf}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Generating PDF…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Generate PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {pdfError && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl" role="alert">
              <p className="text-xs text-red-300">{pdfError}</p>
            </div>
          )}

          {/* Loading state — shown while /api/analyze is in flight */}
          {isAnalyzing && (
            <div
              role="status"
              aria-live="polite"
              aria-label="Analysis in progress"
              className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl px-5 py-4 mb-4"
            >
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm text-zinc-300 font-medium">Analyzing automation…</p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  The Gemini engine is processing your inputs. This may take up to 30 seconds.
                </p>
              </div>
            </div>
          )}

          {/* 11 section shells rendered unconditionally — empty state shown until analysis runs */}
          <div role="region" aria-label="Analysis result sections" className="space-y-2">
            {ANALYSIS_SECTIONS.map(({ id, label, description }) => (
              <div key={id}>
                <SectionPanel
                  sectionId={id}
                  label={label}
                  description={description}
                  value={analysisResult ? (analysisResult as Record<string, unknown>)[id] : undefined}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
