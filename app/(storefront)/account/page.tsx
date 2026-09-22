import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { User, Package, MapPin, Settings, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { ORDERS } from "@/data/orders";
import { formatPrice, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "My Account | KB Beverage",
  description: "Manage your profile, tracked orders, and delivery addresses.",
};

export default function AccountPage() {
  const recentOrders = ORDERS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Account Overview Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[#143425] text-white font-serif font-bold text-2xl flex items-center justify-center">
            AS
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#143425]">
              Aarav Sharma
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              aarav.sharma@example.com • +91 98201 44521
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="gold">KB Connoisseur Member</Badge>
              <span className="text-xs text-stone-400">Member since March 2026</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account/orders"
            className="h-10 px-4 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Package className="h-4 w-4 text-[#143425]" />
            <span>All Orders ({ORDERS.length})</span>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="group p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-400 transition-all hover:shadow-xs space-y-3"
        >
          <div className="h-10 w-10 rounded-xl bg-[#E8F2EC] text-[#143425] flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#143425]">
            My Orders
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Track active consignments, review delivery status, and reorder previous tea premixes.
          </p>
        </Link>

        <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#F2ECE1] text-[#6E4D38] flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Primary Address
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Flat 402, Nilgiri Heights, Baner Road, Pune, Maharashtra - 411045
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#FBF5E8] text-[#A87E28] flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Purity Guarantee
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            All orders are dispatched in temperature-stable aroma containers with verified purity test certificates.
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#143425]">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100 shadow-2xs">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#143425]">
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
                <p className="text-xs text-stone-500">
                  Placed on {formatDate(order.createdAt)} • {order.items.length} items
                </p>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <span className="font-mono font-bold text-sm sm:text-base text-stone-900">
                  {formatPrice(order.total)}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-xs font-semibold text-[#143425] hover:text-[#C89B3C] flex items-center gap-1"
                >
                  <span>Track & Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
