const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
// const User = require("../models/User"); // add this when you have User model

router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalSales = revenue[0]?.totalSales || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          price: { $first: "$items.price" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 4 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          quantity: 1,
          price: 1,
        },
      },
    ]);

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const salesChartData = monthNames.map((month, index) => {
      const found = monthlySales.find((item) => item._id === index + 1);
      return {
        month,
        sales: found ? found.sales : 0,
      };
    });

    res.status(200).json({
      totalSales,
      totalOrders,
      totalCustomers: 0, // replace later with User.countDocuments({ role: "user" })
      totalProducts,
      recentOrders,
      topProducts,
      salesChartData,
      activityData: [
        { name: "Customers", value: 0, percent: 0, color: "#5b2ff5" },
        { name: "customer-service", value: 0, percent: 0, color: "#8e3fd6" },
        { name: "Admin", value: 0, percent: 0, color: "#c45cc9" },
      ],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
});

module.exports = router;