import { useState, useEffect, useCallback } from 'react';

const useInactivity = (timeout, onInactive) => {
  const [lastActivity, setLastActivity] = useState(new Date());

  const handleActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - lastActivity;
      if (diff > timeout) {
        onInactive();
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, timeout, onInactive, handleActivity]);

  return null;
};

export default useInactivity;
