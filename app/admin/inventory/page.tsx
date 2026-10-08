"use client";

import React, { useState, useEffect } from "react";
import { getInventory, adjustStock, updateThreshold } from "@/data/inventory";
import { InventoryItem } from "@/types/inventory";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  RotateCw,
  Loader2,
  Plus,
  SlidersHorizontal,
  X,
  PackagePlus,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [restockingId, setRestockingId] = useState<string | null>(null);

  // Modal states
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState<string>("Restocked from Supplier");
  const [adjustLocation, setAdjustLocation] = useState<string>("");
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  const [thresholdModalItem, setThresholdModalItem] = useState<InventoryItem | null>(null);
  const [newThreshold, setNewThreshold] = useState<number>(25);
  const [newReorderPoint, setNewReorderPoint] = useState<number>(50);
  const [submittingThreshold, setSubmittingThreshold] = useState(false);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const data = await getInventory({ pageSize: 150 });
      setItems(data.items);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brandName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleQuickRestock = async (item: InventoryItem, amount: number = 50) => {
    const targetId = item.variantId || item.id;
    if (!targetId) return;
    setRestockingId(targetId);
    try {
      const updated = await adjustStock(targetId, amount, "Quick Restock (+50 units)");
      if (updated) {
        setItems((prev) =>
          prev.map((i) => ((i.variantId || i.id) === targetId ? updated : i))
        );
      } else {
        await loadData();
      }
    } catch (err) {
      console.error("Failed to restock:", err);
      alert("Failed to restock inventory.");
    } finally {
      setRestockingId(null);
    }
  };

  const openAdjustModal = (item: InventoryItem) => {
    setAdjustModalItem(item);
    setAdjustAmount(50);
    setAdjustReason("Restocked from Supplier");
    setAdjustLocation(item.warehouseLocation || "Main Warehouse");
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalItem) return;
    const targetId = adjustModalItem.variantId || adjustModalItem.id;
    if (!targetId) return;

    setSubmittingAdjust(true);
    try {
      const updated = await adjustStock(
        targetId,
        Number(adjustAmount),
        adjustReason,
        adjustLocation
      );
      if (updated) {
        setItems((prev) =>
          prev.map((i) => ((i.variantId || i.id) === targetId ? updated : i))
        );
      } else {
        await loadData();
      }
      setAdjustModalItem(null);
    } catch (err) {
      console.error("Failed to adjust stock:", err);
      alert("Failed to adjust stock. Please check your admin privileges.");
    } finally {
      setSubmittingAdjust(false);
    }
  };

  const openThresholdModal = (item: InventoryItem) => {
    setThresholdModalItem(item);
    setNewThreshold(item.safetyStock ?? 25);
    setNewReorderPoint(item.reorderPoint ?? 50);
  };

  const handleSaveThreshold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thresholdModalItem) return;
    const targetId = thresholdModalItem.variantId || thresholdModalItem.id;
    if (!targetId) return;

    setSubmittingThreshold(true);
    try {
      const updated = await updateThreshold(
        targetId,
        Number(newThreshold),
        Number(newReorderPoint)
      );
      if (updated) {
        setItems((prev) =>
          prev.map((i) => ((i.variantId || i.id) === targetId ? updated : i))
        );
      } else {
        await loadData();
      }
      setThresholdModalItem(null);
    } catch (err) {
      console.error("Failed to update threshold:", err);
      alert("Failed to update safety threshold.");
    } finally {
      setSubmittingThreshold(false);
    }
  };

  const healthyCount = items.filter((i) => i.status === "In Stock").length;
  const lowCount = items.filter((i) => i.status === "Low Stock").length;
  const outCount = items.filter((i) => i.status === "Out of Stock").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Warehouse Inventory & Stock Health
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time buffer thresholds, reserve balances, and warehouse storage locations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-[#143425] shadow-2xs transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#C89B3C]" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Sync Live Stock"}</span>
        </button>
      </div>

      {/* Stock Health Overview Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">Adequate Stock Buffer</p>
            <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">
              {healthyCount} SKUs
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">Low Stock Warning</p>
            <p className="text-2xl font-bold font-mono text-amber-700 mt-1">
              {lowCount} SKUs
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">Out of Stock</p>
            <p className="text-2xl font-bold font-mono text-rose-700 mt-1">
              {outCount} SKUs
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, product or brand..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-700 focus:outline-none"
        >
          <option value="all">All Stock Statuses ({items.length})</option>
          <option value="In Stock">Healthy Stock ({healthyCount})</option>
          <option value="Low Stock">Low Stock Alert ({lowCount})</option>
          <option value="Out of Stock">Out of Stock ({outCount})</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50/80 border-b border-stone-200 font-serif font-bold text-stone-700">
              <tr>
                <th className="py-3.5 px-4">SKU Code</th>
                <th className="py-3.5 px-4">Product Name & Brand</th>
                <th className="py-3.5 px-4">Warehouse</th>
                <th className="py-3.5 px-4">Available Units</th>
                <th className="py-3.5 px-4">Buffer Threshold</th>
                <th className="py-3.5 px-4">Health Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-[#143425]" />
                    <span>Loading warehouse inventory...</span>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    No inventory records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-stone-50/60 transition-colors ${
                      item.status === "Low Stock"
                        ? "bg-amber-50/30"
                        : item.status === "Out of Stock"
                        ? "bg-rose-50/30"
                        : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#143425]">
                      {item.sku}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{item.productName}</p>
                      <p className="text-[11px] text-[#A87E28] font-bold uppercase">
                        {item.brandName} • {item.categoryName}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-stone-500">
                      {item.warehouseLocation}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={
                          item.currentStock <= 0
                            ? "text-rose-700 font-extrabold"
                            : item.currentStock <= item.safetyStock
                            ? "text-amber-700"
                            : "text-stone-900"
                        }
                      >
                        {item.currentStock} units
                      </span>
                      {item.reservedStock && item.reservedStock > 0 ? (
                        <span className="block text-[10px] text-stone-400 font-normal">
                          ({item.reservedStock} reserved)
                        </span>
                      ) : null}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-stone-500">
                      <button
                        type="button"
                        onClick={() => openThresholdModal(item)}
                        title="Click to adjust safety threshold"
                        className="group inline-flex items-center gap-1 hover:text-[#143425] text-stone-600 transition-colors"
                      >
                        <span>{item.safetyStock} min</span>
                        <SlidersHorizontal className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#A87E28]" />
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === "In Stock" ? (
                        <Badge variant="success">Healthy</Badge>
                      ) : item.status === "Low Stock" ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : (
                        <Badge variant="danger">Depleted</Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={restockingId === (item.variantId || item.id)}
                          onClick={() => handleQuickRestock(item, 50)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#143425] hover:text-[#C89B3C] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                          title="Quick restock +50 units"
                        >
                          <RotateCw
                            className={`h-3 w-3 ${
                              restockingId === (item.variantId || item.id) ? "animate-spin" : ""
                            }`}
                          />
                          <span>+50</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openAdjustModal(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#143425] hover:bg-[#143425] hover:text-white border border-stone-200 px-2 py-1 rounded-md transition-colors"
                          title="Custom stock adjustment"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                          <span>Adjust</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Custom Stock Adjustment */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200/80 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#143425]">
                  Adjust Stock Level
                </h3>
                <p className="text-xs text-stone-500">
                  {adjustModalItem.productName} ({adjustModalItem.sku})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Adjustment Quantity (units)
                </label>
                <p className="text-[11px] text-stone-500 mb-1.5">
                  Use positive numbers to add stock (+), negative numbers to deduct/write off (-).
                </p>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#143425]"
                >
                  <option value="Restocked from Supplier">Restocked from Supplier</option>
                  <option value="Damaged / Broken Bottling">Damaged / Broken Bottling</option>
                  <option value="Inventory Audit Correction">Inventory Audit Correction</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                  <option value="Expired / Quality Control">Expired / Quality Control</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Warehouse Location
                </label>
                <input
                  type="text"
                  value={adjustLocation}
                  onChange={(e) => setAdjustLocation(e.target.value)}
                  placeholder="Main Warehouse, Section B-4..."
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust || adjustAmount === 0}
                  className="px-4 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {submittingAdjust ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Confirm Adjustment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Threshold */}
      {thresholdModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200/80 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#143425]">
                  Update Stock Thresholds
                </h3>
                <p className="text-xs text-stone-500">
                  {thresholdModalItem.productName} ({thresholdModalItem.sku})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setThresholdModalItem(null)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveThreshold} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Low Stock Safety Buffer
                </label>
                <p className="text-[11px] text-stone-500 mb-1.5">
                  Items below this amount trigger a Low Stock warning banner.
                </p>
                <input
                  type="number"
                  required
                  min={0}
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reorder Point
                </label>
                <p className="text-[11px] text-stone-500 mb-1.5">
                  Suggested replenishment trigger quantity for procurement teams.
                </p>
                <input
                  type="number"
                  required
                  min={0}
                  value={newReorderPoint}
                  onChange={(e) => setNewReorderPoint(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#143425]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setThresholdModalItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingThreshold}
                  className="px-4 py-2 rounded-lg bg-[#143425] hover:bg-[#1C4834] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {submittingThreshold ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Thresholds</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
