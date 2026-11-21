const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9+\s\-()]{7,20}$/;

const validDepartments = [
  'Engineering',
  'Product & Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance & Accounting',
  'Customer Operations'
];

const validStatuses = ['Active', 'On Leave', 'Terminated'];

// validate registration
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters';
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct form errors.',
      errors
    });
  }

  next();
};

// validate login
const validateLogin = (req, res, next) => {
  const identifier = (req.body.email || req.body.identifier || req.body.employeeId || '').trim();
  const { password } = req.body;
  const errors = {};

  if (!identifier) {
    errors.email = 'Email or Employee ID is required';
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.',
      errors
    });
  }

  next();
};

// validate employee data
const validateEmployee = (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    position,
    salary,
    status,
    dateOfJoining
  } = req.body;

  const errors = {};

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  } else if (firstName.trim().length > 40) {
    errors.firstName = 'First name cannot exceed 40 characters';
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  } else if (lastName.trim().length > 40) {
    errors.lastName = 'Last name cannot exceed 40 characters';
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email';
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(phone.trim())) {
    errors.phone = 'Please provide a valid phone number (min 7 digits)';
  }

  if (!department || typeof department !== 'string' || !validDepartments.includes(department.trim())) {
    errors.department = `Please select a department from: ${validDepartments.join(', ')}`;
  }

  if (!position || typeof position !== 'string' || position.trim().length === 0) {
    errors.position = 'Job title/position is required';
  } else if (position.trim().length > 60) {
    errors.position = 'Position cannot exceed 60 characters';
  }

  if (salary === undefined || salary === null || salary === '') {
    errors.salary = 'Salary is required';
  } else if (isNaN(Number(salary)) || Number(salary) < 0) {
    errors.salary = 'Salary must be a positive number';
  }

  if (status && !validStatuses.includes(status)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }

  if (dateOfJoining && isNaN(Date.parse(dateOfJoining))) {
    errors.dateOfJoining = 'Invalid date format';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Employee validation failed.',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEmployee
};
