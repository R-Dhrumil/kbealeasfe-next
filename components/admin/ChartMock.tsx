import React from "react";

export interface MonthlyTrendItem {
  label: string;
  val: number;
}

export interface CategoryShareItem {
  name: string;
  share: number;
  unitsSold?: number;
  revenue?: number;
  color?: string;
}

interface SalesTrendChartProps {
  data?: MonthlyTrendItem[];
  growthText?: string;
  isPositiveGrowth?: boolean;
}

interface CategoryShareChartProps {
  data?: CategoryShareItem[];
}

const BRAND_THEME_PALETTE = [
  "bg-[#143425]", // Vrinda / Deep Green
  "bg-[#C89B3C]", // Sangam / Gold Accent
  "bg-[#6E4D38]", // Urban Roast / Warm Coffee
  "bg-[#5C3826]", // CocoJoy / Rich Cocoa
  "bg-[#1C4834]", // Secondary Forest
];

function getCategoryThemeColor(name: string, index: number): string {
  const lower = name.toLowerCase();
  if (lower.includes("vrinda") || lower.includes("tea") || lower.includes("chai")) {
    return "bg-[#143425]";
  }
  if (lower.includes("sangam") || lower.includes("iced")) {
    return "bg-[#C89B3C]";
  }
  if (lower.includes("urban") || lower.includes("coffee") || lower.includes("roast")) {
    return "bg-[#6E4D38]";
  }
  if (lower.includes("coco") || lower.includes("choco")) {
    return "bg-[#5C3826]";
  }
  return BRAND_THEME_PALETTE[index % BRAND_THEME_PALETTE.length];
}

export function SalesTrendChart({
  data,
  growthText = "+14.2% YoY",
  isPositiveGrowth = true,
}: SalesTrendChartProps) {
  const fallbackMonths: MonthlyTrendItem[] = [
    { label: "Apr", val: 42000 },
    { label: "May", val: 58000 },
    { label: "Jun", val: 75000 },
    { label: "Jul", val: 68000 },
    { label: "Aug", val: 94000 },
    { label: "Sep", val: 124000 },
  ];

  const months = data && data.length > 0 ? data : fallbackMonths;
  const maxVal = Math.max(...months.map((m) => m.val), 1000);
  const totalVolume = months.reduce((acc, m) => acc + m.val, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-48 pt-6 pb-2 gap-3">
        {months.map((m, idx) => {
          const heightPercent = m.val > 0 ? Math.max((m.val / maxVal) * 100, 8) : 4;
          const displayLabel =
            m.val >= 100000
              ? `₹${(m.val / 100000).toFixed(1)}L`
              : m.val >= 1000
              ? `₹${(m.val / 1000).toFixed(1)}k`
              : `₹${m.val}`;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              <div className="text-[10px] font-mono text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-stone-100 px-1.5 py-0.5 rounded shadow-2xs">
                {displayLabel}
              </div>
              <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                  m.val > 0
                    ? "bg-[#143425] group-hover:bg-[#C89B3C]"
                    : "bg-stone-200"
                }`}
                style={{ height: `${heightPercent}%` }}
                title={`${m.label}: ₹${m.val.toLocaleString("en-IN")}`}
              />
              <span className="text-xs font-mono text-stone-500">{m.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
        <span>
          {data ? "Live Monthly Revenue (Orders)" : "Monthly Sales Volume (Sample Timeline)"}
        </span>
        <span
          className={`font-semibold ${
            isPositiveGrowth ? "text-emerald-700" : "text-stone-500"
          }`}
        >
          {growthText}
        </span>
      </div>
    </div>
  );
}

export function CategoryShareChart({ data }: CategoryShareChartProps) {
  const fallbackCategories: CategoryShareItem[] = [
    { name: "Tea Premixes (Vrinda)", share: 48 },
    { name: "Iced Teas (Sangam)", share: 28 },
    { name: "Artisan Coffee (Urban Roast)", share: 16 },
    { name: "Chocolate Drinks (CocoJoy)", share: 8 },
  ];

  const categories = data && data.length > 0 ? data : fallbackCategories;
  const isDynamic = Boolean(data && data.length > 0);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-stone-100">
        {categories.map((c, idx) => {
          const colorClass = c.color || getCategoryThemeColor(c.name, idx);
          if (c.share <= 0) return null;
          return (
            <div
              key={idx}
              className={`${colorClass} h-full transition-all duration-300`}
              style={{ width: `${c.share}%` }}
              title={`${c.name}: ${c.share}%${c.unitsSold ? ` (${c.unitsSold} units)` : ""}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2 pt-2">
        {categories.map((c, idx) => {
          const colorClass = c.color || getCategoryThemeColor(c.name, idx);
          return (
            <div
              key={idx}
              className="flex items-center justify-between text-xs text-stone-600"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
                <span className="truncate max-w-[180px]">{c.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                {c.unitsSold !== undefined && c.unitsSold > 0 && (
                  <span className="text-[10px] text-stone-400">
                    {c.unitsSold} {c.unitsSold === 1 ? "unit" : "units"}
                  </span>
                )}
                <span className="font-bold text-stone-900">{c.share}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {isDynamic && (
        <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-100 flex items-center justify-between">
          <span>Based on live customer fulfillment orders</span>
        </div>
      )}
    </div>
  );
}
