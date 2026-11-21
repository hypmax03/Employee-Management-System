import React from 'react';
import { Eye, Edit2, Trash2, Mail, Search } from 'lucide-react';

const EmployeeTable = ({
  employees = [],
  loading = false,
  isAdmin = true,
  onView,
  onEdit,
  onDelete,
  onResetFilters
}) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'badge-active';
      case 'On Leave':
        return 'badge-leave';
      case 'Terminated':
        return 'badge-terminated';
      default:
        return 'badge-active';
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        backgroundColor: '#141419',
        border: '1px solid #252530',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem'
      }}>
        <div className="loading-spinner"></div>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
          Loading employees...
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        backgroundColor: '#141419',
        border: '1px dashed #2f2f3d',
        borderRadius: '10px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(250, 204, 21, 0.1)',
          color: '#facc15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <Search size={24} />
        </div>
        <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.4rem', fontWeight: 700 }}>
          No Employees Found
        </h3>
        <p style={{ color: '#8e8e99', fontSize: '0.86rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
          No records match your search or filter criteria. Try resetting filters or adding a new employee.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      role="region"
      aria-labelledby="employee-table-caption"
      className="table-wrapper"
    >
      <table>
        <caption id="employee-table-caption" className="visually-hidden">
          Employee Directory
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ width: '120px' }}>ID</th>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
            <th scope="col">Position</th>
            <th scope="col">Salary</th>
            <th scope="col">Joined</th>
            <th scope="col">Status</th>
            <th scope="col" style={{ textAlign: 'center', width: isAdmin ? '120px' : '70px' }}>
              {isAdmin ? 'Actions' : 'View'}
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              {/* Employee ID */}
              <td>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#facc15',
                  backgroundColor: 'rgba(250, 204, 21, 0.08)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(250, 204, 21, 0.25)'
                }}>
                  {emp.employeeId || 'N/A'}
                </span>
              </td>

              {/* Name & Email */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    backgroundColor: '#20202a',
                    border: '1px solid #323242',
                    color: '#facc15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    flexShrink: 0
                  }}>
                    {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#888894', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Mail size={12} />
                      <span>{emp.email}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Department */}
              <td>
                <span className="badge badge-dept">
                  {emp.department}
                </span>
              </td>

              {/* Position */}
              <td>
                <span style={{ fontWeight: 500, color: '#e4e4e7' }}>
                  {emp.position}
                </span>
              </td>

              {/* Salary */}
              <td>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: '#facc15',
                  fontSize: '0.9rem'
                }}>
                  {formatCurrency(emp.salary)}
                </span>
              </td>

              {/* Date of Joining */}
              <td>
                <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                  {formatDate(emp.dateOfJoining)}
                </span>
              </td>

              {/* Status */}
              <td>
                <span className={`badge ${getStatusBadgeClass(emp.status)}`}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'currentColor'
                  }} />
                  {emp.status}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => onView(emp)}
                    className="btn-icon"
                    title="View details"
                    aria-label={`View ${emp.firstName} ${emp.lastName}`}
                  >
                    <Eye size={16} />
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => onEdit(emp)}
                        className="btn-icon"
                        title="Edit record"
                        aria-label={`Edit ${emp.firstName} ${emp.lastName}`}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(emp)}
                        className="btn-icon btn-icon-danger"
                        title="Delete record"
                        aria-label={`Delete ${emp.firstName} ${emp.lastName}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
