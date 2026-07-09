import { Router } from "express";
import SiteSettings from "../models/SiteSettings.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const DEFAULT_SLIDES = [
  "https://picsum.photos/seed/nk-studio-1/1000/900",
  "https://picsum.photos/seed/nk-studio-2/1000/900",
  "https://picsum.photos/seed/nk-studio-3/1000/900",
];

function normalizeSlideUrl(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/api\/images\/[a-f0-9]{24}/i);
  if (match) return match[0];
  return url;
}

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ aboutSlides: DEFAULT_SLIDES });
  }
  return settings;
}

// Public read - used by homepage
router.get("/", async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    const aboutSlides = (settings.aboutSlides || [])
      .map(normalizeSlideUrl)
      .filter(Boolean);
    res.json({
      ...settings.toObject(),
      aboutSlides,
    });
  } catch (err) {
    next(err);
  }
});

// Admin update - used by dashboard
router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const aboutSlides = Array.isArray(req.body?.aboutSlides)
      ? req.body.aboutSlides.map(normalizeSlideUrl).filter(Boolean)
      : [];

    const settings = await getOrCreateSettings();
    settings.aboutSlides = aboutSlides;
    await settings.save();
    res.json({
      ...settings.toObject(),
      aboutSlides,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
