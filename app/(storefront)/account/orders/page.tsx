import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import { ORDERS } from "@/data/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Order History | KB Beverage",
  description: "Review all your past and active beverage orders.",
};

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
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
          Review all previous orders, invoices, and active fulfillment tracking.
        </p>
      </div>

      <div className="space-y-4">
        {ORDERS.map((order) => (
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
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A87E28] font-bold">
                      {item.brandName}
                    </span>
                    <p className="font-medium text-xs text-stone-900 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                      Qty: {item.quantity} • {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                Carrier: {order.carrier || "Standard Courier"} ({order.trackingNumber || "Pending"})
              </span>

              <Link
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143425] hover:text-[#C89B3C]"
              >
                <span>View Full Invoice & Tracking</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
