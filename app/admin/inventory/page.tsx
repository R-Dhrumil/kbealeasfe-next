"use client";

import React, { useState } from "react";
import { INVENTORY } from "@/data/inventory";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, AlertTriangle, CheckCircle2, RotateCw } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>(INVENTORY);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  React.useEffect(() => {
    async function loadInventory() {
      try {
        const data = await fetchApi("/inventory?pageSize=100");
        if (data && data.items && Array.isArray(data.items)) {
          // Map backend InventoryDto to the frontend's expected format
          const mappedItems = data.items.map((i: any) => ({
            id: i.id, // using inventory Id for list mapping
            variantId: i.productVariantId,
            productId: i.productId,
            productName: i.productName,
            sku: i.variantSKU,
            brandName: i.brandName,
            categoryName: i.categoryName,
            warehouseLocation: i.warehouseLocation || "Main Warehouse",
            currentStock: i.availableQuantity,
            bufferThreshold: i.lowStockThreshold,
            status: i.isOutOfStock ? "Out of Stock" : (i.isLowStock ? "Low Stock" : "In Stock"),
          }));
          setItems(mappedItems);
        }
      } catch (err) {
        console.error("Failed to load inventory", err);
      }
    }
    loadInventory();
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

  const handleRestock = async (variantId: string) => {
    // If it's a mock string ID from INVENTORY, just do local state update
    if (!variantId || variantId.startsWith("prod-")) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === variantId ? { ...i, currentStock: i.currentStock + 50, status: "In Stock" } : i
        )
      );
      return;
    }

    try {
      const res = await fetchApi(`/inventory/${variantId}/adjust`, {
        method: "PUT",
        body: JSON.stringify({
          adjustmentAmount: 50,
          reason: "Quick Restock from Admin Dashboard"
        }),
      });
      if (res && res.id) {
        setItems((prev) =>
          prev.map((i) =>
            i.variantId === variantId
              ? {
                  ...i,
                  currentStock: res.availableQuantity,
                  status: res.isOutOfStock ? "Out of Stock" : (res.isLowStock ? "Low Stock" : "In Stock"),
                }
              : i
          )
        );
      }
    } catch (err) {
      console.error("Failed to restock", err);
      alert("Failed to restock inventory.");
    }
  };

  const healthyCount = items.filter((i) => i.status === "In Stock").length;
  const lowCount = items.filter((i) => i.status === "Low Stock").length;
  const outCount = items.filter((i) => i.status === "Out of Stock").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#143425]">
            Warehouse Inventory & Stock Health
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time buffer thresholds, reserve balances, and warehouse storage locations.
          </p>
        </div>
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
            placeholder="Search SKU or product..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#143425]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-700 focus:outline-none"
        >
          <option value="all">All Stock Statuses</option>
          <option value="In Stock">Healthy Stock</option>
          <option value="Low Stock">Low Stock Alert</option>
          <option value="Out of Stock">Out of Stock</option>
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
                <th className="py-3.5 px-4">Warehouse Location</th>
                <th className="py-3.5 px-4">Available Units</th>
                <th className="py-3.5 px-4">Safety Buffer</th>
                <th className="py-3.5 px-4">Health Status</th>
                <th className="py-3.5 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-stone-50/60 transition-colors ${
                    item.status === "Low Stock" ? "bg-amber-50/30" : ""
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
                        item.currentStock < item.safetyStock
                          ? "text-amber-700"
                          : "text-stone-900"
                      }
                    >
                      {item.currentStock} units
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    {item.safetyStock} min
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
                    <button
                      type="button"
                      onClick={() => handleRestock(item.variantId || item.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#143425] hover:text-[#C89B3C] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>+50 Units</span>
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
