import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password)
      onLoginSuccess();
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem('username', username);
      onLoginSuccess();
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
          <h2 style={{color:"black"}}>JWT Example</h2>
          <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        </span>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="primary-btn">
              {isRegistering ? 'Register' : 'Login'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Back to Login' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;