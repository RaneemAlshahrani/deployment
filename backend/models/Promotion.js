const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    expiry: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "All Products",
        "Specific Product",
        "Category",
        "Minimum Order",
      ],
    },

    value: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);