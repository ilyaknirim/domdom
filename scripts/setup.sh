#!/bin/bash

# Setup Script for Israeli Real Estate Mini App
# Автоматическая установка и настройка проекта

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║  Israeli Real Estate Mini App Setup      ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Backend Setup
echo -e "${BLUE}🔧 Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Copy .env file if not exists
if [ ! -f ".env" ]; then
    if [ -f ".env.template" ]; then
        echo "📝 Creating .env file from template..."
        cp .env.template .env
        echo -e "${YELLOW}⚠️  Please edit backend/.env file with your credentials${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.template not found, skipping${NC}"
    fi
else
    echo "✅ .env file already exists"
fi

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npx prisma generate

cd ..
echo -e "${GREEN}✅ Backend setup completed${NC}"
echo ""

# Frontend Setup
echo -e "${BLUE}🔧 Setting up Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

# Copy .env file if not exists
if [ ! -f ".env" ]; then
    if [ -f ".env.template" ]; then
        echo "📝 Creating .env file from template..."
        cp .env.template .env
        echo -e "${YELLOW}⚠️  Please edit frontend/.env file with your credentials${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.template not found, skipping${NC}"
    fi
else
    echo "✅ .env file already exists"
fi

cd ..
echo -e "${GREEN}✅ Frontend setup completed${NC}"
echo ""

# Docker check
echo -e "${BLUE}🐳 Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1) detected${NC}"
    
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✅ docker-compose detected${NC}"
    else
        echo -e "${YELLOW}⚠️  docker-compose not found. Install it for easier deployment.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker not found. Install it for easier deployment.${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════╗"
echo "║           Setup Complete! 🎉              ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

echo "Next steps:"
echo ""
echo "1. Configure your environment:"
echo -e "   ${YELLOW}Edit backend/.env and frontend/.env files${NC}"
echo ""
echo "2. Start PostgreSQL and Redis:"
echo "   docker-compose up -d postgres redis"
echo ""
echo "3. Run database migrations:"
echo "   cd backend && npx prisma migrate dev"
echo ""
echo "4. Seed the database (optional):"
echo "   cd backend && npm run prisma:seed"
echo ""
echo "5. Start the application:"
echo "   Option A - Docker: docker-compose up -d"
echo "   Option B - Manual:"
echo "     Terminal 1: cd backend && npm run dev"
echo "     Terminal 2: cd frontend && npm run dev"
echo ""
echo -e "${BLUE}📚 Documentation: ./README.md${NC}"
echo -e "${BLUE}🚀 Quick Start: ./QUICKSTART.md${NC}"
echo ""
