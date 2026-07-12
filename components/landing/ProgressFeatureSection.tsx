"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export function ProgressFeatureSection() {
  return (
    <section className="py-32 bg-sage-100 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-black">
            Watch your fluency compound over time.
          </h2>
          <p className="mt-6 text-xl font-medium leading-relaxed text-black/70">
            Track your daily attempts, average scores, and long-term fluency trends in a gorgeous analytics dashboard. See exactly where your practice is paying off.
          </p>
        </motion.div>

        {/* Abstract Dashboard Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-96 w-full rounded-3xl bg-white border border-sage-700/20 p-8 shadow-sm flex flex-col justify-end overflow-hidden"
        >
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sage-700/10 bg-white text-black shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-black">Fluency Trend</div>
              <div className="text-xs font-semibold text-emerald-600">+12% this week</div>
            </div>
          </div>

          {/* Fake Chart Lines */}
          <div className="relative w-full h-48 mt-auto flex items-end justify-between px-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
              {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-sage-700/10" />)}
            </div>
            
            {/* Bars */}
            {[40, 55, 45, 60, 50, 75, 65, 85, 80, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-[6%] rounded-t-lg bg-emerald-500 relative group"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
