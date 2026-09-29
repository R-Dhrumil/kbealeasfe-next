import React from "react";
import { Metadata } from "next";
import { AdminLayoutClient } from "./AdminLayoutClient";
import { CustomerProvider } from "@/context/CustomerContext";

export const metadata: Metadata = {
  title: "Admin Portal | KB Beverage Operations",
  description: "Operations, catalog management, order fulfillment, and beverage inventory analytics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </CustomerProvider>
  );
}
