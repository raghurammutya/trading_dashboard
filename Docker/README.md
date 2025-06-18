# Trading Dashboard Docker Configuration

This directory contains Docker configuration files for the Trading Dashboard React application.

## Files Overview

### `Dockerfile`
Multi-stage Docker build configuration:
- **Builder stage**: Node.js 18 Alpine for building the React application
- **Production stage**: Nginx Alpine for serving the built application
- Optimized for production with health checks and security headers

### `nginx.conf`
Nginx configuration for:
- Serving React static files with caching
- Proxying API requests to backend services
- CORS headers for cross-origin requests
- Security headers and compression
- SPA routing support (React Router)

### `env-config.js`
Runtime environment configuration script for:
- API endpoint configuration
- Feature flags
- OAuth client IDs
- Application settings

### `.dockerignore`
Excludes unnecessary files from Docker build context:
- Node modules (rebuilt in container)
- Development files and logs
- IDE configurations

### `requirements.txt`
Documentation of Node.js dependencies (actual dependencies in package.json)

### `.env.docker`
Docker environment variables template

## Build and Run

### Local Development Build
```bash
# From trading_dashboard directory
docker build -f Docker/Dockerfile -t trading-dashboard:dev .
docker run -p 3000:80 trading-dashboard:dev
```

### Production Build (via docker-compose)
```bash
# From project root
docker-compose up trading_dashboard
```

## Environment Variables

### Required Variables
- `REACT_APP_USER_SERVICE_URL`: User service API endpoint
- `REACT_APP_TRADE_SERVICE_URL`: Trade service API endpoint

### Optional Variables
- `REACT_APP_APP_NAME`: Application name (default: TradingHub)
- `REACT_APP_USE_MOCK_DATA`: Use mock data (default: false)
- `REACT_APP_ENABLE_SOCIAL_LOGIN`: Enable social authentication
- `REACT_APP_ENABLE_MFA`: Enable multi-factor authentication

### OAuth Configuration
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `REACT_APP_LINKEDIN_CLIENT_ID`: LinkedIn OAuth client ID
- `REACT_APP_FACEBOOK_APP_ID`: Facebook app ID
- `REACT_APP_GITHUB_CLIENT_ID`: GitHub OAuth client ID

## Health Checks

The container includes health check endpoints:
- `/health`: Application health status
- Nginx status monitoring

## Security Features

- CSP headers configured
- CORS properly configured for backend services
- Secure cookie settings
- XSS protection headers

## Performance Optimizations

- Gzip compression enabled
- Static file caching (1 year)
- Optimized Nginx configuration
- Multi-stage build reduces image size

## API Proxying

All `/api/*` requests are proxied to the user_service backend:
- Automatic CORS header injection
- Proper forwarding of client information
- Load balancing ready

## Troubleshooting

1. **Build failures**: Check Node.js version compatibility
2. **API connection issues**: Verify service URLs in environment variables
3. **CORS errors**: Check nginx proxy configuration
4. **Health check failures**: Ensure curl is available in container