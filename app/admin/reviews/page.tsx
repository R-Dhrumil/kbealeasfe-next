"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      customer: "Aarav Sharma",
      product: "Royal Cardamom Tea Premix (Vrinda)",
      rating: 5,
      date: "20 Sep 2026",
      comment: "Incredible real cardamom aroma. Smells just like home-brewed chai.",
      status: "Approved",
    },
    {
      id: "rev-2",
      customer: "Priyanka Nair",
      product: "Spiced Guava Chilly Iced Tea (Sangam)",
      rating: 5,
      date: "19 Sep 2026",
      comment: "The chilly kick at the end of the guava sweetness is genuinely addictive.",
      status: "Approved",
    },
    {
      id: "rev-3",
      customer: "Vikram Mehta",
      product: "Mysore Gold Roast Premix (Urban Roast)",
      rating: 4,
      date: "18 Sep 2026",
      comment: "Rich chicory balance. Great morning boost without acidic aftertaste.",
      status: "Pending Moderation",
    },
    {
      id: "rev-4",
      customer: "Sneha Kulkarni",
      product: "100% Tender Coconut Hydration (CocoJoy)",
      rating: 5,
      date: "15 Sep 2026",
      comment: "Dissolves instantly in ice water. Great for post-workout hydration.",
      status: "Approved",
    },
  ]);

  const handleToggleStatus = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "Approved" ? "Hidden" : "Approved",
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#143425]">
          Customer Review Moderation
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review customer feedback, verified purchase ratings, and publish status.
        </p>
      </div>

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
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-stone-900">{r.customer}</p>
                    <p className="text-[11px] text-[#A87E28] font-medium">{r.product}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{r.rating}.0</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 max-w-sm leading-relaxed">
                    &quot;{r.comment}&quot;
                  </td>

                  <td className="py-3.5 px-4 text-stone-500">{r.date}</td>

                  <td className="py-3.5 px-4">
                    <Badge variant={r.status === "Approved" ? "success" : "warning"}>
                      {r.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r.id)}
                      className="text-xs font-semibold text-[#143425] hover:underline"
                    >
                      {r.status === "Approved" ? "Hide Review" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
