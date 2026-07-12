"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  "100,000+ Phonemes Analyzed",
  "Avg. 24% Score Improvement",
  "Trusted by Non-Native Founders",
  "Powered by Advanced Speech Recognition",
  "Instant Actionable Feedback",
];

export function SocialProofSection() {
  return (
    <section className="border-b border-t border-sage-700/10 bg-white overflow-hidden py-12">
      <div className="relative flex max-w-full overflow-hidden">
        
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        
        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
          className="flex whitespace-nowrap items-center w-max"
        >
          {/* Double the array for seamless looping */}
          {[...stats, ...stats, ...stats].map((stat, idx) => (
            <div key={idx} className="flex items-center mx-10">
              <span className="text-xl md:text-2xl font-sans font-bold text-black/30 uppercase tracking-widest">
                {stat}
              </span>
              <div className="h-2 w-2 rounded-full bg-emerald-500/30 ml-20" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
