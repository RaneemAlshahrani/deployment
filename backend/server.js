// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

// Import routes
const cartRoutes = require("./routes/cart");
const customOptionRoutes = require("./routes/customOptions");
const wishlistRoutes = require("./routes/wishlist");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const faqRoutes = require("./routes/faq");
const ticketRoutes = require("./routes/tickets");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/custom-options", customOptionRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/tickets", ticketRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log("MongoDB connection error:", err));