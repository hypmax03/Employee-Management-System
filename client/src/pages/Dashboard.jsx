import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFormModal from '../components/EmployeeFormModal';
import ViewEmployeeModal from '../components/ViewEmployeeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Toast from '../components/Toast';
import { employeeService } from '../services/api';
import { Search, Plus, RefreshCw } from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Product & Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance & Accounting',
  'Customer Operations'
];

const STATUSES = ['All', 'Active', 'On Leave', 'Terminated'];

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (departmentFilter !== 'All') params.department = departmentFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const data = await employeeService.getAll(params);
      if (data.success) {
        setEmployees(data.employees || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showToast(err.response?.data?.message || 'Failed to fetch employee records', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, departmentFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        const res = await employeeService.update(editingEmployee._id, formData);
        if (res.success) {
          showToast(`Employee "${res.employee.firstName} ${res.employee.lastName}" updated successfully`);
          fetchEmployees();
          return { success: true };
        }
      } else {
        const res = await employeeService.create(formData);
        if (res.success) {
          showToast(`Employee "${res.employee.firstName} ${res.employee.lastName}" added successfully`);
          fetchEmployees();
          return { success: true };
        }
      }
    } catch (err) {
      const data = err.response?.data;
      return {
        success: false,
        message: data?.message || err.message || 'Error saving record',
        errors: data?.errors
      };
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (emp) => {
    setViewingEmployee(emp);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (emp) => {
    setDeletingEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setDeleteLoading(true);
    try {
      const res = await employeeService.delete(deletingEmployee._id);
      if (res.success) {
        showToast(res.message || 'Employee record deleted');
        setIsDeleteModalOpen(false);
        setDeletingEmployee(null);
        fetchEmployees();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete record', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('All');
    setStatusFilter('All');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0d', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAddModal={handleOpenAdd} />

      <main style={{
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '1.75rem 1.5rem'
      }}>
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Toolbar */}
        <div style={{
          backgroundColor: '#121217',
          border: '1px solid #242430',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem'
        }}>
          {/* Search */}
          <search style={{ flex: '1 1 260px', minWidth: '220px' }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ position: 'relative' }}>
              <label htmlFor="directory-search" className="visually-hidden">
                Search employees
              </label>
              <input
                type="search"
                id="directory-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, role, email, or ID..."
                style={{ paddingLeft: '2.4rem', minHeight: '40px', fontSize: '0.86rem' }}
              />
              <Search
                size={16}
                color="#facc15"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </form>
          </search>

          {/* Filters & Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap'
          }}>
            {/* Department */}
            <div style={{ minWidth: '150px' }}>
              <label htmlFor="dept-filter" className="visually-hidden">Department Filter</label>
              <select
                id="dept-filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{ minHeight: '40px', fontSize: '0.84rem', padding: '0.45rem 0.75rem' }}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div style={{ minWidth: '120px' }}>
              <label htmlFor="status-filter" className="visually-hidden">Status Filter</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ minHeight: '40px', fontSize: '0.84rem', padding: '0.45rem 0.75rem' }}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All Status' : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchEmployees}
              className="btn-secondary"
              style={{ minHeight: '40px', padding: '0.45rem 0.75rem' }}
              title="Refresh"
              aria-label="Refresh list"
            >
              <RefreshCw size={15} className={loading ? 'loading-spinner' : ''} />
            </button>

            {/* Add Employee */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn-primary"
              style={{ minHeight: '40px' }}
            >
              <Plus size={16} />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1c1c24',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#6e6e7c',
        backgroundColor: '#0c0c0f'
      }}>
        Employee Management System &copy; 2026
      </footer>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
      />

      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingEmployee(null);
        }}
        onEdit={handleOpenEdit}
        employee={viewingEmployee}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
        employee={deletingEmployee}
        loading={deleteLoading}
      />

      <Toast notification={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Dashboard;
