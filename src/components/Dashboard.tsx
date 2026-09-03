import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { logout } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Book, ArrowRight, Sparkles } from "lucide-react";

// ── Documentation Workspace ─────────────────────────────────────────────────
// Temporary demo data representing the WORKFORCE documentation lifecycle.
// Replace with persisted AnalysisSession records from Firestore.
// ─────────────────────────────────────────────────────────────────────────────

type DocStatus = "needs-analysis" | "ready" | "generated";

interface DocItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: DocStatus;
  findings: number | null;
  analysisComplete: boolean;
  documentationComplete: boolean;
  updatedAt: string;
}

const DEMO_DOC_ITEMS: DocItem[] = [
  {
    id: "demo-1",
    name: "Check Log UMB QRIS via AION",
    category: "Transaction Monitoring · AION",
    description: "SOP and automation successfully analyzed. 3 implementation gaps identified.",
    status: "generated",
    findings: 3,
    analysisComplete: true,
    documentationComplete: true,
    updatedAt: "Aug 28, 2026",
  },
  {
    id: "demo-2",
    name: "Infrastructure Health Check",
    category: "Infrastructure Operations",
    description: "Analysis completed. 5 implementation gaps identified. Structured analysis is ready for documentation.",
    status: "ready",
    findings: 5,
    analysisComplete: true,
    documentationComplete: false,
    updatedAt: "Aug 25, 2026",
  },
  {
    id: "demo-3",
    name: "PostgreSQL Health Check",
    category: "Database Operations",
    description: "SOP and automation have been registered but analysis has not been started.",
    status: "needs-analysis",
    findings: null,
    analysisComplete: false,
    documentationComplete: false,
    updatedAt: "Aug 20, 2026",
  },
];

const FILTER_TABS: { key: "all" | DocStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs-analysis", label: "Needs Analysis" },
  { key: "ready", label: "Ready to Generate" },
  { key: "generated", label: "Generated" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | DocStatus>("all");

  const filteredDocs = activeFilter === "all"
    ? DEMO_DOC_ITEMS
    : DEMO_DOC_ITEMS.filter(d => d.status === activeFilter);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row text-zinc-300 font-sans">
      <aside className="w-full md:w-[280px] bg-[#0d0d0d] border-r border-zinc-800 p-8 flex flex-col shrink-0 h-auto md:h-screen">
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-serif italic text-white tracking-tighter mb-8 flex items-center gap-3" style={{ fontFamily: "Georgia, serif" }}>
            <img src="/logo.png" alt="WORKFORCE" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
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
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 font-bold">Menu</div>
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
                    to="/entry/new"
                    className="flex items-center gap-3 text-sm font-semibold text-zinc-400 hover:text-white transition-colors py-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Gemini Journal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/goals"
                    className="flex items-center gap-3 text-sm font-semibold text-zinc-400 hover:text-white transition-colors py-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Goals
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="pt-6 border-t border-zinc-800 flex justify-between items-center text-[10px] tracking-widest text-zinc-600 uppercase font-bold">
            <div className="flex items-center gap-3 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-zinc-800" />
              )}
              <span className="truncate">{user?.displayName || 'User'}</span>
            </div>
            <button onClick={handleLogout} className="hover:text-zinc-300 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#0a0a0a] relative p-6 md:p-10 overflow-y-auto">
        {/* Main Hero */}
        <div className="bg-zinc-900/30 p-8 md:p-10 rounded-[2rem] border border-zinc-800/60 relative overflow-hidden mb-8">
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold mb-3 flex items-center gap-2">
            <img src="/logo.png" alt="WORKFORCE" className="w-4 h-4 object-contain" />
            WORKFORCE
          </div>
          <h1 className="text-2xl md:text-4xl font-serif italic text-white tracking-tight leading-snug mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Understand the SOP.<br className="hidden sm:inline" /> Find the automation gaps.<br className="hidden sm:inline" /> Generate the documentation.
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed mb-6">
            WORKFORCE uses Gemini to reconcile operational intent with actual automation behavior, surface implementation gaps, and generate structured technical documentation.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-8 py-2 px-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 w-fit">
            <span className="text-zinc-300 font-medium">SOP + Script</span>
            <span className="text-zinc-600">→</span>
            <span className="text-zinc-300 font-medium">AI Analysis</span>
            <span className="text-zinc-600">→</span>
            <span className="text-zinc-300 font-medium">Findings</span>
            <span className="text-zinc-600">→</span>
            <span className="text-zinc-300 font-medium">PDF</span>
          </div>

          <div>
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-xl text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
            >
              Analyze Automation <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>


        {/* Documentation Workspace */}
        <h2 className="text-2xl font-serif italic text-white mb-5" style={{ fontFamily: "Georgia, serif" }}>
          Documentation Workspace
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`text-[10px] uppercase tracking-widest font-bold py-2 px-4 rounded-lg border transition-colors ${
                activeFilter === tab.key
                  ? "bg-zinc-800 text-white border-zinc-700"
                  : "text-zinc-500 border-zinc-800/60 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Documentation Items */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-[1.5rem] border border-zinc-800/50">
            <h3 className="text-lg font-serif italic text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
              No documentation yet.
            </h3>
            <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
              Analyze an SOP and its automation to generate your first technical documentation.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 bg-white text-black py-2.5 px-6 rounded-xl font-semibold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
            >
              Analyze Automation
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredDocs.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/30 p-5 md:p-6 rounded-[1.5rem] border border-zinc-800/50 hover:bg-zinc-900/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                  {/* Left: Name & Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
                      {item.name}
                    </h3>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-2">
                      {item.category}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Middle: Lifecycle Indicators */}
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-center">
                      <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Analysis</div>
                      <span className={`text-sm ${item.analysisComplete ? "text-zinc-300" : "text-zinc-600"}`}>
                        {item.analysisComplete ? "✓" : "○"}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Findings</div>
                      <span className={`text-sm font-mono ${item.findings !== null ? "text-zinc-300" : "text-zinc-600"}`}>
                        {item.findings !== null ? item.findings : "—"}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Docs</div>
                      <span className={`text-sm ${item.documentationComplete ? "text-zinc-300" : "text-zinc-600"}`}>
                        {item.documentationComplete ? "✓" : "○"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Date & CTA */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold hidden md:block whitespace-nowrap">
                      {item.updatedAt}
                    </span>
                    <Link
                      to="/analyze"
                      className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0 whitespace-nowrap ${
                        item.status === "ready"
                          ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                          : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                      }`}
                    >
                      {item.status === "generated"
                        ? "View Docs"
                        : item.status === "ready"
                        ? "Generate Docs"
                        : "Analyze"}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
