const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { validateEmployee } = require('../middleware/validate');

// All employee routes require JWT authentication
router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(validateEmployee, createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(validateEmployee, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
