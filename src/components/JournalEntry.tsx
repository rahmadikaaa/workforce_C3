import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Message, Entry } from "../types";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function JournalEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isNew = id === "new";
  const entryId = React.useMemo(() => isNew ? crypto.randomUUID() : (id as string), [id, isNew]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    if (isNew) {
      setInitialLoad(false);
      setMessages([{
        role: "model",
        text: "Hi there. What's on your mind today?"
      }]);
      return;
    }

    const fetchEntry = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "entries", entryId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Entry;
          setMessages(data.messages || []);
        } else {
          setError("Entry not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load entry");
      } finally {
        setInitialLoad(false);
      }
    };

    fetchEntry();
  }, [user, id, isNew, entryId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const saveEntry = async (newMessages: Message[]) => {
    if (!user) return;
    
    // Generate a simple title based on the first user message if it's new
    let title = "New Reflection";
    const firstUserMsg = newMessages.find(m => m.role === "user");
    if (firstUserMsg) {
      title = firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? "..." : "");
    }

    // Try to get a summary if we have some messages
    let summary = "Reflection in progress...";
    if (newMessages.length >= 3) {
       // Just a simple heuristic, the real app might ask the LLM for a summary
       const modelMsgs = newMessages.filter(m => m.role === "model");
       if (modelMsgs.length > 0) {
         summary = modelMsgs[modelMsgs.length - 1].text.slice(0, 100) + "...";
       }
    }

    const entryRef = doc(db, "users", user.uid, "entries", entryId);
    
    const payload = JSON.parse(JSON.stringify({
      id: entryId,
      userId: user.uid,
      title,
      summary,
      messages: newMessages,
      updatedAt: Date.now()
    }));

    if (isNew && newMessages.length <= 2) {
      payload.createdAt = Date.now();
      await setDoc(entryRef, payload, { merge: true });
    } else {
      await updateDoc(entryRef, payload);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !user || loading) return;

    const userMessage: Message = { role: "user", text: inputValue.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);
    setError(null);

    // Save immediately so user input isn't lost if something fails
    await saveEntry(newMessages).catch(console.error);

    try {
      const token = await user.getIdToken();
      
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemInstruction: {
            role: "system",
            parts: [{ text: "You are an empathetic, insightful journaling assistant. Help the user reflect, summarize their thoughts, and brainstorm. Keep responses concise, warm, and thought-provoking." }]
          }
        })
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      
      const modelMessage: Message = { role: "model", text: data.text };
      const updatedMessages = [...newMessages, modelMessage];
      
      setMessages(updatedMessages);
      await saveEntry(updatedMessages);
      
    } catch (err) {
      console.error(err);
      setError("Failed to get response from AI. Please try again.");
      // We still saved the user message, so we don't pop it off.
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden">
      <header className="h-20 border-b border-zinc-800/50 flex items-center justify-between px-6 md:px-10 bg-[#0a0a0a]/80 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <span className="text-sm font-semibold text-white tracking-wide">
            {isNew ? "New Reflection" : "Journal Entry"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-400 font-bold">Gemini Active</span>
          </div>
        </div>
      </header>

      <section ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col relative px-4 md:px-10 py-8 scroll-smooth">
        <div className="max-w-2xl mx-auto w-full flex flex-col space-y-12 pb-24">
          {messages.map((msg, idx) => (
            msg.role === "user" ? (
              <div key={idx} className="space-y-3 opacity-90 ml-auto max-w-[85%] text-right flex flex-col items-end">
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 flex items-center justify-end space-x-2">
                  <span>You</span>
                  <span className="w-4 h-px bg-zinc-800"></span>
                </div>
                <p className="text-lg leading-relaxed text-zinc-300 bg-zinc-900/50 p-5 rounded-2xl rounded-tr-sm border border-zinc-800">
                  {msg.text}
                </p>
              </div>
            ) : (
              <div key={idx} className="bg-zinc-900/30 p-8 md:p-10 rounded-[2rem] border border-zinc-800/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-indigo-400 font-black">Aura Reflection</span>
                </div>
                <p className="text-base leading-relaxed text-zinc-400 whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            )
          ))}
          
          {loading && (
            <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 relative overflow-hidden w-full max-w-[200px]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse delay-150"></span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-[2rem] text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      <footer className="p-4 md:p-10 pt-0 z-30 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative group"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Speak your mind..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 pr-16 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all shadow-2xl resize-none min-h-[96px] max-h-48"
            />
            <div className="absolute bottom-4 right-4 flex items-center space-x-4">
              <span className="hidden md:inline-block text-[9px] text-zinc-700 italic uppercase tracking-widest">Encryption Active</span>
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-transform active:scale-95 shadow-lg shadow-white/5 disabled:opacity-50 disabled:active:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="flex justify-center mt-4">
            <p className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-bold">Secured by Firebase & Gemini Cloud</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
