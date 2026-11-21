const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');
const { validateEmployee } = require('../middleware/validate');

// All routes require authentication
router.use(protect);

// Read-only routes available to all authenticated users (including employees)
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);

// Administrative operations restricted to admin/manager roles (employees cannot add, edit, or delete)
router.post('/', authorize('admin', 'manager', 'hr'), validateEmployee, createEmployee);
router.put('/:id', authorize('admin', 'manager', 'hr'), validateEmployee, updateEmployee);
router.delete('/:id', authorize('admin', 'manager', 'hr'), deleteEmployee);

module.exports = router;
