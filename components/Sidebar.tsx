"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mic, 
  Settings, 
  X, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  History
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean; // Mobile state
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean; // Desktop state
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Width classes based on collapsed state (only applies on md+ screens)
  const sidebarWidth = isCollapsed ? "md:w-[88px]" : "md:w-[280px]";

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col transform shadow-2xl transition-all duration-300 ease-in-out md:static md:block md:translate-x-0 w-[280px]",
          sidebarWidth,
          isOpen ? "translate-x-0" : "-translate-x-full",
          "bg-sage-900 border-r border-sage-700/50 text-black"
        )}
      >
        {/* ── Header ── */}
        <div className="flex h-[72px] shrink-0 items-center justify-between px-6 border-b border-sage-700/50 md:justify-start">
          <div className="flex items-center gap-4 overflow-hidden w-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-900 font-extrabold text-xl shadow-[0_0_15px_rgba(230,242,221,0.2)]">
              L
            </div>
            {!isCollapsed && (
              <div className="flex flex-col transition-opacity duration-300">
                <span className="text-[15px] font-extrabold text-black tracking-wider leading-none mb-1">
                  LIVO AI
                </span>
                <span className="text-[10px] text-black/70 uppercase tracking-widest leading-none font-semibold">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="text-black/60 hover:text-black transition-colors md:hidden shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* ── Navigation Links ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 flex flex-col gap-8 custom-scrollbar">
          
          <div className="px-4">
            {!isCollapsed && (
              <h4 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-black/60 transition-opacity duration-300">
                Overview
              </h4>
            )}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center rounded-xl px-4 py-3 text-[14px] font-bold transition-all duration-300 relative",
                pathname === "/dashboard"
                  ? "bg-sage-300 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "text-black/70 hover:text-black hover:bg-sage-700/30",
                isCollapsed ? "justify-center" : "gap-4"
              )}
              title={isCollapsed ? "Dashboard" : undefined}
            >
              <LayoutDashboard className={cn("shrink-0 transition-all duration-300", isCollapsed ? "h-6 w-6" : "h-5 w-5", pathname === "/dashboard" ? "text-black" : "text-black/60 group-hover:text-black")} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </div>

          <div className="px-4">
            {!isCollapsed && (
              <h4 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-black/60 transition-opacity duration-300">
                Practice
              </h4>
            )}
            <div className="space-y-2">
              <Link
                href="/dashboard/practice"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center rounded-xl px-4 py-3 text-[14px] font-bold transition-all duration-300 relative",
                  pathname === "/dashboard/practice"
                    ? "bg-sage-300 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-black/70 hover:text-black hover:bg-sage-700/30",
                  isCollapsed ? "justify-center" : "gap-4"
                )}
                title={isCollapsed ? "Start Session" : undefined}
              >
                <Mic className={cn("shrink-0 transition-all duration-300", isCollapsed ? "h-6 w-6" : "h-5 w-5", pathname === "/dashboard/practice" ? "text-black" : "text-black/60 group-hover:text-black")} />
                {!isCollapsed && <span>Start Session</span>}
              </Link>
              <Link
                href="/dashboard/history"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center rounded-xl px-4 py-3 text-[14px] font-bold transition-all duration-300 relative",
                  pathname === "/dashboard/history"
                    ? "bg-sage-300 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "text-black/70 hover:text-black hover:bg-sage-700/30",
                  isCollapsed ? "justify-center" : "gap-4"
                )}
                title={isCollapsed ? "History" : undefined}
              >
                <History className={cn("shrink-0 transition-all duration-300", isCollapsed ? "h-6 w-6" : "h-5 w-5", pathname === "/dashboard/history" ? "text-black" : "text-black/60 group-hover:text-black")} />
                {!isCollapsed && <span>History</span>}
              </Link>
            </div>
          </div>

          <div className="px-4">
            {!isCollapsed && (
              <h4 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-black/60 transition-opacity duration-300">
                System
              </h4>
            )}
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center rounded-xl px-4 py-3 text-[14px] font-bold transition-all duration-300 relative",
                pathname === "/dashboard/settings"
                  ? "bg-sage-300 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "text-black/70 hover:text-black hover:bg-sage-700/30",
                isCollapsed ? "justify-center" : "gap-4"
              )}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings className={cn("shrink-0 transition-all duration-300", isCollapsed ? "h-6 w-6" : "h-5 w-5", pathname === "/dashboard/settings" ? "text-black" : "text-black/60 group-hover:text-black")} />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </div>
          
        </div>

        {/* ── Footer / Collapse ── */}
        <div className="px-4 pb-6 mt-auto">
          {/* Desktop Collapse Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden md:flex items-center px-4 py-3 text-[13px] font-bold text-black/60 hover:text-black hover:bg-sage-700/30 rounded-xl transition-all duration-300 mb-6 w-full group",
              isCollapsed ? "justify-center" : "gap-3"
            )}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" /> 
                Collapse Sidebar
              </>
            )}
          </button>
          
          {/* User Profile Card */}
          <div className={cn(
            "rounded-xl border border-sage-700/30 bg-sage-700/10 shadow-sm transition-all duration-300",
            isCollapsed ? "p-2" : "p-4"
          )}>
            <div className={cn("flex items-center", isCollapsed ? "justify-center mb-0" : "gap-4 mb-4")}>
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="" 
                  className={cn("rounded-lg object-cover ring-2 ring-sage-300/50 shrink-0", isCollapsed ? "h-10 w-10" : "h-11 w-11")} 
                />
              ) : (
                <div className={cn("flex items-center justify-center rounded-lg bg-sage-300 text-black font-bold shrink-0 ring-1 ring-sage-700/30", isCollapsed ? "h-10 w-10 text-base" : "h-11 w-11 text-lg")}>
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-black truncate">{user?.displayName || 'User'}</span>
                  <span className="text-[11px] text-black/70 font-semibold flex items-center gap-1.5 mt-0.5 opacity-80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Online
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex gap-2 border-t border-sage-700/30 pt-3 mt-1">
                <Link href="/dashboard/settings" className="flex-1 flex justify-center py-2 rounded-lg hover:bg-sage-700/30 text-black/60 hover:text-black transition-colors group">
                  <Settings className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
                </Link>
                <button onClick={signOut} className="flex-1 flex justify-center py-2 rounded-lg hover:bg-sage-700/30 text-black/60 hover:text-red-700 transition-colors group">
                  <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Custom Scrollbar Styles for the Sidebar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}
