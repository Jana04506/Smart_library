let currentUser =
  JSON.parse(
    localStorage.getItem("libraryUser")
  ) || null;


// =================================
// INITIAL LOAD
// =================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateNavigation();

    loadBooks();

    updateHomeStats();

    if (currentUser) {

      if (
        currentUser.role === "admin"
      ) {
        showSection("admin");
      }

      updateUserInfo();
    }
  }
);


// =================================
// NAVIGATION
// =================================

function showSection(id) {

  document
    .querySelectorAll(".section")
    .forEach(section => {

      section.classList.remove(
        "active"
      );

    });

  const section =
    document.getElementById(id);

  if (section) {
    section.classList.add("active");
  }

  if (id === "books") {
    loadBooks();
  }

  if (id === "dashboard") {

    if (!currentUser) {

      showSection("login");

      showToast(
        "Please login to view your library."
      );

      return;
    }

    if (
      currentUser.role === "admin"
    ) {

      showSection("admin");

      return;
    }

    updateUserInfo();

    loadMyBooks();
  }

  if (id === "admin") {

    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {

      showSection("login");

      showToast(
        "Admin login required."
      );

      return;
    }

    loadAdminBooks();
  }
}


// =================================
// REGISTER
// =================================

async function register() {

  const name =
    document.getElementById(
      "registerName"
    ).value.trim();

  const email =
    document.getElementById(
      "registerEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "registerPassword"
    ).value;

  const message =
    document.getElementById(
      "registerMessage"
    );

  if (!name || !email || !password) {

    message.innerText =
      "Please fill all fields.";

    return;
  }

  try {

    const response =
      await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

    const data =
      await response.json();

    message.innerText =
      data.message;

    if (response.ok) {

      showToast(
        "Account created successfully!"
      );

      setTimeout(
        () => showSection("login"),
        800
      );
    }

  } catch (error) {

    message.innerText =
      "Server connection failed.";
  }
}


// =================================
// LOGIN
// =================================

async function login() {

  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "loginPassword"
    ).value;

  const message =
    document.getElementById(
      "loginMessage"
    );

  if (!email || !password) {

    message.innerText =
      "Please enter email and password.";

    return;
  }

  try {

    const response =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

    const data =
      await response.json();

    message.innerText =
      data.message;

    if (response.ok) {

      currentUser = data.user;

      localStorage.setItem(
        "libraryUser",
        JSON.stringify(currentUser)
      );

      updateNavigation();

      showToast(
        `Welcome, ${currentUser.name}!`
      );

      if (
        currentUser.role === "admin"
      ) {

        showSection("admin");

      } else {

        showSection("dashboard");

      }
    }

  } catch (error) {

    message.innerText =
      "Server connection failed.";
  }
}


// =================================
// LOGOUT
// =================================

function logout() {

  currentUser = null;

  localStorage.removeItem(
    "libraryUser"
  );

  updateNavigation();

  showToast(
    "You have been logged out."
  );

  showSection("home");
}


// =================================
// UPDATE NAVIGATION
// =================================

function updateNavigation() {

  const login =
    document.getElementById(
      "navLogin"
    );

  const register =
    document.getElementById(
      "navRegister"
    );

  const logoutButton =
    document.getElementById(
      "logoutBtn"
    );

  if (currentUser) {

    login.classList.add("hidden");

    register.classList.add(
      "hidden"
    );

    logoutButton.classList.remove(
      "hidden"
    );

  } else {

    login.classList.remove(
      "hidden"
    );

    register.classList.remove(
      "hidden"
    );

    logoutButton.classList.add(
      "hidden"
    );
  }
}


// =================================
// LOAD BOOKS
// =================================

async function loadBooks() {

  try {

    const response =
      await fetch(
        "/api/books"
      );

    const books =
      await response.json();

    displayBooks(books);

    updateHomeBookCount(
      books.length
    );

  } catch (error) {

    console.error(error);
  }
}


// =================================
// SEARCH
// =================================

async function searchBooks() {

  const query =
    document.getElementById(
      "searchInput"
    ).value.trim();

  try {

    const response =
      await fetch(
        `/api/books/search?q=${encodeURIComponent(
          query
        )}`
      );

    const books =
      await response.json();

    displayBooks(books);

  } catch (error) {

    console.error(error);
  }
}


// =================================
// DISPLAY BOOKS
// =================================

function displayBooks(books) {

  const container =
    document.getElementById(
      "bookList"
    );

  if (!books.length) {

    container.innerHTML = `
      <div class="content-card">
        <h3>No books found</h3>
        <p style="color:#718096;margin-top:8px">
          Try another search.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    books.map(book => `

      <div class="book-card">

        <div class="book-top">

          <div class="book-icon">
            📖
          </div>

          <span class="category">
            ${escapeHTML(book.category)}
          </span>

        </div>

        <h3>
          ${escapeHTML(book.title)}
        </h3>

        <p class="author">
          by ${escapeHTML(book.author)}
        </p>

        <div class="book-info">

          <span>
            ${
              book.available > 0
                ? `<span class="available">
                    ${book.available} available
                   </span>`
                : `<span class="unavailable">
                    Not available
                   </span>`
            }
          </span>

          <span>
            ${book.quantity} copies
          </span>

        </div>

        ${
          book.available > 0
            ? `
              <button
                class="primary-btn full"
                onclick="borrowBook('${book._id}')"
              >
                Borrow Book →
              </button>
            `
            : `
              <button
                class="outline-btn full"
                disabled
              >
                Currently Unavailable
              </button>
            `
        }

      </div>

    `).join("");
}


// =================================
// BORROW
// =================================

async function borrowBook(
  bookId
) {

  if (!currentUser) {

    showToast(
      "Please login first."
    );

    showSection("login");

    return;
  }

  try {

    const response =
      await fetch(
        "/api/borrowings/borrow",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            userId:
              currentUser.id,

            bookId
          })
        }
      );

    const data =
      await response.json();

    showToast(
      data.message
    );

    if (response.ok) {

      loadBooks();

      loadMyBooks();
    }

  } catch (error) {

    showToast(
      "Unable to borrow book."
    );
  }
}


// =================================
// USER INFO
// =================================

function updateUserInfo() {

  const element =
    document.getElementById(
      "userInfo"
    );

  if (!currentUser) {

    element.innerText =
      "Login to view your books.";

    return;
  }

  element.innerText =
    `Welcome back, ${currentUser.name}. Here is your current reading activity.`;
}


// =================================
// LOAD MY BOOKS
// =================================

async function loadMyBooks() {

  if (!currentUser) {
    return;
  }

  try {

    const response =
      await fetch(
        `/api/borrowings/user/${currentUser.id}`
      );

    const borrowings =
      await response.json();

    const container =
      document.getElementById(
        "myBooks"
      );

    let active = 0;
    let totalFine = 0;

    borrowings.forEach(item => {

      if (
        item.status === "borrowed"
      ) {
        active++;
      }

      totalFine +=
        item.fine || 0;
    });

    document.getElementById(
      "borrowedCount"
    ).innerText =
      borrowings.length;

    document.getElementById(
      "activeCount"
    ).innerText =
      active;

    document.getElementById(
      "fineCount"
    ).innerText =
      `₹${totalFine}`;

    if (!borrowings.length) {

      container.innerHTML = `
        <div style="
          padding:40px;
          text-align:center;
          color:#718096;
        ">
          <div style="font-size:35px">
            📚
          </div>

          <h3 style="
            margin-top:12px;
            color:#172033;
          ">
            Your shelf is empty
          </h3>

          <p style="margin-top:6px">
            Explore our collection and borrow
            your first book.
          </p>
        </div>
      `;

      return;
    }

    container.innerHTML =
      borrowings.map(item => {

        const dueDate =
          new Date(
            item.dueDate
          ).toLocaleDateString();

        return `

          <div class="borrow-card">

            <div class="borrow-details">

              <h3>
                📖
                ${escapeHTML(
                  item.bookId.title
                )}
              </h3>

              <p>
                Author:
                ${escapeHTML(
                  item.bookId.author
                )}
              </p>

              <p>
                Due:
                ${dueDate}
              </p>

              <p>
                Fine:
                ₹${item.fine || 0}
              </p>

            </div>

            <div>

              ${
                item.status ===
                "borrowed"

                  ? `
                    <button
                      class="primary-btn"
                      onclick="returnBook('${item._id}')"
                    >
                      Return
                    </button>
                  `

                  : `
                    <span class="status-badge">
                      Returned
                    </span>
                  `
              }

            </div>

          </div>

        `;

      }).join("");

  } catch (error) {

    console.error(error);
  }
}


// =================================
// RETURN BOOK
// =================================

async function returnBook(
  borrowingId
) {

  try {

    const response =
      await fetch(
        `/api/borrowings/return/${borrowingId}`,
        {
          method: "PUT"
        }
      );

    const data =
      await response.json();

    showToast(
      `${data.message} Fine: ₹${
        data.fine || 0
      }`
    );

    if (response.ok) {

      loadMyBooks();

      loadBooks();
    }

  } catch (error) {

    showToast(
      "Unable to return book."
    );
  }
}


// =================================
// ADMIN - ADD BOOK
// =================================

async function addBook() {

  const title =
    document.getElementById(
      "bookTitle"
    ).value.trim();

  const author =
    document.getElementById(
      "bookAuthor"
    ).value.trim();

  const category =
    document.getElementById(
      "bookCategory"
    ).value.trim();

  const isbn =
    document.getElementById(
      "bookISBN"
    ).value.trim();

  const quantity =
    Number(
      document.getElementById(
        "bookQuantity"
      ).value
    );

  if (
    !title ||
    !author ||
    !category ||
    !isbn ||
    quantity < 1
  ) {

    showToast(
      "Please fill all book details."
    );

    return;
  }

  try {

    const response =
      await fetch(
        "/api/books",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            title,
            author,
            category,
            isbn,
            quantity
          })
        }
      );

    const data =
      await response.json();

    showToast(
      data.message
    );

    if (response.ok) {

      document.getElementById(
        "bookTitle"
      ).value = "";

      document.getElementById(
        "bookAuthor"
      ).value = "";

      document.getElementById(
        "bookCategory"
      ).value = "";

      document.getElementById(
        "bookISBN"
      ).value = "";

      document.getElementById(
        "bookQuantity"
      ).value = "";

      loadAdminBooks();

      loadBooks();
    }

  } catch (error) {

    showToast(
      "Unable to add book."
    );
  }
}


// =================================
// ADMIN - LOAD BOOKS
// =================================

async function loadAdminBooks() {

  try {

    const response =
      await fetch(
        "/api/books"
      );

    const books =
      await response.json();

    const container =
      document.getElementById(
        "adminBookList"
      );

    let total = 0;
    let available = 0;

    books.forEach(book => {

      total += book.quantity;

      available += book.available;

    });

    document.getElementById(
      "adminTotalBooks"
    ).innerText =
      total;

    document.getElementById(
      "adminAvailableBooks"
    ).innerText =
      available;

    if (!books.length) {

      container.innerHTML =
        "<p>No books in collection.</p>";

      return;
    }

    container.innerHTML =
      books.map(book => `

        <div class="admin-book-item">

          <div>

            <h3>
              ${escapeHTML(book.title)}
            </h3>

            <p>
              ${escapeHTML(book.author)}
              ·
              ${book.available}/${book.quantity}
              available
            </p>

          </div>

          <button
            class="delete-btn"
            onclick="deleteBook('${book._id}')"
          >
            Delete
          </button>

        </div>

      `).join("");

  } catch (error) {

    console.error(error);
  }
}


// =================================
// DELETE BOOK
// =================================

async function deleteBook(
  bookId
) {

  const confirmDelete =
    confirm(
      "Are you sure you want to delete this book?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    const response =
      await fetch(
        `/api/books/${bookId}`,
        {
          method: "DELETE"
        }
      );

    const data =
      await response.json();

    showToast(
      data.message
    );

    loadAdminBooks();

    loadBooks();

  } catch (error) {

    showToast(
      "Unable to delete book."
    );
  }
}


// =================================
// HOME STATISTICS
// =================================

async function updateHomeStats() {

  try {

    const response =
      await fetch(
        "/api/books"
      );

    const books =
      await response.json();

    updateHomeBookCount(
      books.length
    );

  } catch (error) {

    console.error(error);
  }
}

function updateHomeBookCount(
  count
) {

  const element =
    document.getElementById(
      "homeBookCount"
    );

  if (element) {
    element.innerText =
      count;
  }
}


// =================================
// TOAST
// =================================

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );

  toast.innerText =
    message;

  toast.classList.add(
    "show"
  );

  setTimeout(
    () => {
      toast.classList.remove(
        "show"
      );
    },
    3000
  );
}


// =================================
// SECURITY - HTML ESCAPE
// =================================

function escapeHTML(
  value
) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}