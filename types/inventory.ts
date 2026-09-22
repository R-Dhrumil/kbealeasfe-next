export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  brandName: string;
  categoryName: string;
  currentStock: number;
  safetyStock: number;
  incomingStock: number;
  warehouseLocation: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastRestocked: string;
}
