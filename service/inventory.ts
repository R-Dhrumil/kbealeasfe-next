import { InventoryItem, LowStockAlert } from "@/types/inventory";
import { fetchApi } from "@/lib/api";

/**
 * Hardcoded mock inventory has been replaced with live dynamic backend data.
 * Maintained as an empty array export for backward compatibility.
 */
export const INVENTORY: InventoryItem[] = [];

export function mapBackendInventoryToFrontend(dto: any): InventoryItem {
  return {
    id: dto.id,
    variantId: dto.productVariantId,
    productId: dto.productId,
    productName: dto.productName || "Unnamed Product",
    productSlug: dto.productSlug || "",
    variantName: dto.variantName || "",
    sku: dto.variantSKU || dto.sku || "N/A",
    brandName: dto.brandName || "KB Beverage",
    categoryName: dto.categoryName || "Beverage",
    currentStock: dto.availableQuantity ?? dto.quantityInStock ?? 0,
    availableStock: dto.availableQuantity ?? 0,
    reservedStock: dto.reservedQuantity ?? 0,
    safetyStock: dto.lowStockThreshold ?? 25,
    reorderPoint: dto.reorderPoint ?? 0,
    incomingStock: 0,
    warehouseLocation: dto.warehouseLocation || "Main Warehouse",
    status: dto.isOutOfStock || ((dto.availableQuantity ?? dto.quantityInStock ?? 0) <= 0)
      ? "Out of Stock"
      : ((dto.isLowStock || (dto.availableQuantity ?? 0) <= (dto.lowStockThreshold ?? 25)) ? "Low Stock" : "In Stock"),
    lastRestocked: dto.lastRestockedAt ? new Date(dto.lastRestockedAt).toISOString().split("T")[0] : "Recently",
  };
}

export async function getInventory(params: {
  pageNumber?: number;
  pageSize?: number;
  lowStockOnly?: boolean;
  search?: string;
} = {}): Promise<{ items: InventoryItem[]; totalCount: number; totalPages: number }> {
  try {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append("pageNumber", String(params.pageNumber));
    if (params.pageSize) query.append("pageSize", String(params.pageSize));
    if (params.lowStockOnly) query.append("lowStockOnly", "true");
    if (params.search && params.search.trim()) query.append("search", params.search.trim());

    const queryString = query.toString() ? `?${query.toString()}` : "?pageSize=100";
    const data = await fetchApi(`/inventory${queryString}`);

    if (data && Array.isArray(data.items)) {
      return {
        items: data.items.map(mapBackendInventoryToFrontend),
        totalCount: data.totalCount || data.items.length,
        totalPages: data.totalPages || 1,
      };
    }
    return { items: [], totalCount: 0, totalPages: 1 };
  } catch (error) {
    console.error("Failed to fetch inventory from backend:", error);
    return { items: [], totalCount: 0, totalPages: 1 };
  }
}

export async function getLowStockAlerts(): Promise<LowStockAlert[]> {
  try {
    const data = await fetchApi("/inventory/alerts");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch low stock alerts:", error);
    return [];
  }
}

export async function adjustStock(
  variantId: string,
  amount: number,
  reason: string = "Restocked from Admin",
  warehouseLocation?: string
): Promise<InventoryItem | null> {
  try {
    const payload: Record<string, any> = {
      adjustmentAmount: amount,
      reason,
    };
    if (warehouseLocation) {
      payload.warehouseLocation = warehouseLocation;
    }

    const res = await fetchApi(`/inventory/${variantId}/adjust`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res ? mapBackendInventoryToFrontend(res) : null;
  } catch (error) {
    console.error(`Failed to adjust stock for variant ${variantId}:`, error);
    throw error;
  }
}

export async function updateThreshold(variantId: string, lowStockThreshold: number, reorderPoint: number = 0): Promise<InventoryItem | null> {
  try {
    const res = await fetchApi(`/inventory/${variantId}/threshold`, {
      method: "PUT",
      body: JSON.stringify({
        lowStockThreshold,
        reorderPoint,
      }),
    });
    return res ? mapBackendInventoryToFrontend(res) : null;
  } catch (error) {
    console.error(`Failed to update threshold for variant ${variantId}:`, error);
    throw error;
  }
}
