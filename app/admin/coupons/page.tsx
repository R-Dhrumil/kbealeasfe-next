"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, TicketPercent, CheckCircle2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    {
      code: "KBWELCOME10",
      description: "Flat ₹100 Off on First Order",
      type: "Flat Discount",
      value: "₹100",
      minOrder: "₹500",
      redemptions: 142,
      status: "Active",
      expires: "31 Dec 2026",
    },
    {
      code: "MONSOONTEA",
      description: "15% off on Vrinda Tea Premixes",
      type: "Percentage",
      value: "15%",
      minOrder: "₹800",
      redemptions: 89,
      status: "Active",
      expires: "30 Nov 2026",
    },
    {
      code: "FREESHIP",
      description: "Free delivery on all orders",
      type: "Shipping waiver",
      value: "100% Free",
      minOrder: "₹0",
      redemptions: 310,
      status: "Active",
      expires: "31 Dec 2026",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCoupons([
      ...coupons,
      {
        code: newCode.toUpperCase(),
        description: "Promotional promotional offer",
        type: "Discount",
        value: newValue || "10%",
        minOrder: "₹499",
        redemptions: 0,
        status: "Active",
        expires: "31 Dec 2026",
      },
    ]);
    setShowAddModal(false);
    setNewCode("");
    setNewValue("");
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
          onClick={() => setShowAddModal(true)}
          className="gap-1.5 shadow-2xs"
        >
          <Plus className="h-4 w-4" />
          <span>Create Coupon</span>
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Benefit</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Redemptions</th>
                <th className="py-3.5 px-4">Expiry</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {coupons.map((c, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-xs bg-[#E8F2EC] text-[#143425] px-2.5 py-1 rounded-md border border-[#1C4834]/20">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">{c.description}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {c.value}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-600">{c.minOrder}</td>
                  <td className="py-3.5 px-4 font-mono">{c.redemptions} uses</td>
                  <td className="py-3.5 px-4 text-stone-500">{c.expires}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#143425]">
              Generate Discount Coupon
            </h3>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CHAI20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs font-mono uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
                  Discount Value *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% or ₹150"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs"
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
                <Button variant="primary" size="sm" type="submit">
                  Save Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
