import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = Router();

// POST /api/contact - save a contact message
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    const saved = await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ message: "Message received. We'll get back to you soon.", id: saved._id });
  } catch (err) {
    next(err);
  }
});

export default router;
