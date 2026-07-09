import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";
import { sendContactNotification } from "../services/email.js";
import { isDbConnected } from "../config/db.js";

const router = Router();

// POST /api/contact - email notification (+ save to DB when available)
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Name, email, phone and message are required" });
    }

    let savedId = null;
    if (isDbConnected()) {
      try {
        const saved = await ContactMessage.create({ name, email, phone, message });
        savedId = saved._id;
      } catch (dbErr) {
        console.error("Contact DB save failed:", dbErr.message);
      }
    }

    let emailSent = false;
    try {
      emailSent = await sendContactNotification({ name, email, phone, message });
    } catch (emailErr) {
      console.error("Contact email failed:", emailErr.message);
    }

    if (!savedId && !emailSent) {
      return res.status(503).json({
        message: "Could not send message right now. Please try again in a moment.",
      });
    }

    res.status(201).json({
      message: "Message received. We'll get back to you soon.",
      id: savedId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
