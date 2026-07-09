import { Router } from "express";
import SiteSettings from "../models/SiteSettings.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const DEFAULT_SLIDES = [
  "https://picsum.photos/seed/nk-studio-1/1000/900",
  "https://picsum.photos/seed/nk-studio-2/1000/900",
  "https://picsum.photos/seed/nk-studio-3/1000/900",
];

const DEFAULT_ABOUT = {
  aboutTitle: "ABOUT THE ARTIST",
  aboutText1:
    "Zarmina Bashir is a painter based in Islamabad, Pakistan. After graduating with a distinction from NCA (National College of Arts), she joined the University of Arts London where she further studied different techniques of painting.",
  aboutText2:
    "Bashir aims to achieve a balance between colour luminosity but also to break contrast between harmony and chaos.",
};

function normalizeSlideUrl(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/api\/images\/[a-f0-9]{24}/i);
  if (match) return match[0];
  return url;
}

function cleanText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function serializeSettings(settings) {
  const obj = settings.toObject();
  return {
    ...obj,
    aboutSlides: (obj.aboutSlides || []).map(normalizeSlideUrl).filter(Boolean),
    aboutTitle: obj.aboutTitle || DEFAULT_ABOUT.aboutTitle,
    aboutText1: obj.aboutText1 || DEFAULT_ABOUT.aboutText1,
    aboutText2: obj.aboutText2 || DEFAULT_ABOUT.aboutText2,
  };
}

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({
      aboutSlides: DEFAULT_SLIDES,
      ...DEFAULT_ABOUT,
    });
  }
  return settings;
}

// Public read - used by homepage
router.get("/", async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(serializeSettings(settings));
  } catch (err) {
    next(err);
  }
});

// Admin update - used by dashboard
router.put("/", requireAdmin, async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    if (Array.isArray(req.body?.aboutSlides)) {
      settings.aboutSlides = req.body.aboutSlides.map(normalizeSlideUrl).filter(Boolean);
    }

    if (req.body?.aboutTitle !== undefined) {
      settings.aboutTitle =
        cleanText(req.body.aboutTitle, DEFAULT_ABOUT.aboutTitle) || DEFAULT_ABOUT.aboutTitle;
    }
    if (req.body?.aboutText1 !== undefined) {
      settings.aboutText1 = cleanText(req.body.aboutText1);
    }
    if (req.body?.aboutText2 !== undefined) {
      settings.aboutText2 = cleanText(req.body.aboutText2);
    }

    await settings.save();
    res.json(serializeSettings(settings));
  } catch (err) {
    next(err);
  }
});

export default router;
