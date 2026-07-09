import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";
import { sendContactNotification } from "../services/email.js";

const router = Router();

// POST /api/contact - save message + email notification
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Name, email, phone and message are required" });
    }

    const saved = await ContactMessage.create({ name, email, phone: phone || "", message });

    try {
      await sendContactNotification({ name, email, phone, message });
    } catch (emailErr) {
      console.error("Contact email failed:", emailErr.message);
      // Message is still saved — don't fail the request for the visitor
    }

    res.status(201).json({
      message: "Message received. We'll get back to you soon.",
      id: saved._id,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
