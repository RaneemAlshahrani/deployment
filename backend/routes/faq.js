const express = require("express");
const router = express.Router();
const FAQ = require("../models/Faq");

// GET all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD FAQ
router.post("/", async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE FAQ
router.put("/:id", async (req, res) => {
  try {
    const updated = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE FAQ
router.delete("/:id", async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;