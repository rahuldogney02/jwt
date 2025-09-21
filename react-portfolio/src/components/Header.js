import React, { useState, useEffect } from 'react';
import Login from './Login';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    setLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowLogin(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <header className="header">
      <h1>My Portfolio</h1>
      <div className="login-section">
        {loggedIn ? (
          <div>
            <span>Welcome, {localStorage.getItem('username')}!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLoginClick}>Login</button>
        )}
      </div>
      {showLogin && <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseLogin} />}
    </header>
  );
};

export default Header;