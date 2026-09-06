import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db, logout } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Book, ArrowRight, Sparkles, Loader2 } from "lucide-react";

interface SavedAnalysis {
  id: string;
  activityName: string;
  revision: number;
  createdAt: Date;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchAnalyses = async () => {
      try {
        const q = query(collection(db, "analyses"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedDocs: SavedAnalysis[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedDocs.push({
            id: doc.id,
            activityName: data.activityName || "Unnamed Activity",
            revision: data.revision || 1,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          });
        });
        
        fetchedDocs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setAnalyses(fetchedDocs);
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
        setError("Failed to load saved analyses.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user]);

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
          Saved Analyses
        </h2>

        {/* Documentation Items */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 bg-red-950/20 rounded-xl border border-red-900/50">
            {error}
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-[1.5rem] border border-zinc-800/50">
            <h3 className="text-lg font-serif italic text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
              No analyses yet.
            </h3>
            <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
              Analyze an SOP and its automation to generate your first structured analysis.
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
            {analyses.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/30 p-5 md:p-6 rounded-[1.5rem] border border-zinc-800/50 hover:bg-zinc-900/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 justify-between">
                  {/* Left: Name & Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
                      {item.activityName}
                    </h3>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-2">
                      Revision {item.revision}
                    </div>
                  </div>

                  {/* Right: Date & CTA */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold hidden md:block whitespace-nowrap">
                      {item.createdAt.toLocaleDateString()}
                    </span>
                    <Link
                      to={`/analyze/${item.id}`}
                      className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0 whitespace-nowrap bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    >
                      View Data
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
