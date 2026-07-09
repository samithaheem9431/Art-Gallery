import { Router } from "express";
import multer from "multer";
import Image from "../models/Image.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Keep the file in memory so we can store the bytes directly in MongoDB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

function imageUrl(id) {
  // Relative path so the Next.js /api rewrite (or same-origin proxy) can serve it
  // in both local and production. Absolute PUBLIC_API_URL overrides when set.
  const base = (process.env.PUBLIC_API_URL || "").replace(/\/$/, "");
  return base ? `${base}/api/images/${id}` : `/api/images/${id}`;
}

// POST /api/images - upload one or more images (admin only)
router.post("/", requireAdmin, upload.array("images", 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const saved = await Promise.all(
      req.files.map((file) =>
        Image.create({
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
        })
      )
    );
    const urls = saved.map((img) => imageUrl(img._id));
    res.status(201).json({ urls });
  } catch (err) {
    next(err);
  }
});

// GET /api/images/:id - serve an image from MongoDB (Multer upload)
router.get("/:id", async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id).lean();
    if (!image?.data) return res.status(404).json({ message: "Image not found" });

    const buffer = Buffer.isBuffer(image.data)
      ? image.data
      : Buffer.from(image.data.buffer || image.data);

    res.set("Content-Type", image.contentType || "application/octet-stream");
    res.set("Content-Length", String(buffer.length));
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    res.end(buffer);
  } catch (err) {
    next(err);
  }
});

export default router;
