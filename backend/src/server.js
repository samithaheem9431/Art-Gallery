import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import collectionsRouter from "./routes/collections.js";
import productsRouter from "./routes/products.js";
import contactRouter from "./routes/contact.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import imagesRouter from "./routes/images.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/admin", adminRouter);
app.use("/api/images", imagesRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/orders", ordersRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "MulterError" || err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Server error" });
});

connectDB(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nk_art").then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
