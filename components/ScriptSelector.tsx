"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SCRIPTS, Script } from "@/lib/scripts";
import {
  Sparkles,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Clock,
  BookOpen,
  ArrowRight,
  Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onSelect: (script: Script) => void;
}

interface GeneratedScript extends Script {
  wordCount?: number;
  targetSeconds?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GENRES = [
  { id: "random",    label: "Random",    emoji: "🎲", value: null },
  { id: "adventure", label: "Adventure", emoji: "⚔️", value: "adventure" },
  { id: "mystery",   label: "Mystery",   emoji: "🔍", value: "mystery" },
  { id: "sci-fi",    label: "Sci-Fi",    emoji: "🚀", value: "sci-fi" },
  { id: "romance",   label: "Romance",   emoji: "💖", value: "romance" },
  { id: "horror",    label: "Horror",    emoji: "👻", value: "horror" },
  { id: "comedy",    label: "Comedy",    emoji: "😂", value: "comedy" },
];

const DURATION_PRESETS = [
  { seconds: 15,  label: "15s"  },
  { seconds: 30,  label: "30s"  },
  { seconds: 45,  label: "45s"  },
  { seconds: 60,  label: "1 min" },
  { seconds: 90,  label: "90s"  },
  { seconds: 120, label: "2 min" },
];

const GENERATION_STEPS = [
  "Crafting your story…",
  "Adding vivid details…",
  "Polishing the narrative…",
  "Finalising your script…",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSeconds(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${m} min` : `${m}m ${rem}s`;
}

function approxWords(s: number) {
  return Math.round(s * 2.2);
}

function difficultyBadge(d: "Easy" | "Medium" | "Hard") {
  if (d === "Easy")   return "bg-sage-300/50 text-sage-900 border border-sage-700/50";
  if (d === "Medium") return "bg-sage-300 text-sage-900 border border-sage-700/50";
  return "bg-sage-900/10 text-sage-900 border border-sage-700/50";
}

function sliderBg(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, #659287 0%, #659287 ${pct}%, #E6F2DD ${pct}%, #E6F2DD 100%)`;
}

// ─── AI Modal ─────────────────────────────────────────────────────────────────

interface AIModalProps {
  onClose: () => void;
  onSelect: (script: Script) => void;
}

function AIModal({ onClose, onSelect }: AIModalProps) {
  const [seconds, setSeconds]             = useState(30);
  const [genre, setGenre]                 = useState<string | null>(null);
  const [step, setStep]                   = useState<"configure" | "result">("configure");
  const [isGenerating, setIsGenerating]   = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generated, setGenerated]         = useState<GeneratedScript | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationStep(0);

    const timer = setInterval(() => {
      setGenerationStep((p) => (p < GENERATION_STEPS.length - 1 ? p + 1 : p));
    }, 900);

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds, genre }),
      });
      clearInterval(timer);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate script");
      }

      const data: GeneratedScript = await res.json();
      setGenerated(data);
      setStep("result");
    } catch (e: any) {
      clearInterval(timer);
      setError(e.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUse = () => {
    if (generated) { onSelect(generated); onClose(); }
  };

  const handleRegenerate = () => {
    setGenerated(null);
    setStep("configure");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-sage-700/30 rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sage-700/30 bg-sage-100">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sage-900" />
            <span className="text-sm font-bold text-black">Generate Script with AI</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-sage-300 hover:text-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Configure step ── */}
        {step === "configure" && (
          <div className="p-6 sm:p-8 space-y-8">
            {/* Duration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-sage-900">Recording Duration</p>
                  <p className="text-xs text-sage-700 mt-0.5">How long do you want to read?</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-sage-900 tabular-nums">{formatSeconds(seconds)}</p>
                  <p className="text-xs font-semibold text-sage-700">~{approxWords(seconds)} words</p>
                </div>
              </div>

              {/* Preset chips */}
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((p) => (
                  <button
                    key={p.seconds}
                    onClick={() => setSeconds(p.seconds)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                      seconds === p.seconds
                        ? "bg-sage-300 text-sage-900 border-sage-700 shadow-sm"
                        : "bg-transparent text-sage-700 border-sage-700/20 hover:border-sage-700 hover:text-sage-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={5}
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                  className="w-full"
                  style={{ background: sliderBg(seconds, 15, 120) }}
                />
                <div className="flex justify-between text-[10px] font-bold text-sage-700 mt-2">
                  <span>15s</span>
                  <span className={`px-2 py-0.5 rounded ${
                    seconds <= 30 ? "bg-sage-300 text-sage-900"
                    : seconds <= 60 ? "bg-sage-300 text-sage-900"
                    : "bg-sage-300 text-sage-900"
                  }`}>
                    {seconds <= 30 ? "EASY" : seconds <= 60 ? "MEDIUM" : "HARD"}
                  </span>
                  <span>2 min</span>
                </div>
              </div>
            </div>

            <div className="border-t border-sage-700/20" />

            {/* Genre */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-sage-900">Story Genre</p>
                <p className="text-xs text-sage-700 mt-0.5">What kind of story do you want?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGenre(g.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                      genre === g.value
                        ? "bg-sage-300 text-sage-900 border-sage-700 shadow-sm"
                        : "bg-transparent text-sage-700 border-sage-700/20 hover:border-sage-700 hover:text-sage-900"
                    }`}
                  >
                    <span className="text-base">{g.emoji}</span>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-sage-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(50,60,50,0.3)] hover:shadow-[0_0_25px_rgba(50,60,50,0.5)]"
            >
              {isGenerating ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>{GENERATION_STEPS[generationStep]}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Script</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Result step ── */}
        {step === "result" && generated && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-sage-900 uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" /> AI Generated
                </div>
                <h3 className="text-xl font-black text-sage-900 leading-tight">{generated.title}</h3>
              </div>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${difficultyBadge(generated.difficulty)}`}>
                {generated.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-sage-700">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {formatSeconds(generated.targetSeconds ?? seconds)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> {generated.wordCount} words
              </span>
              {genre && <span className="capitalize text-sage-900 bg-sage-300 px-2 py-0.5 rounded">{genre}</span>}
            </div>

            <div className="rounded-2xl border border-sage-700/20 bg-sage-100 p-5">
              <p className="text-sm leading-relaxed font-medium text-sage-900">{generated.text}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 rounded-xl border border-sage-700/20 bg-transparent px-5 py-3.5 text-sm font-bold text-sage-900 hover:bg-sage-300 transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Redo
              </button>
              <button
                onClick={handleUse}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sage-900 py-3.5 text-sm font-bold text-white hover:bg-sage-700 transition-all shadow-[0_0_15px_rgba(50,60,50,0.3)]"
              >
                Use This Script <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScriptSelector({ onSelect }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScripts = SCRIPTS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        <div className="space-y-2">
          <p className="text-xs font-bold text-sage-900 uppercase tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sage-900 shadow-[0_0_8px_rgba(50,60,50,0.8)] animate-pulse" />
            Pronunciation Practice
          </p>
          <h2 className="text-3xl font-black text-black tracking-tight">
            Select a Script
          </h2>
          <p className="text-sm font-medium text-black/60 mt-1 max-w-xl">
            Choose a practice script to begin your pronunciation session.
          </p>
        </div>

        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-sage-900/50" />
          </div>
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-sage-700/50 bg-sage-100 py-3.5 pl-12 pr-4 text-sm font-medium text-black placeholder:text-black/40 focus:border-sage-900 focus:outline-none focus:ring-1 focus:ring-sage-900 shadow-sm transition-shadow"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredScripts.map((script) => (
            <button
              key={script.id}
              onClick={() => onSelect(script)}
              className="group flex flex-col text-left rounded-3xl border border-sage-700/20 bg-sage-100 p-6 shadow-sm hover:shadow-lg hover:border-sage-700/50 focus:outline-none focus:ring-2 focus:ring-sage-900 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4 w-full">
                <h3 className="font-bold text-black text-lg leading-snug group-hover:text-sage-900 transition-colors line-clamp-2">
                  {script.title}
                </h3>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${difficultyBadge(script.difficulty)}`}>
                  {script.difficulty}
                </span>
              </div>

              <p className="mt-2 text-sm text-black/60 line-clamp-3">
                {script.text}
              </p>

              <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-sage-700/20">
                <span className="text-xs font-bold text-black/50 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {script.text.split(/\s+/).length} words
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-black/50 group-hover:text-sage-900 transition-colors duration-200">
                  Practice <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          ))}

          <button
            onClick={() => setModalOpen(true)}
            className="group flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed border-sage-700/50 bg-white p-6 hover:border-sage-900/50 hover:bg-sage-100/50 focus:outline-none focus:ring-2 focus:ring-sage-900 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 min-h-[180px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-300 group-hover:bg-sage-900 text-sage-900 group-hover:text-white transition-all shadow-sm mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-base font-bold text-black group-hover:text-sage-900 transition-colors">Generate with AI</p>
            <p className="text-xs font-medium text-black/60 mt-1 max-w-[180px]">
              Create a custom story for any recording length
            </p>
          </button>
        </div>
      </div>

      {modalOpen && (
        <AIModal
          onClose={() => setModalOpen(false)}
          onSelect={onSelect}
        />
      )}
    </>
  );
}
