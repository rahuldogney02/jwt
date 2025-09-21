# JWT Authentication App - Vercel Deployment Guide

This repository contains two applications that need to be deployed to Vercel:

1. **jwt-backend/** - Node.js/Express JWT authentication backend
2. **react-portfolio/** - React frontend portfolio application

## Deployment Steps

### Step 1: Deploy Backend First

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import the `jwt-backend` folder
4. Configure the following environment variables in Vercel:
   - `JWT_SECRET` - A secure random string for JWT signing
   - `REFRESH_TOKEN_SECRET` - Another secure random string for refresh tokens
   - `FRONTEND_URL` - Will be automatically set to your frontend domain after deployment
5. Deploy the backend
6. Note the deployment URL (e.g., `https://your-backend-name.vercel.app`)

### Step 2: Deploy Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import the `react-portfolio` folder
4. Configure the following environment variable in Vercel:
   - `REACT_APP_API_URL` - Set this to your backend deployment URL (e.g., `https://your-backend-name.vercel.app`)
5. Deploy the frontend
6. Note the deployment URL (e.g., `https://your-frontend-name.vercel.app`)

### Step 3: Update Backend CORS Configuration

After both deployments are complete:

1. Go to your backend project in Vercel Dashboard
2. Update the `FRONTEND_URL` environment variable to your frontend deployment URL
3. Redeploy the backend

## Environment Variables

### Backend (.env.example)
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env.example)
```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app
```

## Features

- JWT-based authentication with refresh tokens
- Automatic token refresh (every 2.5 minutes)
- Inactivity timeout (3 minutes)
- Secure HTTP-only cookies
- Registration and login functionality
- Protected routes

## Test Credentials

- Username: `admin` | Password: `123`
- Username: `user` | Password: `123`

## Local Development

### Backend
```bash
cd jwt-backend
npm install
npm run dev
```

### Frontend
```bash
cd react-portfolio
npm install
npm start
```

## Production URLs

After deployment, your applications will be available at:
- Backend API: `https://your-backend-name.vercel.app`
- Frontend App: `https://your-frontend-name.vercel.app`

## Security Notes

1. Always use strong, unique secrets for JWT tokens in production
2. The refresh token mechanism provides additional security
3. HTTP-only cookies prevent XSS attacks
4. CORS is properly configured for production domains
