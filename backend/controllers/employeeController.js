const Employee = require('../models/Employee');

// generate next sequential employee id
const generateEmployeeId = async () => {
  const allEmployees = await Employee.find({ employeeId: { $regex: /^EMP-\d+$/i } }, 'employeeId');
  let maxNum = 1000;
  for (const emp of allEmployees) {
    const match = emp.employeeId.match(/\d+$/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `EMP-${maxNum + 1}`;
};

// get employees with search, filter, and summary stats
const getEmployees = async (req, res, next) => {
  try {
    const { search, department, status, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    // search across multiple fields
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { position: regex },
        { employeeId: regex },
        { phone: regex }
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const employees = await Employee.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'name email');

    // calculate overview stats for dashboard
    const allEmployees = await Employee.find({});
    const totalCount = allEmployees.length;
    const activeCount = allEmployees.filter((e) => e.status === 'Active').length;
    const onLeaveCount = allEmployees.filter((e) => e.status === 'On Leave').length;
    const uniqueDepartments = [...new Set(allEmployees.map((e) => e.department))].length;
    const totalPayroll = allEmployees.reduce((acc, curr) => acc + (curr.salary || 0), 0);
    const averageSalary = totalCount > 0 ? Math.round(totalPayroll / totalCount) : 0;

    res.status(200).json({
      success: true,
      count: employees.length,
      stats: {
        totalEmployees: totalCount,
        activeEmployees: activeCount,
        onLeaveEmployees: onLeaveCount,
        departmentsCount: uniqueDepartments,
        averageSalary,
        totalPayroll
      },
      employees
    });
  } catch (error) {
    next(error);
  }
};

// get single employee by id
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('createdBy', 'name email');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    next(error);
  }
};

// add new employee
const createEmployee = async (req, res, next) => {
  try {
    let {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      dateOfJoining,
      status,
      address,
      password
    } = req.body;

    const existingEmail = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email already exists.',
        errors: { email: 'Email already in use' }
      });
    }

    if (!employeeId || employeeId.trim() === '') {
      employeeId = await generateEmployeeId();
    } else {
      employeeId = employeeId.trim().toUpperCase();
      const existingId = await Employee.findOne({ employeeId });
      if (existingId) {
        return res.status(400).json({
          success: false,
          message: `Employee ID "${employeeId}" is already taken.`,
          errors: { employeeId: 'ID already exists' }
        });
      }
    }

    const employee = await Employee.create({
      employeeId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: (req.body.password && req.body.password.trim()) || 'employee123',
      phone: phone.trim(),
      department: department.trim(),
      position: position.trim(),
      salary: Number(salary),
      dateOfJoining: dateOfJoining || new Date(),
      status: status || 'Active',
      address: address ? address.trim() : '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
};

// update employee
const updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      dateOfJoining,
      status,
      address,
      password
    } = req.body;

    if (email && email.toLowerCase().trim() !== employee.email) {
      const duplicateEmail = await Employee.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });
      if (duplicateEmail) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another employee.',
          errors: { email: 'Email already in use' }
        });
      }
    }

    if (employeeId && employeeId.trim().toUpperCase() !== employee.employeeId) {
      const duplicateId = await Employee.findOne({
        employeeId: employeeId.trim().toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (duplicateId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is already in use.',
          errors: { employeeId: 'ID already in use' }
        });
      }
    }

    employee.firstName = firstName ? firstName.trim() : employee.firstName;
    employee.lastName = lastName ? lastName.trim() : employee.lastName;
    employee.email = email ? email.toLowerCase().trim() : employee.email;
    employee.phone = phone ? phone.trim() : employee.phone;
    employee.department = department ? department.trim() : employee.department;
    employee.position = position ? position.trim() : employee.position;
    if (salary !== undefined && salary !== null) employee.salary = Number(salary);
    if (dateOfJoining) employee.dateOfJoining = dateOfJoining;
    if (status) employee.status = status;
    if (address !== undefined) employee.address = address.trim();
    if (password && password.trim().length >= 6) employee.password = password.trim();
    if (employeeId) employee.employeeId = employeeId.trim().toUpperCase();

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
};

// delete employee
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: `Employee "${employee.fullName}" (${employee.employeeId}) deleted successfully.`,
      deletedId: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
