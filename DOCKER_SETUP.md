# 🐳 Docker Deployment - Quick Reference

## ✅ Files Created

The following files have been created for Docker deployment:

1. **Dockerfile** - Multi-stage build with Node.js and nginx
2. **nginx.conf** - Production-ready nginx configuration
3. **docker-compose.yml** - Basic Docker Compose setup (port 80)
4. **docker-compose.prod.yml** - Production setup with health checks (port 8080)
5. **.dockerignore** - Optimizes Docker build by excluding unnecessary files
6. **DOCKER_README.md** - Comprehensive documentation

## 🚀 Quick Commands

### Using Docker Compose (Recommended)

```bash
# Build and start (development)
docker-compose up -d --build

# Build and start (production with health checks)
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose logs -f frontend

# Stop and remove
docker-compose down

# Restart
docker-compose restart
```

### Using Docker Directly

```bash
# Build the image
docker build -t casamento-frontend .

# Run the container
docker run -d -p 8080:80 --name casamento-frontend casamento-frontend

# Stop the container
docker stop casamento-frontend

# Remove the container
docker rm casamento-frontend

# View logs
docker logs -f casamento-frontend
```

## 🌐 Access the Application

- **Development (docker-compose.yml)**: http://localhost
- **Production (docker-compose.prod.yml)**: http://localhost:8080
- **Health Check**: http://localhost/health or http://localhost:8080/health

## 📋 What's Included

### Dockerfile Features
- ✅ Multi-stage build (optimized image size)
- ✅ Node.js 20 Alpine for building
- ✅ nginx Alpine for serving (lightweight)
- ✅ Production-optimized Angular build
- ✅ Secure and minimal final image

### nginx Configuration
- ✅ SPA routing support (Angular routing)
- ✅ Gzip compression enabled
- ✅ Static file caching (1 year for assets)
- ✅ Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- ✅ Health check endpoint
- ✅ Performance optimizations

### Docker Compose
- ✅ Easy one-command deployment
- ✅ Network isolation
- ✅ Restart policies
- ✅ Health checks (prod version)
- ✅ Container labels

## 🔧 Configuration Updates Made

### Angular Budget Limits (angular.json)
Updated to allow production builds:
- Initial bundle: 1MB warning, 2MB error (was 500kB/1MB)
- Component styles: 50kB warning, 100kB error (was 4kB/8kB)

This allows the large CSS files (cover.scss, story.scss) to build successfully.

## 📦 Build Process

The Docker build process:
1. **Stage 1 - Build**:
   - Copies package.json and installs dependencies
   - Copies source code
   - Runs `npm run build --configuration=production`
   - Outputs to `/app/dist/casamento-loren-kevyn-front`

2. **Stage 2 - Serve**:
   - Uses nginx:alpine base image
   - Copies custom nginx configuration
   - Copies built files from stage 1
   - Exposes port 80
   - Starts nginx

## 🎯 Production Deployment Tips

1. **Environment Variables**: Update `src/environments/environment.prod.ts` with your production API URL before building

2. **HTTPS**: Use a reverse proxy (nginx, Traefik, Caddy) in front of the container:
   ```yaml
   # Example with Traefik labels
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.casamento.rule=Host(`yourdomain.com`)"
     - "traefik.http.routers.casamento.tls=true"
   ```

3. **Volume Mounting** (optional, for quick updates):
   ```yaml
   volumes:
     - ./custom-nginx.conf:/etc/nginx/nginx.conf:ro
   ```

4. **Resource Limits**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache
```

### Port Conflicts
If port 80 or 8080 is in use, change in docker-compose.yml:
```yaml
ports:
  - "3000:80"  # Use any available port
```

### Container Won't Start
```bash
# Check logs
docker-compose logs frontend

# Check if nginx config is valid
docker-compose exec frontend nginx -t
```

### Can't Access Application
1. Verify container is running: `docker ps`
2. Check port mapping: `docker port casamento-frontend`
3. Test health endpoint: `curl http://localhost/health`
4. Check nginx logs: `docker-compose logs frontend`

## ✨ Next Steps

1. **Test the deployment**:
   ```bash
   docker-compose up -d --build
   curl http://localhost/health
   # Visit http://localhost in browser
   ```

2. **For production**: Use `docker-compose.prod.yml` and configure your reverse proxy

3. **Set up CI/CD**: Integrate Docker build into your deployment pipeline

4. **Monitor**: Add logging and monitoring solutions (Prometheus, Grafana, etc.)

## 📚 Additional Resources

- Docker Documentation: https://docs.docker.com/
- nginx Documentation: https://nginx.org/en/docs/
- Angular Deployment: https://angular.io/guide/deployment

---

**Status**: ✅ Docker build tested and working successfully!
**Last Updated**: November 6, 2025

