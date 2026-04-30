const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cartRoutes = require("./routes/cart");
const customOptionRoutes = require("./routes/customOptions");

app.use("/api/products", productRoutes);

app.use("/api/faqs", faqRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/custom-options", customOptionRoutes);

const app = express(); 

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));