import React from "react";

export type BadgeVariant = "emerald" | "amber" | "red" | "zinc";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "zinc", className = "", ...props }: BadgeProps) {
  const baseClasses = "shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border";
  
  const variantClasses = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

// ─── Helper for converting scores to badge variant
export function getScoreVariant(score: number): BadgeVariant {
  if (score >= 71) return "emerald";
  if (score >= 41) return "amber";
  return "red";
}

// ─── Helper for converting difficulty to badge variant
export function getDifficultyVariant(difficulty: string): BadgeVariant {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "emerald";
  if (d === "medium") return "amber";
  if (d === "hard") return "red";
  return "zinc";
}
