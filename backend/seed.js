const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Employee = require('./models/Employee');

dotenv.config();

const sampleEmployees = [
  {
    employeeId: 'EMP-1001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@apexems.com',
    phone: '+1 555-234-8901',
    department: 'Engineering',
    position: 'Backend Developer',
    salary: 85000,
    dateOfJoining: new Date('2022-03-15'),
    status: 'Active',
    address: '742 Evergreen Terrace, Seattle, WA'
  },
  {
    employeeId: 'EMP-1002',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@apexems.com',
    phone: '+1 555-872-4411',
    department: 'Product & Design',
    position: 'UI/UX Designer',
    salary: 78000,
    dateOfJoining: new Date('2022-07-01'),
    status: 'Active',
    address: '404 Innovation Way, Austin, TX'
  },
  {
    employeeId: 'EMP-1003',
    firstName: 'Devon',
    lastName: 'Chen',
    email: 'devon.chen@apexems.com',
    phone: '+1 555-431-7729',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 80000,
    dateOfJoining: new Date('2023-01-10'),
    status: 'Active',
    address: '12 Harbor Blvd, San Francisco, CA'
  },
  {
    employeeId: 'EMP-1004',
    firstName: 'Amara',
    lastName: 'Okonkwo',
    email: 'amara.okonkwo@apexems.com',
    phone: '+1 555-667-3120',
    department: 'Human Resources',
    position: 'HR Executive',
    salary: 65000,
    dateOfJoining: new Date('2021-11-20'),
    status: 'Active',
    address: '55 Pine Needle Lane, Boston, MA'
  },
  {
    employeeId: 'EMP-1005',
    firstName: 'Julian',
    lastName: 'Sterling',
    email: 'julian.sterling@apexems.com',
    phone: '+1 555-901-4456',
    department: 'Finance & Accounting',
    position: 'Accountant',
    salary: 72000,
    dateOfJoining: new Date('2023-05-18'),
    status: 'Active',
    address: '88 Wall Street, New York, NY'
  },
  {
    employeeId: 'EMP-1006',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    email: 'sophia.rodriguez@apexems.com',
    phone: '+1 555-312-9988',
    department: 'Marketing',
    position: 'Marketing Specialist',
    salary: 68000,
    dateOfJoining: new Date('2023-09-01'),
    status: 'On Leave',
    address: '320 Sunset Strip, Los Angeles, CA'
  },
  {
    employeeId: 'EMP-1007',
    firstName: 'Tariq',
    lastName: 'Mansoor',
    email: 'tariq.mansoor@apexems.com',
    phone: '+1 555-789-1123',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 70000,
    dateOfJoining: new Date('2022-10-14'),
    status: 'Active',
    address: '190 Peachtree St, Atlanta, GA'
  },
  {
    employeeId: 'EMP-1008',
    firstName: 'Chloe',
    lastName: 'Dubois',
    email: 'chloe.dubois@apexems.com',
    phone: '+1 555-456-7812',
    department: 'Customer Operations',
    position: 'Support Specialist',
    salary: 58000,
    dateOfJoining: new Date('2024-02-01'),
    status: 'Active',
    address: '22 Elm Street, Chicago, IL'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_management_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // create default admin if not existing
    let admin = await User.findOne({ email: 'admin@apex.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Alex Mercer',
        email: 'admin@apex.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created default admin: admin@apex.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // seed employees if table is empty
    const count = await Employee.countDocuments();
    if (count === 0) {
      const preparedEmployees = sampleEmployees.map((emp) => ({
        ...emp,
        createdBy: admin._id
      }));
      await Employee.insertMany(preparedEmployees);
      console.log(`Seeded ${preparedEmployees.length} employees`);
    } else {
      console.log(`Database already has ${count} employees`);
    }

    console.log('Database seeding finished');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
