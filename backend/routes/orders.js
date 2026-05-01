const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (Number(totalPrice) < 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }

    const order = new Order({
      userId,
      items,
      totalPrice: Number(totalPrice),
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// GET all orders (user/public)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// GET orders for one user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user orders" });
  }
});

// GET one order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid order ID" });
  }
});

module.exports = router;