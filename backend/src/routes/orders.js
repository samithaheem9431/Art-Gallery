import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = Router();

// POST /api/orders - create an order from a cart
router.post("/", async (req, res, next) => {
  try {
    const { customer, items } = req.body;
    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ message: "Customer name and email are required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Recompute prices from DB so the client can't tamper with them
    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity,
      });
      total += product.price * quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }

    const order = await Order.create({ customer, items: orderItems, total });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
