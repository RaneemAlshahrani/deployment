// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    customer: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1, min: 1 },
        image: String,
        customization: {
          scents: [String],
          texture: String,
          ingredients: [String],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    discountApplied: {
      type: Number,
      default: 0,
    },
    discountCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);