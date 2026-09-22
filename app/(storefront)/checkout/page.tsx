"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  CreditCard,
  Building2,
  Banknote,
  QrCode,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

type PaymentMethodType = "upi" | "card" | "netbanking" | "cod";

export default function CheckoutPage() {
  const { items, summary, clearCart } = useCart();

  // Form State
  const [email, setEmail] = useState("aarav.sharma@example.com");
  const [phone, setPhone] = useState("+91 98201 44521");
  const [fullName, setFullName] = useState("Aarav Sharma");
  const [addressLine, setAddressLine] = useState("Flat 402, Nilgiri Heights, Baner Road");
  const [city, setCity] = useState("Pune");
  const [state, setState] = useState("Maharashtra");
  const [postalCode, setPostalCode] = useState("411045");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("upi");

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !addressLine.trim() || !postalCode.trim() || !phone.trim()) {
      setValidationError("Please fill out all required shipping fields.");
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    // Simulate mock order placement latency
    setTimeout(() => {
      const orderNum = `KB-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(orderNum);
      setIsSubmitting(false);
      setIsConfirmed(true);
      clearCart();
    }, 1200);
  };

  // SUCCESS CONFIRMATION STATE
  if (isConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-20 w-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
          Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#143425]">
          Thank you for your order!
        </h1>

        <p className="text-stone-600 text-sm max-w-md mx-auto">
          We&apos;ve sent a confirmation email to <span className="font-semibold text-stone-900">{email}</span>. Your order reference is{" "}
          <span className="font-mono font-bold text-[#143425] bg-[#E8F2EC] px-2 py-0.5 rounded">
            {confirmedOrderId}
          </span>.
        </p>

        <div className="p-6 bg-white rounded-3xl border border-stone-200/80 text-left space-y-4 max-w-lg mx-auto shadow-2xs">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <Package className="h-5 w-5 text-[#143425]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Delivery Address
              </p>
              <p className="text-xs text-stone-600 mt-0.5">
                {fullName} • {addressLine}, {city}, {state} - {postalCode}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Payment Method</span>
            <span className="font-semibold uppercase text-stone-900">
              {paymentMethod === "upi" ? "UPI (GPay / PhonePe)" : paymentMethod.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Estimated Delivery</span>
            <span className="font-semibold text-emerald-700">2 - 3 Business Days</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/account/orders">
            <Button variant="outline" size="md">
              View Order Tracking
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="primary" size="md" className="gap-2">
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT FALLBACK
  if (items.length === 0 && !isConfirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#143425]">
          No items to checkout
        </h2>
        <p className="text-stone-500 text-xs">
          Your cart is currently empty. Please select beverages before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="md">
            Browse Beverages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#A87E28]">
            Express Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425] mt-0.5">
            Complete Your Beverage Order
          </h1>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
          <Lock className="h-3.5 w-3.5 text-emerald-700" />
          <span>Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-8">
            {validationError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                {validationError}
              </div>
            )}

            {/* STEP 1: Contact Information */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
                <span className="h-6 w-6 rounded-full bg-[#143425] text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Contact Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: Shipping Address */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
                <span className="h-6 w-6 rounded-full bg-[#143425] text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Shipping Address</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                    Street Address & Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 block">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#143425]/20 focus:border-[#143425]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Delivery Method */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
                <span className="h-6 w-6 rounded-full bg-[#143425] text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>Delivery Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryMethod("standard")}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    deliveryMethod === "standard"
                      ? "border-[#143425] bg-[#E8F2EC]/40 ring-1 ring-[#143425]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-[#143425]" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Standard Delivery</p>
                      <p className="text-[11px] text-stone-500">3-4 business days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Free</span>
                </label>

                <label
                  onClick={() => setDeliveryMethod("express")}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    deliveryMethod === "express"
                      ? "border-[#143425] bg-[#E8F2EC]/40 ring-1 ring-[#143425]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-[#C89B3C]" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Priority Air Delivery</p>
                      <p className="text-[11px] text-stone-500">1-2 business days</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-900">₹99</span>
                </label>
              </div>
            </div>

            {/* STEP 4: Payment Placeholder (Mock UI) */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#143425] pb-2 border-b border-stone-100">
                <span className="h-6 w-6 rounded-full bg-[#143425] text-white flex items-center justify-center text-xs">
                  4
                </span>
                <span>Payment Method (Development Mock)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "upi", label: "UPI", icon: QrCode, sub: "GPay / PhonePe" },
                  { id: "card", label: "Cards", icon: CreditCard, sub: "Visa / Master" },
                  { id: "netbanking", label: "NetBanking", icon: Building2, sub: "All Banks" },
                  { id: "cod", label: "Cash on Delivery", icon: Banknote, sub: "Pay at Door" },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? "border-[#143425] bg-[#143425] text-white shadow-xs"
                          : "border-stone-200 bg-stone-50/50 hover:bg-white text-stone-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <p className="text-xs font-bold">{m.label}</p>
                        <p className={`text-[10px] ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                          {m.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Action */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-5 shadow-2xs">
              <h3 className="font-serif text-lg font-bold text-[#143425] pb-3 border-b border-stone-100">
                Order Review ({summary.itemCount} items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-12 w-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 line-clamp-1 max-w-[180px]">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-stone-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-emerald-700">
                    {deliveryMethod === "express" ? "₹99" : "Free"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono">{formatPrice(summary.tax)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-[#143425]">
                  <span>Total Payable</span>
                  <span className="font-mono">
                    {formatPrice(
                      summary.total + (deliveryMethod === "express" ? 99 : 0)
                    )}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full gap-2 shadow-sm font-semibold"
              >
                <span>Complete Order</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                By placing your order, you agree to KB Beverage Terms of Service. Mock frontend order verification.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
