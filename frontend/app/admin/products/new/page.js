"use client";

import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/adminApi";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-medium">New Product</h1>
      <ProductForm onSubmit={createProduct} submitLabel="Create product" />
    </div>
  );
}
