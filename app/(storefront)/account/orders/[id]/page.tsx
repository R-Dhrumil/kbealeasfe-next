import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck } from "lucide-react";
import { getOrderById, getOrders } from "@/data/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const orders = getOrders();
  return orders.map((o) => ({
    id: o.id,
  }));
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return { title: "Order Not Found | KB Beverage" };
  return {
    title: `Order ${order.orderNumber} | KB Beverage`,
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  const steps = [
    { title: "Order Confirmed", done: true, date: formatDate(order.createdAt) },
    { title: "Packed at Warehouse", done: true, date: "Pune Central Facility" },
    {
      title: "Out for Delivery",
      done: order.status === "Delivered" || order.status === "Shipped",
      date: order.carrier ? `${order.carrier} (${order.trackingNumber})` : "Pending Dispatch",
    },
    { title: "Delivered", done: order.status === "Delivered", date: "Verified Receipt" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
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
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Placed on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
            </p>
          </div>
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
      </div>

      {/* Fulfillment Progress Stepper */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
        <h3 className="font-serif text-base font-bold text-[#143425] mb-6">
          Consignment Tracking Progress
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-start gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
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
          <div className="p-5 bg-stone-50 font-serif font-bold text-xs uppercase tracking-wider text-stone-700">
            Purchased Beverages
          </div>
          {order.items.map((item) => (
            <div key={item.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87E28]">
                    {item.brandName}
                  </span>
                  <p className="font-medium text-sm text-stone-900 line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-xs text-stone-400 font-mono">
                    SKU: {item.sku} • Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-mono font-bold text-sm text-stone-900">
                {formatPrice(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Shipping & Payment Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs text-xs">
            <h3 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
              Delivery Address
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
          </div>
        </div>
      </div>
    </div>
  );
}
