const mongoose = require("mongoose");

const customOptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["scent", "texture", "ingredient"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomOption", customOptionSchema);