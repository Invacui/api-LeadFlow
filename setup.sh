#!/bin/bash

# Express TypeScript Boilerplate Setup Script
# This script sets up the development environment

echo "🚀 Setting up Express TypeScript Boilerplate..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f "Private.env" ]; then
    echo "📝 Creating environment file..."
    cp env.example Private.env
    echo "✅ Environment file created. Please edit Private.env with your configuration."
else
    echo "✅ Environment file already exists"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run prisma:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated successfully"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB before running the application."
    fi
else
    echo "⚠️  MongoDB is not installed. Please install MongoDB to use the database features."
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs
echo "✅ Logs directory created"

# Run linting
echo "🔍 Running linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found. Run 'npm run lint:fix' to fix them."
else
    echo "✅ Linting passed"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Project built successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit Private.env with your configuration"
echo "2. Start MongoDB (if not already running)"
echo "3. Run 'npm run prisma:migrate' to set up the database"
echo "4. Run 'npm run prisma:seed' to seed the database with sample data"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and setup"
echo "- md/API.md - API documentation"
echo "- md/DEVELOPMENT.md - Development guide"
echo "- md/DEPLOYMENT.md - Deployment guide"
echo ""
echo "Happy coding! 🚀"
