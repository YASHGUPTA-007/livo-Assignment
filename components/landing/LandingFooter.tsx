"use client";

import React from "react";

export function LandingFooter() {
  return (
    <footer className="bg-sage-100 py-12 border-t border-sage-700/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white font-bold text-xs">
            L
          </div>
          <span className="font-sans font-bold tracking-tight text-black">
            LIVO AI
          </span>
        </div>

        <div className="flex gap-6 text-sm font-semibold text-black/60">
          <a href="/privacy" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-black transition-colors">Terms of Service</a>
        </div>

        <div className="text-sm font-semibold text-black/40">
          Built for the Livo AI engineering assignment by Yash.
        </div>

      </div>
    </footer>
  );
}
