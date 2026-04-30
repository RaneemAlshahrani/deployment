const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    customer: String,
    email: String,
    phone: String,
    orderNumber: String,
    subject: String,
    message: String,
    status: {
      type: String,
      default: "Pending",
    },
    date: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);