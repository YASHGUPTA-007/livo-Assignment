"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ScoringFeatureSection } from "@/components/landing/ScoringFeatureSection";
import { ScriptsFeatureSection } from "@/components/landing/ScriptsFeatureSection";
import { ProgressFeatureSection } from "@/components/landing/ProgressFeatureSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { BuilderSection } from "@/components/landing/BuilderSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sage-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black selection:bg-sage-900 selection:text-white overflow-x-hidden">
      <LandingNavbar />
      
      <main className="flex-1">
        <HeroSection />
        <SocialProofSection />
        <ProblemSection />
        <ScoringFeatureSection />
        <ScriptsFeatureSection />
        <ProgressFeatureSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
        <BuilderSection />
      </main>
      
      <LandingFooter />
    </div>
  );
}
