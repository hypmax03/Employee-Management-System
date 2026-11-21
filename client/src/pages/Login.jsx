import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, Eye, EyeOff, AlertCircle, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.message || 'Invalid email or password');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@apex.com');
    setPassword('admin123');
    setErrorMessage('');
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
        maxWidth: '420px',
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
            Sign In
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#8d8d9b' }}>
            Employee Management System
          </p>
        </div>

        {/* Demo Helper */}
        <div style={{
          backgroundColor: '#191924',
          border: '1px solid #2e2e3d',
          borderRadius: '8px',
          padding: '0.75rem 0.9rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#facc15' }}>
              Demo Credentials
            </div>
            <div style={{ fontSize: '0.74rem', color: '#9e9eb0' }}>
              admin@apex.com / admin123
            </div>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            style={{
              backgroundColor: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid rgba(250, 204, 21, 0.35)',
              color: '#facc15',
              fontSize: '0.74rem',
              fontWeight: 600,
              padding: '0.3rem 0.6rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Auto Fill
          </button>
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
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="login-email"
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
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                required
                autoComplete="username"
                placeholder="admin@apex.com"
                style={{ paddingLeft: '2.5rem' }}
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
            <div className="error-msg">
              <AlertCircle size={12} />
              <span>Enter a valid email address</span>
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="login-password"
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
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
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
            <div className="error-msg">
              <AlertCircle size={12} />
              <span>Password must be at least 6 characters</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', minHeight: '44px' }}
            disabled={loading}
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
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
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#facc15',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
