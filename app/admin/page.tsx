"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { SalesTrendChart, CategoryShareChart } from "@/components/admin/ChartMock";
import { fetchApi } from "@/lib/api";
import { getLowStockAlerts } from "@/service/inventory";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Order } from "@/types/order";

export default function AdminDashboardPage() {
  const [report, setReport] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [reportData, ordersData, alertsData] = await Promise.allSettled([
          fetchApi("/admin/reports"),
          fetchApi("/admin/orders"),
          getLowStockAlerts(),
        ]);
        if (reportData.status === "fulfilled") setReport(reportData.value);
        if (ordersData.status === "fulfilled" && Array.isArray(ordersData.value)) {
          setAllOrders(ordersData.value);
          setRecentOrders(ordersData.value.slice(0, 4));
        }
        if (alertsData.status === "fulfilled" && Array.isArray(alertsData.value)) {
          setLowStockItems(alertsData.value);
        }
      } catch (err) {
        console.error("Dashboard data load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute live monthly sales trend
  const monthlyTrend = React.useMemo(() => {
    if (report?.monthlyRevenue && Array.isArray(report.monthlyRevenue) && report.monthlyRevenue.length > 0) {
      return report.monthlyRevenue.map((m: any) => ({
        label: m.month,
        val: Number(m.revenue) || 0,
      }));
    }

    const now = new Date();
    const months: { label: string; year: number; month: number; val: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        val: 0,
      });
    }

    if (allOrders.length > 0) {
      allOrders.forEach((o) => {
        if (!o.createdAt || o.status === "Cancelled") return;
        const d = new Date(o.createdAt);
        if (isNaN(d.getTime())) return;
        const target = months.find((m) => m.year === d.getFullYear() && m.month === d.getMonth());
        if (target) {
          target.val += Number(o.total || o.subtotal || 0);
        }
      });
    }

    return months.map((m) => ({ label: m.label, val: Math.round(m.val) }));
  }, [report, allOrders]);

  // Compute month-over-month growth rate
  const growthMetric = React.useMemo(() => {
    if (!monthlyTrend || monthlyTrend.length < 2) return { text: "+14.2% YoY", isPositive: true };
    const cur = monthlyTrend[monthlyTrend.length - 1].val;
    const prev = monthlyTrend[monthlyTrend.length - 2].val;
    if (prev === 0 && cur > 0) return { text: "+100% MoM", isPositive: true };
    if (prev === 0 && cur === 0) return { text: `FY ${new Date().getFullYear()}`, isPositive: true };
    const pct = Math.round(((cur - prev) / prev) * 100);
    return {
      text: `${pct >= 0 ? "+" : ""}${pct}% MoM`,
      isPositive: pct >= 0,
    };
  }, [monthlyTrend]);

  // Compute category share based on live orders and items
  const categoryBreakdown = React.useMemo(() => {
    if (report?.categoryBreakdown && Array.isArray(report.categoryBreakdown) && report.categoryBreakdown.length > 0) {
      return report.categoryBreakdown;
    }

    const brandMap: Record<string, { units: number; revenue: number }> = {};
    let totalQty = 0;

    allOrders.forEach((order) => {
      if (order.status === "Cancelled" || !Array.isArray(order.items)) return;
      order.items.forEach((item) => {
        let brandName = item.brandName;
        if (!brandName || brandName === "KB Beverage" || brandName === "Unknown") {
          const lower = (item.productName || "").toLowerCase();
          if (lower.includes("vrinda") || lower.includes("chai") || lower.includes("tea")) {
            brandName = "Tea Premixes (Vrinda)";
          } else if (lower.includes("sangam") || lower.includes("iced")) {
            brandName = "Iced Teas (Sangam)";
          } else if (lower.includes("urban") || lower.includes("coffee") || lower.includes("roast")) {
            brandName = "Artisan Coffee (Urban Roast)";
          } else if (lower.includes("coco") || lower.includes("choco")) {
            brandName = "Chocolate Drinks (CocoJoy)";
          } else {
            brandName = "Specialty Beverages";
          }
        }

        if (!brandMap[brandName]) {
          brandMap[brandName] = { units: 0, revenue: 0 };
        }
        const qty = item.quantity || 1;
        const lineTotal = item.lineTotal || (item.unitPrice * qty) || 0;
        brandMap[brandName].units += qty;
        brandMap[brandName].revenue += lineTotal;
        totalQty += qty;
      });
    });

    if (totalQty === 0) return undefined;

    return Object.entries(brandMap)
      .map(([name, stat]) => ({
        name,
        unitsSold: stat.units,
        revenue: stat.revenue,
        share: Math.round((stat.units / totalQty) * 100),
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold);
  }, [report, allOrders]);

  if (loading) return <div className="p-8 text-center text-stone-500">Loading dashboard...</div>;
  
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Live Operations Hub:</strong> Real-time sales metrics, customer orders, and warehouse fulfillment records.
          </span>
        </div>
        <Link
          href="/admin/orders"
          className="font-bold underline text-emerald-900 hover:text-emerald-700 shrink-0"
        >
          View All Orders →
        </Link>
      </div>

      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
            Operational Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time storefront health, beverage sales trends, and warehouse inventory statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="h-9 px-4 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>+ Add Product</span>
          </Link>
        </div>
      </div>

      {/* Five Operational Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Revenue"
          value={report ? `₹${report.totalRevenue?.toLocaleString()}` : "₹0"}
          delta="+14.2%"
          subtext="vs last month"
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={report?.totalOrders?.toString() || "0"}
          delta="+8.1%"
          subtext="fulfillment 98%"
          icon={ShoppingCart}
        />
        <StatCard
          label="Customers"
          value={report?.totalCustomers?.toString() || "0"}
          delta="+19.5%"
          subtext="active accounts"
          icon={Users}
        />
        <StatCard
          label="Avg Order Value"
          value={report ? `₹${report.averageOrderValue?.toLocaleString()}` : "₹0"}
          subtext="across all orders"
          icon={Package}
        />
        <StatCard
          label="Low Stock Alerts"
          value={`${lowStockItems.length} SKUs`}
          delta="Attention Needed"
          isPositive={false}
          icon={AlertTriangle}
        />
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales Volume Trend */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425]">
                Beverage Sales Revenue Trend
              </h2>
              <p className="text-xs text-stone-500">
                Monthly revenue across online and corporate wholesale channels
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              FY 2026
            </span>
          </div>

          <SalesTrendChart
            data={monthlyTrend}
            growthText={growthMetric.text}
            isPositiveGrowth={growthMetric.isPositive}
          />
        </div>

        {/* Category Share */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="font-serif text-base font-bold text-[#143425]">
              Category Breakdown
            </h2>
            <p className="text-xs text-stone-500">
              Share of volume among the 4 primary categories
            </p>
          </div>

          <CategoryShareChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Actionable Tables: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425]">
                Recent Customer Orders
              </h2>
              <p className="text-xs text-stone-500">
                Last 4 customer transactions needing fulfillment
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-stone-400">No orders recorded yet.</p>
            ) : (
              recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">
                      {order.orderNumber}
                    </span>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Confirmed"
                          ? "brand"
                          : "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-stone-500 mt-0.5">
                    {order.customerName} • {order.items.length} items
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-stone-900">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-stone-400 text-[10px]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Low Stock Warning Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-base font-bold text-[#143425]">
                Warehouse Restock Alerts
              </h2>
              <p className="text-xs text-stone-500">
                SKUs below safety stock buffer thresholds
              </p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C]"
            >
              Inventory →
            </Link>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center text-stone-500">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1.5" />
                <span>All warehouse SKUs are currently healthy.</span>
              </div>
            ) : (
              lowStockItems.map((inv) => (
                <div
                  key={inv.inventoryId || inv.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-stone-900 line-clamp-1">
                      {inv.productName}
                    </p>
                    <p className="text-stone-400 font-mono text-[10px] mt-0.5">
                      SKU: {inv.variantSKU || inv.sku}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {inv.availableQuantity ?? inv.currentStock} left
                    </span>
                    <p className="text-[10px] text-stone-400 mt-1">
                      Threshold: {inv.lowStockThreshold ?? inv.safetyStock}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
