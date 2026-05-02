// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

// ==================== Import Routes ====================
// Match your actual file names (singular, not plural)
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const faqRoutes = require("./routes/faq");        // Note: faq.js (singular)
const ticketRoutes = require("./routes/ticket");   // Note: ticket.js (singular)
const customOptionRoutes = require("./routes/customOptions");
const adminRoutes = require("./routes/admin");
const adminInventoryRoutes = require("./routes/adminInventory");
const adminOrdersRoutes = require("./routes/adminOrders");
const adminProductsRoutes = require("./routes/adminProducts");
const adminPromotionsRoutes = require("./routes/adminPromotions");
const adminReviewsRoutes = require("./routes/adminReviews");

// ==================== Register Routes ====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/custom-options", customOptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/inventory", adminInventoryRoutes);
app.use("/api/admin/orders", adminOrdersRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/promotions", adminPromotionsRoutes);
app.use("/api/admin/reviews", adminReviewsRoutes);

// ==================== Health Check ====================
app.get("/", (req, res) => {
  res.json({
    message: "Bubble Soap Store API is running 🚀",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const mongoose = require("mongoose");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Uploads directory: ${uploadDir}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();