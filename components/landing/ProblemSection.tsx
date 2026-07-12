"use client";

import React from "react";
import { motion } from "framer-motion";

export function ProblemSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-4xl font-black tracking-tight text-black sm:text-6xl">
            Generic AI doesn't understand accents.<br className="hidden sm:block"/>
            <span className="text-sage-700/50">Human tutors are too slow.</span>
          </h2>
          <p className="mt-8 text-xl font-medium leading-relaxed text-black/60">
            Practicing pronunciation in a mirror doesn't work. You need real-time, objective data to fix the microscopic mistakes you can't hear yourself make.
          </p>
        </motion.div>

        <div className="mx-auto mt-20 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-3xl border border-sage-700/20 bg-sage-100/30 overflow-hidden hover:bg-sage-100/50 transition-colors flex flex-col"
          >
            <div className="h-64 w-full relative overflow-hidden bg-sage-900 border-b border-sage-700/10">
              <img 
                src="/images/ai-trap.png" 
                alt="AI Transcription Model" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-100/30 to-transparent" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-black mb-3">The AI Trap</h3>
              <p className="text-black/60 font-medium leading-relaxed">
                Standard transcription models are built to guess what you meant to say, aggressively auto-correcting your mistakes instead of highlighting them.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-3xl border border-sage-700/20 bg-sage-100/30 overflow-hidden hover:bg-sage-100/50 transition-colors flex flex-col"
          >
            <div className="h-64 w-full relative overflow-hidden bg-sage-900 border-b border-sage-700/10">
              <img 
                src="/images/tutor.png" 
                alt="Human Tutor Bottleneck" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-100/30 to-transparent" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-black mb-3">The Tutor Bottleneck</h3>
              <p className="text-black/60 font-medium leading-relaxed">
                Human tutors are fantastic, but they cost $40/hour and can't be there every time you want to practice for 15 minutes before a big meeting.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
