# St. Bakhita Library Management System

A modern, full-stack Library Management System built with the MERN stack (MongoDB, Express, React, Node.js). This system provides a complete solution for managing library operations including book catalog management, borrowing/returning books, fine management, and user administration.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Models](#database-models)
- [Scripts](#scripts)
- [Screenshots](#screenshots)

---

## Features

### For All Users
- **User Authentication**: Secure login and registration system
- **Book Catalog Search**: Search and browse books by title, author, ISBN, or genre
- **Borrow History**: View personal borrowing history
- **Fine Management**: View and track fines

### For Students
- Browse available books
- Borrow books (with customizable duration)
- Return borrowed books
- Renew books (extends due date by 7 days)
- View personal fines

### For Librarians
- All student features
- Add new books to the catalog
- Delete books from the catalog
- Process book returns
- View all borrowing history
- Manage fines (mark as paid)
- Access admin dashboard with statistics

### For Administrators
- All librarian features
- User management (create, update, delete users)
- Change user roles (Student, Librarian, Admin)
- System settings (configure fine rates)
- Dashboard with library statistics

---

## Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM (Object Data Modeling) |
| JWT | Authentication |
| bcryptjs | Password hashing |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| React Icons | Icon library |

---

## Project Structure

```
lib-mgmt-sys/
├── client/                    # React Frontend
│   ├── index.html            # HTML entry point
│   ├── package.json          # Client dependencies
│   ├── vite.config.js        # Vite configuration
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Main app component with routes
│       ├── index.css         # Global styles
│       ├── components/
│       │   └── Navbar.jsx    # Navigation component
│       ├── context/
│       │   └── AuthContext.jsx  # Authentication context
│       └── pages/
│           ├── Login.jsx     # Login page
│           ├── Register.jsx  # Registration page
│           ├── Dashboard.jsx # Dashboard page
│           ├── BookSearch.jsx # Book catalog & search
│           ├── BorrowHistory.jsx # Borrowing history
│           ├── FineManagement.jsx # Fine management
│           └── UserManagement.jsx # User management (Admin only)
│
└── server/                    # Node.js Backend
    ├── index.js              # Express app entry point
    ├── package.json          # Server dependencies
    ├── .env                  # Environment variables (create this)
    ├── controllers/          # Route handlers
    │   ├── authController.js     # Authentication logic
    │   ├── bookController.js     # Book CRUD operations
    │   ├── borrowController.js   # Borrow/return logic
    │   ├── categoryController.js # Category management
    │   ├── fineController.js     # Fine management
    │   ├── reportController.js   # Dashboard statistics
    │   ├── settingsController.js # System settings
    │   └── userController.js     # User management
    ├── middleware/
    │   └── auth.js           # JWT authentication & authorization
    ├── models/               # Mongoose schemas
    │   ├── User.js           # User model
    │   ├── Book.js           # Book model
    │   ├── BorrowRecord.js   # Borrowing records
    │   ├── Category.js       # Book categories
    │   ├── Fine.js           # Fine records
    │   └── Setting.js        # System settings
    ├── routes/               # Express routes
    │   ├── auth.js           # Auth routes
    │   ├── books.js          # Book routes
    │   ├── borrow.js         # Borrow routes
    │   ├── categories.js     # Category routes
    │   ├── fines.js          # Fine routes
    │   ├── reports.js        # Report routes
    │   ├── settings.js       # Settings routes
    │   └── users.js          # User routes
    └── scripts/              # Database seeding scripts
        ├── seedBooks.js
        ├── seedCategories.js
        ├── seedSettings.js
        └── verifyCount.js
```

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd lib-mgmt-sys
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/st_bakhita_library

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Fine Configuration (can be changed in settings)
FINE_RATE_PER_DAY=10
```

### Step 5: Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas:

```bash
# Local MongoDB (if installed)
mongod

# Or use MongoDB Atlas connection string in .env
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/st_bakhita_library
```

### Step 6: Seed Initial Data (Optional)

```bash
cd server

# Seed categories first
node scripts/seedCategories.js

# Then seed books
node scripts/seedBooks.js

# Seed system settings
node scripts/seedSettings.js
```

### Step 7: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/st_bakhita_library |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `JWT_EXPIRE` | Token expiration time | 1d |

### Fine Rate Settings

The daily fine rate can be configured through:
1. **Environment Variable**: Set `FINE_RATE_PER_DAY` in `.env`
2. **Admin Interface**: Navigate to Fines page and update the rate (Admin only)

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Student"  // Optional, default: Student
}

Response (201):
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Student"
    }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}

Response (200):
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Student"
    }
}
```

#### Get Current User
```
GET /auth/me
Headers: { "x-auth-token": "token" }

Response (200):
{
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Book Endpoints

#### Get All Books
```
GET /books?title=search&author=author&genre=Fiction
Headers: { "x-auth-token": "token" }

Response (200):
[
    {
        "_id": "book_id",
        "title": "The Great Adventure",
        "author": "J.K. Rowling",
        "ISBN": "978-1234567890-1",
        "genre": "Fiction",
        "status": "Available",
        "category_id": { "_id": "cat_id", "name": "Fiction" },
        "createdAt": "2024-01-01T00:00:00.000Z"
    }
]
```

#### Add Book (Admin/Librarian only)
```
POST /books
Headers: { "x-auth-token": "token" }
Content-Type: application/json

{
    "title": "New Book Title",
    "author": "Author Name",
    "ISBN": "978-1234567890-1",
    "genre": "Fiction",
    "category_id": "category_id"
}

Response (201):
{
    "_id": "new_book_id",
    "title": "New Book Title",
    ...
}
```

#### Update Book (Admin/Librarian only)
```
PUT /books/:id
Headers: { "x-auth-token": "token" }
Content-Type: application/json

{
    "title": "Updated Title",
    "author": "Updated Author"
}

Response (200):
{
    "_id": "book_id",
    "title": "Updated Title",
    ...
}
```

#### Delete Book (Admin/Librarian only)
```
DELETE /books/:id
Headers: { "x-auth-token": "token" }

Response (200):
{ "message": "Book deleted successfully" }
```

---

### Borrow Endpoints

#### Borrow a Book
```
POST /borrow/borrow
Headers: { "x-auth-token": "token" }
Content-Type: application/json

{
    "book_id": "book_id",
    "days": 14  // Duration in days (default: 14)
}

Response (201):
{
    "_id": "record_id",
    "user_id": "user_id",
    "book_id": "book_id",
    "borrow_date": "2024-01-15T00:00:00.000Z",
    "due_date": "2024-01-29T00:00:00.000Z",
    "status": "Active"
}
```

#### Return a Book
```
PUT /borrow/return/:id
Headers: { "x-auth-token": "token" }

Response (200):
{
    "message": "Book returned successfully",
    "record": {
        "_id": "record_id",
        "status": "Returned",
        "return_date": "2024-01-25T00:00:00.000Z"
    }
}
```

#### Renew a Book
```
PUT /borrow/renew/:id
Headers: { "x-auth-token": "token" }

Response (200):
{
    "_id": "record_id",
    "due_date": "2024-02-05T00:00:00.000Z"
}
```

#### Get Borrow History
```
GET /borrow/history
Headers: { "x-auth-token": "token" }

Response (200):
[
    {
        "_id": "record_id",
        "book_id": { "_id": "book_id", "title": "Book Title" },
        "user_id": { "_id": "user_id", "name": "User Name", "email": "user@email.com" },
        "borrow_date": "2024-01-15T00:00:00.000Z",
        "due_date": "2024-01-29T00:00:00.000Z",
        "status": "Active"
    }
]
```

---

### Fine Endpoints

#### Get Fines
```
GET /fines
Headers: { "x-auth-token": "token" }

Response (200):
[
    {
        "_id": "fine_id",
        "user_id": { "_id": "user_id", "name": "User Name", "email": "user@email.com" },
        "borrow_id": { "_id": "record_id", "book_id": { "title": "Book Title" } },
        "amount": 50,
        "paid_status": "Unpaid",
        "createdAt": "2024-01-30T00:00:00.000Z"
    }
]
```

#### Pay Fine (Admin/Librarian only)
```
PUT /fines/pay/:id
Headers: { "x-auth-token": "token" }

Response (200):
{
    "_id": "fine_id",
    "paid_status": "Paid"
}
```

---

### Category Endpoints

#### Get All Categories
```
GET /categories
Headers: { "x-auth-token": "token" }

Response (200):
[
    { "_id": "cat_id", "name": "Fiction" },
    { "_id": "cat_id", "name": "Science" }
]
```

#### Add Category (Admin/Librarian only)
```
POST /categories
Headers: { "x-auth-token": "token" }
Content-Type: application/json

{ "name": "New Category" }

Response (201):
{ "_id": "new_cat_id", "name": "New Category" }
```

#### Delete Category (Admin/Librarian only)
```
DELETE /categories/:id
Headers: { "x-auth-token": "token" }

Response (200):
{ "message": "Category deleted successfully" }
```

---

### User Endpoints (Admin only)

#### Get All Users
```
GET /users
Headers: { "x-auth-token": "token" }

Response (200):
[
    {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Student",
        "createdAt": "2024-01-01T00:00:00.000Z"
    }
]
```

#### Update User
```
PUT /users/:id
Headers: { "x-auth-token": "token" }
Content-Type: application/json

{
    "name": "Updated Name",
    "email": "updated@email.com",
    "role": "Librarian"
}

Response (200):
{
    "_id": "user_id",
    "name": "Updated Name",
    "email": "updated@email.com",
    "role": "Librarian"
}
```

#### Delete User
```
DELETE /users/:id
Headers: { "x-auth-token": "token" }

Response (200):
{ "message": "User deleted" }
```

---

### Report/Setting Endpoints

#### Get Dashboard Statistics (Admin/Librarian only)
```
GET /reports/stats
Headers: { "x-auth-token": "token" }

Response (200):
{
    "totalBooks": 150,
    "totalUsers": 50,
    "activeBorrows": 25,
    "totalFines": 500
}
```

#### Get Settings (Admin only)
```
GET /settings
Headers: { "x-auth-token": "token" }

Response (200):
[
    { "key": "fine_rate_per_day", "value": 10 }
]
```

#### Update Setting (Admin only)
```
POST /settings
Headers: { "x-auth-token": "token" }
Content-Type: application/json

{
    "key": "fine_rate_per_day",
    "value": 15
}

Response (200):
{
    "key": "fine_rate_per_day",
    "value": 15
}
```

---

## Frontend Documentation

### Tech Stack
- **React 18** with Functional Components and Hooks
- **React Router v6** for client-side routing
- **Context API** for state management (Auth)
- **Axios** for API requests
- **CSS Variables** for theming

### Theme Configuration
The application uses CSS variables defined in `src/index.css`:

```css
:root {
  --primary: #2563eb;           /* Primary brand color */
  --primary-hover: #1d4ed8;     /* Hover state color */
  --secondary: #64748b;         /* Secondary color */
  --bg: #f8fafc;               /* Background color */
  --card-bg: #ffffff;          /* Card background */
  --text: #1e293b;             /* Main text color */
  --text-light: #64748b;       /* Light text color */
  --error: #ef4444;            /* Error color */
  --success: #22c55e;          /* Success color */
  --border: #e2e8f0;           /* Border color */
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); /* Card shadow */
}
```

### Components

#### Navbar
The main navigation component that displays different links based on user role:
- **Public**: Login, Register
- **All authenticated**: Browse, My Books, Fines
- **Admin/Librarian**: Dashboard
- **Admin only**: User Management

#### AuthContext
Manages authentication state across the application:
- `user`: Current user object
- `loading`: Authentication loading state
- `login(email, password)`: Login function
- `register(name, email, password, role)`: Register function
- `logout()`: Logout function

### Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Login | `/login` | Public | User login form |
| Register | `/register` | Public | User registration form |
| Dashboard | `/` | All | User dashboard with role-based content |
| Dashboard | `/admin` | Admin/Librarian | Admin dashboard with statistics |
| Book Search | `/search` | All | Browse and search books |
| Borrow History | `/history` | All | View borrowing history |
| Fine Management | `/fines` | All | View and manage fines |
| User Management | `/users` | Admin | Manage all users |

---

## User Roles & Permissions

### Student
- Browse books
- Borrow available books
- Return books
- Renew books
- View personal history
- View personal fines

### Librarian
- All student permissions
- Add books
- Edit books
- Delete books
- View all borrowing history
- Process returns
- Manage fines (mark as paid)
- Access admin dashboard

### Admin
- All librarian permissions
- Create users
- Update user roles
- Delete users
- Configure system settings

---

## Database Models

### User
```javascript
{
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Librarian', 'Student'], default: 'Student' },
    createdAt: Date,
    updatedAt: Date
}
```

### Book
```javascript
{
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true, unique: true },
    genre: String,
    category_id: { type: ObjectId, ref: 'Category' },
    status: { type: String, enum: ['Available', 'Borrowed', 'Reserved'], default: 'Available' },
    createdAt: Date,
    updatedAt: Date
}
```

### BorrowRecord
```javascript
{
    user_id: { type: ObjectId, ref: 'User', required: true },
    book_id: { type: ObjectId, ref: 'Book', required: true },
    borrow_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
    return_date: Date,
    status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
    createdAt: Date,
    updatedAt: Date
}
```

### Fine
```javascript
{
    borrow_id: { type: ObjectId, ref: 'BorrowRecord', required: true },
    user_id: { type: ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paid_status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    createdAt: Date,
    updatedAt: Date
}
```

### Category
```javascript
{
    name: { type: String, required: true, unique: true },
    createdAt: Date,
    updatedAt: Date
}
```

### Setting
```javascript
{
    key: { type: String, required: true, unique: true },
    value: { type: Mixed, required: true },
    description: String,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Scripts

### Seed Categories
```bash
cd server
node scripts/seedCategories.js
```
Adds default categories like Fiction, Science, History, etc.

### Seed Books
```bash
cd server
node scripts/seedBooks.js
```
Generates 200 sample books with random titles, authors, and categories.

### Seed Settings
```bash
cd server
node scripts/seedSettings.js
```
Initializes system settings like `fine_rate_per_day`.

### Verify Count
```bash
cd server
node scripts/verifyCount.js
```
Displays the current count of documents in all collections.

---

## Screenshots

### Login Page
```
+-------------------------------+
|                               |
|         Login                 |
|                               |
|  Email Address    [__________]|
|  Password         [__________]|
|                               |
|     [ Login Button ]          |
|                               |
|  Don't have an account?       |
|  Register                     |
+-------------------------------+
```

### Dashboard (Admin)
```
+-------------------------------------------------------------+
| Welcome, Admin Name!                                        |
+-------------------------------------------------------------+
| +----------+ +----------+ +----------+ +----------+          |
| | TOTAL    | | TOTAL    | | ACTIVE   | | TOTAL    |          |
| |   BOOKS  | |   USERS  | | BORROWS  | |   FINES  |          |
| |    150   | |     50   | |     25   | |  KSh500  |          |
| +----------+ +----------+ +----------+ +----------+          |
+-------------------------------------------------------------+
| Recent Activity                                             |
| You have no recent activities to display.                   |
+-------------------------------------------------------------+
```

### Book Catalog
```
+-------------------------------------------------------------+
| Book Catalog                              [+ Add Book]       |
+-------------------------------------------------------------+
| [ Title... ] [ Author... ] [ Genre... ] [ Search]           |
+-------------------------------------------------------------+
| +---------------------------------------------------+       |
| | The Great Adventure                               |       |
| | by J.K. Rowling                                   |       |
| | [Available]  |  ISBN: 978-1234567890-1             |       |
| | Genre: Fiction                                    |       |
| |                                                   |       |
| | [ Borrow ]  [ Edit ]  [ Delete ]                  |       |
| +---------------------------------------------------+       |
| +---------------------------------------------------+       |
| | Shadow of the Moon                                |       |
| | by George R.R. Martin                             |       |
| | [Unavailable]  |  ISBN: 978-1234567890-2            |       |
| | Genre: Fantasy                                    |       |
| |                                                   |       |
| | [ Unavailable ]  [ Edit ]  [ Delete ]             |       |
| +---------------------------------------------------+       |
+-------------------------------------------------------------+
```

---

## Future Improvements

- Email notifications for due dates
- Book reservation system
- Advanced search with filters
- Book cover image upload
- Analytics and reporting dashboard
- Mobile responsive design improvements
- Dark mode support
- Multi-language support
- Book recommendations based on borrowing history
- Integration with external library systems

---

## License

This project is licensed under the ISC License.

---

## Author

Developed for St. Bakhita Library

---

## Acknowledgments

- React Team for the amazing React library
- MongoDB for the flexible database
- Open source community for various libraries used

