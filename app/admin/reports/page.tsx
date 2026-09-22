import React from "react";
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";
import { SalesTrendChart, CategoryShareChart } from "@/components/admin/ChartMock";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#143425]">
          Beverage Sales & Analytics Reports
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Evaluate brand performance across Vrinda, Sangam, Urban Roast, and CocoJoy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif text-base font-bold text-[#143425]">
            Annual Sales Volume Progression
          </h2>
          <SalesTrendChart />
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif text-base font-bold text-[#143425]">
            Portfolio Distribution
          </h2>
          <CategoryShareChart />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 space-y-2">
          <p className="text-xs text-stone-500">Average Order Value (AOV)</p>
          <p className="text-2xl font-bold font-mono text-[#143425]">₹892</p>
          <p className="text-[11px] text-emerald-700 font-semibold">+12% vs last quarter</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 space-y-2">
          <p className="text-xs text-stone-500">Repeat Customer Rate</p>
          <p className="text-2xl font-bold font-mono text-[#143425]">43.8%</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Chai premixes drive highest loyalty</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 space-y-2">
          <p className="text-xs text-stone-500">Top Selling SKU</p>
          <p className="text-base font-bold text-stone-900">Vrinda Royal Cardamom</p>
          <p className="text-[11px] text-[#A87E28] font-bold">142 units sold this month</p>
        </div>
      </div>
    </div>
  );
}
