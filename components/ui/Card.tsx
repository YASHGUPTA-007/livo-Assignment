import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ children, hoverEffect = false, className = "", ...props }: CardProps) {
  const baseClasses = "bg-sage-300 rounded-3xl border border-sage-700/50 shadow-sm";
  const hoverClasses = hoverEffect 
    ? "transition-all duration-300 hover:border-sage-700 hover:shadow-md hover:-translate-y-0.5" 
    : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
