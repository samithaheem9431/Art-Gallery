import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: String,
    price: Number,
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      country: { type: String, default: "Pakistan" },
    },
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
