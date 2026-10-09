import { Order, OrderStatus } from "@/types/order";
import { fetchApi } from "@/lib/api";

/**
 * In-memory orders cache.
 * Hardcoded mock orders have been removed to ensure dynamic handling.
 */
export const ORDERS: Order[] = [];

export interface CreateOrderPayload {
  shippingAddressId: string;
  paymentMethod: string;
  couponCode?: string;
  items: Array<{
    productVariantId: string;
    quantity: number;
  }>;
}

/**
 * Fetch orders for the current customer account.
 */
export async function getCustomerOrders(): Promise<Order[]> {
  try {
    const data = await fetchApi("/account/orders");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return [];
  }
}

/**
 * Fetch all orders for admin management.
 */
export async function getAdminOrders(): Promise<Order[]> {
  try {
    const data = await fetchApi("/admin/orders");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    return [];
  }
}

/**
 * Dynamic getter for orders.
 * @param scope "account" for customer orders, "admin" for all orders.
 */
export async function getOrders(scope: "account" | "admin" = "account"): Promise<Order[]> {
  if (scope === "admin") {
    return getAdminOrders();
  }
  return getCustomerOrders();
}

/**
 * Fetch a single order by ID or order number dynamically.
 * @param id Order ID (GUID) or order number (e.g. ORD-20260920-1234 or KB-8924)
 * @param scope "account" or "admin"
 */
export async function getOrderById(
  id: string,
  scope: "account" | "admin" = "account"
): Promise<Order | undefined> {
  const cleanId = id?.trim();
  if (!cleanId) return undefined;

  // 1. Try direct API endpoint if ID is a valid GUID/UUID
  try {
    const directOrder = await fetchApi(`/orders/${cleanId}`);
    if (directOrder && directOrder.id) {
      return directOrder as Order;
    }
  } catch {
    // Continue to list search if direct lookup fails (e.g. when searching by orderNumber)
  }

  // 2. Fetch list based on scope and search by ID or order number
  try {
    const ordersList = scope === "admin" ? await getAdminOrders() : await getCustomerOrders();
    const normalizedTarget = cleanId.toLowerCase().replace(/^#/, "");

    const matched = ordersList.find((o) => {
      const oId = (o.id || "").toLowerCase();
      const oNum = (o.orderNumber || "").toLowerCase().replace(/^#/, "");
      return oId === normalizedTarget || oNum === normalizedTarget;
    });

    if (matched) return matched;
  } catch (error) {
    console.error(`Failed to find order ${id}:`, error);
  }

  return undefined;
}

/**
 * Create/place a new order dynamically.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return await fetchApi("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update the status of an existing order (Admin fulfillment).
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  try {
    const updated = await fetchApi(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return updated as Order;
  } catch (error) {
    console.warn("Failed to update order status via API:", error);
    return null;
  }
}
