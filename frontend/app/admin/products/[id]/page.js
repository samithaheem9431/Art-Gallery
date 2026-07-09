"use client";

import { use, useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById, updateProduct } from "@/lib/adminApi";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-medium">Edit Product</h1>
      <ProductForm
        initial={product}
        onSubmit={(data) => updateProduct(id, data)}
        submitLabel="Save changes"
      />
    </div>
  );
}
