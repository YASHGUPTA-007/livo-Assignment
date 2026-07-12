"use client";

import React, { useState, useRef, useEffect } from "react";
import { Script } from "@/lib/scripts";
import { Mic, StopCircle, Upload, RefreshCw, BookOpen, AudioLines } from "lucide-react";

interface Props {
  script: Script;
  onSubmit: (blob: Blob) => void;
  onCancel: () => void;
  /** Target recording duration in seconds. Defaults to 45. */
  maxSeconds?: number;
}

export default function Recorder({ script, onSubmit, onCancel, maxSeconds = 45 }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (recordingTime >= maxSeconds && isRecording) {
      stopRecording();
    }
  }, [recordingTime, isRecording, maxSeconds]);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMsg("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate duration using a temporary audio element
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      if (duration < 15 || duration > maxSeconds + 1) {
        setErrorMsg(`Your file is ${Math.round(duration)}s long. It must be between 15 and ${maxSeconds} seconds.`);
        URL.revokeObjectURL(url);
      } else {
        setAudioBlob(file);
        setAudioUrl(url);
      }
    };
    
    audio.onerror = () => {
      setErrorMsg("Failed to read the audio file.");
      URL.revokeObjectURL(url);
    };
  };

  const handleSubmit = () => {
    if (audioBlob) {
      const upperBound = maxSeconds + 1;
      if (recordingTime > 0 && (recordingTime < 15 || recordingTime > upperBound)) {
         setErrorMsg(`Recording must be between 15-${maxSeconds} seconds. (Currently ${recordingTime}s)`);
         return;
      }
      onSubmit(audioBlob);
    }
  };

  const handleReset = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* ── Script Display Card ── */}
      <div className="rounded-3xl border border-sage-700/50 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-sage-100/50 px-6 sm:px-8 py-5 border-b border-sage-700/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-300/50 text-sage-900">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-0.5">Reading Material</p>
              <h3 className="text-base font-bold text-black leading-none">{script.title}</h3>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="text-xs font-bold px-4 py-2 rounded-xl border border-sage-700/50 bg-white text-black/60 hover:bg-sage-100 hover:text-black transition-colors"
          >
            Change Script
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8 md:p-10 bg-white">
          <p className="text-[19px] md:text-[22px] leading-[1.8] text-black/80 font-medium tracking-tight">
            {script.text}
          </p>
        </div>
      </div>

      {/* ── Recording / Upload Interface ── */}
      <div className="rounded-3xl border border-sage-700/50 bg-white p-8 shadow-sm text-center relative overflow-hidden">
        {/* Decorative background pulse if recording */}
        {isRecording && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
        )}
        
        <div className="relative z-10">
          {errorMsg && (
            <div className="mb-6 mx-auto max-w-lg rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-bold text-red-400 animate-in fade-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}

          {!audioBlob ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-black tracking-tight">
                  Ready to record?
                </h4>
                <p className="text-sm font-medium text-black/60">
                  Read the script aloud. Aim for 15 – {maxSeconds} seconds.
                </p>
              </div>

              {isRecording ? (
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 h-8">
                      {[1,2,3,4,5].map(i => (
                        <div 
                          key={i} 
                          className="w-1.5 bg-red-500 rounded-full animate-bounce"
                          style={{ 
                            height: `${Math.random() * 100 + 40}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.8s'
                          }} 
                        />
                      ))}
                    </div>
                    
                    <div className="text-4xl font-black text-red-500 tabular-nums tracking-tighter">
                      00:{recordingTime.toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  <button
                    onClick={stopRecording}
                    className="group relative flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-white font-bold text-lg hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:-translate-y-0.5"
                  >
                    <StopCircle className="h-6 w-6" /> 
                    <span>Finish Recording</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={startRecording}
                  className="group relative flex mx-auto items-center gap-3 rounded-2xl bg-sage-900 px-8 py-4 text-white font-bold text-lg hover:bg-sage-700 transition-all shadow-[0_0_15px_rgba(101,146,135,0.3)] hover:shadow-[0_0_25px_rgba(101,146,135,0.5)] hover:-translate-y-0.5"
                >
                  <Mic className="h-6 w-6 group-hover:scale-110 transition-transform" /> 
                  <span>Start Recording</span>
                </button>
              )}

              <div className="relative mx-auto max-w-sm pt-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-sage-700/20" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs font-bold uppercase tracking-widest text-black/40">OR</span>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex mx-auto items-center gap-2 rounded-xl border-2 border-dashed border-sage-700/30 bg-sage-100/50 px-6 py-3 text-sm font-bold text-black/60 hover:border-sage-700 hover:text-black transition-colors"
                >
                  <Upload className="h-4 w-4" /> 
                  Upload Audio File instead
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-300 text-sage-900 mb-2 border border-sage-700/30">
                  <AudioLines className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-black text-black tracking-tight">Audio Captured!</h4>
                <p className="text-sm font-medium text-black/60">Listen back to make sure it sounds good.</p>
              </div>
              
              {audioUrl && (
                <div className="mx-auto max-w-md rounded-2xl bg-sage-100 p-2 border border-sage-700/30 shadow-sm">
                  <audio controls src={audioUrl} className="w-full rounded-xl outline-none" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-sage-700/30 bg-white px-8 py-3.5 text-sm font-bold text-black/70 hover:bg-sage-100 transition-colors shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" /> Re-record
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-sage-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-sage-700 shadow-[0_0_15px_rgba(101,146,135,0.3)] hover:-translate-y-0.5 transition-all"
                >
                  <Mic className="h-4 w-4" />
                  Submit for Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
