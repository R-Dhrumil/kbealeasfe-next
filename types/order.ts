export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export type PaymentMethod = "UPI" | "Credit/Debit Card" | "Net Banking" | "Cash on Delivery";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  brandName: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  sku: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
}
