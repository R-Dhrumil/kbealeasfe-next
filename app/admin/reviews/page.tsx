"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, XCircle, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";
import { formatDate } from "@/lib/formatters";

interface Review {
  id: string;
  productId: string;
  productName?: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  status: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi("/reviews/admin/all");
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (err: any) {
      console.error("Failed to load reviews:", err);
      setError(err?.message || "Failed to load customer reviews from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Approved" ? "Hidden" : "Approved";
    setUpdatingId(id);

    try {
      await fetchApi(`/reviews/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update review status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Customer Review Moderation
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Review live customer feedback, verified purchase ratings, and toggle storefront visibility.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadReviews}
          className="gap-1.5 shadow-2xs"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Reviews</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-stone-400 space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#143425]" />
          <p className="text-sm font-medium">Syncing customer reviews from backend...</p>
        </div>
      ) : error ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-stone-200/80 shadow-2xs text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <p className="text-sm font-semibold text-stone-900">{error}</p>
          <Button variant="outline" size="sm" onClick={loadReviews} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
                <tr>
                  <th className="py-3.5 px-4">Customer & Product</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Feedback Comment</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      No customer reviews found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-stone-900">{r.userName || "Verified Customer"}</p>
                          {r.isVerifiedPurchase && (
                            <span title="Verified Purchase">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#A87E28] font-medium mt-0.5">
                          {r.productName || "Beverage Product"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{r.rating}.0</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 max-w-sm leading-relaxed">
                        {r.title && <p className="font-semibold text-stone-900 text-xs mb-0.5">{r.title}</p>}
                        &quot;{r.comment}&quot;
                      </td>

                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={r.status === "Approved" ? "success" : "warning"}>
                          {r.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          disabled={updatingId === r.id}
                          onClick={() => handleToggleStatus(r.id, r.status)}
                          className="text-xs font-semibold text-[#143425] hover:underline disabled:opacity-50"
                        >
                          {updatingId === r.id
                            ? "Updating..."
                            : r.status === "Approved"
                              ? "Hide Review"
                              : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
