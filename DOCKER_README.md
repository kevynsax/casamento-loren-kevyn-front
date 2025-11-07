# Docker Deployment Instructions

This guide explains how to build and deploy the Casamento Frontend application using Docker and nginx.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:80`

### Build and Run with Docker only

```bash
# Build the image
docker build -t casamento-frontend .

# Run the container
docker run -d -p 80:80 --name casamento-frontend casamento-frontend

# View logs
docker logs -f casamento-frontend

# Stop and remove the container
docker stop casamento-frontend
docker rm casamento-frontend
```

## Files Overview

### Dockerfile
Multi-stage Dockerfile that:
1. **Stage 1 (build)**: Uses Node.js 20 Alpine to build the Angular application
2. **Stage 2 (serve)**: Uses nginx Alpine to serve the static files

### nginx.conf
Custom nginx configuration that:
- Serves the Angular application
- Handles Angular routing (SPA mode)
- Enables gzip compression
- Sets cache headers for static assets
- Includes security headers
- Provides a health check endpoint at `/health`

### docker-compose.yml
Docker Compose configuration for easy deployment:
- Exposes port 80
- Configures restart policy
- Sets up networking

### .dockerignore
Excludes unnecessary files from the Docker build context to optimize build time and image size.

## Production Deployment

For production deployment, you may want to:

1. **Change the port mapping** in `docker-compose.yml`:
   ```yaml
   ports:
     - "8080:80"  # Use a different host port
   ```

2. **Add environment variables** for the backend API:
   Update `src/environments/environment.prod.ts` before building

3. **Use HTTPS** with a reverse proxy (nginx, Traefik, etc.)

4. **Enable additional nginx features**:
   - Rate limiting
   - SSL/TLS configuration
   - Additional security headers

## Useful Commands

```bash
# Rebuild without cache
docker-compose build --no-cache

# View container status
docker-compose ps

# Access container shell
docker-compose exec frontend sh

# View nginx access logs
docker-compose exec frontend tail -f /var/log/nginx/access.log

# View nginx error logs
docker-compose exec frontend tail -f /var/log/nginx/error.log

# Remove all stopped containers, networks, and images
docker system prune -a
```

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs frontend`
- Verify port 80 is not already in use
- Ensure Docker daemon is running

### Build fails
- Clear Docker cache: `docker builder prune`
- Check if all files are present
- Verify Node.js version compatibility

### Can't access the application
- Check if container is running: `docker ps`
- Verify port mapping: `docker port casamento-frontend`
- Check nginx logs for errors

## Health Check

The application includes a health check endpoint:
```bash
curl http://localhost/health
```

Should return: `healthy`

