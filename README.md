# 📚 Smart Library Management System

A modern **web-based Library Management System** designed for college libraries. The system helps students search and borrow books, manage their borrowing history, and calculate fines automatically. Administrators can manage the book collection and monitor borrowing activities.

---

## 🚀 Project Overview

Traditional library management can involve manual book searching, borrowing records, and difficulty tracking due dates.

The **Smart Library Management System** provides a simple and user-friendly web application that digitizes these activities.

### Main Objectives

- 📖 Make book searching easier
- 🔄 Provide real-time book availability
- 👨‍🎓 Allow students to borrow and return books
- 💰 Automatically calculate late-return fines
- 🛠️ Allow administrators to manage books
- 📊 Provide students with a personal library dashboard
- 🗃️ Store library data securely in MongoDB

---

## ✨ Features

### 👨‍🎓 Student Features

- User registration and login
- Search books by title, author, or category
- View book availability
- Borrow available books
- Return borrowed books
- View borrowing history
- View currently borrowed books
- View due dates
- Automatic fine calculation
- Personalized student dashboard

### 👨‍💼 Admin Features

- Admin login
- Add new books
- Update book information
- Delete books
- View total books
- View available copies
- View borrowing records
- Monitor student borrowing activities

---

## 🧮 Fine Calculation

The system provides a **14-day borrowing period**.

If a book is returned after the due date:

**Fine = Number of Late Days × ₹5**

Example:

```text
Late by 3 days
Fine = 3 × ₹5
Fine = ₹15
```

---

## 🏗️ System Architecture

```text
                 ┌──────────────────────┐
                 │      User Browser    │
                 │   HTML / CSS / JS    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    Node.js Server    │
                 │      Express.js      │
                 └──────────┬───────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        Auth Routes     Book Routes   Borrowing Routes
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                 ┌──────────────────────┐
                 │       MongoDB        │
                 │                      │
                 │  users               │
                 │  books               │
                 │  borrowings          │
                 └──────────────────────┘
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | User interface and styling |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| bcryptjs | Password hashing |
| MongoDB Compass | Database management |
| Git & GitHub | Version control |

---

## 📁 Project Structure

```text
Smart-Library/
│
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Borrowing.js
│
├── routes/
│   ├── auth.js
│   ├── books.js
│   └── borrowings.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
├── server.js
├── package.json
└── package-lock.json
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Smart-Library.git
```

### 2. Open the Project

```bash
cd Smart-Library
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:




> Do not upload the `.env` file to GitHub because it may contain sensitive configuration.

### 5. Start the Server

For development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

### 6. Open the Website

Open your browser and visit:

```text
http://localhost:5000
```

---

## 🗄️ Database

The project uses MongoDB with the following database:

```text
Smart_library
```

### Collections

```text
users
books
borrowings
```

### Users Collection

Stores:

- Name
- Email
- Password
- Role

### Books Collection

Stores:

- Title
- Author
- Category
- ISBN
- Quantity
- Available Copies

### Borrowings Collection

Stores:

- Student
- Book
- Issue Date
- Due Date
- Return Date
- Fine
- Status

---

## 🔐 Default Admin Account

For the prototype, a default administrator account is created automatically.

```text
Email: admin@library.com
Password: admin123
```

> For a production system, the default credentials should be changed and stronger authentication should be implemented.

---

## 📚 Sample Books

The system can contain books such as:

- Atomic Habits
- The Alchemist
- Rich Dad Poor Dad
- The Psychology of Money
- Harry Potter and the Philosopher's Stone
- Clean Code
- Introduction to Algorithms
- The Pragmatic Programmer

---

## 🔄 System Workflow

```text
User Registration
       ↓
     Login
       ↓
Search for Books
       ↓
Check Availability
       ↓
Borrow Book
       ↓
14-Day Borrowing Period
       ↓
Return Book
       ↓
Fine Calculation (if late)
       ↓
Borrowing History Updated
```

---

## 🌟 What Makes This System Different?

The system is designed specifically with **college library requirements** in mind.

Instead of providing a large and complex library platform, this project focuses on a simple and modern experience for students and administrators.

### Key Improvements

- 🎯 Student-focused interface
- ⚡ Simple and fast book search
- 📦 Real-time availability tracking
- 💰 Automatic fine calculation
- 📊 Personalized student dashboard
- 🛠️ Simple admin book management
- 📱 Responsive and modern UI
- 🗃️ Centralized MongoDB database

---

## 🔮 Future Enhancements

The following features can be added in future versions:

- 🔔 Due-date notifications
- 📧 Email reminders
- 📱 Mobile application
- 📊 Most-borrowed books analytics
- 🔍 Advanced category filters
- ⭐ Book ratings and reviews
- 📈 Reading statistics
- 📚 Book reservation system
- 📷 Barcode/QR-code scanning
- 🔐 JWT-based authentication
- 👥 Multiple librarian/admin roles

---

## 🧪 Project Evaluation

The prototype can be evaluated based on:

- Book search speed
- Ease of borrowing and returning
- Accuracy of availability information
- Accuracy of fine calculation
- User interface usability
- Database reliability
- Admin management efficiency

---

## 👨‍💻 Project Type

**Academic / College Mini Project**

### Domain

**Library Management**

### Application Type

**Web-Based Application**

---

## 📌 Conclusion

The Smart Library Management System provides a simple digital solution for managing college library activities. It reduces manual work, improves book availability tracking, simplifies borrowing and returning, and provides students with an easy-to-use library experience.

The system can be further expanded with notifications, analytics, reservations, barcode scanning, and mobile support.

---

## 📄 License

This project is developed for academic and educational purposes.
