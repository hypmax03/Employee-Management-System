import React, { useState, useEffect, useRef } from 'react';
import { X, Check, AlertCircle, Edit2, Plus } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Product & Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance & Accounting',
  'Customer Operations'
];

const STATUSES = ['Active', 'On Leave', 'Terminated'];

const EmployeeFormModal = ({ isOpen, onClose, onSubmit, employee = null }) => {
  const dialogRef = useRef(null);
  const isEdit = !!employee;

  const initialFormData = {
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: '',
    salary: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    status: 'Active',
    address: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || 'Engineering',
        position: employee.position || '',
        salary: employee.salary !== undefined ? employee.salary : '',
        dateOfJoining: employee.dateOfJoining
          ? new Date(employee.dateOfJoining).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: employee.status || 'Active',
        address: employee.address || '',
        password: ''
      });
    } else {
      setFormData(initialFormData);
    }
    setFormError(null);
    setServerFieldErrors({});
  }, [employee, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handlePointerDown = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const r = dialog.getBoundingClientRect();
    const isOutside =
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom;
    if (isOutside) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverFieldErrors[name]) {
      setServerFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setServerFieldErrors({});
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary)
      };

      const result = await onSubmit(payload);
      if (result && !result.success) {
        setFormError(result.message || 'Please correct the form errors.');
        if (result.errors) {
          setServerFieldErrors(result.errors);
        }
      } else {
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Save failed';
      setFormError(msg);
      if (err.response?.data?.errors) {
        setServerFieldErrors(err.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onPointerDown={handlePointerDown}
      aria-labelledby="modal-employee-title"
      style={{
        maxWidth: '660px',
        padding: 0,
        backgroundColor: '#121217',
        border: '1px solid #2a2a38',
        borderRadius: '12px',
        color: '#f4f4f6'
      }}
    >
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #22222d',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <h2
              id="modal-employee-title"
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ color: '#facc15' }}>
                {isEdit ? <Edit2 size={18} /> : <Plus size={18} />}
              </span>
              <span>{isEdit ? 'Edit Employee' : 'Add Employee'}</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#888896', marginTop: '0.2rem' }}>
              {isEdit
                ? `Updating details for ${employee.firstName} ${employee.lastName}`
                : 'Fill in the details below to add a new employee.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 0.9rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>{formError}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* First Name */}
            <div>
              <label htmlFor="emp-firstName" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                First Name <span style={{ color: '#facc15' }}>*</span>
              </label>
              <input
                type="text"
                id="emp-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                maxLength={40}
                placeholder="Marcus"
                autoComplete="given-name"
                className={serverFieldErrors.firstName ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.firstName || 'First name is required'}</span>
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="emp-lastName" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Last Name <span style={{ color: '#facc15' }}>*</span>
              </label>
              <input
                type="text"
                id="emp-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                maxLength={40}
                placeholder="Vance"
                autoComplete="family-name"
                className={serverFieldErrors.lastName ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.lastName || 'Last name is required'}</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="emp-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Email <span style={{ color: '#facc15' }}>*</span>
              </label>
              <input
                type="email"
                id="emp-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="marcus@company.com"
                autoComplete="email"
                className={serverFieldErrors.email ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.email || 'Valid email address required'}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="emp-phone" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Phone <span style={{ color: '#facc15' }}>*</span>
              </label>
              <input
                type="tel"
                id="emp-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="^[0-9+\s\-()]{7,20}$"
                placeholder="+1 555-234-8901"
                autoComplete="tel"
                className={serverFieldErrors.phone ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.phone || 'Phone number must be at least 7 digits'}</span>
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="emp-dept" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Department <span style={{ color: '#facc15' }}>*</span>
              </label>
              <select
                id="emp-dept"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label htmlFor="emp-position" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Position <span style={{ color: '#facc15' }}>*</span>
              </label>
              <input
                type="text"
                id="emp-position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                maxLength={60}
                placeholder="Software Engineer"
                className={serverFieldErrors.position ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.position || 'Position is required'}</span>
              </div>
            </div>

            {/* Salary */}
            <div>
              <label htmlFor="emp-salary" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Salary ($) <span style={{ color: '#facc15' }}>*</span>
              </label>
              <input
                type="number"
                id="emp-salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                min={0}
                step={500}
                placeholder="80000"
                className={serverFieldErrors.salary ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.salary || 'Salary must be a positive number'}</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="emp-status" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Status
              </label>
              <select
                id="emp-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Joining */}
            <div>
              <label htmlFor="emp-doj" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Date of Joining
              </label>
              <input
                type="date"
                id="emp-doj"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label htmlFor="emp-id" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Employee ID <span style={{ fontSize: '0.72rem', color: '#8e8e98' }}>(Leave blank to auto-generate)</span>
              </label>
              <input
                type="text"
                id="emp-id"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP-1001"
                style={{ textTransform: 'uppercase' }}
                className={serverFieldErrors.employeeId ? "user-invalid-fallback" : ""}
              />
              <div className="error-msg">
                <AlertCircle size={12} />
                <span>{serverFieldErrors.employeeId || 'Invalid ID'}</span>
              </div>
            </div>

            {/* Portal Password */}
            <div>
              <label htmlFor="emp-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
                Portal Login Password <span style={{ fontSize: '0.72rem', color: '#8e8e98' }}>{isEdit ? '(Leave blank to keep current)' : '(Default: employee123)'}</span>
              </label>
              <input
                type="password"
                id="emp-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEdit ? "Leave blank to keep unchanged" : "employee123"}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="emp-address" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.35rem' }}>
              Address
            </label>
            <input
              type="text"
              id="emp-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="742 Evergreen Terrace, Seattle, WA"
              autoComplete="street-address"
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            borderTop: '1px solid #22222d',
            paddingTop: '1.25rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEdit ? 'Save Changes' : 'Add Employee'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EmployeeFormModal;
