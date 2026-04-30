const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

// GET all tickets
router.get("/", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

// ADD ticket
router.post("/", async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.json(ticket);
});

// UPDATE status
router.put("/:id", async (req, res) => {
  const updated = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;