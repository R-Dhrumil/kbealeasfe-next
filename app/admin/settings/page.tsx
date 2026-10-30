"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Store, CreditCard, Truck, Bell, HardDrive, Globe, ArrowRight } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("KB Beverage Ltd.");
  const [supportEmail, setSupportEmail] = useState("care@kbbeverage.com");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("499");
  const [gstRate, setGstRate] = useState("5");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#143425]">
          Store Preferences & Configuration
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          General settings for company identity, shipping rules, and tax parameters.
        </p>
      </div>

      {/* Quick Navigation to specialized settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/settings/storage"
          className="bg-white rounded-2xl border border-stone-200/80 p-4 flex items-center justify-between hover:border-[#143425] hover:shadow-2xs transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#A87E28] flex items-center justify-center group-hover:bg-[#143425] group-hover:text-white transition-colors">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-[#143425]">Media & Image Storage</h3>
              <p className="text-[11px] text-stone-500">Configure wwwroot, Database, or Cloudinary</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-[#143425] transition-colors" />
        </Link>

        <Link
          href="/admin/settings/seo"
          className="bg-white rounded-2xl border border-stone-200/80 p-4 flex items-center justify-between hover:border-[#143425] hover:shadow-2xs transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-[#143425] group-hover:text-white transition-colors">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-[#143425]">Global SEO & Social</h3>
              <p className="text-[11px] text-stone-500">Meta tags, OpenGraph previews & schema</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-[#143425] transition-colors" />
        </Link>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Store settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Store className="h-4 w-4 text-[#A87E28]" />
            <span>Storefront Business Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
          <h2 className="font-serif text-sm font-bold text-[#143425] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#A87E28]" />
            <span>Shipping & Tax Rates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                Packaged Beverage GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" type="submit">
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
