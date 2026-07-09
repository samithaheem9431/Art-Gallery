"use client";

import { use, useEffect, useState } from "react";
import CollectionForm from "@/components/admin/CollectionForm";
import { listCollections, updateCollection } from "@/lib/adminApi";

export default function EditCollectionPage({ params }) {
  const { id } = use(params);
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listCollections()
      .then((all) => {
        const found = all.find((c) => c._id === id);
        if (!found) setError("Collection not found");
        else setCollection(found);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!collection) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-medium">Edit Collection</h1>
      <CollectionForm
        initial={collection}
        onSubmit={(data) => updateCollection(id, data)}
        submitLabel="Save changes"
      />
    </div>
  );
}
