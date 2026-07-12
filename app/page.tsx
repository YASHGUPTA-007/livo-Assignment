"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mic, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-saas-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-saas-sidebar border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-saas-bg font-sans text-saas-text selection:bg-saas-sidebar-active selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-saas-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-saas-sidebar text-white font-bold text-lg">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-saas-text">
              LIVO AI
            </span>
          </div>
          <button
            onClick={signIn}
            className="rounded-xl bg-saas-sidebar px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-saas-sidebar-active shadow-sm"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center rounded-full border border-saas-border bg-white px-4 py-1.5 text-sm font-semibold text-saas-text shadow-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Livo Assignment by Yash
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-saas-text">
          Master your English <br className="hidden sm:block" />
          <span className="text-saas-sidebar-active/80">pronunciation today.</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-saas-text-muted sm:text-xl font-medium">
          An AI-powered assessment tool built for the Livo AI engineering assignment. 
          Upload your speech, get instant feedback, and uncover exactly where to improve.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={signIn}
            className="group flex items-center justify-center gap-2 rounded-xl bg-saas-sidebar px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-saas-sidebar-active hover:shadow-xl"
          >
            Get Started <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-5xl mx-auto text-left">
          {[
            "Instant AI-driven feedback",
            "Detailed word-level analysis",
            "DPDP compliant architecture",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-saas-border bg-white p-6 shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
              <span className="font-bold text-saas-text tracking-tight">{feature}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-saas-border bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 lg:px-8 sm:flex-row">
          <p className="text-sm font-semibold text-saas-text-muted">
            © {new Date().getFullYear()} Livo AI Assessment.
          </p>
          <p className="text-sm font-semibold text-saas-text-muted">
            Made by <span className="font-bold text-saas-text">Yash</span> •{" "}
            <a
              href="https://yashships.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-saas-text hover:underline transition-colors"
            >
              yashships.live
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
