"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { fetchApi } from "@/lib/api";
import { Search, Eye, Filter, AlertCircle, RefreshCw } from "lucide-react";
export function OrdersAdminClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchApi("/admin/orders");
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
          setError("Invalid data format received.");
        }
      } catch (err: any) {
        setError(err.message || "Unable to connect");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = (orders || []).filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor consignment statuses, packing progress, and payment settlements.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                  statusFilter === tab
                    ? "bg-[#143425] text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order # or customer..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-stone-400 space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-[#143425]" />
          <p className="text-sm font-medium">Syncing live orders...</p>
        </div>
      ) : error ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Unable to load orders</h3>
          <p className="text-stone-500 text-sm max-w-md text-center mb-6">
            We're having trouble connecting to the backend server. Please make sure the API is running or try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#143425] hover:bg-[#1C4834] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
              <tr>
                <th className="py-3.5 px-4">Order Reference</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#143425]">
                    {order.orderNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-stone-900">{order.customerName}</p>
                    <p className="text-[11px] text-stone-400">{order.shippingAddress.city}</p>
                  </td>

                  <td className="py-3.5 px-4 text-stone-500">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    {formatPrice(order.total)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="h-7 px-2 rounded-md border border-stone-200 bg-stone-50 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#143425]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-1.5 text-stone-500 hover:text-[#143425] inline-flex items-center gap-1 font-semibold"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
