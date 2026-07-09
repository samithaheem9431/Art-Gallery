import { Router } from "express";
import { signAdminToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/admin/login - exchange the admin password for a JWT
router.post("/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (!password || password !== adminPassword) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = signAdminToken();
  res.json({ token });
});

// GET /api/admin/me - verify a token is still valid
router.get("/me", requireAdmin, (req, res) => {
  res.json({ role: "admin" });
});

export default router;
