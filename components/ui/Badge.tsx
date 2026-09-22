import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "gold" | "brand" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-stone-100 text-stone-700 border-stone-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border-rose-200/80",
    gold: "bg-[#FBF5E8] text-[#A87E28] border-[#D9CBB8]",
    brand: "bg-[#E8F2EC] text-[#143425] border-[#1C4834]/20",
    outline: "bg-transparent text-stone-700 border-stone-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
