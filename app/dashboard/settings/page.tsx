"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, writeBatch, doc, deleteDoc } from "firebase/firestore";
import { LogOut, Trash2, AlertTriangle, Shield, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "success" | "error">("idle");

  const handleDeleteData = async () => {
    if (!user) return;
    setIsDeleting(true);
    setDeleteStatus("idle");
    try {
      // 1. Delete all attempts
      const attemptsRef = collection(db, "users", user.uid, "attempts");
      const q = query(attemptsRef);
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
      });
      await batch.commit();

      // 2. Delete user profile (consent flag etc)
      await deleteDoc(doc(db, "users", user.uid));
      
      setDeleteStatus("success");
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting data:", error);
      setDeleteStatus("error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-500 pb-12">
      <div>
        <h3 className="text-3xl font-black tracking-tight text-black">Settings</h3>
        <p className="mt-2 text-sm font-medium text-black/60">
          Manage your account settings and privacy preferences.
        </p>
      </div>

      {deleteStatus === "success" && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium text-emerald-400">All your data has been successfully deleted from our servers.</p>
        </div>
      )}

      {deleteStatus === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 fade-in">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-400">Failed to delete data. Please try again or contact support.</p>
        </div>
      )}

      <div className="bg-white shadow-sm border border-sage-700/30 rounded-3xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex items-center gap-x-6 mb-8">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-sage-300 shadow-sm" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sage-300 text-sage-900 text-3xl font-black ring-2 ring-sage-100 shadow-sm border border-sage-700/30">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold text-black">{user?.displayName || 'User'}</h4>
              <p className="text-sm font-medium text-black/60">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sage-100 border border-sage-700/30 text-[10px] font-bold uppercase tracking-widest text-sage-900">
                <Shield className="h-3 w-3" /> Admin Account
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-sage-700/20 pt-8 mt-2">
            <button
              onClick={signOut}
              className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black/70 shadow-sm border border-sage-700/30 hover:border-sage-700 hover:text-black hover:bg-sage-100 transition-all"
            >
              <LogOut className="h-4 w-4 text-black/50 group-hover:text-black transition-colors" />
              Sign Out Securely
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-sage-700/30 rounded-3xl overflow-hidden relative">
        {/* Subtle red glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 px-6 py-8 sm:p-10">
          <h4 className="text-lg font-black text-red-600 flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </h4>
          <div className="max-w-xl text-sm font-medium text-black/60 leading-relaxed mb-6">
            <p>
              Deleting your data will permanently remove all your past pronunciation attempts, scores, and coaching feedback from our servers. This action is instantaneous and cannot be reversed.
            </p>
          </div>
          
          <div>
            {!showConfirm ? (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="inline-flex items-center rounded-xl bg-red-50 border border-red-200 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all"
              >
                Delete all my data
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-red-50/50 p-5 rounded-2xl border border-red-200 shadow-inner">
                <span className="text-sm font-bold text-red-700 flex-1">Are you absolutely sure? This cannot be undone.</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="text-sm font-bold text-black/60 hover:text-black transition-colors px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteData}
                    disabled={isDeleting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-red-700 disabled:opacity-50 transition-all w-[180px]"
                  >
                    {isDeleting ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      <><Trash2 className="h-4 w-4"/> Confirm Delete</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
