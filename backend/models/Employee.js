const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [40, 'First name cannot exceed 40 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [40, 'Last name cannot exceed 40 characters']
    },
    email: {
      type: String,
      required: [true, 'Work email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      default: 'employee123',
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[0-9+\s\-()]{7,20}$/,
        'Please provide a valid phone number (digits, optional +, hyphens)'
      ]
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: [
          'Engineering',
          'Product & Design',
          'Marketing',
          'Sales',
          'Human Resources',
          'Finance & Accounting',
          'Customer Operations'
        ],
        message: '{VALUE} is not a valid department'
      }
    },
    position: {
      type: String,
      required: [true, 'Job position/title is required'],
      trim: true,
      maxlength: [60, 'Position cannot exceed 60 characters']
    },
    salary: {
      type: Number,
      required: [true, 'Annual salary is required'],
      min: [0, 'Salary must be a positive number']
    },
    dateOfJoining: {
      type: Date,
      required: [true, 'Date of joining is required'],
      default: Date.now
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'On Leave', 'Terminated'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Active'
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      default: 'employee'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash employee password before saving
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return enteredPassword === 'employee123';
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual property for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Employee', employeeSchema);
