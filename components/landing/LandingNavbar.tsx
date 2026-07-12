"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function LandingNavbar() {
  const { signIn } = useAuth();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-sage-100"
    >
      <div 
        className={`mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8 border-b border-sage-700/10 transition-colors duration-300 ${
          isScrolled ? "bg-sage-100/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-bold text-lg">
            L
          </div>
          <span className="font-sans font-bold tracking-tight text-black text-xl">
            LIVO AI
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-black/70">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
        </div>

        <button
          onClick={signIn}
          className="rounded-full bg-white/50 border border-sage-700/10 px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-white shadow-sm"
        >
          Sign In
        </button>
      </div>
    </motion.header>
  );
}
