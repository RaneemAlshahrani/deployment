const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    scent: {
      type: String,
      default: "",
    },
    skinType: {
      type: String,
      default: "",
    },
    ingredients: {
      type: [String],
      default: [],
    },
    isCustomizable: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "pink",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);