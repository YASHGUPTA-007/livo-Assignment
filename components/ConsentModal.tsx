"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ConsentModal() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkConsent() {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().hasConsented) {
          setShowModal(false);
        } else {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error checking consent:", error);
        // Show modal on error just to be safe
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
    
    checkConsent();
  }, [user]);

  const handleConsent = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), { hasConsented: true }, { merge: true });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving consent:", error);
      alert("Failed to save consent. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-saas-border">
        <h3 className="mb-4 text-xl font-bold text-saas-text tracking-tight">Privacy Notice</h3>
        <p className="mb-6 text-sm leading-relaxed text-saas-text-muted">
          By continuing, you agree that your audio will be processed for pronunciation scoring and <strong>will not be stored</strong>. Only the resulting transcript, score, and feedback will be saved to your account.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-saas-text hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConsent}
            disabled={saving}
            className="rounded-xl bg-saas-sidebar px-6 py-2.5 text-sm font-semibold text-white hover:bg-saas-sidebar-active shadow-sm disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "I Agree"}
          </button>
        </div>
      </div>
    </div>
  );
}
