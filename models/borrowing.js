const mongoose = require("mongoose");

const borrowingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    dueDate: {
      type: Date,
      required: true
    },

    returnDate: {
      type: Date,
      default: null
    },

    fine: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Borrowing", borrowingSchema);