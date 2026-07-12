import React from "react";
import { Activity } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Activity, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border-2 border-dashed border-zinc-200 rounded-3xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-bold text-zinc-900 text-lg">{title}</p>
      <p className="text-sm font-medium text-zinc-500 mt-1 max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
