import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (authService.getCurrentUser()) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage('Please fill in all fields');
      addToast('Please fill in all fields', 'warning');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address');
      addToast('Please enter a valid email address', 'warning');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      addToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setLoading(false);
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    authService.register(firstName, lastName, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setLoading(false);
        addToast('Registration successful! Please login.', 'success');
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
        addToast('Registration failed. Please try again.', 'error');
      }
    );
  };

  const handleSocialRegister = (provider) => {
    addToast(`Register with ${provider} coming soon!`, 'info');
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join MyKart to start shopping</p>
        </div>
        {message && (
          <div className={message.includes('Error') ? "alert alert-danger" : "alert alert-success"}>
            {message}
          </div>
        )}
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
                autoComplete="given-name"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
                autoComplete="family-name"
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                minLength="6"
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="form-text">Password must be at least 6 characters</small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <div className="terms-agreement">
              <input type="checkbox" id="terms" required disabled={loading} />
              <label htmlFor="terms">
                I agree to the <a href="#" onClick={(e) => {
                  e.preventDefault();
                  addToast('Terms of Service coming soon!', 'info');
                }}>Terms of Service</a> and <a href="#" onClick={(e) => {
                  e.preventDefault();
                  addToast('Privacy Policy coming soon!', 'info');
                }}>Privacy Policy</a>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
          <div className="divider">
            <span>or continue with</span>
          </div>
          <div className="social-register">
            <button className="btn btn-social google" onClick={() => handleSocialRegister('Google')}>
              <span className="icon">G</span> Google
            </button>
            <button className="btn btn-social facebook" onClick={() => handleSocialRegister('Facebook')}>
              <span className="icon">f</span> Facebook
            </button>
            <button className="btn btn-social apple" onClick={() => handleSocialRegister('Apple')}>
              <span className="icon"></span> Apple
            </button>
          </div>
          <div className="register-security">
            <p>
              <i className="security-icon">🔒</i>
              Your information is securely encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;