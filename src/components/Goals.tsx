import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logout } from "../lib/firebase";
import {
  Plus,
  Book,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
  GitBranch,
  Server,
  FileText,
  CheckSquare,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  Workflow,
} from "lucide-react";
import clsx from "clsx";
import {
  RequirementCategory,
  RequirementStatus,
  SubmissionRequirement,
  REQUIREMENT_CATEGORIES,
  INITIAL_SAMPLE_REQUIREMENTS,
} from "../types/goals";

const STORAGE_KEY = "workforce_submission_readiness_status_v1";

const ALL_STATUSES: RequirementStatus[] = [
  "TODO",
  "READY TO TEST",
  "PASS",
  "FAIL",
  "N/A",
];

type FilterOption =
  | "All"
  | "Blockers"
  | "Mandatory"
  | "Pending"
  | "Failed"
  | "Passed";

const FILTER_OPTIONS: FilterOption[] = [
  "All",
  "Blockers",
  "Mandatory",
  "Pending",
  "Failed",
  "Passed",
];

const categoryMeta: Record<
  RequirementCategory,
  { icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  "01. Challenge Foundation": {
    icon: BookOpen,
    description: "Architectural context, starter decoupling, and core platform foundations",
  },
  "02. Google AI Studio Configuration": {
    icon: Sparkles,
    description: "System instructions, Gemini model parameters, and security constitution",
  },
  "03. Developer Challenge / WORKFORCE Core Flow": {
    icon: Workflow,
    description: "Firebase Auth, Firestore persistence, SOP extraction, and domain analysis pipeline",
  },
  "04. Cloud Run Deployment": {
    icon: Server,
    description: "Containerized service build, deployment, and live public HTTPS availability",
  },
  "05. GitHub & Documentation": {
    icon: GitBranch,
    description: "Open-source repository, architectural foundation, and audit status",
  },
  "06. Production Hardening": {
    icon: Lock,
    description: "Secret Manager injection, backend proxy isolation, and Firestore security rules",
  },
  "07. Submission & Evidence": {
    icon: FileText,
    description: "Walkthrough demo video, sample artifacts, and public submission assets",
  },
};

const statusStyles: Record<
  RequirementStatus,
  { badge: string; activeBtn: string }
> = {
  PASS: {
    badge: "bg-emerald-950/40 text-emerald-400 border-emerald-800/50",
    activeBtn: "bg-emerald-950/80 border-emerald-700/80 text-emerald-300 font-semibold shadow-[0_0_8px_rgba(16,185,129,0.15)]",
  },
  FAIL: {
    badge: "bg-red-950/40 text-red-400 border-red-800/50",
    activeBtn: "bg-red-950/80 border-red-700/80 text-red-300 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.15)]",
  },
  "READY TO TEST": {
    badge: "bg-blue-950/40 text-blue-400 border-blue-800/50",
    activeBtn: "bg-blue-950/70 border-blue-700/70 text-blue-300 font-semibold",
  },
  TODO: {
    badge: "bg-zinc-800/50 text-zinc-400 border-zinc-700/50",
    activeBtn: "bg-zinc-800 border-zinc-600 text-zinc-200 font-semibold",
  },
  "N/A": {
    badge: "bg-zinc-900/60 text-zinc-500 border-zinc-800",
    activeBtn: "bg-zinc-800/80 border-zinc-700 text-zinc-400 font-semibold",
  },
};

function getInitialRequirements(): SubmissionRequirement[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_REQUIREMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If parsed data is an array of full objects from legacy versions, clear and fallback
      if (Array.isArray(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        return INITIAL_SAMPLE_REQUIREMENTS;
      }
      if (typeof parsed === "object" && parsed !== null) {
        const hasValidKey = INITIAL_SAMPLE_REQUIREMENTS.some(
          (req) => req.id in parsed
        );
        if (!hasValidKey) {
          localStorage.removeItem(STORAGE_KEY);
          return INITIAL_SAMPLE_REQUIREMENTS;
        }
        return INITIAL_SAMPLE_REQUIREMENTS.map((req) => ({
          ...req,
          status: parsed[req.id] || req.status,
        }));
      }
    }
  } catch (err) {
    console.error("Error reading localStorage for checklist statuses:", err);
  }
  return INITIAL_SAMPLE_REQUIREMENTS;
}

export default function Goals() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Requirements loaded with local persistence
  const [requirements, setRequirements] = useState<SubmissionRequirement[]>(
    getInitialRequirements
  );

  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleStatusChange = (id: string, newStatus: RequirementStatus) => {
    setRequirements((prev) => {
      const updated = prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      );
      try {
        const map: Record<string, RequirementStatus> = {};
        updated.forEach((r) => {
          map[r.id] = r.status;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch (err) {
        console.error("Error writing localStorage for checklist statuses:", err);
      }
      return updated;
    });
  };

  const handleResetStatuses = () => {
    if (window.confirm("Reset all checklist statuses to their defaults?")) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Error clearing localStorage:", err);
      }
      setRequirements(INITIAL_SAMPLE_REQUIREMENTS);
    }
  };

  const toggleSection = (category: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const allCollapsed = REQUIREMENT_CATEGORIES.every(
    (cat) => !!collapsedSections[cat]
  );

  const toggleAllSections = () => {
    if (allCollapsed) {
      setCollapsedSections({});
    } else {
      const next: Record<string, boolean> = {};
      REQUIREMENT_CATEGORIES.forEach((cat) => {
        next[cat] = true;
      });
      setCollapsedSections(next);
    }
  };

  // --- Summary & Decision Logic ---
  const totalRequirements = requirements.length;
  const completed = requirements.filter((r) => r.status === "PASS").length;
  const failed = requirements.filter((r) => r.status === "FAIL").length;
  const pending = requirements.filter(
    (r) => r.status === "TODO" || r.status === "READY TO TEST"
  ).length;
  const blockersRemaining = requirements.filter(
    (r) => r.blocker && r.status !== "PASS"
  ).length;

  const mandatoryRequirements = requirements.filter((r) => r.mandatory);
  const mandatoryPassed = mandatoryRequirements.filter(
    (r) => r.status === "PASS"
  ).length;
  const mandatoryFailed = mandatoryRequirements.filter(
    (r) => r.status === "FAIL"
  ).length;

  // Submission Readiness %: mandatory PASS / total mandatory * 100
  // Note: N/A does not count as PASS for mandatory requirements
  const readinessPercent =
    mandatoryRequirements.length > 0
      ? Math.round((mandatoryPassed / mandatoryRequirements.length) * 100)
      : 100;

  // Decision logic: GO only when every blocker requirement is PASS AND no mandatory requirements with FAIL
  const isGo = blockersRemaining === 0 && mandatoryFailed === 0;

  const getFilterCount = (filter: FilterOption): number => {
    switch (filter) {
      case "Blockers":
        return requirements.filter((r) => r.blocker).length;
      case "Mandatory":
        return requirements.filter((r) => r.mandatory).length;
      case "Pending":
        return requirements.filter(
          (r) => r.status === "TODO" || r.status === "READY TO TEST"
        ).length;
      case "Failed":
        return requirements.filter((r) => r.status === "FAIL").length;
      case "Passed":
        return requirements.filter((r) => r.status === "PASS").length;
      case "All":
      default:
        return requirements.length;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row text-zinc-300 font-sans">
      {/* Existing Sidebar Preserved Visually Untouched */}
      <aside className="w-full md:w-[280px] bg-[#0d0d0d] border-r border-zinc-800 p-8 flex flex-col shrink-0 h-auto md:h-screen">
        <div className="flex flex-col h-full">
          <h1
            className="text-2xl font-serif italic text-white tracking-tighter mb-8 flex items-center gap-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <img
              src="/logo.png"
              alt="WORKFORCE"
              className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            />
            WORKFORCE
          </h1>

          <Link
            to="/entry/new"
            className="w-full py-3 px-4 border border-zinc-800 rounded-xl text-xs font-semibold tracking-widest text-zinc-400 uppercase hover:bg-zinc-800 transition-colors mb-10 text-center flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Reflection
          </Link>

          <nav className="flex-1 space-y-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 font-bold">
                Menu
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 text-sm font-semibold text-zinc-400 hover:text-white transition-colors py-2"
                  >
                    <Book className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/goals"
                    className="flex items-center gap-3 text-sm font-semibold text-white transition-colors py-2"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    Goals
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="pt-6 border-t border-zinc-800 flex justify-between items-center text-[10px] tracking-widest text-zinc-600 uppercase font-bold">
            <div className="flex items-center gap-3 overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-zinc-800" />
              )}
              <span className="truncate">{user?.displayName || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hover:text-zinc-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a] relative p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl w-full mx-auto space-y-8">
          <header className="border-b border-zinc-800/60 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                Readiness Matrix
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500">
                WORKFORCE Hackathon
              </span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-serif italic text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Submission Readiness
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Evidence-grounded audit matrix covering compliance, core workflows, security, and final deliverables.
            </p>
          </header>

          {/* Top Summary Metrics Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* Total Requirements */}
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/60 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold leading-tight">
                Total Requirements
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {totalRequirements}
              </div>
            </div>

            {/* Completed */}
            <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/30 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-bold">
                Completed
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {completed}
              </div>
            </div>

            {/* Failed */}
            <div className="bg-red-950/20 p-3.5 rounded-xl border border-red-900/30 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-widest text-red-500/80 font-bold">
                Failed
              </div>
              <div className="text-2xl font-bold text-red-400 mt-1">
                {failed}
              </div>
            </div>

            {/* Pending */}
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/60 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Pending
              </div>
              <div className="text-2xl font-bold text-zinc-300 mt-1">
                {pending}
              </div>
            </div>

            {/* Blockers */}
            <div
              className={clsx(
                "p-3.5 rounded-xl border flex flex-col justify-between transition-colors",
                blockersRemaining > 0
                  ? "bg-amber-950/20 border-amber-900/40"
                  : "bg-zinc-900/40 border-zinc-800/60"
              )}
            >
              <div
                className={clsx(
                  "text-[10px] uppercase tracking-widest font-bold",
                  blockersRemaining > 0 ? "text-amber-400" : "text-zinc-500"
                )}
              >
                Blockers
              </div>
              <div
                className={clsx(
                  "text-2xl font-bold mt-1",
                  blockersRemaining > 0 ? "text-amber-400" : "text-zinc-500"
                )}
              >
                {blockersRemaining}
              </div>
            </div>

            {/* Submission Readiness % */}
            <div className="bg-blue-950/20 p-3.5 rounded-xl border border-blue-900/30 flex flex-col justify-between">
              <div className="text-[10px] uppercase tracking-widest text-blue-400/80 font-bold leading-tight">
                Submission Readiness
              </div>
              <div className="text-2xl font-bold text-blue-300 mt-1">
                {readinessPercent}%
              </div>
            </div>

            {/* Decision */}
            <div
              className={clsx(
                "p-3.5 rounded-xl border flex flex-col justify-between transition-colors",
                isGo
                  ? "bg-emerald-950/30 border-emerald-700/60"
                  : "bg-red-950/30 border-red-800/60"
              )}
            >
              <div
                className={clsx(
                  "text-[10px] uppercase tracking-widest font-bold",
                  isGo ? "text-emerald-400" : "text-red-400"
                )}
              >
                Decision
              </div>
              <div
                className={clsx(
                  "text-2xl font-bold mt-1 tracking-wider",
                  isGo ? "text-emerald-400" : "text-red-400"
                )}
              >
                {isGo ? "GO" : "NO-GO"}
              </div>
            </div>
          </div>

          {/* Filtering Bar & Section Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-2 shrink-0">
                Filter:
              </span>
              {FILTER_OPTIONS.map((opt) => {
                const isSelected = activeFilter === opt;
                const count = getFilterCount(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setActiveFilter(opt)}
                    className={clsx(
                      "px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0",
                      isSelected
                        ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    )}
                  >
                    <span>{opt}</span>
                    <span
                      className={clsx(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded",
                        isSelected
                          ? "bg-zinc-700 text-white"
                          : "bg-zinc-800/60 text-zinc-500"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={toggleAllSections}
                className="text-[11px] text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-zinc-800/80 hover:bg-zinc-800/40 transition-colors"
              >
                {allCollapsed ? "Expand All" : "Collapse All"}
              </button>
              <button
                type="button"
                onClick={handleResetStatuses}
                title="Reset checklist statuses to default"
                className="text-[11px] text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg border border-zinc-800/80 hover:bg-zinc-800/40 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Seven Codelab Requirement Sections */}
          <div className="space-y-10">
            {REQUIREMENT_CATEGORIES.map((category) => {
              const isFoundation = category === "01. Challenge Foundation";
              const categoryItems = requirements.filter((r) => r.category === category);
              const meta = categoryMeta[category] || {
                icon: ShieldCheck,
                description: "",
              };
              const IconComponent = meta.icon || ShieldCheck;
              const isCollapsed = !!collapsedSections[category];

              if (isFoundation) {
                return (
                  <section key={category} className="space-y-4">
                    <div
                      onClick={() => toggleSection(category)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/50 pb-3 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 group-hover:border-zinc-700 transition-colors">
                          <IconComponent className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-white tracking-wide group-hover:text-zinc-100 transition-colors">
                              {category}
                            </h2>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {meta.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-900/40 shrink-0">
                          Architecture Foundation
                        </span>
                        <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors p-1">
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/20 to-zinc-950/60 p-5 rounded-xl border border-zinc-800/60 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              Starter Scaffolding Extension
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              WORKFORCE extends the official Google Cloud Run & Gemini Hackathon <span className="text-zinc-200 font-medium">Personal Gemini Journal</span> starter scaffolding, inheriting its authenticated multi-tenant structure while transforming its core purpose.
                            </p>
                          </div>

                          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                              Intentional Product Differentiation
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              The final app is intentionally differentiated into an enterprise-ready <span className="text-zinc-200 font-medium">Evidence-Grounded Automation Analysis Engine</span> rather than a personal diary, featuring SOP extraction, script parsing, and FSD generation.
                            </p>
                          </div>

                          <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                              Secure AI Architecture Foundation
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Secure authenticated AI architecture is the bedrock: Firebase Authentication, per-user Cloud Firestore isolation (<code className="text-[11px] text-zinc-300 font-mono">users/{'{userId}'}</code>), Google Cloud Secret Manager key segregation, and zero client key leakage.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                );
              }

              // Filter category items based on activeFilter
              const filteredItems = categoryItems.filter((r) => {
                switch (activeFilter) {
                  case "Blockers":
                    return r.blocker;
                  case "Mandatory":
                    return r.mandatory;
                  case "Pending":
                    return r.status === "TODO" || r.status === "READY TO TEST";
                  case "Failed":
                    return r.status === "FAIL";
                  case "Passed":
                    return r.status === "PASS";
                  case "All":
                  default:
                    return true;
                }
              });

              return (
                <section key={category} className="space-y-4">
                  <div
                    onClick={() => toggleSection(category)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/50 pb-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 group-hover:border-zinc-700 transition-colors">
                        <IconComponent className="w-4 h-4 text-zinc-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-white tracking-wide group-hover:text-zinc-100 transition-colors">
                            {category}
                          </h2>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800 shrink-0">
                        {filteredItems.length} of {categoryItems.length}
                      </span>
                      <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors p-1">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <>
                      {filteredItems.length === 0 ? (
                        <div className="text-xs text-zinc-600 italic py-4 px-5 rounded-xl border border-zinc-900 bg-zinc-950/30">
                          {categoryItems.length === 0
                            ? "No requirements defined in this section yet."
                            : `No requirements match the "${activeFilter}" filter in this section.`}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredItems.map((req) => (
                            <div
                              key={req.id}
                              className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/60 hover:border-zinc-700/60 transition-colors"
                            >
                              {/* Card Header: ID, Title, Badges, Status Controls */}
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-3">
                                <div className="space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                                      {req.id}
                                    </span>
                                    {req.mandatory && (
                                      <span className="text-[9px] uppercase tracking-wider bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded font-bold border border-zinc-700/60">
                                        Mandatory
                                      </span>
                                    )}
                                    {req.blocker && (
                                      <span className="text-[9px] uppercase tracking-wider bg-red-950/90 text-red-400 px-2 py-0.5 rounded font-bold border border-red-800/80 flex items-center gap-1 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                                        <AlertCircle className="w-2.5 h-2.5" />
                                        BLOCKER
                                      </span>
                                    )}
                                    <span
                                      className={clsx(
                                        "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border font-semibold",
                                        statusStyles[req.status]?.badge
                                      )}
                                    >
                                      {req.status}
                                    </span>
                                  </div>
                                  <h3 className="text-sm md:text-base font-semibold text-white">
                                    {req.title}
                                  </h3>
                                </div>

                                {/* Compact Status Controls */}
                                <div className="flex items-center gap-1 flex-wrap shrink-0">
                                  {ALL_STATUSES.map((statusOption) => {
                                    const isCurrent = req.status === statusOption;
                                    return (
                                      <button
                                        key={statusOption}
                                        type="button"
                                        onClick={() =>
                                          handleStatusChange(req.id, statusOption)
                                        }
                                        className={clsx(
                                          "px-2 py-1 rounded text-[10px] uppercase tracking-wider border transition-colors",
                                          isCurrent
                                            ? statusStyles[statusOption].activeBtn
                                            : "bg-zinc-900/40 border-zinc-800/60 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
                                        )}
                                      >
                                        {statusOption}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                {req.description}
                              </p>

                              {/* Checklist & Evidence Grid */}
                              <div className="grid md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-zinc-800/40">
                                <div>
                                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                                    <CheckSquare className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Verification Checklist</span>
                                  </div>
                                  <ul className="space-y-1 text-xs text-zinc-300">
                                    {req.checklist.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-zinc-600">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Required Evidence</span>
                                  </div>
                                  <div className="text-xs font-mono text-zinc-300 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/50 leading-relaxed">
                                    {req.evidence}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}



