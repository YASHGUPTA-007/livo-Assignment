"use client";

import React, { useState } from "react";
import ConsentModal from "@/components/ConsentModal";
import ScriptSelector from "@/components/ScriptSelector";
import Recorder from "@/components/Recorder";
import ResultsView, { AnalysisResult } from "@/components/ResultsView";
import { Script } from "@/lib/scripts";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

type PracticeState = "select" | "record" | "analyzing" | "results";

export default function PracticePage() {
  const { user } = useAuth();
  const [currentState, setCurrentState] = useState<PracticeState>("select");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScriptSelect = (script: Script) => {
    setSelectedScript(script);
    setCurrentState("record");
    setErrorMsg(null);
  };

  const handleAudioSubmit = async (blob: Blob) => {
    if (!selectedScript || !user) return;
    
    setCurrentState("analyzing");
    setLoadingMsg("Uploading and transcribing audio...");
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("scriptText", selectedScript.text);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      setLoadingMsg("Generating personalized feedback...");
      const data: AnalysisResult = await res.json();

      setResult(data);
      setCurrentState("results");

      // Save to Firestore
      try {
        await addDoc(collection(db, "users", user.uid, "attempts"), {
          scriptId: selectedScript.id,
          scriptTitle: selectedScript.title,
          score: data.score,
          transcript: data.transcript,
          flaggedWords: data.flaggedWords,
          createdAt: serverTimestamp()
        });
      } catch (dbError) {
        console.error("Failed to save attempt to Firestore", dbError);
        // We don't block the UI for a failed save, but it's logged
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during analysis.");
      setCurrentState("record");
    }
  };

  return (
    <div className="py-6">
      <ConsentModal />
      
      {currentState === "select" && (
        <ScriptSelector onSelect={handleScriptSelect} />
      )}

      {currentState === "record" && selectedScript && (
        <div className="space-y-4">
          {errorMsg && (
            <div className="mx-auto max-w-4xl rounded-md bg-red-50 p-4 text-sm text-red-700 mb-4">
              {errorMsg}
            </div>
          )}
          <Recorder
            script={selectedScript}
            onSubmit={handleAudioSubmit}
            onCancel={() => setCurrentState("select")}
            maxSeconds={selectedScript.targetSeconds ?? 45}
          />
        </div>
      )}

      {currentState === "analyzing" && (
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-saas-text" />
          <h2 className="text-xl font-bold text-saas-text tracking-tight animate-pulse">{loadingMsg}</h2>
          <p className="text-gray-500 max-w-md text-center">
            Our AI is listening carefully to your pronunciation. This usually takes 5-10 seconds.
          </p>
        </div>
      )}

      {currentState === "results" && selectedScript && result && (
        <ResultsView
          script={selectedScript}
          result={result}
          onRetry={() => setCurrentState("select")}
        />
      )}
    </div>
  );
}
