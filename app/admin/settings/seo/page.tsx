"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Globe,
  Search,
  Share2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Eye,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { triggerRevalidate } from "@/service/cms";

export default function AdminSeoSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Fields
  const [title, setTitle] = useState("KB Beverage | Pure Taste, Every Time.");
  const [desc, setDesc] = useState("Premium beverage manufacturer and tea premix crafts including Vrinda, Sangam, Urban Roast, and CocoJoy. Handcrafted with single-origin purity.");
  const [keywords, setKeywords] = useState("tea premix, cardamom chai, instant iced tea, arabica coffee, cocojoy chocolate, gourmet beverages");
  const [ogImage, setOgImage] = useState("/assets/banners/banner-master-blend.png");
  const [twitterHandle, setTwitterHandle] = useState("@KBBeverage");
  const [googleVerification, setGoogleVerification] = useState("");

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi("/settings/seo");
      if (data && typeof data === "object") {
        if (data.Seo_DefaultTitle) setTitle(data.Seo_DefaultTitle);
        if (data.Seo_DefaultDesc) setDesc(data.Seo_DefaultDesc);
        if (data.Seo_Keywords) setKeywords(data.Seo_Keywords);
        if (data.Seo_OgImage) setOgImage(data.Seo_OgImage);
        if (data.Seo_TwitterHandle) setTwitterHandle(data.Seo_TwitterHandle);
        if (data.Seo_GoogleSiteVerification) setGoogleVerification(data.Seo_GoogleSiteVerification);
      }
    } catch (err: any) {
      console.error("Failed to load SEO settings:", err);
      showStatus("error", "Failed to load SEO settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await fetchApi("/catalog/upload-image", {
        method: "POST",
        body: formData,
      });
      if (res && res.url) {
        setOgImage(res.url);
        showStatus("success", "Social share image uploaded!");
      }
    } catch {
      showStatus("error", "Failed to upload social image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      Seo_DefaultTitle: title.trim(),
      Seo_DefaultDesc: desc.trim(),
      Seo_Keywords: keywords.trim(),
      Seo_OgImage: ogImage.trim(),
      Seo_TwitterHandle: twitterHandle.trim(),
      Seo_GoogleSiteVerification: googleVerification.trim(),
    };

    try {
      await fetchApi("/settings/seo", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      await triggerRevalidate("seo");
      showStatus("success", "Global SEO metadata saved & published site-wide!");
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to save SEO settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
            <Globe className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Search Engine Optimization & Social Metadata</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
            Global SEO & Social Graph Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Control default search engine titles, OpenGraph previews for Facebook & WhatsApp, and Google site verification tags.
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#143425]" />
          <p className="text-xs text-stone-500 font-medium">Loading SEO parameters...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Top Previews Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Google SERP Preview */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-stone-400" />
                  <span>Google Search Snippet Preview</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Desktop & Mobile SERP
                </span>
              </div>

              {/* SERP Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 font-sans space-y-1">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <div className="h-4 w-4 rounded-full bg-[#143425] text-white text-[8px] flex items-center justify-center font-bold">
                    KB
                  </div>
                  <span className="text-[11px] text-stone-700 font-medium">kbealeas.com</span>
                  <span className="text-stone-300">›</span>
                  <span className="text-[11px] text-stone-400">home</span>
                </div>

                <h3 className="text-blue-800 text-base font-medium hover:underline cursor-pointer leading-tight pt-0.5 line-clamp-1">
                  {title || "KB Beverage | Pure Taste, Every Time."}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 pt-1">
                  {desc || "Premium beverage manufacturer and tea premix crafts including Vrinda, Sangam, Urban Roast, and CocoJoy."}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>
                  Title length: <strong className={title.length > 60 ? "text-amber-600" : "text-emerald-700"}>{title.length}</strong> / 60 chars
                </span>
                <span>
                  Snippet length: <strong className={desc.length > 160 ? "text-amber-600" : "text-emerald-700"}>{desc.length}</strong> / 160 chars
                </span>
              </div>
            </div>

            {/* 2. Social Card (OpenGraph) Preview */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-stone-400" />
                  <span>Social Share Preview (WhatsApp / Facebook)</span>
                </span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                  OpenGraph 1200x630
                </span>
              </div>

              {/* Social Card */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-2xs">
                <div className="relative aspect-[1.91/1] w-full bg-stone-100">
                  {ogImage ? (
                    <Image src={ogImage} alt="Social Share Card" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-400 text-xs">
                      No social banner specified
                    </div>
                  )}
                </div>

                <div className="p-3 bg-stone-50 border-t border-stone-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 font-mono tracking-wider">
                    KBEALEAS.COM
                  </span>
                  <p className="text-xs font-bold text-stone-900 line-clamp-1">{title}</p>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Settings Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs space-y-5">
            <h2 className="font-serif text-base font-bold text-[#143425]">
              Meta Tags & Crawler Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Default Storefront &lt;title&gt; *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. KB Beverage | Pure Taste, Every Time."
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Default Meta &lt;description&gt; *
                </label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detailed description summarizing your brand and product offering for search crawlers..."
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. tea premix, instant cardamom tea, arabica coffee, cocojoy chocolate"
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              {/* Social OG Image */}
              <div className="sm:col-span-2 space-y-2 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Default Social Share Image (OpenGraph / Twitter)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleOgImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1.5 text-xs h-9"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>{isUploading ? "Uploading..." : "Upload New Image"}</span>
                  </Button>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="/assets/banners/..."
                    className="flex-1 h-9 px-3.5 rounded-xl border border-stone-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Twitter / X Creator Handle
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@KBBeverage"
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Google Search Console Verification Token
                </label>
                <input
                  type="text"
                  value={googleVerification}
                  onChange={(e) => setGoogleVerification(e.target.value)}
                  placeholder="google-site-verification code"
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#143425]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSaving}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSaving ? "Saving Settings..." : "Publish Global SEO Settings"}</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
