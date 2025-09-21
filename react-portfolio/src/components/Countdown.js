import React, { useState, useEffect } from 'react';

const Countdown = ({ user, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (user) {
      const calculateTimeLeft = () => {
        const expiresIn = new Date(user.exp * 1000) - new Date();
        return Math.max(0, Math.floor(expiresIn / 1000));
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
        if (newTimeLeft === 0) {
          onLogout();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [user, onLogout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Session Active</h2>
      <p>Your session will automatically expire in:</p>
      <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
        {timeLeft !== null ? formatTime(timeLeft) : 'Loading...'}
      </div>
    </div>
  );
};

export default Countdown;
