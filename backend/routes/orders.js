// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

// CREATE order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    if (totalPrice < 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }

    // Get user details
    const user = await User.findById(userId);

    const order = new Order({
      userId,
      customer: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: shippingAddress || user.address,
      },
      items,
      totalPrice: Number(totalPrice),
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    const savedOrder = await order.save();

    // Clear user's cart
    await Cart.deleteMany({ userId });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// GET user's orders
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// GET all orders (Admin only)
router.get("/admin/all", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// GET single order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check if user owns order or is admin
    if (order.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid order ID" });
  }
});

// UPDATE order status (Admin only)
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

module.exports = router;