import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.warn("Starting without database — contact email may still work.");
    return false;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
