"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Settings, 
  Mic, 
  BarChart, 
  Clock,
  Command,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface Attempt {
  id: string;
  scriptTitle: string;
  score: number;
  createdAt: any;
}

// ─── Shared Components ──────────────────────────────────────────────────────
const SkeletonCard = () => (
  <Card className="p-6 h-[160px] flex flex-col justify-between animate-pulse">
    <div className="h-10 w-10 rounded-xl bg-zinc-100" />
    <div className="space-y-2">
      <div className="h-8 w-16 bg-zinc-100 rounded-md" />
      <div className="h-4 w-24 bg-zinc-100 rounded-md" />
      <div className="h-3 w-32 bg-zinc-50 rounded-md" />
    </div>
  </Card>
);

const StatCard = ({ icon: Icon, value, title, subtitle, colorClass }: { icon: any, value: React.ReactNode, title: string, subtitle: string, colorClass: string }) => (
  <Card hoverEffect className="group p-6 flex flex-col justify-between h-[160px]">
    <div className={`flex items-center justify-center h-10 w-10 rounded-xl ${colorClass} mb-4`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="text-3xl font-black text-black tracking-tight">{value}</div>
      <div className="text-sm font-semibold text-black/70 mt-1">{title}</div>
      <div className="text-xs text-black/50 mt-0.5">{subtitle}</div>
    </div>
    <ArrowUpRight className="absolute top-6 right-6 h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
  </Card>
);

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttempts() {
      if (!user) return;
      try {
        // Fetch ordered ascending so chart data goes from oldest to newest
        const q = query(collection(db, "users", user.uid, "attempts"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attempt));
        setAttempts(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttempts();
  }, [user]);

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts) 
    : 0;
  const highScore = totalAttempts > 0 
    ? Math.round(Math.max(...attempts.map(a => a.score))) 
    : 0;
  const timeSpent = totalAttempts * 30; // approx 30s per attempt

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Prepare chart data
  const chartData = attempts.map((a, i) => {
    const date = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
    return {
      name: `Session ${i + 1}`,
      score: Math.round(a.score),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Online</span>
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-black/60 mt-1">{today}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-black/60 bg-sage-300 border border-sage-700/50 px-3 py-1.5 rounded-lg shadow-sm">
          <Command className="h-3 w-3" /> Press <kbd className="font-mono text-black">Cmd+K</kbd> to jump anywhere
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : totalAttempts === 0 ? (
        <EmptyState 
          icon={Activity}
          title="No Practice Sessions Yet"
          description="You haven't recorded any sessions. Start practicing to unlock your dashboard stats and progress tracking!"
          action={
            <Link 
              href="/dashboard/practice"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
            >
              <Mic className="h-4 w-4" />
              Start Your First Session
            </Link>
          }
        />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={FileText} 
              value={totalAttempts}
              title="Total Attempts"
              subtitle={`${totalAttempts} completed · 0 drafts`}
              colorClass="bg-sage-100/50 text-sage-900"
            />
            <StatCard 
              icon={BarChart} 
              value={avgScore}
              title="Average Score"
              subtitle="out of 100"
              colorClass="bg-emerald-500/10 text-emerald-400"
            />
            <StatCard 
              icon={CheckCircle2} 
              value={highScore}
              title="Highest Score"
              subtitle="personal best"
              colorClass="bg-amber-500/10 text-amber-400"
            />
            <StatCard 
              icon={Clock} 
              value={<>{Math.floor(timeSpent/60)}<span className="text-xl text-zinc-500 font-semibold ml-1">m</span></>}
              title="Practice Time"
              subtitle="active speaking"
              colorClass="bg-blue-500/10 text-blue-400"
            />
          </div>

          {/* Chart Section */}
          <Card className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-black">Score Trend</h3>
              <p className="text-sm font-medium text-black/60 mt-1">Your pronunciation progress over recent sessions.</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    labelStyle={{ color: '#71717a', fontWeight: '500', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      {/* Quick Actions */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sage-900/10 blur-3xl pointer-events-none" />
        
        <div className="mb-8 relative z-10">
          <h3 className="text-xl font-bold text-black tracking-tight">Quick Actions</h3>
          <p className="text-sm font-medium text-black/60 mt-1">Jump directly to key areas of the platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <Link href="/dashboard/practice" className="group flex items-start gap-4 p-5 rounded-2xl bg-sage-100/50 hover:bg-sage-100 transition-all border border-sage-700/30 hover:border-sage-700/70 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-sage-100 border border-sage-700/30 text-sage-900 group-hover:bg-sage-900 group-hover:text-white transition-colors shadow-sm">
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black group-hover:text-sage-900 transition-colors">Start New Practice</h4>
              <p className="text-xs font-medium text-black/60 mt-1">Record audio and get instant AI feedback on your pronunciation.</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-black/40 group-hover:text-sage-900 transition-colors mt-1" />
          </Link>

          <Link href="/dashboard/history" className="group flex items-start gap-4 p-5 rounded-2xl bg-sage-100/50 hover:bg-sage-100 transition-all border border-sage-700/30 hover:border-sage-700/70 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-sage-100 border border-sage-700/30 text-sage-900 group-hover:bg-sage-900 group-hover:text-white transition-colors shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black group-hover:text-sage-900 transition-colors">Review History</h4>
              <p className="text-xs font-medium text-black/60 mt-1">Review past attempts and track your long-term progress.</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-black/40 group-hover:text-sage-900 transition-colors mt-1" />
          </Link>

          <Link href="/dashboard/settings" className="group flex items-start gap-4 p-5 rounded-2xl bg-sage-100/50 hover:bg-sage-100 transition-all border border-sage-700/30 hover:border-sage-700/70 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-sage-100 border border-sage-700/30 text-sage-900 group-hover:bg-sage-900 group-hover:text-white transition-colors shadow-sm">
              <Settings className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black transition-colors">Account Settings</h4>
              <p className="text-xs font-medium text-black/60 mt-1">Manage your profile, preferences, and data privacy.</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-black/40 group-hover:text-sage-900 transition-colors mt-1" />
          </Link>

          <div className="group flex items-start gap-4 p-5 rounded-2xl bg-sage-300/30 border border-sage-700/20 cursor-not-allowed opacity-60">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-sage-100/50 text-black/40">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black/60 flex items-center gap-2">
                Expert Feedback <span className="text-[10px] bg-sage-700/20 px-1.5 py-0.5 rounded text-black/60 uppercase">Pro</span>
              </h4>
              <p className="text-xs font-medium text-black/50 mt-1">Human coach review coming soon.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
