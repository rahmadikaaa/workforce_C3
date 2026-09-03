import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logout } from "../lib/firebase";
import { Plus, Book, ArrowRight, ArrowLeft } from "lucide-react";
// @ts-ignore
import checklistRaw from "../../hackathon_submission_checklist.md?raw";
import clsx from "clsx";

interface TestCase {
  id: string;
  title: string;
  requirement: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  evidence: string;
  severity: string;
}

const parseChecklist = (): TestCase[] => {
  const testSections = checklistRaw.split("### ").filter((s) => s.startsWith("TC-"));
  return testSections.map((section) => {
    const lines = section.split("\n");
    const title = lines[0].trim();
    const idMatch = title.match(/^(TC-\d+)/);
    const id = idMatch ? idMatch[1] : title;

    const extractField = (prefix: string) => {
      const line = lines.find((l) => l.includes(prefix));
      return line ? line.split(prefix)[1].trim() : "";
    };

    const requirement = extractField("**Hackathon Requirement:**");
    const preconditions = extractField("**Preconditions:**");
    const expectedResult = extractField("**Expected Result:**");
    const evidence = extractField("**Evidence to Capture:**");
    
    let severity = "UNKNOWN";
    const severityLine = lines.find(l => l.includes("**Severity:**"));
    if (severityLine) {
       const match = severityLine.match(/\*\*Severity:\*\* \*\*(.*?)\*\*/);
       if (match) severity = match[1];
       else severity = severityLine.split("**Severity:**")[1].trim().replace(/\*/g, '');
    }

    const stepsStart = lines.findIndex((l) => l.includes("**Exact Manual Steps:**"));
    const steps: string[] = [];
    if (stepsStart !== -1) {
      for (let i = stepsStart + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith("*") || lines[i].trim() === "") {
            if (lines[i].trim().startsWith("*") && !lines[i].includes("    1.")) break; 
            if (lines[i].trim() === "") continue;
        }
        if (lines[i].trim().match(/^\d+\./) || lines[i].trim().startsWith("*")) {
           steps.push(lines[i].trim());
        }
      }
    }

    return {
      id,
      title,
      requirement,
      preconditions,
      steps,
      expectedResult,
      evidence,
      severity,
    };
  });
};

export default function Goals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [statuses, setStatuses] = useState<Record<string, "NOT TESTED" | "PASS" | "FAIL">>({});

  useEffect(() => {
    const parsed = parseChecklist();
    setTestCases(parsed);
    const initialStatuses: Record<string, "NOT TESTED" | "PASS" | "FAIL"> = {};
    parsed.forEach((tc) => {
      initialStatuses[tc.id] = "NOT TESTED";
    });
    setStatuses(initialStatuses);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const setStatus = (id: string, status: "NOT TESTED" | "PASS" | "FAIL") => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const totalTests = testCases.length;
  const passed = Object.values(statuses).filter((s) => s === "PASS").length;
  const failed = Object.values(statuses).filter((s) => s === "FAIL").length;
  const notTested = Object.values(statuses).filter((s) => s === "NOT TESTED").length;

  const blockersRemaining = testCases.filter(
    (tc) => tc.severity === "BLOCKER" && statuses[tc.id] !== "PASS"
  ).length;

  const isGo = blockersRemaining === 0;

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
        <div className="max-w-4xl w-full mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-serif italic text-white" style={{ fontFamily: "Georgia, serif" }}>Hackathon Goals</h1>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50 text-center">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Total Tests</div>
              <div className="text-2xl font-bold text-white">{totalTests}</div>
            </div>
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30 text-center">
              <div className="text-[10px] uppercase tracking-widest text-emerald-500/70 font-bold mb-1">Passed</div>
              <div className="text-2xl font-bold text-emerald-400">{passed}</div>
            </div>
            <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/30 text-center">
              <div className="text-[10px] uppercase tracking-widest text-red-500/70 font-bold mb-1">Failed</div>
              <div className="text-2xl font-bold text-red-400">{failed}</div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50 text-center">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Not Tested</div>
              <div className="text-2xl font-bold text-zinc-400">{notTested}</div>
            </div>
            <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/30 text-center">
              <div className="text-[10px] uppercase tracking-widest text-amber-500/70 font-bold mb-1">Blockers</div>
              <div className="text-2xl font-bold text-amber-400">{blockersRemaining}</div>
            </div>
            <div className={clsx("p-4 rounded-xl border text-center flex flex-col justify-center", isGo ? "bg-emerald-900/30 border-emerald-800/50" : "bg-red-900/30 border-red-800/50")}>
              <div className={clsx("text-[10px] uppercase tracking-widest font-bold mb-1", isGo ? "text-emerald-500/80" : "text-red-500/80")}>Decision</div>
              <div className={clsx("text-xl font-bold", isGo ? "text-emerald-400" : "text-red-400")}>{isGo ? "GO" : "NO-GO"}</div>
            </div>
          </div>

          <div className="space-y-6">
            {testCases.map((tc) => (
              <div key={tc.id} className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      {tc.title}
                      {tc.severity === "BLOCKER" && (
                        <span className="text-[9px] uppercase tracking-widest bg-red-950 text-red-400 px-2 py-1 rounded-sm border border-red-900/50">Blocker</span>
                      )}
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">{tc.requirement}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setStatus(tc.id, "NOT TESTED")}
                      className={clsx("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-colors", statuses[tc.id] === "NOT TESTED" ? "bg-zinc-700 border-zinc-600 text-white" : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300")}
                    >
                      Not Tested
                    </button>
                    <button
                      onClick={() => setStatus(tc.id, "PASS")}
                      className={clsx("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-colors", statuses[tc.id] === "PASS" ? "bg-emerald-900/50 border-emerald-800 text-emerald-400" : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300")}
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => setStatus(tc.id, "FAIL")}
                      className={clsx("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-colors", statuses[tc.id] === "FAIL" ? "bg-red-900/50 border-red-800 text-red-400" : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300")}
                    >
                      Fail
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Preconditions</div>
                      <div className="text-zinc-300">{tc.preconditions}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Manual Steps</div>
                      <ul className="space-y-1 text-zinc-300">
                        {tc.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Expected Result</div>
                      <div className="text-emerald-400/90">{tc.expectedResult}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Evidence to Capture</div>
                      <div className="text-zinc-300">{tc.evidence}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
