import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderNotification } from "../services/email.js";

const router = Router();

async function findProduct(item) {
  const id = item?.product;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    const byId = await Product.findById(id);
    if (byId) return byId;
  }
  if (item?.slug) {
    return Product.findOne({ slug: item.slug });
  }
  return null;
}

// POST /api/orders - create an order from a cart
router.post("/", async (req, res, next) => {
  try {
    const { customer, items } = req.body;
    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ message: "Customer name and email are required" });
    }
    if (!customer?.phone?.trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!customer?.address?.trim()) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const product = await findProduct(item);
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
      return res.status(400).json({
        message:
          "No valid products in cart. Remove old items and add paintings again from the shop.",
      });
    }

    const order = await Order.create({ customer, items: orderItems, total });

    try {
      await sendOrderNotification(order);
    } catch (emailErr) {
      console.error("Order email failed:", emailErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
