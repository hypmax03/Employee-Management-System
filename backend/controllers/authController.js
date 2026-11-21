const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_apex_ems_jwt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// register new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
        errors: { email: 'Email already exists' }
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'admin'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// login user or employee
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const identifier = (email || req.body.identifier || req.body.employeeId || '').trim();

    // 1. Check if identifier is in User collection (admin/manager/hr)
    const user = await User.findOne({ email: identifier.toLowerCase() }).select('+password');
    if (user) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/ID or password'
        });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'admin'
        }
      });
    }

    // 2. Check if identifier is in Employee collection (by email or employeeId)
    const employee = await Employee.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { employeeId: identifier.toUpperCase() }
      ]
    }).select('+password');

    if (employee) {
      const isMatch = await employee.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/ID or password'
        });
      }

      const token = generateToken(employee._id);
      return res.status(200).json({
        success: true,
        message: 'Employee login successful',
        token,
        user: {
          id: employee._id,
          name: employee.fullName,
          email: employee.email,
          role: 'employee',
          employeeId: employee.employeeId,
          department: employee.department,
          position: employee.position
        }
      });
    }

    // If neither matched
    return res.status(401).json({
      success: false,
      message: 'Invalid email/ID or password'
    });
  } catch (error) {
    next(error);
  }
};

// get current user or employee profile
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    }

    const employee = await Employee.findById(req.user.id);
    if (employee) {
      return res.status(200).json({
        success: true,
        user: {
          id: employee._id,
          name: employee.fullName,
          email: employee.email,
          role: 'employee',
          employeeId: employee.employeeId,
          department: employee.department,
          position: employee.position,
          createdAt: employee.createdAt
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
