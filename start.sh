#!/bin/bash

# Topo Platform - Quick Start Script
# This script helps you set up and start the development servers

set -e

echo "🚀 Topo Development Platform - Quick Start"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if PostgreSQL is running
if ! psql -U postgres -c "SELECT 1" &> /dev/null; then
  echo -e "${YELLOW}⚠ PostgreSQL is not running. Please start PostgreSQL first.${NC}"
  echo "  macOS: brew services start postgresql"
  echo "  Linux: sudo systemctl start postgresql"
  echo "  Windows: Start PostgreSQL from Services"
  exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is running${NC}"

# Check if database exists
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -w topo > /dev/null; then
  echo -e "${YELLOW}ℹ Creating database 'topo'...${NC}"
  createdb -U postgres topo || createdb topo
  echo -e "${GREEN}✓ Database created${NC}"
fi

# Install dependencies
echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"

if [ ! -d "backend/node_modules" ]; then
  echo "  📦 Backend dependencies..."
  cd backend
  npm install --quiet
  cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "  📦 Frontend dependencies..."
  cd frontend
  npm install --quiet
  cd ..
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Set up environment files
echo ""
echo -e "${YELLOW}Setting up environment variables...${NC}"

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo -e "${GREEN}✓ Created backend/.env${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
  cp frontend/.env.example frontend/.env.local
  echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
fi

# Initialize database schema
echo ""
echo -e "${YELLOW}Initializing database schema...${NC}"
cd backend
npx prisma db push --skip-generate || true
cd ..
echo -e "${GREEN}✓ Database schema initialized${NC}"

# Display startup instructions
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Open TWO terminal windows"
echo ""
echo "2. In Terminal 1, run:"
echo -e "${YELLOW}   cd backend && npm run dev${NC}"
echo ""
echo "3. In Terminal 2, run:"
echo -e "${YELLOW}   cd frontend && npm run dev${NC}"
echo ""
echo "4. Open your browser to:"
echo -e "${YELLOW}   http://localhost:3000${NC}"
echo ""
echo "📚 For detailed setup instructions, see SETUP_GUIDE.md"
echo ""
