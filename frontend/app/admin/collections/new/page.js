"use client";

import CollectionForm from "@/components/admin/CollectionForm";
import { createCollection } from "@/lib/adminApi";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-medium">New Collection</h1>
      <CollectionForm onSubmit={createCollection} submitLabel="Create collection" />
    </div>
  );
}
