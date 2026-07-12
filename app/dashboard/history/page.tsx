"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { FlaggedWord } from "@/components/ResultsView";
import Link from "next/link";
import { 
  Mic, 
  Search, 
  Trash2, 
  Trophy, 
  Activity, 
  List, 
  Calendar,
  X,
  Loader2,
  Clock,
  BookOpen
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Attempt {
  id: string;
  scriptId: string;
  scriptTitle: string;
  score: number;
  transcript: string;
  flaggedWords: FlaggedWord[];
  createdAt: any; // Firestore Timestamp
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(timestamp: any) {
  if (!timestamp) return "Unknown Date";
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getScoreBadge(score: number) {
  if (score >= 90) return "bg-sage-100 text-sage-900 border-sage-700/50";
  if (score >= 75) return "bg-sage-100/50 text-black/70 border-sage-700/30";
  if (score >= 60) return "bg-amber-100 text-amber-900 border-amber-300";
  return "bg-red-100 text-red-900 border-red-300";
}

// ─── Modal Component ─────────────────────────────────────────────────────────

interface SessionModalProps {
  session: Attempt;
  onClose: () => void;
}

function SessionModal({ session, onClose }: SessionModalProps) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sage-700/30 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-sage-900" />
            <span className="text-sm font-bold text-black">Session Details</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-sage-700/20 hover:text-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Top section: Score and Meta */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-black mb-1">{session.scriptTitle}</h2>
              <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                <Calendar className="h-4 w-4" />
                {formatDate(session.createdAt)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-black/50 uppercase tracking-widest mb-1">Score</div>
              <div className="text-4xl font-black text-sage-900 tabular-nums">
                {Math.round(session.score)}
              </div>
            </div>
          </div>

          <div className="border-t border-sage-700/20" />

          {/* Transcript */}
          <div>
            <h3 className="text-xs font-bold text-black/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Mic className="h-4 w-4 text-black/40" />
              What was heard
            </h3>
            <div className="rounded-2xl border border-sage-700/30 bg-sage-100 p-5 shadow-sm">
              <p className="text-sm text-black/80 leading-relaxed font-medium">
                {session.transcript || "No transcript available."}
              </p>
            </div>
          </div>

          {/* Flagged Words */}
          <div>
            <h3 className="text-xs font-bold text-black/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-black/40" />
              Feedback received
            </h3>
            
            {session.flaggedWords && session.flaggedWords.length > 0 ? (
              <div className="space-y-4">
                {session.flaggedWords.map((fw, idx) => (
                  <div key={idx} className="rounded-2xl border border-sage-700/30 bg-white/50 p-5 flex flex-col gap-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-lg bg-sage-300 px-3 py-1.5 text-sm font-bold text-black">
                        "{fw.word}"
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-md border ${
                        fw.type === "missing" 
                          ? "bg-red-50 text-red-700 border-red-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {fw.type}
                      </span>
                    </div>

                    {fw.simple_phonetic && fw.simple_phonetic !== fw.word && (
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">Sounds like:</span>
                         <code className="text-sm font-mono font-bold text-sage-900 bg-sage-100 px-2 py-0.5 rounded border border-sage-700/30">
                           {fw.simple_phonetic}
                         </code>
                       </div>
                    )}
                    
                    {fw.issue && (
                      <p className="text-sm text-black/80 font-medium">
                        <span className="font-bold text-black/50 text-[10px] uppercase tracking-widest mr-2">Issue:</span>
                        {fw.issue}
                      </p>
                    )}
                    
                    {fw.tip && (
                      <div className="relative mt-2">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage-900 rounded-full" />
                         <p className="text-sm text-black font-semibold pl-4">
                           <span className="block font-black text-sage-900 text-[10px] uppercase tracking-widest mb-1">Tip:</span>
                           {fw.tip}
                         </p>
                      </div>
                    )}

                    {!fw.issue && !fw.tip && fw.feedback && (
                      <p className="text-sm text-black/60 font-medium mt-1">{fw.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-sage-700/50 bg-sage-100 p-5 text-center text-sm text-sage-900 font-bold">
                No pronunciation issues flagged! Perfect reading.
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(15px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<Attempt | null>(null);

  useEffect(() => {
    if (!user) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "attempts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: Attempt[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...docSnap.data() } as Attempt);
      });
      setSessions(loaded);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    if (!user) return;
    if (confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "attempts", id));
      } catch (err) {
        console.error("Failed to delete session", err);
      }
    }
  };

  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, curr) => acc + curr.score, 0) / totalSessions) 
    : 0;
  const highestScore = totalSessions > 0 
    ? Math.round(Math.max(...sessions.map(s => s.score))) 
    : 0;

  const filteredSessions = sessions.filter(s => {
    const query = searchQuery.toLowerCase();
    return s.scriptTitle?.toLowerCase().includes(query) || 
           s.transcript?.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold text-black/50 uppercase tracking-widest">
            Overview
          </p>
          <h2 className="text-3xl font-black text-black tracking-tight">
            Practice History
          </h2>
        </div>
        <Link 
          href="/dashboard/practice"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sage-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-sage-900/90 shadow-[0_0_15px_rgba(101,146,135,0.3)] shrink-0"
        >
          <Mic className="h-4 w-4" />
          Record New Session
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-sage-700/50 bg-sage-300 p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100 text-sage-900">
            <List className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-1">Total Sessions</p>
            <p className="text-3xl font-black text-black tabular-nums">{totalSessions}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-sage-700/50 bg-sage-300 p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-1">Avg Score</p>
            <p className="text-3xl font-black text-black tabular-nums">{avgScore}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-sage-700/50 bg-sage-300 p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-1">Highest Score</p>
            <p className="text-3xl font-black text-black tabular-nums">{highestScore}</p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-sage-900/50" />
        </div>
        <input
          type="text"
          placeholder="Search by title or transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-2xl border border-sage-700/50 bg-sage-100 py-3.5 pl-12 pr-4 text-sm font-medium text-black placeholder:text-black/40 focus:border-sage-900 focus:outline-none focus:ring-1 focus:ring-sage-900 shadow-sm"
        />
      </div>

      {/* ── History Grid ── */}
      {filteredSessions.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="group relative flex flex-col justify-between rounded-2xl border border-sage-700/50 bg-sage-300 p-6 shadow-sm hover:shadow-md hover:border-sage-900 transition-all duration-300 cursor-pointer min-h-[180px]"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-md border ${getScoreBadge(session.score)}`}>
                  {Math.round(session.score)} / 100
                </span>
                
                <button
                  onClick={(e) => handleDelete(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-black/40 hover:text-red-700 hover:bg-red-100 transition-all duration-200 focus:outline-none focus:opacity-100"
                  title="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-black text-base leading-snug line-clamp-2 group-hover:text-sage-900 transition-colors">
                  {session.scriptTitle}
                </h3>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-black/50 font-medium">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(session.createdAt)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-sage-300 border-2 border-dashed border-sage-700/50 rounded-3xl">
          <Activity className="h-12 w-12 text-sage-900/30 mb-4" />
          <p className="font-bold text-black text-lg">No sessions found</p>
          <p className="text-sm font-medium text-black/60 mt-1 max-w-sm">
            {searchQuery 
              ? "We couldn't find any sessions matching your search." 
              : "You haven't recorded any practice sessions yet. Start one to see your history!"}
          </p>
        </div>
      )}

      {selectedSession && (
        <SessionModal 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
        />
      )}
      
    </div>
  );
}
