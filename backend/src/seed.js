import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import Collection from "./models/Collection.js";
import Product from "./models/Product.js";

dotenv.config();

const img = (seed, w = 900, h = 1100) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const collections = [
  {
    title: "Stallions",
    slug: "stallions",
    description:
      "Powerful equine studies exploring movement, muscle and the untamed spirit of the horse.",
    image: img("nk-stallions", 1000, 1200),
  },
  {
    title: "Figurative",
    slug: "figurative",
    description:
      "Human forms and portraits rendered in luminous colour, balancing harmony and chaos.",
    image: img("nk-figurative", 1000, 1200),
  },
  {
    title: "Abstract",
    slug: "abstract",
    description:
      "Expressive abstractions where colour luminosity and contrast meet on canvas.",
    image: img("nk-abstract", 1000, 1200),
  },
];

const products = [
  // Stallions
  {
    title: "Crimson Stallion",
    slug: "crimson-stallion",
    collectionSlug: "stallions",
    price: 85000,
    medium: "Oil on canvas",
    dimensions: "36 x 48 in",
    featured: true,
    description:
      "A brooding stallion emerges from a deep crimson field, capturing raw power and stillness.",
    images: [img("stallion-1"), img("stallion-1b")],
  },
  {
    title: "Midnight Gallop",
    slug: "midnight-gallop",
    collectionSlug: "stallions",
    price: 92000,
    medium: "Oil on canvas",
    dimensions: "40 x 50 in",
    description: "Motion frozen in time as a dark horse charges through the night.",
    images: [img("stallion-2")],
  },
  {
    title: "Golden Mane",
    slug: "golden-mane",
    collectionSlug: "stallions",
    price: 78000,
    medium: "Acrylic on canvas",
    dimensions: "30 x 40 in",
    description: "Warm golden light catches the flowing mane of a resting horse.",
    images: [img("stallion-3")],
  },
  // Figurative
  {
    title: "Quiet Gaze",
    slug: "quiet-gaze",
    collectionSlug: "figurative",
    price: 110000,
    medium: "Oil on canvas",
    dimensions: "24 x 36 in",
    featured: true,
    description: "An intimate portrait exploring the balance between harmony and chaos.",
    images: [img("figure-1")],
  },
  {
    title: "Veiled Light",
    slug: "veiled-light",
    collectionSlug: "figurative",
    price: 98000,
    medium: "Oil on canvas",
    dimensions: "28 x 40 in",
    description: "Soft light falls across a contemplative figure.",
    images: [img("figure-2")],
  },
  {
    title: "Reverie",
    slug: "reverie",
    collectionSlug: "figurative",
    price: 105000,
    medium: "Mixed media",
    dimensions: "30 x 42 in",
    description: "A dreamlike study of the human form in colour.",
    images: [img("figure-3")],
  },
  // Abstract
  {
    title: "Chaos & Harmony",
    slug: "chaos-and-harmony",
    collectionSlug: "abstract",
    price: 70000,
    medium: "Acrylic on canvas",
    dimensions: "36 x 36 in",
    featured: true,
    description: "Bold strokes collide and resolve into unexpected balance.",
    images: [img("abstract-1")],
  },
  {
    title: "Luminous Field",
    slug: "luminous-field",
    collectionSlug: "abstract",
    price: 64000,
    medium: "Acrylic on canvas",
    dimensions: "32 x 44 in",
    description: "Layered colour creating depth and glow.",
    images: [img("abstract-2")],
  },
  {
    title: "Fragments",
    slug: "fragments",
    collectionSlug: "abstract",
    price: 58000,
    medium: "Mixed media",
    dimensions: "28 x 38 in",
    description: "Broken forms reassembled into a quiet rhythm.",
    images: [img("abstract-3")],
  },
];

async function seed() {
  await connectDB(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nk_art");
  await Collection.deleteMany({});
  await Product.deleteMany({});
  await Collection.insertMany(collections);
  await Product.insertMany(products);
  console.log(`Seeded ${collections.length} collections and ${products.length} products`);
  await mongoose.connection.close();
  process.exit(0);
}

seed();
