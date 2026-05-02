// backend/api.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow any origin in production (Vercel)
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For Vercel serverless, use /tmp for uploads
const uploadDir = process.env.VERCEL ? "/tmp/uploads" : path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// ==================== Import Routes ====================
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const faqRoutes = require("./routes/faq");
const ticketRoutes = require("./routes/ticket");
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

// ==================== Serve Frontend in Production ====================
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

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

// Export for Vercel serverless
module.exports = app;