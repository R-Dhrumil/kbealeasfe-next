"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/formatters";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minimumSpend?: number | null;
  startDate?: string;
  endDate?: string | null;
  isActive: boolean;
  usageLimit?: number | null;
  usageCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"Percentage" | "FixedAmount">("Percentage");
  const [newValue, setNewValue] = useState<number>(10);
  const [newMinSpend, setNewMinSpend] = useState<number>(499);
  const [newUsageLimit, setNewUsageLimit] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi("/coupons");
      if (Array.isArray(data)) {
        setCoupons(data);
      } else {
        setCoupons([]);
      }
    } catch (err: any) {
      console.error("Failed to load coupons:", err);
      setError(err?.message || "Failed to load coupons from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        code: newCode.trim().toUpperCase(),
        discountType: newType,
        discountValue: Number(newValue) || 0,
        minimumSpend: newMinSpend ? Number(newMinSpend) : null,
        usageLimit: newUsageLimit ? parseInt(newUsageLimit, 10) : null,
        endDate: newEndDate ? new Date(newEndDate).toISOString() : null,
        isActive: true,
      };

      const created = await fetchApi("/coupons", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (created) {
        setShowAddModal(false);
        setNewCode("");
        setNewValue(10);
        setNewMinSpend(499);
        setNewUsageLimit("");
        setNewEndDate("");
        await loadCoupons();
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to create coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    try {
      await fetchApi(`/coupons/${id}`, {
        method: "DELETE",
      });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Coupons & Marketing Campaigns
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure discount promo codes, minimum spend rules, and track redemption metrics.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setFormError(null);
            setShowAddModal(true);
          }}
          className="gap-1.5 shadow-2xs"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-stone-400 space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#143425]" />
          <p className="text-sm font-medium">Syncing live promotional coupons...</p>
        </div>
      ) : error ? (
        <div className="min-h-[250px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-stone-200/80 shadow-2xs text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <p className="text-sm font-semibold text-stone-900">{error}</p>
          <Button variant="outline" size="sm" onClick={loadCoupons} className="gap-2">
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
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Type</th>
                  <th className="py-3.5 px-4">Benefit</th>
                  <th className="py-3.5 px-4">Min Order</th>
                  <th className="py-3.5 px-4">Redemptions</th>
                  <th className="py-3.5 px-4">Expiry</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-stone-400">
                      No active coupons found. Create your first campaign coupon!
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-xs bg-[#E8F2EC] text-[#143425] px-2.5 py-1 rounded-md border border-[#1C4834]/20">
                          {c.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700">
                        {c.discountType === "Percentage" ? "Percentage Discount" : "Flat Amount"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                        {c.discountType === "Percentage"
                          ? `${c.discountValue}%`
                          : formatPrice(c.discountValue)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">
                        {c.minimumSpend ? formatPrice(c.minimumSpend) : "No minimum"}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : "uses"}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {c.endDate ? formatDate(c.endDate) : "Never expires"}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={c.isActive ? "success" : "default"}>
                          {c.isActive ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                          title="Delete Coupon"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#143425]">
              Generate Discount Coupon
            </h3>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KBWELCOME10"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "Percentage" | "FixedAmount")}
                    className="w-full h-10 px-2 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="FixedAmount">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    placeholder={newType === "Percentage" ? "10" : "100"}
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Min Spend (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(Number(e.target.value))}
                    placeholder="499"
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newUsageLimit}
                    onChange={(e) => setNewUsageLimit(e.target.value)}
                    placeholder="Unlimited"
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#143425]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Coupon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
