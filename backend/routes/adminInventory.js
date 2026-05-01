const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all inventory
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .select("name stock price image")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
});

// UPDATE stock
router.put("/:id", async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update stock",
    });
  }
});

module.exports = router;