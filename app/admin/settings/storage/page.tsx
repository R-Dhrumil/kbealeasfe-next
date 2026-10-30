"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  HardDrive,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Server,
  Layers,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";

type StorageProvider = "Local" | "Database" | "Cloud";

export default function AdminStorageSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings State
  const [activeProvider, setActiveProvider] = useState<StorageProvider>("Local");
  const [cloudName, setCloudName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  // Test Upload State
  const [isTestingUpload, setIsTestingUpload] = useState(false);
  const [testResultUrl, setTestResultUrl] = useState<string | null>(null);
  const [testResultProvider, setTestResultProvider] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi("/settings/storage");
      if (data && typeof data === "object") {
        if (data["Storage:ActiveProvider"]) {
          setActiveProvider(data["Storage:ActiveProvider"] as StorageProvider);
        }
        if (data["Storage:CloudinaryCloudName"]) {
          setCloudName(data["Storage:CloudinaryCloudName"]);
        }
        if (data["Storage:CloudinaryApiKey"]) {
          setApiKey(data["Storage:CloudinaryApiKey"]);
        }
        if (data["Storage:CloudinaryApiSecret"]) {
          setApiSecret(data["Storage:CloudinaryApiSecret"]);
        }
      }
    } catch (err: any) {
      console.error("Failed to load storage settings:", err);
      showStatus("error", err.message || "Failed to load storage settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeProvider === "Cloud") {
      if (!cloudName.trim() || !apiKey.trim() || !apiSecret.trim()) {
        showStatus("error", "Please provide Cloud Name, API Key, and API Secret to activate Cloud Storage.");
        return;
      }
    }

    try {
      setIsSaving(true);
      await fetchApi("/settings/storage", {
        method: "PUT",
        body: JSON.stringify({
          "Storage:ActiveProvider": activeProvider,
          "Storage:CloudinaryCloudName": cloudName.trim(),
          "Storage:CloudinaryApiKey": apiKey.trim(),
          "Storage:CloudinaryApiSecret": apiSecret.trim(),
        }),
      });

      showStatus("success", `Storage provider set to "${activeProvider}" successfully!`);
    } catch (err: any) {
      console.error("Failed to save storage settings:", err);
      showStatus("error", err.message || "Failed to save storage settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsTestingUpload(true);
      setTestResultUrl(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetchApi("/catalog/upload-image", {
        method: "POST",
        body: formData,
      });

      if (res && res.url) {
        setTestResultUrl(res.url);
        setTestResultProvider(activeProvider);
        showStatus("success", `Test image uploaded successfully using ${activeProvider} storage!`);
      }
    } catch (err: any) {
      console.error("Test upload failed:", err);
      showStatus("error", `Upload failed: ${err.message}`);
    } finally {
      setIsTestingUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#143425]" />
        <p className="text-xs text-stone-500 font-medium">Loading storage configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425] flex items-center gap-2">
            <Server className="h-6 w-6 text-[#A87E28]" />
            <span>Media & Image Storage</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Choose where newly uploaded product images, banners, and media assets are stored.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={isSaving}
          className="self-start sm:self-auto flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 3 Storage Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Local wwwroot */}
        <div
          onClick={() => setActiveProvider("Local")}
          className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
            activeProvider === "Local"
              ? "bg-[#143425]/5 border-[#143425] ring-2 ring-[#143425]/20 shadow-sm"
              : "bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-2xs"
          }`}
        >
          {activeProvider === "Local" && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
          )}
          <div className="space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeProvider === "Local" ? "bg-[#143425] text-white" : "bg-stone-100 text-stone-600"
            }`}>
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#143425] flex items-center gap-1.5">
                <span>1. Server File Storage</span>
              </h3>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">wwwroot/uploads</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Saves media directly to the host server disk. Served as static files with zero external overhead.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Setup: <strong>Default</strong></span>
            <span className="text-emerald-700 font-medium">Ready</span>
          </div>
        </div>

        {/* Option 2: Database Binary */}
        <div
          onClick={() => setActiveProvider("Database")}
          className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
            activeProvider === "Database"
              ? "bg-[#143425]/5 border-[#143425] ring-2 ring-[#143425]/20 shadow-sm"
              : "bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-2xs"
          }`}
        >
          {activeProvider === "Database" && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
          )}
          <div className="space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeProvider === "Database" ? "bg-[#143425] text-white" : "bg-stone-100 text-stone-600"
            }`}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#143425] flex items-center gap-1.5">
                <span>2. Database (Binary)</span>
              </h3>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">PostgreSQL bytea</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Stores raw bytes inside the database in <code>MediaFiles</code>. Streamed via cached <code>/api/media/{`{id}`}</code> endpoints.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Zero file loss</span>
            <span className="text-emerald-700 font-medium">Ready</span>
          </div>
        </div>

        {/* Option 3: Cloud Storage */}
        <div
          onClick={() => setActiveProvider("Cloud")}
          className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
            activeProvider === "Cloud"
              ? "bg-[#143425]/5 border-[#143425] ring-2 ring-[#143425]/20 shadow-sm"
              : "bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-2xs"
          }`}
        >
          {activeProvider === "Cloud" && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
          )}
          <div className="space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeProvider === "Cloud" ? "bg-[#143425] text-white" : "bg-stone-100 text-stone-600"
            }`}>
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#143425] flex items-center gap-1.5">
                <span>3. Cloud Storage</span>
              </h3>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">Cloudinary CDN</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Uploads to high-speed global CDN with instant media delivery and automatic compression.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Requires API key</span>
            <span className={cloudName ? "text-emerald-700 font-medium" : "text-amber-600 font-medium"}>
              {cloudName ? "Configured" : "Config needed"}
            </span>
          </div>
        </div>
      </div>

      {/* Cloud Credentials Form (Active when Cloud selected or to pre-configure) */}
      <div className={`bg-white rounded-3xl border p-6 space-y-4 shadow-2xs transition-all ${
        activeProvider === "Cloud" ? "border-[#143425]/40 ring-1 ring-[#143425]/10" : "border-stone-200/80 opacity-90"
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-[#A87E28]" />
            <h2 className="font-serif text-sm font-bold text-[#143425]">
              Cloudinary Configuration
            </h2>
          </div>
          <a
            href="https://cloudinary.com/console"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#A87E28] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Cloudinary Console</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <p className="text-xs text-stone-500">
          These credentials are required when <strong>Option 3 (Cloud Storage)</strong> is active. You can find them on your Cloudinary dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
              Cloud Name
            </label>
            <input
              type="text"
              placeholder="e.g. dxyz123"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:border-[#143425] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
              API Key
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789012345"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:border-[#143425] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
              API Secret
            </label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                placeholder="e.g. abcde_12345XYZ"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="w-full h-10 pl-3 pr-9 rounded-lg border border-stone-300 text-xs font-mono focus:border-[#143425] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Test Upload Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Sparkles className="h-4 w-4 text-[#A87E28]" />
          <h2 className="font-serif text-sm font-bold text-[#143425]">
            Live Storage Tester
          </h2>
        </div>

        <p className="text-xs text-stone-500">
          Upload an image below to immediately test the currently active storage target (<strong>{activeProvider}</strong>).
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleTestUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            disabled={isTestingUpload}
            className="flex items-center gap-2"
          >
            {isTestingUpload ? (
              <Loader2 className="h-4 w-4 animate-spin text-stone-600" />
            ) : (
              <UploadCloud className="h-4 w-4 text-stone-600" />
            )}
            <span>{isTestingUpload ? "Uploading to " + activeProvider + "..." : "Select Image to Test"}</span>
          </Button>

          <span className="text-xs text-stone-400">
            JPG, PNG, WebP up to 10MB
          </span>
        </div>

        {testResultUrl && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Upload Successful via {testResultProvider} Storage
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-300 bg-white shrink-0">
                <img
                  src={testResultUrl}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 overflow-hidden">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Generated Public URL:
                </p>
                <a
                  href={testResultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline break-all font-mono flex items-center gap-1"
                >
                  <span>{testResultUrl}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
