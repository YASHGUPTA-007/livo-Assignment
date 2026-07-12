"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CtaSection() {
  const { signIn } = useAuth();

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[3rem] bg-sage-100 border border-sage-700/20 p-16 md:p-24 shadow-sm"
        >
          <h2 className="font-sans text-5xl sm:text-7xl font-extrabold tracking-tight text-black mb-8 leading-[1.1]">
            Stop practicing <br /> in the dark.
          </h2>
          <p className="text-xl font-medium text-black/70 mb-12 max-w-2xl mx-auto">
            Join the professionals who use Livo AI to perfect their pronunciation and speak with absolute confidence.
          </p>
          
          <button
            onClick={signIn}
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-black px-10 py-5 text-lg font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            Start your free session
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
