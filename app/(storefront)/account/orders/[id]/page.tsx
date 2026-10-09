"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck, HelpCircle } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import { getOrderById as fetchOrderById } from "@/service/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = params?.id as string | undefined;
  const { getOrderById: getContextOrderById, isLoaded } = useCustomer();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!rawId) {
        setLoading(false);
        return;
      }

      // 1. Try local customer context first
      const contextOrder = getContextOrderById(rawId);
      if (contextOrder) {
        if (isMounted) {
          setOrder(contextOrder);
          setLoading(false);
        }
        return;
      }

      // 2. Fetch dynamically from API
      try {
        const remoteOrder = await fetchOrderById(rawId, "account");
        if (isMounted) {
          setOrder(remoteOrder || null);
        }
      } catch (err) {
        console.error("Failed to load order dynamically:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (isLoaded) {
      loadOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [rawId, isLoaded, getContextOrderById]);

  if (!rawId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-stone-500">
        Order ID missing.
      </div>
    );
  }

  if (loading || !isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-stone-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <Package className="h-14 w-14 text-stone-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#143425]">
          Order Not Found
        </h2>
        <p className="text-xs text-stone-500">
          We could not find an order matching <code className="font-mono bg-stone-100 px-2 py-0.5 rounded">{rawId}</code>.
        </p>
        <div className="pt-2">
          <Link href="/account/orders">
            <Button variant="primary" size="md">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { title: "Order Confirmed", done: true, date: formatDate(order.createdAt) },
    { title: "Packed at Warehouse", done: true, date: "Pune Central Facility" },
    {
      title: "Out for Delivery",
      done: order.status === "Delivered" || order.status === "Shipped",
      date: order.carrier ? `${order.carrier} (${order.trackingNumber || "Pending"})` : "Dispatch Scheduled",
    },
    { title: "Delivered", done: order.status === "Delivered", date: "Verified Delivery" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Header & Back link */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#143425] mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
                Order #{order.orderNumber}
              </h1>
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
            <p className="text-xs text-stone-500 mt-1">
              Placed on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Payment Status:</span>
            <span className="font-semibold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {order.paymentStatus || "Paid"}
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment Progress Stepper */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif text-base font-bold text-[#143425]">
              Consignment Tracking Progress
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Carrier: <strong>{order.carrier || "BlueDart Express"}</strong> • AWB Number:{" "}
              <strong className="font-mono">{order.trackingNumber || "Pending Dispatch"}</strong>
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold hidden sm:inline-block">
            Estimated Delivery: 2-3 Business Days
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-start gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                  step.done
                    ? "bg-[#143425] text-white"
                    : "bg-stone-100 text-stone-400 border border-stone-200"
                }`}
              >
                {step.done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <div>
                <p className={`text-xs font-bold ${step.done ? "text-stone-900" : "text-stone-400"}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Itemized Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
          <div className="p-5 bg-stone-50 font-serif font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center justify-between">
            <span>Purchased Beverages ({order.items.length})</span>
            <span className="text-stone-500 font-sans font-normal text-xs">Aroma-Preserving Packaging</span>
          </div>
          {order.items.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  <Image
                    src={item.image && item.image.trim() !== "" ? item.image : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87E28]">
                    {item.brandName}
                  </span>
                  <p className="font-medium text-sm text-stone-900 line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    SKU: {item.sku} • Qty: {item.quantity} • Unit: {formatPrice(item.unitPrice)}
                  </p>
                </div>
              </div>

              <span className="font-mono font-bold text-sm text-stone-900">
                {formatPrice(item.lineTotal || item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Shipping & Payment Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-3 shadow-2xs text-xs">
            <h3 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#143425]" />
              <span>Delivery Address</span>
            </h3>
            <p className="font-bold text-stone-900">{order.shippingAddress.fullName}</p>
            <p className="text-stone-600 leading-relaxed">
              {order.shippingAddress.addressLine1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              <br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-3 shadow-2xs text-xs text-stone-600">
            <h3 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
              Payment Breakdown
            </h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-mono font-medium text-emerald-700">
                {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-mono font-medium">{formatPrice(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-[#143425]">
              <span>Grand Total</span>
              <span className="font-mono">{formatPrice(order.total)}</span>
            </div>
            <div className="pt-2 text-[11px] text-stone-400">
              Method: <span className="font-semibold text-stone-700">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Need Assistance Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#143425]">
              <HelpCircle className="h-4 w-4" />
              <span>Need Help with this Order?</span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              For queries or wholesale consignment manifests, contact KB Beverage Support at{" "}
              <a href="mailto:support@kbbeverage.com" className="text-[#143425] underline">
                support@kbbeverage.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
