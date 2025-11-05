import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (authService.getCurrentUser()) {
      navigate('/');
    }
    
    // Check if there's a saved email in localStorage
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const validateForm = () => {
    // Reset message
    setMessage('');
    
    // Check if all fields are filled
    if (!email || !password) {
      const errorMsg = 'Please fill in all fields';
      setMessage(errorMsg);
      addToast(errorMsg, 'warning');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = 'Please enter a valid email address';
      setMessage(errorMsg);
      addToast(errorMsg, 'warning');
      return false;
    }
    
    // Validate password length
    if (password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      setMessage(errorMsg);
      addToast(errorMsg, 'warning');
      return false;
    }
    
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');

    authService.login(email, password).then(
      (response) => {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        addToast('Login successful! Welcome back.', 'success');
        navigate('/');
        window.location.reload();
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
        addToast('Login failed. Please check your credentials.', 'error');
      }
    );
  };

  const handleSocialLogin = (provider) => {
    addToast(`Login with ${provider} coming soon!`, 'info');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    addToast('Password reset feature coming soon!', 'info');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
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
                onKeyPress={handleKeyPress}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
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
          </div>
          <div className="form-options">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading} 
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button type="button" className="forgot-password" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : null}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Create Account</Link></p>
          <div className="divider">
            <span>or continue with</span>
          </div>
          <div className="social-login">
            <button className="btn btn-social google" onClick={() => handleSocialLogin('Google')}>
              <span className="icon">G</span> Google
            </button>
            <button className="btn btn-social facebook" onClick={() => handleSocialLogin('Facebook')}>
              <span className="icon">f</span> Facebook
            </button>
            <button className="btn btn-social apple" onClick={() => handleSocialLogin('Apple')}>
              <span className="icon"></span> Apple
            </button>
          </div>
          <div className="login-security">
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

export default Login;