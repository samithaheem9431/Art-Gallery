import { Router } from "express";
import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";
import { uniqueSlug } from "../utils/slugify.js";

const router = Router();

// GET /api/collections - list all collections
router.get("/", async (req, res, next) => {
  try {
    const collections = await Collection.find().sort({ createdAt: 1 });
    res.json(collections);
  } catch (err) {
    next(err);
  }
});

// GET /api/collections/:slug - single collection with its products
router.get("/:slug", async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    const products = await Product.find({ collectionSlug: collection.slug }).sort({
      createdAt: -1,
    });
    res.json({ collection, products });
  } catch (err) {
    next(err);
  }
});

// POST /api/collections - create (admin)
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.title) return res.status(400).json({ message: "Title is required" });
    const slug = await uniqueSlug(Collection, body.slug || body.title);
    const collection = await Collection.create({ ...body, slug });
    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
});

// PUT /api/collections/:id - update (admin)
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const body = { ...req.body };
    const existing = await Collection.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Collection not found" });

    if (body.title) {
      body.slug = await uniqueSlug(Collection, body.slug || body.title, req.params.id);
    }
    const updated = await Collection.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    // Keep products in sync if the collection slug changed
    if (body.slug && body.slug !== existing.slug) {
      await Product.updateMany(
        { collectionSlug: existing.slug },
        { collectionSlug: body.slug }
      );
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/collections/:id - delete (admin)
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
