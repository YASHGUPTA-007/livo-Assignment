"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";

export function ScriptsFeatureSection() {
  const [level, setLevel] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockScripts = [
    "I'd like to order a cup of coffee, please.",
    "The logistics of this quarter require a nuanced strategy to circumvent bottlenecks.",
    "Philosophical paradigms often necessitate an epistemological shift in pedagogical methodologies."
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLevel((prev) => (prev % 3) + 1);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Interactive UI Mock */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-3xl border border-sage-700/20 bg-white p-6 sm:p-8 shadow-sm order-2 lg:order-1"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI Generator
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i <= level ? 'bg-black' : 'bg-sage-700/20'}`} />
              ))}
            </div>
          </div>

          <div className="bg-sage-100/50 rounded-2xl p-6 border border-sage-700/10 min-h-[160px] flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-black/60"
                >
                  <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                  <span className="text-sm font-bold">Generating...</span>
                </motion.div>
              ) : (
                <motion.p
                  key={level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl sm:text-2xl font-medium text-black text-center leading-relaxed"
                >
                  "{mockScripts[level - 1]}"
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-full bg-white border border-sage-700/20 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-sage-100 active:scale-95 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Level Up Difficulty
            </button>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2"
        >
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-black">
            Don't just read the dictionary. Practice real conversations.
          </h2>
          <p className="mt-6 text-xl font-medium leading-relaxed text-black/70">
            Struggling with the 'th' sound? Or maybe multi-syllabic corporate jargon trips you up? Our generative AI creates custom, challenging scripts targeting your specific weak points instantly.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
