import React from 'react';

const Header = ({ user, onLogout, onShowLogin }) => {
  return (
    <header className="header">
      <h1>My Portfolio</h1>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
          {user ? (
            <li>
              <span>Welcome, {user.username}!</span>
              <button onClick={onLogout}>Logout</button>
            </li>
          ) : (
            <li>
              <button onClick={onShowLogin}>Login</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
