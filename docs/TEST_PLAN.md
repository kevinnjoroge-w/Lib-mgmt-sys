# Test Plan - St. Bakhita Library Management System

This document outlines the testing strategy for the St. Bakhita Library Management System. The goal is to ensure stability, security, and a seamless user experience across all modules.

## Testing Strategy

The project employs a multi-layered testing approach to maintain high code quality and reliability.

### Unit Testing

Unit tests focus on individual components and functions in isolation.

#### Backend
- **Models**: Validate Mongoose schemas, ensuring required fields, unique constraints, and enum values are correctly enforced.
- **Controllers**: Test the logic within controller functions by mocking database interactions and verifying response codes and payloads.
- **Middleware**: Verify that authentication and authorization middleware correctly identify valid/invalid tokens and enforce role-based access.

#### Frontend
- **Components**: Test individual React components for correct rendering based on props.
- **Context API**: Ensure the AuthContext correctly manages and provides the authentication state to the rest of the application.
- **Utility Functions**: Test any helper functions used for date formatting, fine calculations, or data transformation.

### Integration Testing

Integration tests verify that different parts of the system work together correctly.

#### API Testing
- Verify that Express routes correctly map to their respective controller functions.
- Ensure that the database is correctly updated after successful API calls.
- Test error handling for scenarios such as database connection failures or invalid input data.

#### Frontend-Backend Communication
- Validate that the frontend correctly handles API responses, including success and various error states (400, 401, 403, 404, 500).
- Ensure that JWT tokens are correctly stored in local storage and included in successive requests.

### System and End-to-End Testing

These tests simulate real-world user scenarios to ensure the entire system functions as expected.

#### Key Scenarios
- **Authentication Flow**: Registration, login, and logout for different user roles.
- **Book Management**: Adding, editing, and deleting a book, then searching for it in the catalog.
- **Borrowing Process**: A student searching for a book, borrowing it, and then checking their borrow history.
- **Overdue Management**: Simulating an overdue return and verifying that a fine is correctly generated and manageable by a librarian.
- **User Administration**: An admin changing a user's role and verifying the updated permissions.

## Manual Verification Checklist

Before any major release or feature deployment, the following steps must be performed manually:

1. **Deployment Check**: Verify the application builds and runs without errors in a production-like environment.
2. **Cross-Browser Compatibility**: Test the frontend on major browsers (Chrome, Firefox, Safari, Edge).
3. **Responsive Design**: Ensure the UI is functional and visually appealing on mobile, tablet, and desktop screens.
4. **Security Audit**: Manually verify that protected routes cannot be accessed without proper authorization.
5. **Data Integrity**: Verify that data persists correctly across server restarts and database refreshes.

## Tools and Environment

- **Backend**: Node.js, Express, Jest (suggested for future implementation), Supertest.
- **Frontend**: Vite, React, Vitest (suggested for future implementation).
- **Database**: MongoDB (Local or Atlas).
- **API Testing**: Postman or Thunder Client for manual endpoint verification.
