const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for refresh tokens
const refreshTokens = new Map();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// In-memory user database
const userDB = new Map();

const addUser = async (username, password, email) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = userDB.size + 1;
  userDB.set(username, { id, username, password: hashedPassword, email });
};

(async () => {
  await addUser('admin', '123', 'admin@example.com');
  await addUser('user', '123', 'user@example.com');
})();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-token-key';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (userDB.has(username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    await addUser(username, password, email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = userDB.get(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = jwt.sign({ userId: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '3m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    refreshTokens.set(user.id, refreshToken);

    res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

    const decodedToken = jwt.verify(accessToken, JWT_SECRET);
    res.json({ message: 'Login successful', user: decodedToken });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

    const storedRefreshToken = refreshTokens.get(user.userId);
    if (storedRefreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId: user.userId, username: userDB.get(user.username)?.username, email: userDB.get(user.username)?.email }, JWT_SECRET, { expiresIn: '3m' });
    res.cookie('token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3 * 60 * 1000 });
    const decodedToken = jwt.verify(newAccessToken, JWT_SECRET);
    res.json({ message: 'Token refreshed successfully', user: decodedToken });
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (user) {
        refreshTokens.delete(user.userId);
      }
    });
  }
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 JWT Authentication Server running on port ${PORT}`);
});