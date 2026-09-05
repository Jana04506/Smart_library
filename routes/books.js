const express = require("express");

const router = express.Router();

const Book = require("../models/Book");

// ================================
// GET ALL BOOKS
// ================================

router.get("/", async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load books."
    });
  }
});

// ================================
// SEARCH BOOKS
// ================================

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    const books = await Book.find({
      $or: [
        {
          title: {
            $regex: q,
            $options: "i"
          }
        },
        {
          author: {
            $regex: q,
            $options: "i"
          }
        },
        {
          category: {
            $regex: q,
            $options: "i"
          }
        }
      ]
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Search failed."
    });
  }
});

// ================================
// ADD BOOK
// ================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      isbn,
      quantity
    } = req.body;

    if (
      !title ||
      !author ||
      !category ||
      !isbn ||
      !quantity
    ) {
      return res.status(400).json({
        message: "Please fill all book fields."
      });
    }

    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      return res.status(400).json({
        message: "A book with this ISBN already exists."
      });
    }

    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      quantity,
      available: quantity
    });

    res.status(201).json({
      message: "Book added successfully!",
      book
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to add book."
    });
  }
});

// ================================
// UPDATE BOOK
// ================================

router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    const {
      title,
      author,
      category,
      quantity
    } = req.body;

    const borrowedCopies =
      book.quantity - book.available;

    if (quantity < borrowedCopies) {
      return res.status(400).json({
        message:
          "Quantity cannot be less than currently borrowed copies."
      });
    }

    book.title = title;
    book.author = author;
    book.category = category;
    book.quantity = quantity;

    book.available =
      quantity - borrowedCopies;

    await book.save();

    res.json({
      message: "Book updated successfully!",
      book
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update book."
    });
  }
});

// ================================
// DELETE BOOK
// ================================

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    if (book.available !== book.quantity) {
      return res.status(400).json({
        message:
          "Cannot delete a book while copies are borrowed."
      });
    }

    await Book.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Book deleted successfully!"
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete book."
    });
  }
});

module.exports = router;