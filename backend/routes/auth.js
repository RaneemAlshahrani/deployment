const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const JWT_SECRET = process.env.JWT_SECRET || "bubble_secret_key_123";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bubble-profile-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// ================== SIGN UP ==================
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      role: "user",
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================== SIGN IN ==================
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================== GET PROFILE ==================
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================== UPDATE PROFILE ==================
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone, address },
      { new: true }
    ).select("-password");

    res.json({ user, message: "Profile updated successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================== UPLOAD PROFILE IMAGE ==================
router.post(
  "/profile/image",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const imageUrl = req.file.path;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { profileImage: imageUrl },
        { new: true }
      ).select("-password");

      res.json({ user, message: "Profile image updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// ================== CHANGE PASSWORD ==================
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ message: "Wrong password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;