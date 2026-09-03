export type RequirementCategory =
  | "01. Challenge Foundation"
  | "02. Google AI Studio Configuration"
  | "03. Developer Challenge / WORKFORCE Core Flow"
  | "04. Cloud Run Deployment"
  | "05. GitHub & Documentation"
  | "06. Production Hardening"
  | "07. Submission & Evidence";

export type RequirementStatus =
  | "TODO"
  | "READY TO TEST"
  | "PASS"
  | "FAIL"
  | "N/A";

export interface SubmissionRequirement {
  id: string;
  title: string;
  category: RequirementCategory;
  description: string;
  mandatory: boolean;
  blocker: boolean;
  checklist: string[];
  evidence: string;
  status: RequirementStatus;
}

export const REQUIREMENT_CATEGORIES: RequirementCategory[] = [
  "01. Challenge Foundation",
  "02. Google AI Studio Configuration",
  "03. Developer Challenge / WORKFORCE Core Flow",
  "04. Cloud Run Deployment",
  "05. GitHub & Documentation",
  "06. Production Hardening",
  "07. Submission & Evidence",
];

export const INITIAL_SAMPLE_REQUIREMENTS: SubmissionRequirement[] = [
  // --- 02. Google AI Studio Configuration (REQ-01, REQ-03, REQ-04) ---
  {
    id: "REQ-01",
    title: "AI Studio Security Constitution & System Instructions",
    category: "02. Google AI Studio Configuration",
    description:
      "System instructions configured with strict grounding directives, zero speculative claims, and multi-tenant security rules.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Security directives outlined in docs/HACKATHON_FOUNDATION.md",
      "Runtime prompt rules defined in server.ts (ANALYSIS_SYSTEM_INSTRUCTION)",
    ],
    evidence: "docs/HACKATHON_FOUNDATION.md and server.ts system instruction prompt",
    status: "PASS",
  },
  {
    id: "REQ-03",
    title: "Gemini Model Selection & Parameter Tuning",
    category: "02. Google AI Studio Configuration",
    description:
      "Configuration of Gemini 2.5 Flash and Pro with low temperature (0.2) and structured JSON schema enforcement for deterministic analysis.",
    mandatory: true,
    blocker: false,
    checklist: [
      "Default model configured as gemini-2.5-flash with low temperature",
      "Fallback hierarchy configured for resilience",
    ],
    evidence: "server.ts model instantiation and call parameters",
    status: "PASS",
  },
  {
    id: "REQ-04",
    title: "Google AI Studio API Key Provisioning",
    category: "02. Google AI Studio Configuration",
    description:
      "Gemini API key generated via Google AI Studio and configured for secure server-side container injection.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Valid Gemini API Key provisioned via Google AI Studio",
      "Key designated exclusively for backend server consumption",
    ],
    evidence: "Backend environment configuration via GEMINI_API_KEY",
    status: "PASS",
  },

  // --- 03. Developer Challenge / WORKFORCE Core Flow (REQ-02, REQ-07..REQ-13) ---
  {
    id: "REQ-02",
    title: "Firebase Authentication with Google Sign-In",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Secure user authentication with Google OAuth pop-up, client session management, and server-side token verification.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Client authentication via signInWithPopup in src/lib/firebase.ts",
      "Protected routes on frontend and Bearer token verification in server.ts",
    ],
    evidence: "src/lib/firebase.ts, src/components/AuthContext.tsx, and server.ts verifyAuth",
    status: "PASS",
  },
  {
    id: "REQ-07",
    title: "Multi-Turn Gemini Conversational Flow",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Interactive conversational turns retaining history across prompt exchanges via the Gemini API.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Multi-turn history sent via POST /api/chat",
      "Conversational context maintained across successive turns",
    ],
    evidence: "POST /api/chat route in server.ts and src/components/JournalEntry.tsx",
    status: "PASS",
  },
  {
    id: "REQ-08",
    title: "Automatic Summary & History Persistence in Firestore",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Automatic persistence of titles, summaries, timestamps, and conversation records in Cloud Firestore.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Writes conversation entries to users/{userId}/entries/{entryId}",
      "Data restored seamlessly upon page refresh or subsequent login",
    ],
    evidence: "src/components/JournalEntry.tsx saveEntry and Dashboard.tsx",
    status: "PASS",
  },
  {
    id: "REQ-09",
    title: "Per-User Firestore Multi-Tenant Isolation",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Strict document path isolation under users/{userId} ensuring zero unauthorized cross-tenant data leakage.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Firestore queries explicitly scoped to user.uid",
      "User B cannot read or modify User A's data",
    ],
    evidence: "src/components/Dashboard.tsx collection queries and TC-05 audit",
    status: "PASS",
  },
  {
    id: "REQ-10",
    title: "In-Memory SOP Text Extraction (PDF & DOCX)",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Original enhancement: in-memory multi-format SOP extraction for PDF and DOCX files without temporary disk writes.",
    mandatory: true,
    blocker: false,
    checklist: [
      "POST /api/extract-sop endpoint parsing uploaded files via pdf-parse & mammoth",
      "Extracted text fed directly into the analysis pipeline",
    ],
    evidence: "server.ts extract-sop route and src/components/AnalysisWorkspace.tsx",
    status: "PASS",
  },
  {
    id: "REQ-11",
    title: "11-Section Domain Analysis Pipeline (Executable Source Grounding)",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Original enhancement: converts SOPs, executable Bash scripts, and activity context into a validated 11-section JSON schema.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Strict separation between Activity Context and Analysis Evidence (.agents/rules)",
      "Generated schema validates metadata, business, technical, and security sections",
    ],
    evidence: "server.ts POST /api/analyze and ANALYSIS_SYSTEM_INSTRUCTION",
    status: "PASS",
  },
  {
    id: "REQ-12",
    title: "Interactive Analysis Workspace & Multi-Panel Inspection",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Original enhancement: rich user interface supporting dual document uploads and 11 collapsible domain inspection views.",
    mandatory: true,
    blocker: false,
    checklist: [
      "Drag-and-drop file uploaders with file type validation",
      "Visual inspection for all 11 analysis domains with syntax formatting",
    ],
    evidence: "src/components/AnalysisWorkspace.tsx",
    status: "PASS",
  },
  {
    id: "REQ-13",
    title: "Automated Functional Specification Document (FSD) PDF Generation",
    category: "03. Developer Challenge / WORKFORCE Core Flow",
    description:
      "Original enhancement: client-side compilation transforming analysis.json into an enterprise-ready PDF document.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Cover page, document history, and structured tables rendered via React-PDF",
      "One-click export directly from the analysis workspace",
    ],
    evidence: "src/lib/pdfAdapter.ts and pdf-core/ExportTemplatePDF.jsx",
    status: "PASS",
  },

  // --- 04. Cloud Run Deployment (REQ-05, REQ-06) ---
  {
    id: "REQ-05",
    title: "Production Multi-Stage Containerization (Dockerfile)",
    category: "04. Cloud Run Deployment",
    description:
      "Containerized build packaging Vite static frontend and Express backend into an optimized Node.js runtime image.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Multi-stage Dockerfile compiling client assets and bundling server.cjs",
      "Container runs on 0.0.0.0:3000 matching Cloud Run expectations",
    ],
    evidence: "Dockerfile and package.json build script (vite build && esbuild)",
    status: "PASS",
  },
  {
    id: "REQ-06",
    title: "Google Cloud Run Service Deployment & HTTPS Health",
    category: "04. Cloud Run Deployment",
    description:
      "Service deployed to Google Cloud Run with an active public HTTPS URL serving all routes.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Cloud Run service deployed with automatic TLS",
      "Public endpoint responds 200 OK and serves index.html on SPA routes",
    ],
    evidence: "Live Google Cloud Run service URL (.run.app)",
    status: "READY TO TEST",
  },

  // --- 05. GitHub & Documentation (REQ-17, REQ-18, REQ-19) ---
  {
    id: "REQ-17",
    title: "Architectural Foundation & Governance Documents",
    category: "05. GitHub & Documentation",
    description:
      "Comprehensive governance documentation detailing product identity, domain methodology, and instruction hierarchies.",
    mandatory: true,
    blocker: false,
    checklist: [
      "docs/HACKATHON_FOUNDATION.md committed",
      "AGENTS.md and .agents/rules repository guidelines established",
    ],
    evidence: "docs/HACKATHON_FOUNDATION.md and AGENTS.md",
    status: "PASS",
  },
  {
    id: "REQ-18",
    title: "Public Open-Source Repository Structure",
    category: "05. GitHub & Documentation",
    description:
      "Clean public repository on GitHub/GitLab containing readable code, clear commit history, and comprehensive README.",
    mandatory: true,
    blocker: false,
    checklist: [
      "Public repository accessible without credentials",
      "Zero committed secrets or private API keys in git history",
    ],
    evidence: "Public GitHub repository URL and commit log",
    status: "PASS",
  },
  {
    id: "REQ-19",
    title: "Hackathon Submission Audit Matrix",
    category: "05. GitHub & Documentation",
    description:
      "Detailed status audit and gap analysis tracking compliance across all hackathon evaluation criteria.",
    mandatory: false,
    blocker: false,
    checklist: [
      "SUBMISSION_STATUS.md maintained with evidence links",
      "Clear remaining actions and readiness tracking documented",
    ],
    evidence: "SUBMISSION_STATUS.md and hackathon_submission_checklist.md",
    status: "PASS",
  },

  // --- 06. Production Hardening (REQ-14, REQ-15, REQ-16) ---
  {
    id: "REQ-14",
    title: "Google Cloud Secret Manager Integration",
    category: "06. Production Hardening",
    description:
      "Runtime injection of GEMINI_API_KEY from Google Cloud Secret Manager into Cloud Run container environment.",
    mandatory: true,
    blocker: true,
    checklist: [
      "No hardcoded API keys in codebase or repository",
      "Cloud Run environment variable bound to Secret Manager secret",
    ],
    evidence: "server.ts process.env.GEMINI_API_KEY binding and .env.example",
    status: "READY TO TEST",
  },
  {
    id: "REQ-15",
    title: "Zero Frontend API Key Leakage",
    category: "06. Production Hardening",
    description:
      "Strict architectural isolation ensuring Gemini API credentials are never transmitted to or visible within the browser.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Frontend calls only authenticated Express proxy endpoints (/api/*)",
      "Network tab inspection confirms absence of Google API keys in client requests",
    ],
    evidence: "TC-10 Network tab inspection and server-side @google/genai calls",
    status: "PASS",
  },
  {
    id: "REQ-16",
    title: "Firestore Security Rules Deployment & Enforcement",
    category: "06. Production Hardening",
    description:
      "Security rules strictly enforcing request.auth.uid == userId for all reads and writes across entries and sessions.",
    mandatory: true,
    blocker: true,
    checklist: [
      "firestore.rules committed and deployed to target Firebase project",
      "Rules block unauthenticated and cross-user read/write attempts",
    ],
    evidence: "firestore.rules file content",
    status: "PASS",
  },

  // --- 07. Submission & Evidence (REQ-20, REQ-21, REQ-22, REQ-23, REQ-24) ---
  {
    id: "REQ-20",
    title: "Verified Live Cloud Run Application URL",
    category: "07. Submission & Evidence",
    description:
      "Live Google Cloud Run service URL providing interactive access to the deployed application.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Active https://...run.app URL verified in incognito window",
      "Landing page, Google login, and analysis workspace fully operational",
    ],
    evidence: "Live .run.app URL provided in submission form",
    status: "TODO",
  },
  {
    id: "REQ-21",
    title: "End-to-End Walkthrough Demonstration Video",
    category: "07. Submission & Evidence",
    description:
      "3-5 minute video walkthrough demonstrating authentication, journal multi-turn chat, SOP analysis, and PDF download.",
    mandatory: true,
    blocker: true,
    checklist: [
      "Video captures login, conversation, SOP upload, and analysis generation",
      "PDF download and cover page inspected in recording",
    ],
    evidence: "Public YouTube / Vimeo / Cloud video link",
    status: "TODO",
  },
  {
    id: "REQ-22",
    title: "Sample Generated FSD PDF Artifact Attachment",
    category: "07. Submission & Evidence",
    description:
      "Exported sample Functional Specification Document PDF demonstrating real-world automation analysis.",
    mandatory: false,
    blocker: false,
    checklist: [
      "Generated PDF contains cover page, document history, and domain sections",
      "Artifact attached to submission or repository release",
    ],
    evidence: "Sample PDF artifact file",
    status: "READY TO TEST",
  },
  {
    id: "REQ-23",
    title: "Public Social Media Post (#AccelerateAIwithCloudRun)",
    category: "07. Submission & Evidence",
    description:
      "Public social media post highlighting the project, Cloud Run deployment, and hackathon hashtag.",
    mandatory: true,
    blocker: false,
    checklist: [
      "Public post on X, LinkedIn, or similar platform",
      "Includes #AccelerateAIwithCloudRun hashtag and video/screenshot",
    ],
    evidence: "Public social post URL",
    status: "TODO",
  },
  {
    id: "REQ-24",
    title: "Devpost / Platform Final Submission Package",
    category: "07. Submission & Evidence",
    description:
      "Complete submission form including live URL, video link, repo link, architecture summary, and hackathon checklist.",
    mandatory: true,
    blocker: true,
    checklist: [
      "All required form fields completed before deadline",
      "Architecture narrative articulates Cloud Run, Firebase, and Gemini synergy",
    ],
    evidence: "Confirmed submission receipt on hackathon platform",
    status: "TODO",
  },
];
