import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPack?: string;
}

export interface CartSummary {
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
}
