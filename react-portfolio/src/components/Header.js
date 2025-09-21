import React, { useState, useEffect } from 'react';
import Login from './Login';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginTime, setLoginTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  console.table([showLogin, loggedIn, loginTime, sessionDuration]);
  useEffect(() => {
    const username = localStorage.getItem('username');
    const storedLoginTime = localStorage.getItem('loginTime');

    if (username && storedLoginTime) {
      setLoggedIn(true);
      setLoginTime(new Date(parseInt(storedLoginTime)));
    }
  }, []);

  useEffect(() => {
    let interval;

    if (loggedIn && loginTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - loginTime) / 1000); // Duration in seconds
        setSessionDuration(duration);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loggedIn, loginTime]);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    setLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    const now = new Date();
    setLoggedIn(true);
    setLoginTime(now);
    setShowLogin(false);
    localStorage.setItem('loginTime', now.getTime().toString());
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <header className="header">
      <h1>My Portfolio</h1>
      <div className="login-section">
        {loggedIn ? (
          <div className="user-info">
            <div className="welcome-section">
              <span>Welcome, {localStorage.getItem('username')}!</span>
              <div className="session-counter">
                <span className="counter-label">Session:</span>
                <span className="counter-time">{formatDuration(sessionDuration)}</span>
              </div>
            </div>
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