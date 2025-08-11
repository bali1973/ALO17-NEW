#!/bin/bash

# Render Build Script for Alo17
echo "🚀 Starting Alo17 build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
if [ -d ".next" ]; then
    echo "✅ Build successful! .next directory created."
    ls -la .next/
else
    echo "❌ Build failed! .next directory not found."
    exit 1
fi

# Check for critical files
echo "🔍 Checking critical files..."
if [ -f ".next/server.js" ]; then
    echo "✅ Server file found"
else
    echo "❌ Server file missing"
    exit 1
fi

if [ -f ".next/static" ]; then
    echo "✅ Static files found"
else
    echo "❌ Static files missing"
    exit 1
fi

echo "🎉 Build process completed successfully!"
echo "📁 Build output:"
du -sh .next/
echo "📊 Build summary:"
echo "- Next.js version: $(node -e "console.log(require('next/package.json').version)")"
echo "- Node.js version: $(node --version)"
echo "- Build time: $(date)"
