const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();

const User = require("./models/User");
const Book = require("./models/Book");

const authRoutes =
  require("./routes/auth");

const bookRoutes =
  require("./routes/books");

const borrowingRoutes =
  require("./routes/borrowings");

// ================================
// MIDDLEWARE
// ================================

app.use(cors());

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// ================================
// API ROUTES
// ================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/books",
  bookRoutes
);

app.use(
  "/api/borrowings",
  borrowingRoutes
);

// ================================
// CREATE DEFAULT ADMIN
// ================================

async function createDefaultAdmin() {
  try {
    const admin =
      await User.findOne({
        email: "admin@library.com"
      });

    if (!admin) {
      const password =
        await bcrypt.hash(
          "admin123",
          10
        );

      await User.create({
        name: "Library Admin",
        email: "admin@library.com",
        password,
        role: "admin"
      });

      console.log(
        "Default admin created."
      );

      console.log(
        "Email: admin@library.com"
      );

      console.log(
        "Password: admin123"
      );
    }
  } catch (error) {
    console.log(
      "Admin creation error:",
      error.message
    );
  }
}

// ================================
// DATABASE CONNECTION
// ================================

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(async () => {
    console.log(
      "MongoDB connected successfully"
    );

    await createDefaultAdmin();

    app.listen(
      process.env.PORT,
      () => {
        console.log(
          `Server running at http://localhost:${process.env.PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );
  });