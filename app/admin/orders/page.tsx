import React from "react";
import { Metadata } from "next";
import { getOrders } from "@/data/orders";
import { OrdersAdminClient } from "./OrdersAdminClient";

export const metadata: Metadata = {
  title: "Orders Fulfillment | KB Admin",
  description: "Fulfillment and dispatch status management for customer orders.",
};

export default function AdminOrdersPage() {
  return <OrdersAdminClient />;
}
