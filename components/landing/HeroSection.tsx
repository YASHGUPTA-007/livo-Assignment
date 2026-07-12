"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function HeroSection() {
  const { signIn } = useAuth();

  return (
    <section className="relative min-h-screen pt-32 pb-12 bg-white flex flex-col justify-between">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Headline */}
          <div className="lg:col-span-8 flex flex-col items-start">
            
            {/* Eyebrow Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border border-emerald-500/30 px-3 py-1.5 mb-8"
            >
              <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
                The AI Platform For Serious Learners
              </span>
            </motion.div>

            {/* Massive Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4rem] sm:text-[5rem] lg:text-[7rem] leading-[0.9] text-black tracking-tight"
            >
              <span className="font-sans font-bold">Master your</span><br/>
              <span className="font-sans font-bold">English.</span><br/>
              <span className="font-serif italic text-emerald-600 relative inline-block">
                Not just grammar.
                
                {/* Hand-drawn SVG Underline */}
                <svg className="absolute -bottom-4 left-0 w-[120%] h-8 text-emerald-600" viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                    d="M 10 20 Q 150 40 380 5" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                </svg>
              </span>
            </motion.h1>
          </div>

          {/* Right Column: Text & Buttons */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end pt-8 lg:pt-32">
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg font-medium leading-relaxed text-black/70 mb-10 border-l-2 border-emerald-500/20 pl-6"
            >
              An AI-powered assessment tool built for the Livo AI engineering assignment. Upload your speech, get instant feedback, and uncover exactly where to improve.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-0 border border-sage-700/20"
            >
              <button
                onClick={signIn}
                className="group flex items-center justify-between bg-white px-6 py-5 hover:bg-emerald-50 transition-colors border-b border-sage-700/20"
              >
                <span className="text-sm font-bold text-black uppercase tracking-widest">Start Free Session</span>
                <ArrowUpRight className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={signIn}
                className="group flex items-center justify-between bg-white px-6 py-5 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-sm font-bold text-black uppercase tracking-widest">Explore Architecture</span>
                <ArrowRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
          
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-20 border-t border-b border-sage-700/20 bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-0 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-sage-700/20">
          
          <div className="p-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-emerald-600 text-white shadow-sm shrink-0">
              <span className="font-bold">L</span>
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Livo Assignment Pulse</div>
              <div className="text-sm font-extrabold text-black uppercase tracking-tight">Yash from Mumbai is building...</div>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Phonemes Analyzed</div>
            <div className="text-2xl font-extrabold text-black">100K+</div>
          </div>

          <div className="p-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Avg Score Improvement</div>
            <div className="text-2xl font-extrabold text-black">+24%</div>
          </div>

          <div className="p-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Median Practice Time</div>
            <div className="text-2xl font-extrabold text-black">15 Mins</div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
