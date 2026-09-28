import React from "react";
import { Metadata } from "next";
import { getProducts } from "@/data/products";
import { ProductsAdminClient } from "./ProductsAdminClient";

export const metadata: Metadata = {
  title: "Products Management | KB Admin",
  description: "Manage beverage products catalog, prices, and inventory statuses.",
};

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsAdminClient initialProducts={products} />;
}
