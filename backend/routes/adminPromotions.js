const express = require("express");
const router = express.Router();
const Promotion = require("../models/Promotion");

// GET all promotions
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get promotions",
      error: error.message,
    });
  }
});

// CREATE promotion
router.post("/", async (req, res) => {
  try {
    const { code, expiry, type, value } = req.body;

    if (!code || !expiry || !type || value === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanCode = code.trim().toLowerCase();
    const discountValue = Number(String(value).replace("%", ""));

    if (Number.isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      return res.status(400).json({
        message: "Discount value must be between 1 and 100",
      });
    }

    const expiryDate = new Date(expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(expiryDate.getTime()) || expiryDate < today) {
      return res.status(400).json({
        message: "Expiry date must be today or later",
      });
    }

    const existing = await Promotion.findOne({ code: cleanCode });

    if (existing) {
      return res.status(400).json({
        message: "Promo code already exists",
      });
    }

    const promotion = new Promotion({
      code: cleanCode,
      expiry: expiryDate,
      type,
      value: discountValue,
    });

    const savedPromotion = await promotion.save();

    res.status(201).json(savedPromotion);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create promotion",
      error: error.message,
    });
  }
});

// UPDATE promotion
router.put("/:id", async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (updatedData.code) {
      updatedData.code = updatedData.code.trim().toLowerCase();
    }

    if (updatedData.value !== undefined) {
      updatedData.value = Number(String(updatedData.value).replace("%", ""));

      if (
        Number.isNaN(updatedData.value) ||
        updatedData.value <= 0 ||
        updatedData.value > 100
      ) {
        return res.status(400).json({
          message: "Discount value must be between 1 and 100",
        });
      }
    }

    if (updatedData.expiry) {
      updatedData.expiry = new Date(updatedData.expiry);

      if (Number.isNaN(updatedData.expiry.getTime())) {
        return res.status(400).json({
          message: "Invalid expiry date",
        });
      }
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json(updatedPromotion);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update promotion",
      error: error.message,
    });
  }
});

// DELETE promotion
router.delete("/:id", async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete promotion",
      error: error.message,
    });
  }
});

module.exports = router;