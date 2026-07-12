"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Script } from "@/lib/scripts";
import { RefreshCw, Info, Volume2, VolumeX, Lightbulb, Play, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FlaggedWord {
  word: string;
  type: "missing" | "substituted" | "unclear";
  feedback: string;
  index: number;
  phonemes?: string | null;
  simple_phonetic?: string;
  issue?: string;
  tip?: string;
}

export interface AnalysisResult {
  score: number;
  transcript: string;
  flaggedWords: FlaggedWord[];
}

interface Props {
  script: Script;
  result: AnalysisResult;
  onRetry: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks & Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

type TtsState = "supported" | "unavailable" | "loading";

function useTts() {
  const [ttsState, setTtsState] = useState<TtsState>("loading");
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTimeout(() => setTtsState("unavailable"), 0);
      return;
    }

    function tryInit() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
        setTtsState("supported");
        return true;
      }
      return false;
    }

    if (tryInit()) return;

    let settled = false;
    const onVoicesChanged = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      if (!tryInit()) setTtsState("unavailable");
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      if (!tryInit()) setTtsState("unavailable");
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
    };
  }, []);

  const speak = useCallback((word: string) => {
    if (ttsState !== "supported" || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9;
    utterance.lang = "en-US";
    const preferred = voicesRef.current.length > 0
      ? (window.speechSynthesis.getVoices().find((v) => v.lang === "en-US") || voicesRef.current[0])
      : null;
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, [ttsState]);

  return { ttsState, speak };
}

function SpeakerButton({ word, ttsState, speak }: { word: string, ttsState: TtsState, speak: (w: string) => void }) {
  if (ttsState === "loading") return null;

  if (ttsState === "unavailable") {
    return (
        <span
        title="Voice playback not available on this device"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-300 text-black/40 cursor-not-allowed select-none border border-sage-700/30"
        aria-disabled="true"
      >
        <VolumeX className="h-4 w-4" />
        <span className="text-xs font-bold">Unavailable</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(word);
      }}
      title={`Hear pronunciation of "${word}"`}
      className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-900 text-white hover:bg-sage-700 transition-all shadow-[0_0_15px_rgba(50,60,50,0.3)] hover:shadow-[0_0_20px_rgba(50,60,50,0.5)] focus:outline-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/10 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      <Volume2 className="h-4 w-4 shrink-0 animate-pulse" />
      <span className="text-xs font-bold tracking-wide">Listen</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Score Ring Component
// ─────────────────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const radius = 90;
  const stroke = 18;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "#ef4444"; // red-500
  let bg = "rgba(239, 68, 68, 0.1)"; // red-500/10
  if (score >= 90) { color = "#659287"; bg = "rgba(101, 146, 135, 0.2)"; } // sage-900
  else if (score >= 75) { color = "#88BDA4"; bg = "rgba(136, 189, 164, 0.2)"; } // sage-700
  else if (score >= 60) { color = "#f59e0b"; bg = "rgba(245, 158, 11, 0.1)"; } // amber

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke={bg}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center drop-shadow-md">
        <span className="text-5xl font-black tabular-nums tracking-tighter" style={{ color }}>
          {Math.round(score)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ResultsView
// ─────────────────────────────────────────────────────────────────────────────

export default function ResultsView({ script, result, onRetry }: Props) {
  const [activeFeedback, setActiveFeedback] = useState<FlaggedWord | null>(null);
  const { ttsState, speak } = useTts();

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: "Excellent Pronunciation!", msg: "You read the script clearly and accurately." };
    if (score >= 75) return { label: "Good Job!", msg: "A solid effort, with just a few minor mistakes." };
    if (score >= 60) return { label: "Needs Practice", msg: "You're getting there! Focus on the highlighted words." };
    return                  { label: "Keep Trying", msg: "Don't give up! Review the feedback below and try again." };
  };

  const { label, msg } = getScoreLabel(result.score);
  const words = script.text.split(/\b/);
  const flaggedMap = new Map<number, FlaggedWord>();
  result.flaggedWords.forEach((fw) => flaggedMap.set(fw.index, fw));
  let wordIndexCount = 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in duration-500 pb-12">

      {/* ── Score card ─────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-sage-700/50 bg-white p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        <div className="shrink-0 animate-in zoom-in duration-700 delay-150 fill-mode-both">
          <ScoreRing score={result.score} />
        </div>
        <div className="text-center md:text-left space-y-3 max-w-sm">
          <h2 className="text-3xl font-black text-black tracking-tight">{label}</h2>
          <p className="text-sm text-black/60 font-medium leading-relaxed">{msg}</p>
          <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-black/40">
            <Info className="h-4 w-4" /> Audio discarded for privacy.
          </div>
        </div>
      </div>

      {/* ── Bottom grid ────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

        {/* Highlighted script */}
        <div className="rounded-3xl border border-sage-700/50 bg-white p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="text-xs font-black text-black/50 mb-6 tracking-widest uppercase">
            Transcript Analysis
          </h3>

          <div className="mb-6 flex flex-wrap gap-4 text-[10px] font-bold text-black/50 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sage-300 border border-sage-700/50" /> Correct
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-300" /> Missed / Subbed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> Unclear
            </span>
          </div>

          <div className="flex-1 rounded-2xl bg-sage-100/50 border border-sage-700/30 p-6 shadow-inner">
            <p className="text-[17px] leading-[2] text-black/80 font-medium tracking-wide">
              {words.map((chunk, i) => {
                if (!/\w/.test(chunk)) {
                  return <span key={i} className="opacity-40">{chunk}</span>;
                }

                const currentIndex = wordIndexCount++;
                const flagged = flaggedMap.get(currentIndex);

                if (flagged) {
                  const isRed = flagged.type === "missing" || flagged.type === "substituted";
                  const active = activeFeedback?.index === currentIndex;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveFeedback(active ? null : flagged)}
                      className={`relative inline-block mx-0.5 px-1.5 rounded font-bold transition-all duration-200 cursor-pointer outline-none
                        ${isRed ? "text-red-700 bg-red-100 hover:bg-red-200" : "text-amber-700 bg-amber-100 hover:bg-amber-200"}
                        ${active ? "ring-2 ring-sage-900 ring-offset-2 ring-offset-sage-100 scale-105 shadow-md z-10" : "border-b-2 border-dashed border-red-500/30"}
                      `}
                    >
                      {chunk}
                    </button>
                  );
                }

                return (
                  <span key={i} className="text-sage-900 transition-colors mx-[1px]">
                    {chunk}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        {/* Feedback panel */}
        <div className="rounded-3xl border border-sage-700/50 bg-sage-100/50 shadow-sm flex flex-col overflow-hidden relative">
          <div className="px-6 py-5 border-b border-sage-700/30 bg-sage-300">
            <h3 className="text-xs font-black tracking-widest uppercase flex items-center gap-2 text-black">
              <Lightbulb className="h-4 w-4 text-sage-900" /> 
              Coach Feedback
            </h3>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center relative">
            {activeFeedback ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
                
                {/* Header & Type */}
                <div>
                  <span className={`inline-block mb-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    activeFeedback.type === "missing"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : activeFeedback.type === "substituted"
                      ? "bg-orange-100 text-orange-700 border-orange-200"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                  }`}>
                    {activeFeedback.type}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest">Target Word</span>
                    <h4 className="text-3xl font-black tracking-tight text-black">{activeFeedback.word}</h4>
                  </div>
                </div>

                {/* Pronunciation & TTS */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-sage-700/30 shadow-sm">
                  {activeFeedback.simple_phonetic && activeFeedback.simple_phonetic !== activeFeedback.word ? (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-black/50 mb-1">Sounds like</span>
                      <code className="text-sm font-mono font-bold text-sage-900 bg-sage-300 px-2 py-0.5 rounded border border-sage-700/50">
                        {activeFeedback.simple_phonetic}
                      </code>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-black/50 mb-1">Correct Audio</span>
                      <span className="text-sm font-bold text-black/80">Listen carefully</span>
                    </div>
                  )}
                  <SpeakerButton word={activeFeedback.word} ttsState={ttsState} speak={speak} />
                </div>

                {/* Issue */}
                {activeFeedback.issue && (
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black/50 mb-2">
                      <AlertCircle className="h-3.5 w-3.5" /> Issue
                    </span>
                    <p className="text-sm font-medium text-black/80 leading-relaxed">
                      {activeFeedback.issue}
                    </p>
                  </div>
                )}

                {/* Tip */}
                {activeFeedback.tip && (
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage-900 rounded-full" />
                    <div className="pl-4">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-sage-900 mb-2">
                        How to fix it
                      </span>
                      <p className="text-sm text-black font-semibold leading-relaxed">
                        {activeFeedback.tip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fallback */}
                {!activeFeedback.issue && !activeFeedback.tip && activeFeedback.feedback && (
                  <p className="text-sm font-medium text-black/80 leading-relaxed border-l-2 border-sage-700/30 pl-3">
                    {activeFeedback.feedback}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-white border border-sage-700/50 flex items-center justify-center mb-6 shadow-sm">
                  <Play className="h-6 w-6 text-sage-900/50 ml-1" />
                </div>
                <h4 className="text-lg font-bold text-black">Select a word</h4>
                <p className="text-xs font-medium text-black/60 max-w-[220px] mx-auto leading-relaxed">
                  Click any <span className="text-red-700 font-bold">red</span> or <span className="text-amber-700 font-bold">yellow</span> highlighted word to reveal personalized coaching feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Retry button ────────────────────────────────────────────────────── */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onRetry}
          className="group relative flex items-center gap-3 rounded-2xl bg-white border border-sage-700/50 px-10 py-4 text-sm font-bold text-black/70 hover:text-black hover:bg-sage-100 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          Try Another Script
        </button>
      </div>
    </div>
  );
}
