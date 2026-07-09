import { Router } from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";
import { uniqueSlug } from "../utils/slugify.js";

const router = Router();

// GET /api/products - list products (optional ?collection= & ?featured=true)
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.collection) filter.collectionSlug = req.query.collection;
    if (req.query.featured === "true") filter.featured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/id/:id - single product by id (admin editing)
router.get("/id/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug - single product
router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - create (admin)
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.title || body.price == null || !body.collectionSlug) {
      return res.status(400).json({ message: "Title, price and collection are required" });
    }
    const slug = await uniqueSlug(Product, body.slug || body.title);
    const product = await Product.create({ ...body, slug });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - update (admin)
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.title) {
      body.slug = await uniqueSlug(Product, body.slug || body.title, req.params.id);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - delete (admin)
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
