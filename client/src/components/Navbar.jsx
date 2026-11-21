import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, Users } from 'lucide-react';

const Navbar = ({ onOpenAddModal }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#111116',
      borderBottom: '1px solid #23232c',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#facc15',
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.95rem'
          }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#ffffff'
            }}>
              <span>Employee</span>
              <span style={{ color: '#facc15' }}>Manager</span>
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: '#8e8e99',
              fontWeight: 500
            }}>
              {user?.role === 'employee' ? 'Employee Portal' : 'Admin Portal'}
            </div>
          </div>
        </Link>

        {/* Authenticated Controls */}
        {isAuthenticated && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Add Employee Button (admins/managers only) */}
            {user?.role !== 'employee' && onOpenAddModal && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                <Plus size={16} />
                <span>Add Employee</span>
              </button>
            )}

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#191922',
              borderRadius: '9999px',
              border: '1px solid #2b2b38'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(250, 204, 21, 0.15)',
                color: '#facc15',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f4f4f6' }}>
                  {user?.name || 'Staff'}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  color: user?.role === 'employee' ? '#4ade80' : '#facc15',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}>
                  {user?.role === 'employee' ? 'Employee' : (user?.role || 'Admin')}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '0.45rem 0.85rem'
              }}
              title="Sign out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
