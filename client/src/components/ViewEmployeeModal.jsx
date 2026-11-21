import React, { useEffect, useRef } from 'react';
import { X, Mail, Phone, MapPin, Calendar, DollarSign, Building2, Briefcase, Edit2 } from 'lucide-react';

const ViewEmployeeModal = ({ isOpen, onClose, onEdit, employee }) => {
  const dialogRef = useRef(null);

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

  if (!employee) return null;

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
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
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
      aria-labelledby="view-modal-title"
      style={{
        maxWidth: '560px',
        padding: 0,
        backgroundColor: '#131318',
        border: '1px solid #282836',
        borderRadius: '12px',
        color: '#f4f4f6'
      }}
    >
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ padding: '1.5rem' }}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#facc15',
              backgroundColor: 'rgba(250, 204, 21, 0.1)',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              border: '1px solid rgba(250, 204, 21, 0.3)'
            }}>
              {employee.employeeId}
            </span>
            <span className={`badge ${
              employee.status === 'Active'
                ? 'badge-active'
                : employee.status === 'On Leave'
                ? 'badge-leave'
                : 'badge-terminated'
            }`}>
              {employee.status}
            </span>
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

        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #23232f',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '10px',
            backgroundColor: '#1f1f2b',
            border: '2px solid #facc15',
            color: '#facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.3rem'
          }}>
            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
          </div>
          <div>
            <h2
              id="view-modal-title"
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '0.2rem'
              }}
            >
              {employee.firstName} {employee.lastName}
            </h2>
            <div style={{
              fontSize: '0.88rem',
              color: '#facc15',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Briefcase size={14} />
              <span>{employee.position}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#181822',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid #242432'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888896', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building2 size={13} color="#facc15" /> Department
            </div>
            <div style={{ fontWeight: 600, color: '#f4f4f7', fontSize: '0.92rem' }}>
              {employee.department}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181822',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid #242432'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888896', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={13} color="#facc15" /> Salary
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#facc15', fontSize: '1rem' }}>
              {formatCurrency(employee.salary)} <span style={{ fontSize: '0.72rem', color: '#9999a8', fontWeight: 400 }}>/ year</span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#181822',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid #242432'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888896', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={13} color="#facc15" /> Email
            </div>
            <div style={{ fontWeight: 500, color: '#f4f4f7', fontSize: '0.88rem', wordBreak: 'break-all' }}>
              {employee.email}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181822',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid #242432'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888896', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={13} color="#facc15" /> Phone
            </div>
            <div style={{ fontWeight: 500, color: '#f4f4f7', fontSize: '0.88rem' }}>
              {employee.phone}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181822',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid #242432'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888896', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} color="#facc15" /> Date Joined
            </div>
            <div style={{ fontWeight: 500, color: '#f4f4f7', fontSize: '0.88rem' }}>
              {formatDate(employee.dateOfJoining)}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181822',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid #242432'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888896', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={13} color="#facc15" /> Address
            </div>
            <div style={{ fontWeight: 500, color: '#f4f4f7', fontSize: '0.88rem' }}>
              {employee.address || 'Not provided'}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          borderTop: '1px solid #23232f',
          paddingTop: '1rem'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
            className="btn-primary"
          >
            <Edit2 size={15} />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ViewEmployeeModal;
