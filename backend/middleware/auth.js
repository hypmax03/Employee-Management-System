const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_apex_ems_jwt_key_2026_secure'
    );

    // 1. Check if token belongs to User (admin/manager/hr)
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      return next();
    }

    // 2. Check if token belongs to Employee
    const employee = await Employee.findById(decoded.id).select('-password');
    if (employee) {
      req.user = {
        _id: employee._id,
        id: employee._id,
        name: employee.fullName,
        email: employee.email,
        role: 'employee',
        employeeId: employee.employeeId,
        department: employee.department
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Account not found or deleted.'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

// role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role "${req.user ? req.user.role : 'unauthorized'}" is not permitted to perform this action. Administrator access required.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
