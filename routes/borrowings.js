const express = require("express");

const router = express.Router();

const Borrowing =
  require("../models/Borrowing");

const Book =
  require("../models/Book");

// ================================
// BORROW BOOK
// ================================

router.post("/borrow", async (req, res) => {
  try {
    const {
      userId,
      bookId
    } = req.body;

    const book =
      await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    if (book.available <= 0) {
      return res.status(400).json({
        message:
          "This book is currently unavailable."
      });
    }

    // Prevent same student from borrowing
    // same book twice at the same time

    const alreadyBorrowed =
      await Borrowing.findOne({
        userId,
        bookId,
        status: "borrowed"
      });

    if (alreadyBorrowed) {
      return res.status(400).json({
        message:
          "You already borrowed this book."
      });
    }

    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate() + 14
    );

    const borrowing =
      await Borrowing.create({
        userId,
        bookId,
        dueDate
      });

    book.available -= 1;

    await book.save();

    res.status(201).json({
      message:
        "Book borrowed successfully!",
      borrowing
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to borrow book."
    });
  }
});

// ================================
// USER BORROWINGS
// ================================

router.get(
  "/user/:userId",
  async (req, res) => {
    try {
      const borrowings =
        await Borrowing.find({
          userId: req.params.userId
        })
          .populate("bookId")
          .sort({ createdAt: -1 });

      res.json(borrowings);
    } catch (error) {
      res.status(500).json({
        message:
          "Unable to load borrowing history."
      });
    }
  }
);

// ================================
// RETURN BOOK
// ================================

router.put(
  "/return/:id",
  async (req, res) => {
    try {
      const borrowing =
        await Borrowing.findById(
          req.params.id
        );

      if (!borrowing) {
        return res.status(404).json({
          message:
            "Borrowing record not found."
        });
      }

      if (
        borrowing.status === "returned"
      ) {
        return res.status(400).json({
          message:
            "Book has already been returned."
        });
      }

      const returnDate = new Date();

      let fine = 0;

      if (
        returnDate > borrowing.dueDate
      ) {
        const difference =
          returnDate -
          borrowing.dueDate;

        const lateDays =
          Math.ceil(
            difference /
              (1000 * 60 * 60 * 24)
          );

        // ₹5 per late day

        fine = lateDays * 5;
      }

      borrowing.returnDate =
        returnDate;

      borrowing.fine = fine;

      borrowing.status =
        "returned";

      await borrowing.save();

      await Book.findByIdAndUpdate(
        borrowing.bookId,
        {
          $inc: {
            available: 1
          }
        }
      );

      res.json({
        message:
          "Book returned successfully!",
        fine
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Unable to return book."
      });
    }
  }
);

// ================================
// ALL BORROWINGS - ADMIN
// ================================

router.get(
  "/all",
  async (req, res) => {
    try {
      const borrowings =
        await Borrowing.find()
          .populate("userId", "name email")
          .populate("bookId", "title author")
          .sort({ createdAt: -1 });

      res.json(borrowings);
    } catch (error) {
      res.status(500).json({
        message:
          "Unable to load borrowing records."
      });
    }
  }
);

module.exports = router;