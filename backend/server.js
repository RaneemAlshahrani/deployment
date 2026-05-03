// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const app = express();
// Middleware
app.use(cors({
 origin: ['https://bubble-raneem1.vercel.app', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ==================== FIX: Handle uploads directory ====================
// Only create uploads directory in development (not on Vercel)
if (!process.env.VERCEL) {
 const uploadDir = path.join(__dirname, "uploads");
 if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
 }
 app.use("/uploads", express.static(uploadDir));
}
// ==================== SERVE FRONTEND STATIC FILES ====================
const frontendPath = path.join(__dirname, "../frontend/dist");
console.log("Frontend path:", frontendPath);
// Check if frontend dist exists
if (fs.existsSync(frontendPath)) {
 console.log("✅ Serving frontend from:", frontendPath);
 app.use(express.static(frontendPath));
} else {
 console.log("❌ Frontend dist not found at:", frontendPath);
}
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
// ==================== Health Check ====================
app.get("/", (req, res) => {
 res.json({
   message: "Bubble Soap Store API is running 🚀",
   status: "healthy",
   timestamp: new Date().toISOString(),
   env: process.env.VERCEL ? "vercel" : "development"
 });
});
// ==================== HANDLE REACT ROUTING ====================
// This must come AFTER all API routes
app.get("*", (req, res, next) => {
 // Skip API routes
 if (req.path.startsWith("/api/")) {
   return next();
 }
 // Send index.html for all other routes (React router)
 const indexPath = path.join(frontendPath, "index.html");
 if (fs.existsSync(indexPath)) {
   res.sendFile(indexPath);
 } else {
   res.status(404).json({
     error: "Frontend not found",
     message: "Please build the frontend with: cd frontend && npm run build"
   });
 }
});
// ==================== Error Handler ====================
app.use((err, req, res, next) => {
 console.error("Error:", err.stack);
 res.status(500).json({
   message: "Something went wrong!",
   error: process.env.NODE_ENV === "development" ? err.message : undefined
 });
});
module.exports = app;