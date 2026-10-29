"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Compass,
  CornerDownRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { triggerRevalidate } from "@/service/cms";

interface NavItem {
  id: string;
  menuLocation: string;
  label: string;
  url: string;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
}

const COMMON_LINKS = [
  { label: "Shop All Products", url: "/shop" },
  { label: "Our 4 Brands", url: "/brands" },
  { label: "Brand Heritage Story", url: "/about" },
  { label: "Contact & Concierge", url: "/contact" },
  { label: "Privacy Policy", url: "/privacy-policy" },
  { label: "Terms of Service", url: "/terms-of-service" },
  { label: "Shipping & Delivery", url: "/shipping-policy" },
  { label: "Returns & Refunds", url: "/returns-policy" },
  { label: "Track Your Order", url: "/account/orders" },
  { label: "Saved Wishlist", url: "/wishlist" },
];

export default function AdminNavigationPage() {
  const [activeLocation, setActiveLocation] = useState<"Header" | "FooterQuickLinks" | "FooterLegal">("Header");
  const [items, setItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formLabel, setFormLabel] = useState("");
  const [formUrl, setFormUrl] = useState("/");
  const [formLocation, setFormLocation] = useState<string>("Header");
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(false);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi("/content/navigation");
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err: any) {
      console.error("Failed to load navigation items:", err);
      showStatus("error", "Failed to load navigation. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const locationItems = items
    .filter((i) => i.menuLocation.toLowerCase() === activeLocation.toLowerCase())
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormLabel("");
    setFormUrl("/shop");
    setFormLocation(activeLocation);
    setFormDisplayOrder(locationItems.length + 1);
    setFormIsActive(true);
    setFormOpenInNewTab(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: NavItem) => {
    setEditingItem(item);
    setFormLabel(item.label);
    setFormUrl(item.url);
    setFormLocation(item.menuLocation);
    setFormDisplayOrder(item.displayOrder);
    setFormIsActive(item.isActive);
    setFormOpenInNewTab(item.openInNewTab);
    setModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) {
      showStatus("error", "Link label is required.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      menuLocation: formLocation,
      label: formLabel.trim(),
      url: formUrl.trim() || "/",
      displayOrder: formDisplayOrder,
      isActive: formIsActive,
      openInNewTab: formOpenInNewTab,
    };

    try {
      if (editingItem) {
        await fetchApi(`/content/navigation/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showStatus("success", "Link updated successfully!");
      } else {
        await fetchApi("/content/navigation", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showStatus("success", "New navigation link added!");
      }

      await triggerRevalidate("navigation");
      setModalOpen(false);
      await loadItems();
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to save link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= locationItems.length) return;

    const currentList = [...locationItems];
    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    const reorderedPayload = currentList.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1,
    }));

    try {
      await fetchApi("/content/navigation/reorder", {
        method: "PUT",
        body: JSON.stringify(reorderedPayload),
      });
      await triggerRevalidate("navigation");
      showStatus("success", "Order updated!");
      await loadItems();
    } catch {
      showStatus("error", "Failed to update navigation order.");
    }
  };

  const handleToggleActive = async (item: NavItem) => {
    try {
      await fetchApi(`/content/navigation/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          menuLocation: item.menuLocation,
          label: item.label,
          url: item.url,
          parentId: item.parentId,
          displayOrder: item.displayOrder,
          isActive: !item.isActive,
          openInNewTab: item.openInNewTab,
        }),
      });
      await triggerRevalidate("navigation");
      showStatus("success", `Link ${!item.isActive ? "activated" : "deactivated"}!`);
      await loadItems();
    } catch {
      showStatus("error", "Failed to toggle status.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this navigation link?")) return;
    try {
      await fetchApi(`/content/navigation/${id}`, { method: "DELETE" });
      await triggerRevalidate("navigation");
      showStatus("success", "Navigation link removed!");
      await loadItems();
    } catch {
      showStatus("error", "Failed to delete link.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
            <Compass className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Navigation & Menu Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
            Dynamic Storefront Menus
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure header and footer links, reorder menu hierarchies, and toggle link visibility without touching code.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Menu Link</span>
        </Button>
      </div>

      {/* Status Message */}
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

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-stone-200 gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveLocation("Header")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeLocation === "Header"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Menu className="h-4 w-4" />
          <span>Header Main Menu</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
            {items.filter((i) => i.menuLocation.toLowerCase() === "header").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLocation("FooterQuickLinks")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeLocation === "FooterQuickLinks"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <CornerDownRight className="h-4 w-4" />
          <span>Footer Quick Links</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
            {items.filter((i) => i.menuLocation.toLowerCase() === "footerquicklinks").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLocation("FooterLegal")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeLocation === "FooterLegal"
              ? "border-[#143425] text-[#143425]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <CornerDownRight className="h-4 w-4" />
          <span>Footer Legal & Policies</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
            {items.filter((i) => i.menuLocation.toLowerCase() === "footerlegal").length}
          </span>
        </button>
      </div>

      {/* Navigation Items List */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        {isLoading && items.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#143425]" />
            <p className="text-xs text-stone-500 font-medium">Loading navigation...</p>
          </div>
        ) : locationItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Compass className="h-10 w-10 mx-auto text-stone-300" />
            <p className="font-bold text-sm text-stone-700">No Custom Links in this Menu</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Add links to customize the {activeLocation} navigation for your customers.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
              Add First Link
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <span className="col-span-1 text-center">Order</span>
              <span className="col-span-4">Menu Label</span>
              <span className="col-span-3">Destination URL</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            {locationItems.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-stone-50/50 transition-colors text-xs"
              >
                {/* Reorder Buttons & Position */}
                <div className="col-span-1 flex items-center justify-center gap-1">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, "up")}
                      className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-600"
                      title="Move up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === locationItems.length - 1}
                      onClick={() => handleMoveOrder(idx, "down")}
                      className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-600"
                      title="Move down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-mono font-bold text-stone-400 text-[11px] ml-1">
                    #{idx + 1}
                  </span>
                </div>

                {/* Label */}
                <div className="col-span-4 font-serif font-bold text-stone-900 text-sm">
                  {item.label}
                  {item.openInNewTab && (
                    <span className="ml-2 text-[10px] font-sans font-normal text-stone-400 border border-stone-200 px-1.5 py-0.5 rounded">
                      New Tab
                    </span>
                  )}
                </div>

                {/* URL */}
                <div className="col-span-3 flex items-center gap-1 font-mono text-[11px] text-stone-500">
                  <span className="truncate">{item.url}</span>
                  <Link
                    href={item.url}
                    target="_blank"
                    className="text-stone-400 hover:text-[#143425] p-1 shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Active Toggle */}
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] transition-colors ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {item.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{item.isActive ? "Active" : "Hidden"}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl text-stone-500 hover:text-[#143425] hover:bg-stone-100 transition-colors"
                    title="Edit Link"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                {editingItem ? "Edit Navigation Link" : "Add Navigation Link"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Menu Location
                </label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425] bg-white"
                >
                  <option value="Header">Header Main Menu</option>
                  <option value="FooterQuickLinks">Footer Quick Links</option>
                  <option value="FooterLegal">Footer Legal & Policies</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. Shop All or Shipping & FAQs"
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="/shop or /about"
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-1 focus:ring-[#143425]"
                />
                {/* Shortcuts */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-stone-400 self-center">Presets:</span>
                  {COMMON_LINKS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setFormUrl(preset.url);
                        if (!formLabel) setFormLabel(preset.label);
                      }}
                      className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md transition-colors"
                    >
                      {preset.url}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formOpenInNewTab}
                    onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                    className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                  />
                  <span className="text-xs font-medium text-stone-700">
                    Open link in a new browser tab (target=&quot;_blank&quot;)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                  />
                  <span className="text-xs font-medium text-stone-700">
                    Make visible on live storefront
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : editingItem ? "Update Link" : "Add Link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
