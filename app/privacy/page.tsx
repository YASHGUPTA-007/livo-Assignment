"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black font-sans">
      <LandingNavbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-sage prose-p:font-medium prose-p:text-black/70 prose-h2:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4">
          <p>Last updated: July 12, 2026</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Livo AI. We are committed to protecting your privacy and ensuring your personal data is handled in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023 of India.</p>
          
          <h2>2. Zero Retention Audio Processing</h2>
          <p>The core feature of Livo AI involves analyzing your voice. We operate on a strict <strong>Zero Retention</strong> policy for biometric data:</p>
          <ul>
            <li>Your audio is processed entirely in ephemeral server memory (RAM).</li>
            <li>We do not write audio files to any database, file system, or cloud storage (e.g., S3).</li>
            <li>Once the transcription API returns the text, your audio buffer is immediately destroyed by the system's garbage collector.</li>
          </ul>
          
          <h2>3. Contextual Consent</h2>
          <p>Under the DPDP Act, we process your data based on explicit contextual consent. By clicking the microphone icon to record your speech, you grant us permission to process that specific audio clip solely for the purpose of providing pronunciation feedback. Because we do not store the audio, no ongoing consent management for biometric data is required.</p>

          <h2>4. Data Shared with Sub-Processors</h2>
          <p>To provide ultra-low latency transcription and phonetics analysis, your ephemeral audio stream and text are securely routed to our AI partner, Groq. Groq operates under strict enterprise compliance agreements ensuring that your transient data is not stored or used to train their foundational models.</p>

          <h2>5. Your Rights (DPDP Act)</h2>
          <p>As a Data Principal under the DPDP Act, you have the right to access, correct, and erase your personal data. Because we do not retain your audio, there is no audio data to delete post-session. Any account-level data (such as login email or practice scores) can be requested for deletion at any time by contacting our support.</p>

          <h2>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our DPDP compliance architecture, please reach out to our Data Protection Officer.</p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
