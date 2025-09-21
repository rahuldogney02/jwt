import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3001/api/auth';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Send cookies
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful registration, switch to login view
        setIsRegistering(false);
        setError('Registration successful! Please log in.');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span>
          <h2 style={{color:"black"}}>JWT Authentication</h2>
          <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        </span>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <h2 style={{color:"black"}}>{isRegistering ? 'Register' : 'Login'}</h2>

          {error && (
            <div style={{
              color: isRegistering ? 'green' : 'red',
              backgroundColor: isRegistering ? '#e8f5e9' : '#ffebee',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: `1px solid ${isRegistering ? '#4caf50' : '#f44336'}`
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={loading}
            >
              {isRegistering ? 'Back to Login' : 'Register'}
            </button>
          </div>

          <div style={{
            marginTop: '15px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p><strong>Test Credentials:</strong></p>
            <p>Username: admin | Password: 123</p>
            <p>Username: user | Password: 123</p>
          </div>
        </form>.
      </div>
    </div>
  );
};

export default Login;
