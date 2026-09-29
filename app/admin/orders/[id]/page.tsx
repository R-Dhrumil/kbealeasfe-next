import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Printer, ShieldCheck, Truck, Package } from "lucide-react";
import { getOrderById, getOrders } from "@/data/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AdminOrderDetailPageProps {
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
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return { title: "Order Not Found | KB Admin" };
  return {
    title: `Order ${order.orderNumber} Inspection | KB Admin`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Orders List</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-[#143425]">
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
            Created on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            <span>Print Packing Slip</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Purchased Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs divide-y divide-stone-100">
          <div className="p-4 bg-stone-50 font-serif font-bold text-xs uppercase tracking-wider text-stone-700">
            Fulfillment Items
          </div>
          {order.items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  <Image
                    src={item.image && item.image.trim() !== "" ? item.image : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87E28]">
                    {item.brandName}
                  </span>
                  <p className="font-semibold text-stone-900">{item.productName}</p>
                  <p className="text-stone-400 font-mono text-[11px]">
                    SKU: {item.sku} • Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono font-bold text-stone-900">
                  {formatPrice(item.lineTotal)}
                </p>
                <p className="text-stone-400 text-[10px]">{formatPrice(item.unitPrice)} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer & Settlement */ }
  <div className="lg:col-span-4 space-y-6">
    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-3 shadow-2xs text-xs">
      <h3 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
        Customer Details
      </h3>
      <p className="font-bold text-stone-900">{order.customerName}</p>
      <p className="text-stone-600">{order.customerEmail}</p>
      <p className="text-stone-600 font-mono">{order.customerPhone}</p>
      <div className="pt-2 border-t border-stone-100">
        <p className="text-[11px] font-semibold text-stone-400 uppercase">
          Shipping Destination
        </p>
        <p className="text-stone-700 mt-1 leading-relaxed">
          {order.shippingAddress.addressLine1}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
        </p>
      </div>
    </div>

    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-2.5 shadow-2xs text-xs text-stone-600">
      <h3 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
        Financial Summary
      </h3>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-mono">{formatPrice(order.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping Fee</span>
        <span className="font-mono text-emerald-700">
          {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>GST (5%)</span>
        <span className="font-mono">{formatPrice(order.tax)}</span>
      </div>
      {order.discount > 0 && (
        <div className="flex justify-between text-emerald-700">
          <span>Discount</span>
          <span className="font-mono">-{formatPrice(order.discount)}</span>
        </div>
      )}
      <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
        <span>Total Settled</span>
        <span className="font-mono text-[#143425]">{formatPrice(order.total)}</span>
      </div>
    </div>
  </div>
      </div >
    </div >
  );
}
