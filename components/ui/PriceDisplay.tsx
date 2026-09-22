import React from "react";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface PriceDisplayProps {
  price: number;
  mrp?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showDiscount?: boolean;
}

export function PriceDisplay({
  price,
  mrp,
  size = "md",
  className,
  showDiscount = true,
}: PriceDisplayProps) {
  const hasDiscount = mrp && mrp > price;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base font-semibold",
    lg: "text-xl font-bold",
    xl: "text-2xl md:text-3xl font-bold",
  };

  const mrpClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base",
  };

  return (
    <div className={cn("inline-flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn("text-[#143425] font-mono tracking-tight", sizeClasses[size])}>
        {formatPrice(price)}
      </span>

      {hasDiscount && (
        <span
          className={cn(
            "text-stone-400 line-through font-mono",
            mrpClasses[size]
          )}
        >
          {formatPrice(mrp)}
        </span>
      )}

      {hasDiscount && showDiscount && (
        <span className="text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
          {discountPercent}% OFF
        </span>
      )}
    </div>
  );
}
