import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import cors from "cors";

// Initialize Firebase Admin for token verification
initializeApp();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.7-flash",
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
      if (status === 503 || status === 429 || status === 404 || status === 500) {
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
