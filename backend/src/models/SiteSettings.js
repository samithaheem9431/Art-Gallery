import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    aboutSlides: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
