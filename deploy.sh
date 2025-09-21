#!/bin/bash

echo "🚀 JWT Authentication App - Vercel Deployment Script"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI is installed"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ You are not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"

# Deploy Backend
echo ""
echo "📦 Deploying Backend..."
echo "======================"
cd jwt-backend
echo "Setting up environment variables for backend..."

# Set environment variables for backend
vercel env add JWT_SECRET
vercel env add REFRESH_TOKEN_SECRET
vercel env add NODE_ENV production

echo "Deploying backend..."
BACKEND_URL=$(vercel --prod | grep -o 'https://[^ ]*\.vercel\.app')

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    echo "Backend URL: $BACKEND_URL"
else
    echo "❌ Backend deployment failed!"
    exit 1
fi

cd ..

# Deploy Frontend
echo ""
echo "🎨 Deploying Frontend..."
echo "======================="
cd react-portfolio
echo "Setting up environment variables for frontend..."

# Set environment variable for frontend
vercel env add REACT_APP_API_URL
echo "The REACT_APP_API_URL should be set to: $BACKEND_URL"

echo "Deploying frontend..."
FRONTEND_URL=$(vercel --prod | grep -o 'https://[^ ]*\.vercel\.app')

if [ $? -eq 0 ]; then
    echo "✅ Frontend deployed successfully!"
    echo "Frontend URL: $FRONTEND_URL"
else
    echo "❌ Frontend deployment failed!"
    exit 1
fi

cd ..

# Update Backend CORS
echo ""
echo "🔧 Updating Backend CORS Configuration..."
echo "========================================"
cd jwt-backend
vercel env add FRONTEND_URL
echo "The FRONTEND_URL should be set to: $FRONTEND_URL"

echo "Redeploying backend with updated CORS..."
vercel --prod > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Backend CORS updated successfully!"
else
    echo "❌ Backend CORS update failed!"
    exit 1
fi

cd ..

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "You can now access your application at: $FRONTEND_URL"
echo ""
echo "Test Credentials:"
echo "- Username: admin | Password: 123"
echo "- Username: user | Password: 123"
