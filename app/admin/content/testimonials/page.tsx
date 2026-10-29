"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MessageSquareQuote,
  Plus,
  Star,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UploadCloud,
  X,
  User
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { triggerRevalidate } from "@/service/cms";

interface Testimonial {
  id: string;
  reviewerName: string;
  reviewerSubtext?: string | null;
  quote: string;
  rating: number;
  avatarImageUrl?: string | null;
  brandName?: string | null;
  displayOrder: number;
  isActive: boolean;
}

const BRANDS = ["Vrinda", "Sangam", "Urban Roast", "CocoJoy", "KB Beverage General"];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSubtext, setFormSubtext] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formBrand, setFormBrand] = useState("Vrinda");
  const [formAvatar, setFormAvatar] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi("/content/testimonials/admin");
      if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (err: any) {
      console.error("Failed to load testimonials:", err);
      showStatus("error", "Failed to load testimonials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormSubtext("Verified Buyer");
    setFormQuote("");
    setFormRating(5);
    setFormBrand("Vrinda");
    setFormAvatar("");
    setFormOrder(testimonials.length + 1);
    setFormIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormName(item.reviewerName);
    setFormSubtext(item.reviewerSubtext || "");
    setFormQuote(item.quote);
    setFormRating(item.rating);
    setFormBrand(item.brandName || "Vrinda");
    setFormAvatar(item.avatarImageUrl || "");
    setFormOrder(item.displayOrder);
    setFormIsActive(item.isActive);
    setModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormAvatar(res.url);
        showStatus("success", "Avatar uploaded successfully!");
      }
    } catch {
      showStatus("error", "Failed to upload avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuote.trim()) {
      showStatus("error", "Reviewer name and quote are required.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      reviewerName: formName.trim(),
      reviewerSubtext: formSubtext.trim() || null,
      quote: formQuote.trim(),
      rating: formRating,
      brandName: formBrand,
      avatarImageUrl: formAvatar.trim() || null,
      displayOrder: formOrder,
      isActive: formIsActive,
    };

    try {
      if (editingItem) {
        await fetchApi(`/content/testimonials/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showStatus("success", "Review updated successfully!");
      } else {
        await fetchApi("/content/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showStatus("success", "New review testimonial published!");
      }

      await triggerRevalidate("testimonials");
      setModalOpen(false);
      await loadTestimonials();
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to save review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: Testimonial) => {
    try {
      await fetchApi(`/content/testimonials/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          reviewerName: item.reviewerName,
          reviewerSubtext: item.reviewerSubtext,
          quote: item.quote,
          rating: item.rating,
          brandName: item.brandName,
          avatarImageUrl: item.avatarImageUrl,
          displayOrder: item.displayOrder,
          isActive: !item.isActive,
        }),
      });
      await triggerRevalidate("testimonials");
      showStatus("success", `Review ${!item.isActive ? "activated" : "hidden"}!`);
      await loadTestimonials();
    } catch {
      showStatus("error", "Failed to toggle status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this testimonial?")) return;
    try {
      await fetchApi(`/content/testimonials/${id}`, { method: "DELETE" });
      await triggerRevalidate("testimonials");
      showStatus("success", "Testimonial removed successfully!");
      await loadTestimonials();
    } catch {
      showStatus("error", "Failed to delete review.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#143425] text-xs font-semibold mb-1">
            <MessageSquareQuote className="h-3.5 w-3.5 text-[#A87E28]" />
            <span>Customer Social Proof & Praise</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#143425]">
            Featured Customer Testimonials
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Curate verified customer quotes, press mentions, and sommelier feedback for the storefront homepage carousel.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          className="gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
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

      {/* Grid */}
      {isLoading && testimonials.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#143425]" />
          <p className="text-xs text-stone-500 font-medium">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200/80 space-y-3">
          <MessageSquareQuote className="h-10 w-10 mx-auto text-stone-300" />
          <p className="font-bold text-sm text-stone-700">No Featured Testimonials</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Add quotes from press or happy buyers to showcase on the homepage.
          </p>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
            Add First Review
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border p-5 shadow-2xs space-y-4 flex flex-col justify-between transition-all ${
                item.isActive ? "border-stone-200/80 hover:border-[#143425]/40" : "border-stone-200 bg-stone-50/50 opacity-70"
              }`}
            >
              <div className="space-y-3">
                {/* Top Bar: Stars & Brand Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#A87E28]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#A87E28]" />
                    ))}
                  </div>

                  {item.brandName && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {item.brandName}
                    </span>
                  )}
                </div>

                {/* Quote */}
                <blockquote className="text-xs text-stone-700 italic leading-relaxed line-clamp-4">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Reviewer Details & Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {item.avatarImageUrl ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image src={item.avatarImageUrl} alt={item.reviewerName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#143425]/10 text-[#143425] flex items-center justify-center font-bold text-xs shrink-0">
                      {item.reviewerName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-serif font-bold text-stone-900 text-xs truncate">
                      {item.reviewerName}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {item.reviewerSubtext || "Verified Buyer"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                    title={item.isActive ? "Hide from Storefront" : "Show on Storefront"}
                  >
                    {item.isActive ? <Eye className="h-3.5 w-3.5 text-emerald-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-[#143425] hover:bg-stone-100"
                    title="Edit Review"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Review"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-[#143425]">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Reviewer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Aditi Roy"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Reviewer Subtext
                  </label>
                  <input
                    type="text"
                    value={formSubtext}
                    onChange={(e) => setFormSubtext(e.target.value)}
                    placeholder="e.g. Verified Buyer • Vrinda Chai"
                    className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Brand Category
                  </label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425] bg-white"
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <div className="flex items-center gap-1.5 h-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= formRating ? "fill-[#A87E28] text-[#A87E28]" : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Quote / Testimonial Text *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Enter the customer praise or review quote..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                {/* Avatar */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                    Reviewer Avatar Photo (optional)
                  </label>
                  <div className="flex items-center gap-3">
                    {formAvatar ? (
                      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-stone-100 border border-stone-300 shrink-0">
                        <Image src={formAvatar} alt="Avatar preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                    )}

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
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
                        <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                      </Button>
                      <input
                        type="text"
                        value={formAvatar}
                        onChange={(e) => setFormAvatar(e.target.value)}
                        placeholder="Or direct image URL"
                        className="flex-1 h-9 px-3 rounded-xl border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="h-4 w-4 rounded text-[#143425] focus:ring-[#143425]"
                    />
                    <span className="text-xs font-medium text-stone-700">
                      Display on storefront homepage carousel
                    </span>
                  </label>
                </div>
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
                  {isSubmitting ? "Saving..." : editingItem ? "Update Review" : "Publish Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
