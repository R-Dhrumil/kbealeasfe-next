export interface InventoryItem {
  id: string;
  variantId?: string;
  productId?: string;
  sku: string;
  productName: string;
  productSlug?: string;
  variantName?: string;
  brandName: string;
  categoryName: string;
  currentStock: number;
  availableStock?: number;
  reservedStock?: number;
  safetyStock: number;
  reorderPoint?: number;
  incomingStock: number;
  warehouseLocation: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastRestocked: string;
}

export interface LowStockAlert {
  inventoryId: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  variantSKU: string;
  brandName: string;
  quantityInStock: number;
  availableQuantity: number;
  lowStockThreshold: number;
  severity: "CRITICAL" | "WARNING";
  message: string;
}

