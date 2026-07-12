"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import { Menu, ArrowLeft } from "lucide-react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-sage-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Mobile menu hamburger - positioned on top left over the Navbar */}
        <div className="absolute top-0 left-0 z-50 flex h-[72px] items-center pl-4 md:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <Navbar />
        <CommandPalette />
        
        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-[1400px]">
            {pathname !== "/dashboard" && (
              <div className="mb-6">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
