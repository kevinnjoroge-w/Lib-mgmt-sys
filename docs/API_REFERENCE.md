# API Reference - St. Bakhita Library Management System

This document provides a detailed reference for all API endpoints in the Library Management System.

## Base URL
All API requests should be made to:
`http://localhost:5000/api`

## Authentication
Most endpoints require a valid JWT token. Include the token in the request header:
`x-auth-token: <your-jwt-token>`

---

## Authentication Endpoints

### Register User
`POST /auth/register`
- **Description**: Registers a new user.
- **Body**:
  ```json
  {
    "name": "Full Name",
    "email": "user@example.com",
    "password": "securepassword",
    "role": "Student"
  }
  ```
- **Response**: `201 Created` with token and user object.

### Login
`POST /auth/login`
- **Description**: Authenticates a user and returns a token.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `200 OK` with token and user object.

### Get Current User
`GET /auth/me`
- **Description**: Retrieves details of the currently authenticated user.
- **Response**: `200 OK` with user details.

---

## Book Endpoints

### Get All Books
`GET /books`
- **Description**: Fetches all books. Supports search parameters.
- **Query Params**: `title`, `author`, `genre`.
- **Response**: `200 OK` with an array of books.

### Add Book
`POST /books`
- **Access**: Librarian, Admin.
- **Body**: `title`, `author`, `ISBN`, `genre`, `category_id`.
- **Response**: `201 Created` with the new book object.

### Update Book
`PUT /books/:id`
- **Access**: Librarian, Admin.
- **Body**: Book fields to update.
- **Response**: `200 OK` with the updated book.

### Delete Book
`DELETE /books/:id`
- **Access**: Librarian, Admin.
- **Response**: `200 OK` with a success message.

---

## Borrowing Endpoints

### Borrow a Book
`POST /borrow/borrow`
- **Body**: `book_id`, `days` (optional).
- **Response**: `201 Created` with borrow record.

### Return a Book
`PUT /borrow/return/:id`
- **Description**: Marks a book as returned.
- **Response**: `200 OK` with updated record and message.

### Renew a Book
`PUT /borrow/renew/:id`
- **Description**: Extends the due date of an active borrow.
- **Response**: `200 OK` with updated record.

### Get History
`GET /borrow/history`
- **Description**: Fetches borrowing history for the user (or all if Librarian/Admin).
- **Response**: `200 OK` with an array of records.

---

## Fine Endpoints

### Get Fines
`GET /fines`
- **Description**: Fetches fines for the current user (or all if Librarian/Admin).
- **Response**: `200 OK` with an array of fines.

### Pay Fine
`PUT /fines/pay/:id`
- **Access**: Librarian, Admin.
- **Response**: `200 OK` with updated fine status.

---

## Category and User Management

### Categories
- `GET /categories`: List all categories.
- `POST /categories`: Create a new category (Librarian/Admin).
- `DELETE /categories/:id`: Delete a category (Librarian/Admin).

### Users (Admin Only)
- `GET /users`: List all users.
- `PUT /users/:id`: Update user details/role.
- `DELETE /users/:id`: Remove a user account.

---

## System Statistics and Settings

### Get Dashboard Stats
`GET /reports/stats`
- **Access**: Librarian, Admin.
- **Response**: `200 OK` with counts for books, users, borrows, and fines.

### Settings
- `GET /settings`: Fetch system settings (Admin).
- `POST /settings`: Update a system setting (Admin).
```json
{
  "key": "fine_rate_per_day",
  "value": 15
}
```
