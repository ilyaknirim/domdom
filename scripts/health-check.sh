#!/bin/bash

# Health Check Script for Israeli Real Estate Mini App
# Проверяет доступность всех сервисов

echo "🏥 Israeli Real Estate - Health Check"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Backend
echo "🔍 Checking Backend..."
BACKEND_URL="${BACKEND_URL:-http://localhost:3000}"
if curl -f -s "${BACKEND_URL}/health" > /dev/null; then
    echo -e "${GREEN}✅ Backend is UP${NC} - ${BACKEND_URL}"
    BACKEND_STATUS=$(curl -s "${BACKEND_URL}/health" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "   Status: ${BACKEND_STATUS}"
else
    echo -e "${RED}❌ Backend is DOWN${NC} - ${BACKEND_URL}"
    BACKEND_DOWN=1
fi
echo ""

# Check Frontend
echo "🔍 Checking Frontend..."
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"
if curl -f -s "${FRONTEND_URL}" > /dev/null; then
    echo -e "${GREEN}✅ Frontend is UP${NC} - ${FRONTEND_URL}"
else
    echo -e "${RED}❌ Frontend is DOWN${NC} - ${FRONTEND_URL}"
    FRONTEND_DOWN=1
fi
echo ""

# Check PostgreSQL
echo "🔍 Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    if psql "${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/israeli_realestate}" -c "SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is UP${NC}"
    else
        echo -e "${RED}❌ PostgreSQL is DOWN${NC}"
        POSTGRES_DOWN=1
    fi
else
    echo -e "${YELLOW}⚠️  psql not installed, skipping PostgreSQL check${NC}"
fi
echo ""

# Check Redis
echo "🔍 Checking Redis..."
REDIS_URL="${REDIS_URL:-localhost:6379}"
REDIS_HOST=$(echo $REDIS_URL | cut -d':' -f1)
REDIS_PORT=$(echo $REDIS_URL | cut -d':' -f2)
if command -v redis-cli &> /dev/null; then
    if redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis is UP${NC}"
    else
        echo -e "${RED}❌ Redis is DOWN${NC}"
        REDIS_DOWN=1
    fi
else
    echo -e "${YELLOW}⚠️  redis-cli not installed, skipping Redis check${NC}"
fi
echo ""

# Summary
echo "======================================"
echo "📊 Summary:"
if [ -z "$BACKEND_DOWN" ] && [ -z "$FRONTEND_DOWN" ] && [ -z "$POSTGRES_DOWN" ] && [ -z "$REDIS_DOWN" ]; then
    echo -e "${GREEN}🎉 All services are running!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some services are down. Please check logs.${NC}"
    exit 1
fi
