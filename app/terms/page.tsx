"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black font-sans">
      <LandingNavbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-sage prose-p:font-medium prose-p:text-black/70 prose-h2:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4">
          <p>Last updated: July 12, 2026</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Livo AI platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.</p>
          
          <h2>2. Description of Service</h2>
          <p>Livo AI provides an AI-powered pronunciation assessment tool. The service allows users to read scripts aloud and receive instant phoneme-level feedback. The service is provided "as is" and is currently developed as an engineering assignment prototype.</p>
          
          <h2>3. User Responsibilities</h2>
          <p>You agree not to use the service to:</p>
          <ul>
            <li>Upload any audio that contains illegal, offensive, or otherwise inappropriate content.</li>
            <li>Attempt to reverse engineer, decompile, or hack the AI transcription and assessment APIs.</li>
            <li>Use the service for high-volume automated requests without prior authorization.</li>
          </ul>

          <h2>4. Data Privacy & DPDP Act</h2>
          <p>We respect your privacy. All audio data is processed ephemerally in server memory to provide instant feedback and is immediately destroyed. We do not store biometric data or audio recordings. For complete details on how we handle data under India's Digital Personal Data Protection (DPDP) Act 2023, please refer to our Privacy Policy.</p>

          <h2>5. Limitation of Liability</h2>
          <p>Livo AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. The scoring is provided by AI models and may not always be 100% accurate.</p>

          <h2>6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service following any changes constitutes your acceptance of the new terms.</p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
