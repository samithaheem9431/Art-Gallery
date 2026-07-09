import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    aboutSlides: { type: [String], default: [] },
    aboutTitle: {
      type: String,
      default: "ABOUT THE ARTIST",
    },
    aboutText1: {
      type: String,
      default:
        "Zarmina Bashir is a painter based in Islamabad, Pakistan. After graduating with a distinction from NCA (National College of Arts), she joined the University of Arts London where she further studied different techniques of painting.",
    },
    aboutText2: {
      type: String,
      default:
        "Bashir aims to achieve a balance between colour luminosity but also to break contrast between harmony and chaos.",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
