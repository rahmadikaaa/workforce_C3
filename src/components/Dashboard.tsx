import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db, logout } from "../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Entry } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Book, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "entries"),
          orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const entriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Entry[];
        setEntries(entriesData);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
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
            Analyze your SOP and automation.<br className="hidden sm:inline" /> Find the gaps.<br className="hidden sm:inline" /> Generate the documentation.
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

        {/* Secondary Journal Action */}
        <div className="bg-zinc-900/20 p-6 md:p-8 rounded-[1.5rem] border border-zinc-800/40 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif italic text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Personal Gemini Journal
            </h2>
            <p className="text-sm text-zinc-400">
              Reflect, brainstorm, and work through ideas securely with Gemini.
            </p>
          </div>
          <Link
            to="/entry/new"
            className="inline-flex items-center gap-2 py-2.5 px-5 border border-zinc-800 rounded-xl text-xs font-semibold tracking-wider text-zinc-300 uppercase hover:bg-zinc-800 hover:text-white transition-colors shrink-0 self-start sm:self-center"
          >
            Start Reflection <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recent Activity */}
        <h2 className="text-2xl font-serif italic text-white mb-6" style={{ fontFamily: "Georgia, serif" }}>
          Recent Activity
        </h2>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-zinc-900/30 rounded-[2rem] border border-zinc-800/50 w-full" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-[2rem] border border-zinc-800/50">
            <h3 className="text-xl font-serif italic text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>No reflections yet</h3>
            <p className="text-zinc-400 mb-6 text-sm">Start journaling to see your thoughts summarized here.</p>
            <Link
              to="/entry/new"
              className="inline-flex items-center justify-center gap-2 bg-white text-black py-2.5 px-6 rounded-xl font-semibold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
            >
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map(entry => (
              <Link
                key={entry.id}
                to={`/entry/${entry.id}`}
                className="group bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 relative overflow-hidden hover:bg-zinc-900/50 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif italic text-white leading-snug group-hover:text-zinc-200 transition-colors" style={{ fontFamily: "Georgia, serif" }}>
                    {entry.title || "Untitled Reflection"}
                  </h3>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(entry.createdAt))}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400 line-clamp-2 mt-4">
                  {entry.summary || "No summary available."}
                </p>
                <div className="absolute bottom-8 right-8 flex items-center text-xs font-bold text-zinc-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
