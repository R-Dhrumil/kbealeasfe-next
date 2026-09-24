"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Package, Truck, ExternalLink } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
  const { orders, isLoaded } = useCustomer();
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  const filteredOrders = orders.filter((order) => {
    if (filter === "active") {
      return order.status !== "Delivered" && order.status !== "Cancelled";
    }
    if (filter === "delivered") {
      return order.status === "Delivered";
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#143425] mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Account Overview</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-[#143425]">
            Your Order History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review previous dispatches, consignment invoices, and real-time tracking numbers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl border border-stone-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-white text-[#143425] shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "active"
                ? "bg-white text-[#143425] shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Active ({orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("delivered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === "delivered"
                ? "bg-white text-[#143425] shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Delivered ({orders.filter((o) => o.status === "Delivered").length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {!isLoaded ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading order records...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4 shadow-2xs">
          <Package className="h-12 w-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-900">
            No orders found in this view
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {filter === "all"
              ? "You haven't placed any beverage orders yet."
              : `You have no ${filter} orders currently.`}
          </p>
          <Link href="/shop">
            <Button variant="primary" size="md">
              Browse Beverage Selection
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-2xs"
            >
              {/* Order Top Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-base text-[#143425]">
                    {order.orderNumber}
                  </span>
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Confirmed"
                        ? "brand"
                        : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                  {order.paymentStatus && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {order.paymentStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span>Placed on {formatDate(order.createdAt)}</span>
                  <span className="font-mono font-bold text-sm text-stone-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50/60 border border-stone-100"
                  >
                    <div className="relative h-14 w-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#A87E28] font-bold">
                        {item.brandName}
                      </span>
                      <p className="font-medium text-xs text-stone-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        Qty: {item.quantity} • {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions & Tracking Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-stone-100 gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Truck className="h-4 w-4 text-[#143425]" />
                  <span>
                    Carrier: <strong className="text-stone-800">{order.carrier || "BlueDart Express"}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    AWB Tracking: <strong className="font-mono text-stone-800">{order.trackingNumber || "Pending Dispatch"}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="h-9 px-4 rounded-xl bg-[#143425] text-white hover:bg-[#1b4330] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Track Consignment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
