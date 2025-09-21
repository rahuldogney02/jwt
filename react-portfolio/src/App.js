import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import './components/Portfolio.css';
import './components/Login.css';
import Header from './components/Header';
import SubHeader from './components/SubHeader';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import Login from './components/Login';
import useInactivity from './hooks/useInactivity';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    navigate('/');
  }, [navigate]);

  useInactivity(3 * 60 * 1000, user ? handleLogout : () => {});

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // If verification fails, try to refresh the token
          refreshToken();
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    };
    verifyUser();
  }, [refreshToken]);

  useEffect(() => {
    let refreshInterval;
    if (user) {
      // Refresh token every 2.5 minutes
      refreshInterval = setInterval(refreshToken, 2.5 * 60 * 1000);
    }
    return () => {
      clearInterval(refreshInterval);
    };
  }, [user, refreshToken]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} onShowLogin={handleShowLogin} />
      <Routes>
        <Route path="/" element={<>
          <SubHeader />
          <Portfolio />
          <Footer />
        </>} />
      </Routes>
      {showLogin && <Login onLoginSuccess={handleLoginSuccess} onClose={handleCloseLogin} />}
    </div>
  );
}

export default App;
