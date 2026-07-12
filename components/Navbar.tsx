"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b border-sage-700/50 bg-sage-100/50 backdrop-blur-md px-6">
      <div className="flex flex-1 items-center gap-4 md:ml-0 ml-10">
        <div className="relative w-full max-w-2xl hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-black/40" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-sage-700/30 py-2.5 pl-10 text-black placeholder:text-black/40 focus:ring-2 focus:ring-inset focus:ring-sage-700/50 sm:text-sm sm:leading-6 bg-white/50 outline-none"
            placeholder="Search messages, blogs, subscribers..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-bold text-black leading-tight">
            {user?.displayName || "User"}
          </span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-300 text-sage-900 font-black text-xs shadow-sm ring-2 ring-sage-100 cursor-pointer border border-sage-700/30">
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
}
