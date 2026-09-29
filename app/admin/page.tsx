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
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { SalesTrendChart, CategoryShareChart } from "@/components/admin/ChartMock";
import { fetchApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { ORDERS } from "@/data/orders";
import { INVENTORY } from "@/data/inventory";

export default function AdminDashboardPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApi("/admin/reports");
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-stone-500">Loading dashboard...</div>;

  const lowStockItems: any[] = INVENTORY.filter(
    (i: any) => i.status === "Low Stock" || i.status === "Out of Stock"
  );
  
  const recentOrders = ORDERS.slice(0, 4);
  
  return (
    <div className="space-y-8">
      {/* Top Banner indicating Mock Mode */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#A87E28] shrink-0" />
          <span>
            <strong>UI Mock Data Mode:</strong> All metrics, graphs, and order records are populated from local centralized datasets for frontend architectural evaluation.
          </span>
        </div>
        <Link
          href="/admin/products"
          className="font-bold underline text-amber-950 hover:text-amber-800 shrink-0"
        >
          Manage Product Catalog →
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

          <SalesTrendChart />
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

          <CategoryShareChart />
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
            {recentOrders.map((order) => (
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
            ))}
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
            {lowStockItems.map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-stone-900 line-clamp-1">
                    {inv.productName}
                  </p>
                  <p className="text-stone-400 font-mono text-[10px] mt-0.5">
                    SKU: {inv.sku} • {inv.warehouseLocation}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {inv.currentStock} left
                  </span>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Threshold: {inv.safetyStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
