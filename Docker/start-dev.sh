#!/bin/bash
# Development startup script for Trading Dashboard

set -e

echo "🚀 Starting Trading Dashboard in Development Mode"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if main docker-compose network exists
if ! docker network ls | grep -q "stocksblitz_backend-net"; then
    echo "⚠️  Main backend network not found. Starting dependencies first..."
    cd ../..
    docker-compose up -d timescaledb redis rabbitmq user_service
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    cd trading_dashboard/Docker
fi

# Build and start development container
echo "🔨 Building development container..."
docker-compose -f docker-compose.override.yml build trading_dashboard_dev

echo "🎯 Starting Trading Dashboard in development mode..."
docker-compose -f docker-compose.override.yml up trading_dashboard_dev

echo "✅ Trading Dashboard is running at http://localhost:3001"
echo "🔗 API will connect to backend services automatically"
echo "📝 Source code changes will trigger hot reload"