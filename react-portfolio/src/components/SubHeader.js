import React, { useState, useEffect } from 'react';
import Login from './Login';

const SubHeader = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginTime, setLoginTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  const API_BASE_URL = 'http://localhost:3001/api/auth';

  // Check JWT token validity on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('jwtToken');
      const username = localStorage.getItem('username');

      if (token && username) {
        try {
          // Verify token with backend
          const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            await response.json();
            setLoggedIn(true);
            

            // Set login time from token (issued at time)
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            setLoginTime(new Date(tokenPayload.iat * 1000));
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            setLoggedIn(false);
            
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid token
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
          setLoggedIn(false);
          
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Real-time session counter
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

  const handleLogout = async () => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      try {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');

    // Update state
    setLoggedIn(false);
    
    setLoginTime(null);
    setSessionDuration(0);
  };

  const handleLoginSuccess = (username) => {
    setLoggedIn(true);
    
    setLoginTime(new Date());
    setShowLogin(false);
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
    <header className="subheader">
      <h2>My Projects</h2>
      <div className="login-section">
        {loggedIn ? (
          <div className="user-info">
            <div className="welcome-section">
              <span>Welcome to Projects, {localStorage.getItem('username')}!</span>
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

export default SubHeader;
