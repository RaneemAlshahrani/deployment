// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

// Secret key for JWT (store in .env for production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_this";

// ==================== SIGN UP (Register) ====================
router.post(
  "/signup",
  [
    body("fullName")
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 2 })
      .withMessage("Full name must be at least 2 characters"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { fullName, email, password, phone, address, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || "",
        address: address || "",
        role: role || "user", // Default to "user" if not specified
      });

      await user.save();

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return user info (without password)
      res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during signup",
        error: error.message,
      });
    }
  }
);

// ==================== SIGN IN (Login) ====================
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return user info (without password)
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
        error: error.message,
      });
    }
  }
);

// ==================== GET USER PROFILE ====================
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching profile" 
    });
  }
});

// ==================== UPDATE USER PROFILE ====================
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    
    // Build update object
    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error updating profile" 
    });
  }
});

// ==================== CHANGE PASSWORD ====================
router.put(
  "/change-password",
  authenticateToken,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      
      // Get user with password
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password
      user.password = hashedPassword;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error changing password",
      });
    }
  }
);

// ==================== VERIFY TOKEN ====================
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

// ==================== LOGOUT ====================
router.post("/logout", authenticateToken, async (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  // You can implement token blacklisting here if needed
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// ==================== GET ALL USERS (Admin only) ====================
router.get("/users", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
    });
  }
});

// ==================== DELETE USER (Admin only) ====================
router.delete("/users/:userId", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    
    // Don't allow deleting yourself
    if (req.params.userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting user",
    });
  }
});

module.exports = router;