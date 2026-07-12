"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function BuilderSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-sage-700/10">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] bg-black p-10 md:p-16 shadow-2xl relative overflow-hidden border border-sage-700/20"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
            
            <div className="flex-1 text-white">
              <div className="inline-flex items-center rounded border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6">
                A Note From The Builder
              </div>
              
              <h2 className="font-serif italic text-4xl md:text-5xl text-white mb-6 tracking-tight">
                Why I'm the perfect match.
              </h2>
              
              <p className="text-lg font-medium text-white/70 leading-relaxed mb-6">
                This assignment is just a small glimpse of my actual potential. I've successfully shipped <strong>20+ client projects</strong> with full ownership of the development lifecycle driving every single architectural and product decision from zero to production.
              </p>
              
              <p className="text-xl font-bold text-emerald-400 leading-relaxed">
                I'm ready to ship real agents.
              </p>
            </div>
            
            <div className="shrink-0 w-full md:w-auto flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 w-full max-w-[320px] mx-auto md:mx-0 bg-sage-900 aspect-video relative">
                <img 
                  src="https://www.yashships.live/OGGImage.png" 
                  alt="Yash Portfolio Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <a 
                href="https://yashships.live/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 rounded-2xl bg-white px-8 py-6 text-black transition-all hover:bg-emerald-50 shadow-md w-full max-w-[320px] mx-auto md:mx-0"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Portfolio</div>
                  <div className="font-sans font-black text-xl tracking-tight">yashships.live</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-45 transition-all duration-300">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
