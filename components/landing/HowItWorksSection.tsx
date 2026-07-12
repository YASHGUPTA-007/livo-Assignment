"use client";

import React from "react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white relative py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
          {/* Left Text (Scrolling) */}
          <div className="relative">
            <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl text-black mb-16">
              Three steps to <br/> perfect pronunciation.
            </h2>
            
            <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-black flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-900 text-sm">1</span>
                  Generate a script
                </h3>
                <p className="mt-2 text-black/60 font-medium pl-12">Select your difficulty level and let AI craft a practice text targeting your specific needs.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-black flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-900 text-sm">2</span>
                  Hit record & speak
                </h3>
                <p className="mt-2 text-black/60 font-medium pl-12">Read the text naturally. We process your audio securely in real-time.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-black flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-900 text-sm">3</span>
                  Review your mistakes
                </h3>
                <p className="mt-2 text-black/60 font-medium pl-12">Get an overall score and a phoneme-level breakdown of exactly what you mispronounced.</p>
              </motion.div>
            </div>
          </div>

          {/* Right Visuals (Natural Scroll) */}
          <div className="hidden lg:flex flex-col gap-16">
            
            {/* Step 1 Visual */}
            <div className="h-[60vh] rounded-3xl bg-sage-100/50 border border-sage-700/20 flex items-center justify-center p-8 sticky top-32">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm border border-sage-700/10 text-center">
                <div className="h-2 w-32 bg-sage-100 rounded-full mx-auto mb-4" />
                <div className="text-lg font-bold text-black">Generating Script...</div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full bg-sage-100 rounded-full" />
                  <div className="h-2 w-4/5 bg-sage-100 rounded-full" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
