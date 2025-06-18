# Redirect to the proper Dockerfile in Docker directory
# This file exists for backward compatibility
# The actual production Dockerfile is in Docker/Dockerfile

FROM node:18-alpine AS redirect-notice

RUN echo "⚠️  This Dockerfile is deprecated. Use Docker/Dockerfile instead." && \
    echo "🔗 For production builds: docker build -f Docker/Dockerfile ." && \
    echo "🔗 For development: use Docker/start-dev.sh" && \
    exit 1