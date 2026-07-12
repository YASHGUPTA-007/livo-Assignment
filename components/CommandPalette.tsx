"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, Mic, History, Settings } from "lucide-react";

interface RouteItem {
  name: string;
  href: string;
  icon: React.FC<any>;
}

const routes: RouteItem[] = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Start Practice Session", href: "/dashboard/practice", icon: Mic },
  { name: "Review History", href: "/dashboard/history", icon: History },
  { name: "Account Settings", href: "/dashboard/settings", icon: Settings },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setQuery("");
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  if (!open) return null;

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease" }}
      >
        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 mr-3" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-500 text-base"
            placeholder="Search commands... (e.g., 'practice')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-[10px] font-bold text-zinc-500 border border-zinc-700 px-1.5 py-0.5 rounded bg-zinc-800 ml-3">
            ESC
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto py-2">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <button
                key={route.href}
                className="w-full flex items-center px-4 py-3 hover:bg-zinc-800 text-left transition-colors focus:bg-zinc-800 focus:outline-none"
                onClick={() => {
                  router.push(route.href);
                  setOpen(false);
                }}
              >
                <route.icon className="h-4 w-4 text-zinc-400 mr-3" />
                <span className="text-sm font-medium text-zinc-200">{route.name}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
