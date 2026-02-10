# Contributing Guidelines - St. Bakhita Library Management System

Thank you for your interest in contributing to the St. Bakhita Library Management System. These guidelines will help you set up your development environment and understand the standards we maintain.

## Environment Setup

The project uses the MERN stack (MongoDB, Express, React, Node.js). Follow these steps to get a local copy running.

### Prerequisites
- **Node.js**: Version 14 or higher.
- **MongoDB**: A running instance of MongoDB (Local or Atlas).
- **npm**: Package manager for installing dependencies.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd lib-mgmt-sys
   ```
2. **Setup Backend**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and configure the environment variables as described in the main README.
3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application
- **Backend**: In the `server` directory, run `npm run dev` to start the server with nodemon.
- **Frontend**: In the `client` directory, run `npm run dev` to start the Vite development server.

---

## Coding Standards

To maintain consistency across the codebase, please adhere to the following standards:

### JavaScript conventions
- We use modern JavaScript (ES6+) features.
- Follow the existing formatting and naming conventions (camelCase for variables and functions, PascalCase for components and models).
- Ensure code is well-commented, especially for complex logic in controllers and services.

### Backend Development
- All API routes should return consistent JSON responses.
- Implement proper error handling using try-catch blocks in controllers.
- Ensure that sensitive operations are protected by the appropriate middleware.

### Frontend Development
- Use functional components and hooks.
- Keep components focused and modular.
- Use CSS variables for styling to maintain theme consistency.

---

## The Contribution Process

1. **Create a Branch**: Create a new branch for each feature or bug fix. Use descriptive names like `feature/add-book-ratings` or `fix/login-error`.
2. **Implement and Test**: Write your code and perform manual verification as outlined in the Test Plan.
3. **Submit a Pull Request**: Provide a detailed description of your changes and why they are necessary. Ensure your branch is up to date with the main project before submitting.

## Reporting Issues

If you encounter a bug or have a suggestion for improvement, please open an issue in the project repository. Include clear steps to reproduce the issue and any relevant error messages or screenshots.
