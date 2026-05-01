const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User"); 

router.get("/dashboard", async (req, res) => {
  try {
    const { salesFilter = "all" } = req.query;

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCustomerService = await User.countDocuments({
      role: "customer-service",
    });

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalSales = revenueResult[0]?.totalSales || 0;

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

    let matchStage = {};

    if (salesFilter === "last6" || salesFilter === "last3") {
      const now = new Date();
      const monthsBack = salesFilter === "last6" ? 6 : 3;

      const fromDate = new Date(
        now.getFullYear(),
        now.getMonth() - monthsBack + 1,
        1
      );

      matchStage = {
        createdAt: { $gte: fromDate, $lte: now },
      };
    }

    const monthlySales = await Order.aggregate([
      { $match: matchStage },
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

    let monthsToShow = monthNames;

    if (salesFilter === "last6") {
      const nowIdx = new Date().getMonth();
      monthsToShow = [];
      for (let i = 5; i >= 0; i--) {
        monthsToShow.push(monthNames[(nowIdx - i + 12) % 12]);
      }
    } else if (salesFilter === "last3") {
      const nowIdx = new Date().getMonth();
      monthsToShow = [];
      for (let i = 2; i >= 0; i--) {
        monthsToShow.push(monthNames[(nowIdx - i + 12) % 12]);
      }
    }

    const salesChartData = monthsToShow.map((month) => {
      const monthIndex = monthNames.indexOf(month) + 1;

      const found = monthlySales.find((m) => m._id === monthIndex);

      return {
        month,
        sales: found ? found.sales : 0,
      };
    });

    const totalUsers =
      totalCustomers + totalAdmins + totalCustomerService;

    const activityData = [
      {
        name: "Customers",
        value: totalCustomers,
        percent: totalUsers
          ? Math.round((totalCustomers / totalUsers) * 100)
          : 0,
        color: "#5b2ff5",
      },
      {
        name: "customer-service",
        value: totalCustomerService,
        percent: totalUsers
          ? Math.round((totalCustomerService / totalUsers) * 100)
          : 0,
        color: "#8e3fd6",
      },
      {
        name: "Admin",
        value: totalAdmins,
        percent: totalUsers
          ? Math.round((totalAdmins / totalUsers) * 100)
          : 0,
        color: "#c45cc9",
      },
    ];

    res.status(200).json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      salesChartData,
      activityData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
});

module.exports = router;