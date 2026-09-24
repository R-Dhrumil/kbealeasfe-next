import React from "react";

export function SalesTrendChart() {
  const months = [
    { label: "Apr", val: 42 },
    { label: "May", val: 58 },
    { label: "Jun", val: 75 },
    { label: "Jul", val: 68 },
    { label: "Aug", val: 94 },
    { label: "Sep", val: 124 },
  ];

  const maxVal = 130;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-48 pt-6 pb-2 gap-3">
        {months.map((m, idx) => {
          const heightPercent = (m.val / maxVal) * 100;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              <div className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                ₹{m.val}k
              </div>
              <div
                className="w-full max-w-[40px] rounded-t-lg bg-[#143425] hover:bg-[#C89B3C] transition-colors"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-xs font-mono text-stone-500">{m.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
        <span>Monthly Sales Volume (in ₹ thousands)</span>
        <span className="text-emerald-700 font-semibold">+18.4% YoY</span>
      </div>
    </div>
  );
}

export function CategoryShareChart() {
  const categories = [
    { name: "Tea Premixes (Vrinda)", share: 48, color: "bg-[#143425]" },
    { name: "Iced Teas (Sangam)", share: 28, color: "bg-[#C89B3C]" },
    { name: "Artisan Coffee (Urban Roast)", share: 16, color: "bg-[#6E4D38]" },
    { name: "Chocolate Drinks (CocoJoy)", share: 8, color: "bg-[#5C3826]" },
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-stone-100">
        {categories.map((c, idx) => (
          <div
            key={idx}
            className={`${c.color} h-full`}
            style={{ width: `${c.share}%` }}
            title={`${c.name}: ${c.share}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2 pt-2">
        {categories.map((c, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs text-stone-600"
          >
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
              <span>{c.name}</span>
            </div>
            <span className="font-mono font-bold text-stone-900">
              {c.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
