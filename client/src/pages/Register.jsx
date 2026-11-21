import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, Shield, Users } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setFieldErrors({ password: 'Must be at least 6 characters' });
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setErrorMessage(result.message || 'Registration failed');
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: '#0a0a0d'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#131318',
        border: '1px solid #282835',
        borderRadius: '14px',
        padding: '2.25rem 2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: '#facc15',
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <Users size={24} />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '0.3rem'
          }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#8d8d9b' }}>
            Register as an Administrator
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 0.9rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '0.84rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label
              htmlFor="reg-name"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '0.35rem'
              }}
            >
              Full Name <span style={{ color: '#facc15' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="reg-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
                autoComplete="name"
                placeholder="Alex Mercer"
                style={{ paddingLeft: '2.5rem' }}
                className={fieldErrors.name ? "user-invalid-fallback" : ""}
              />
              <User
                size={16}
                color="#71717e"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
            {fieldErrors.name && (
              <div className="error-msg" style={{ display: 'flex' }}>
                <AlertCircle size={12} />
                <span>{fieldErrors.name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label
              htmlFor="reg-email"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '0.35rem'
              }}
            >
              Email <span style={{ color: '#facc15' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="reg-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="alex@apex.com"
                style={{ paddingLeft: '2.5rem' }}
                className={fieldErrors.email ? "user-invalid-fallback" : ""}
              />
              <Mail
                size={16}
                color="#71717e"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
            {fieldErrors.email && (
              <div className="error-msg" style={{ display: 'flex' }}>
                <AlertCircle size={12} />
                <span>{fieldErrors.email}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label
              htmlFor="reg-role"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '0.35rem'
              }}
            >
              Role
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="reg-role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
              </select>
              <Shield
                size={16}
                color="#facc15"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label
              htmlFor="reg-password"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '0.35rem'
              }}
            >
              Password <span style={{ color: '#facc15' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                className={fieldErrors.password ? "user-invalid-fallback" : ""}
              />
              <Lock
                size={16}
                color="#71717e"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#71717e',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <div className="error-msg" style={{ display: 'flex' }}>
                <AlertCircle size={12} />
                <span>{fieldErrors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="reg-confirm"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '0.35rem'
              }}
            >
              Confirm Password <span style={{ color: '#facc15' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-confirm"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Re-enter password"
                style={{ paddingLeft: '2.5rem' }}
                className={fieldErrors.confirmPassword ? "user-invalid-fallback" : ""}
              />
              <Lock
                size={16}
                color="#71717e"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <div className="error-msg" style={{ display: 'flex' }}>
                <AlertCircle size={12} />
                <span>{fieldErrors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', minHeight: '44px' }}
            disabled={loading}
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #20202a',
          fontSize: '0.84rem',
          color: '#8e8e9b'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#facc15',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
