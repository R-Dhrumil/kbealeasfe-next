"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, Package, Users, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface TopProduct {
  productName: string;
  unitsSold: number;
  revenue: number;
}

interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
}

export default function AdminReportsPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi("/admin/reports");
      if (data && typeof data.totalRevenue === "number") {
        setReport(data);
      } else {
        setReport({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          averageOrderValue: 0,
          dailyRevenue: [],
          topProducts: [],
        });
      }
    } catch (err: any) {
      console.error("Failed to load sales report:", err);
      setError(err?.message || "Failed to load reports from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const maxDailyRevenue = Math.max(
    ...(report?.dailyRevenue?.map((d) => d.revenue) || [1000]),
    1000
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Beverage Sales & Analytics Reports
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time financial performance and SKU turnover across all beverage brands.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadReports}
          className="gap-1.5 shadow-2xs"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-stone-400 space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#143425]" />
          <p className="text-sm font-medium">Aggregating live sales & reports data...</p>
        </div>
      ) : error ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-stone-200/80 shadow-2xs text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <p className="text-sm font-semibold text-stone-900">{error}</p>
          <Button variant="outline" size="sm" onClick={loadReports} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Executive KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Total Gross Revenue
                </span>
                <DollarSign className="h-4 w-4 text-[#C89B3C]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#143425]">
                {formatPrice(report?.totalRevenue || 0)}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold">Live settled sales</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Total Orders
                </span>
                <ShoppingBag className="h-4 w-4 text-[#143425]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#143425]">
                {report?.totalOrders || 0}
              </p>
              <p className="text-[11px] text-stone-400 font-medium">Customer consignments</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Average Order Value
                </span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#143425]">
                {formatPrice(report?.averageOrderValue || 0)}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold">Per consignment basket</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Total Customers
                </span>
                <Users className="h-4 w-4 text-[#A87E28]" />
              </div>
              <p className="text-2xl font-bold font-mono text-[#143425]">
                {report?.totalCustomers || 0}
              </p>
              <p className="text-[11px] text-stone-400 font-medium">Registered beverage buyers</p>
            </div>
          </div>

          {/* Revenue Progression & Top SKUs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Daily Revenue Trend Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-base font-bold text-[#143425]">
                    Revenue Progression Timeline
                  </h2>
                  <p className="text-xs text-stone-400">Daily sales performance</p>
                </div>
                <BarChart3 className="h-5 w-5 text-stone-400" />
              </div>

              {report?.dailyRevenue && report.dailyRevenue.length > 0 ? (
                <div className="space-y-4 pt-4">
                  <div className="flex items-end justify-between h-48 pt-6 pb-2 gap-2 overflow-x-auto">
                    {report.dailyRevenue.map((d, idx) => {
                      const heightPercent = Math.max(
                        (d.revenue / maxDailyRevenue) * 100,
                        8
                      );
                      const shortDate = d.date.slice(5); // e.g. "09-20"
                      return (
                        <div
                          key={idx}
                          className="flex-1 min-w-[36px] flex flex-col items-center gap-2 h-full justify-end group"
                        >
                          <div className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatPrice(d.revenue)}
                          </div>
                          <div
                            className="w-full max-w-[36px] rounded-t-lg bg-[#143425] hover:bg-[#C89B3C] transition-colors"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[10px] font-mono text-stone-500">
                            {shortDate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                    <span>Recent Daily Turnover</span>
                    <span className="text-[#143425] font-semibold">Live Backend Orders</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-stone-400">
                  No sales recorded yet. Process sample orders to generate charts.
                </div>
              )}
            </div>

            {/* Top Selling Products */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-base font-bold text-[#143425]">
                    Top Performing Products
                  </h2>
                  <p className="text-xs text-stone-400">By quantity and sales volume</p>
                </div>
                <Package className="h-5 w-5 text-stone-400" />
              </div>

              {report?.topProducts && report.topProducts.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {report.topProducts.map((p, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 truncate">
                          {p.productName}
                        </p>
                        <p className="text-[11px] text-stone-400 font-mono">
                          {p.unitsSold} units dispatched
                        </p>
                      </div>
                      <span className="font-mono font-bold text-[#143425] shrink-0">
                        {formatPrice(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-stone-400">
                  No product sales recorded yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
