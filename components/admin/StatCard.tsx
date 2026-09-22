import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtext?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  isPositive = true,
  icon: Icon,
  subtext,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {label}
        </span>
        <div className="h-8 w-8 rounded-lg bg-[#E8F2EC] text-[#143425] flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold font-mono text-stone-900 tracking-tight">
          {value}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 text-xs">
          {delta && (
            <span
              className={cn(
                "font-semibold font-mono",
                isPositive ? "text-emerald-700" : "text-rose-600"
              )}
            >
              {delta}
            </span>
          )}
          {subtext && <span className="text-stone-400">{subtext}</span>}
        </div>
      </div>
    </div>
  );
}
