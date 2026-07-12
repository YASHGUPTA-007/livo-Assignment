"use client";

import React from "react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = [
    {
      score: "+34",
      quote: "I finally nailed the 'th' sound after practicing the exact same generated script 15 times.",
      name: "David K.",
      role: "Software Engineer"
    },
    {
      score: "+42",
      quote: "My team used to ask me to repeat myself constantly on Zoom. Now they don't.",
      name: "Maria S.",
      role: "Product Manager"
    },
    {
      score: "+21",
      quote: "The visual diff showing exactly which syllable I missed changed everything for me.",
      name: "Kenji Y.",
      role: "Founder"
    }
  ];

  return (
    <section className="py-32 bg-sage-100 text-black overflow-hidden relative border-t border-sage-700/10">
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center mb-20"
        >
          <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl text-black">
            The difference is night and day.
          </h2>
          <p className="mt-6 text-xl font-medium leading-relaxed text-black/70">
            Real improvements from professionals who needed to be heard clearly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-sage-700/20 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-sm">
                    {t.score}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-black/40">Score Impr.</span>
                </div>
                <p className="text-lg font-medium leading-relaxed text-black/80 mb-8">
                  "{t.quote}"
                </p>
              </div>
              <div>
                <div className="font-bold text-black">{t.name}</div>
                <div className="text-sm font-medium text-black/50">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
