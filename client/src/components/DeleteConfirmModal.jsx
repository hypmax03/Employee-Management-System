import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, employee, loading = false }) => {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        setTimeout(() => cancelBtnRef.current?.focus(), 50);
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

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onPointerDown={handlePointerDown}
      aria-labelledby="delete-confirm-title"
      style={{
        maxWidth: '440px',
        padding: 0,
        backgroundColor: '#14141a',
        border: '1px solid #332626',
        borderRadius: '12px',
        color: '#f4f4f6'
      }}
    >
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ padding: '1.5rem', textAlign: 'center' }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <AlertTriangle size={24} />
        </div>

        <h2
          id="delete-confirm-title"
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}
        >
          Delete Employee
        </h2>

        <p style={{ fontSize: '0.86rem', color: '#a1a1aa', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#ffffff' }}>
            {employee.firstName} {employee.lastName}
          </strong>{' '}
          ({employee.employeeId})? This cannot be undone.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-danger"
            disabled={loading}
          >
            {loading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmModal;
