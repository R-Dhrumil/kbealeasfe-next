"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-3 text-sm",
  };

  const btnClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden select-none",
        sizeClasses[size],
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded text-stone-600 hover:text-[#143425] hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
          btnClasses[size]
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="w-9 text-center font-mono font-medium text-stone-900">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded text-stone-600 hover:text-[#143425] hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
          btnClasses[size]
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
