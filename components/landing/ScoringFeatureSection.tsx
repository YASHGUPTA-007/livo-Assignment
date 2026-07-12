"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScoringFeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const word1Color = useTransform(scrollYProgress, [0.3, 0.4], ["#000000", "#10b981"]); // emerald-500
  const word2Color = useTransform(scrollYProgress, [0.4, 0.5], ["#000000", "#ef4444"]); // red-500
  const word3Color = useTransform(scrollYProgress, [0.5, 0.6], ["#000000", "#10b981"]); // emerald-500

  const word2Y = useTransform(scrollYProgress, [0.4, 0.5], [0, 10]);

  return (
    <section ref={containerRef} className="py-32 bg-sage-100 text-black relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-black">
            Feedback so precise, it catches the silent letters you missed.
          </h2>
          <p className="mt-6 text-xl font-medium leading-relaxed text-black/70">
            Get a granular breakdown of every sentence. We highlight exact insertions, deletions, and substitutions so you know exactly what went wrong down to the syllable.
          </p>
        </motion.div>

        <div className="relative h-96 w-full rounded-3xl bg-white border border-sage-700/20 p-8 shadow-sm flex items-center justify-center">
          <div className="absolute top-0 right-0 p-4">
            <span className="inline-flex items-center rounded-full bg-white border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 shadow-sm">
              Analysis Complete
            </span>
          </div>

          <div className="flex gap-4 font-sans text-4xl sm:text-6xl font-extrabold">
            <motion.span style={{ color: word1Color }}>The</motion.span>
            <motion.span style={{ color: word2Color, y: word2Y }} className="relative">
              kwick
              <motion.span 
                initial={{ opacity: 0 }} 
                style={{ opacity: useTransform(scrollYProgress, [0.4, 0.5], [0, 1]) }}
                className="absolute -top-8 left-0 text-lg text-red-500 font-bold"
              >
                quick*
              </motion.span>
            </motion.span>
            <motion.span style={{ color: word3Color }}>brown</motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
