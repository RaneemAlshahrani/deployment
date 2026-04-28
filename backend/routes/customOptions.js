const express = require("express");
const router = express.Router();
const CustomOption = require("../models/CustomOption");

// GET all custom options
router.get("/", async (req, res) => {
  try {
    const options = await CustomOption.find();
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: "Failed to get custom options" });
  }
});

// POST add custom option
router.post("/", async (req, res) => {
  try {
    const { type, name, price, stock, available } = req.body;

    if (!type || !name) {
      return res.status(400).json({ message: "Type and name are required" });
    }

    const option = new CustomOption({
      type,
      name,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      available: available ?? true,
    });

    const savedOption = await option.save();
    res.status(201).json(savedOption);
  } catch (error) {
    res.status(500).json({ message: "Failed to add custom option" });
  }
});

// PUT update custom option
router.put("/:id", async (req, res) => {
  try {
    const updatedOption = await CustomOption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: "Custom option not found" });
    }

    res.status(200).json(updatedOption);
  } catch (error) {
    res.status(400).json({ message: "Failed to update custom option" });
  }
});

// DELETE custom option
router.delete("/:id", async (req, res) => {
  try {
    const deletedOption = await CustomOption.findByIdAndDelete(req.params.id);

    if (!deletedOption) {
      return res.status(404).json({ message: "Custom option not found" });
    }

    res.status(200).json({ message: "Custom option deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete custom option" });
  }
});

module.exports = router;