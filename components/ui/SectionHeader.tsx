import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionText,
  actionHref,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12",
        align === "center" && "text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-[#A87E28] uppercase mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-4xl font-serif text-[#143425] tracking-tight font-normal">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-stone-600 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#143425] hover:text-[#C89B3C] transition-colors group shrink-0"
        >
          <span>{actionText}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
