const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to get products" });
  }
});

// GET one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// POST add product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || price === undefined || !description || stock === undefined) {
      return res.status(400).json({
        message: "Name, price, description, and stock are required",
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        message: "Price and stock must be positive numbers",
      });
    }

    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : req.body.image;

    const product = new Product({
      ...req.body,
      price: Number(price),
      stock: Number(stock),
      image: imageUrl,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to add product",
      error: error.message
    });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    if (req.body.price < 0 || req.body.stock < 0) {
      return res.status(400).json({
        message: "Price and stock must be positive numbers",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete product" });
  }
});

module.exports = router;