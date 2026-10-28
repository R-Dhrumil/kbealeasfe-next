"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { useCustomer } from "@/context/CustomerContext";
import { ShieldAlert, Lock, ArrowRight, Loader2, LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { customer, isLoggedIn, isLoaded, logout } = useCustomer();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = isLoggedIn && (customer?.role === "Admin" || customer?.memberTier === "Admin");

  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      router.replace(`/account/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
    }
  }, [isLoaded, isLoggedIn, pathname, router]);

  // 1. Initial Authentication Check Loading State
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="h-16 w-16 rounded-2xl bg-white border border-[#E8DED1] shadow-sm flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 text-[#143425] animate-spin" />
        </div>
        <h2 className="font-serif text-xl font-bold text-[#143425]">
          Verifying Admin Access
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xs">
          Checking your administrator credentials and security permissions...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt or redirect to login)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#A87E28]">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#143425]">
              Authentication Required
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              The KB Beverage Operations Portal is restricted to authorized personnel. Please sign in with your administrative account to continue.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2"
              onClick={() => router.push(`/account/login?redirect=${encodeURIComponent(pathname || "/admin")}`)}
            >
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full text-xs font-semibold text-stone-600 hover:text-stone-900 py-2.5 transition-colors"
            >
              <Store className="h-4 w-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized (Customer account trying to access Admin)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200/80 p-8 shadow-sm space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Access Restricted
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#143425] mt-2">
              Admin Privileges Required
            </h2>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              You are signed in as <strong className="text-stone-800">{customer?.fullName}</strong> ({customer?.email}), which is a standard customer account and cannot access operations tools.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2"
              onClick={() => {
                logout();
                router.push(`/account/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Switch to Admin Account</span>
            </Button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full text-xs font-semibold text-stone-600 hover:text-stone-900 py-2.5 transition-colors"
            >
              <Store className="h-4 w-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Administrator View
  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-screen-2xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
