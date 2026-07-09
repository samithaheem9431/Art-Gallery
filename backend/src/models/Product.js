import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR" },
    images: { type: [String], default: [] },
    collectionSlug: { type: String, required: true, index: true },
    medium: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
