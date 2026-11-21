# Employee Management System

Full-stack MERN application for managing employee records, built with React, Node.js, Express, MongoDB (Mongoose), and JWT authentication. Designed with a custom black and yellow theme.

---

## Features

- **Authentication**: User registration and login using JWT and bcrypt password hashing.
- **Protected Routes**: React Router route guarding requiring valid JWT authentication.
- **Employee CRUD**:
  - Add new employees with auto-generated sequential IDs (`EMP-XXXX`) or custom IDs.
  - View employee details in a modal dialog.
  - Update employee records.
  - Delete records with confirmation prompt.
- **RESTful APIs**: Complete backend endpoints for auth and employee management.
- **Mongoose Models**: Schemas for User and Employee with data validation and unique constraints.
- **Form Validation**:
  - Client-side validation using standard HTML attributes and `:user-invalid` styling.
  - Server-side validation middleware using Express.
  - Centralized Express error handler for duplicate keys (E11000) and validation errors.
- **Dynamic Database Search & Filter**:
  - Live search across name, email, department, position, and ID.
  - Filter by department and employment status.
  - Summary stats: Total Employees, Active Count, On Leave, Average Salary, and Total Payroll.
- **UI Theme**: Clean black and yellow theme with responsive tables and modal dialogs.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB server running on `mongodb://127.0.0.1:27017`

### 1. Database Setup & Seeding
From the `backend` folder, run the seed script to create the initial admin user and sample employee data:
```bash
cd backend
npm run seed
```

**Default Admin Credentials**:
- Email: `admin@apex.com`
- Password: `admin123`

### 2. Run the Backend Server
```bash
cd backend
npm run dev
```
The server will start on port `5000`.

### 3. Run the Frontend Client
In a separate terminal:
```bash
cd client
npm run dev
```
The React development server will start on `http://localhost:3000`.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user (requires Bearer token)

### Employees (All require Bearer token)
- `GET /api/employees` - Get all employees (supports `?search=`, `?department=`, `?status=`, `?sortBy=`, `?order=`)
- `POST /api/employees` - Create a new employee record
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee by ID
- `DELETE /api/employees/:id` - Delete employee by ID

---

## Project Structure

```
part 2/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── employeeController.js # Employee CRUD and stats
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Central error handler
│   │   └── validate.js           # Input validation
│   ├── models/
│   │   ├── Employee.js           # Employee model
│   │   └── User.js               # User model
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes
│   │   └── employeeRoutes.js     # Employee routes
│   ├── .env                      # Environment config
│   ├── package.json
│   ├── seed.js                   # Database seed script
│   └── server.js                 # Express server
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── DeleteConfirmModal.jsx
    │   │   ├── EmployeeFormModal.jsx
    │   │   ├── EmployeeTable.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatsCards.jsx
    │   │   ├── Toast.jsx
    │   │   └── ViewEmployeeModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```
