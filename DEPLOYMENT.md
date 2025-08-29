# 🚀 Deployment Guide

This guide covers deployment strategies, configuration, and best practices for the Recipe UI Service.

## 📋 Table of Contents

- [Deployment Overview](#-deployment-overview)
- [Local Development](#-local-development)
- [Docker Deployment](#-docker-deployment)
- [Production Deployment](#-production-deployment)
- [Environment Configuration](#️-environment-configuration)
- [Health Monitoring](#-health-monitoring)
- [Troubleshooting](#-troubleshooting)

## 🌐 Deployment Overview

### Deployment Targets

1. **Local Development**: Hot reload with Docker Compose
2. **Staging**: Container deployment with staging configs
3. **Production**: Enterprise-grade container deployment
4. **Edge**: CDN and edge optimization

### Architecture Patterns

- **Blue-Green Deployment**: Zero-downtime releases
- **Rolling Updates**: Gradual rollout strategy
- **Canary Deployment**: Risk-minimal feature releases
- **Multi-Region**: Geographic distribution

## 💻 Local Development

### Quick Start

```bash
# Clone and setup
git clone https://github.com/jsamuelsen/recipe-web-app.git
cd recipe-web-app/recipe-ui-service

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

### Docker Development

```bash
# Development with Docker
docker-compose --profile dev up recipe-ui-dev

# Production-like local testing
docker-compose up recipe-ui
```

## 🐳 Docker Deployment

### Building Production Image

```bash
# Build with build arguments
docker build \
  --build-arg APP_VERSION=1.0.0 \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  -t recipe-ui-service:latest .

# Multi-platform build
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag recipe-ui-service:latest \
  --push .
```

### Security-Hardened Deployment

```bash
# Run with security constraints
docker run -d \
  --name recipe-ui-service \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  --tmpfs /app/.next/cache:rw,noexec,nosuid,size=200m \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --security-opt=no-new-privileges:true \
  --user=1001:1001 \
  --memory=512m \
  --cpus="1.0" \
  -p 3000:3000 \
  --env-file=.env.production \
  recipe-ui-service:latest
```

## 🏭 Production Deployment

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: recipe-ui-service
  labels:
    app: recipe-ui-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: recipe-ui-service
  template:
    metadata:
      labels:
        app: recipe-ui-service
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
        - name: recipe-ui-service
          image: recipe-ui-service:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: 'production'
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '1000m'
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
```

### Service Configuration

```yaml
apiVersion: v1
kind: Service
metadata:
  name: recipe-ui-service
spec:
  selector:
    app: recipe-ui-service
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: recipe-ui-service
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
spec:
  tls:
    - hosts:
        - recipe-app.example.com
      secretName: recipe-ui-tls
  rules:
    - host: recipe-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: recipe-ui-service
                port:
                  number: 80
```

## ⚙️ Environment Configuration

### Required Environment Variables

```bash
# Core Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://recipe-app.example.com
NEXT_PUBLIC_API_URL=https://api.recipe-app.example.com

# Security
NEXTAUTH_SECRET=your-secure-secret-here
NEXTAUTH_URL=https://recipe-app.example.com

# External Services
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Environment-Specific Configs

#### Development (.env.local)

```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

#### Staging (.env.staging)

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.recipe-app.example.com
NEXT_PUBLIC_API_URL=https://staging-api.recipe-app.example.com
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

#### Production (.env.production)

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://recipe-app.example.com
NEXT_PUBLIC_API_URL=https://api.recipe-app.example.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
```

## 🏥 Health Monitoring

### Health Check Endpoint

```bash
# Check application health
curl https://recipe-app.example.com/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-12-28T10:00:00.000Z",
  "uptime": "3600s",
  "memory": {
    "rss": "45MB",
    "heapUsed": "32MB",
    "heapTotal": "55MB"
  },
  "environment": "production",
  "version": "1.0.0"
}
```

### Monitoring Metrics

```bash
# Key metrics to monitor
- Response time (< 200ms p95)
- Error rate (< 1%)
- Memory usage (< 400MB)
- CPU usage (< 80%)
- Request rate
- Core Web Vitals (LCP, FID, CLS)
```

### Alerting Thresholds

```yaml
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    duration: 5m

  - name: High Response Time
    condition: response_time_p95 > 500ms
    duration: 2m

  - name: High Memory Usage
    condition: memory_usage > 450MB
    duration: 10m

  - name: Service Down
    condition: health_check_failed
    duration: 30s
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear caches and rebuild
npm run clean:cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Container Issues

```bash
# Check container logs
docker logs recipe-ui-service

# Debug container interactively
docker run -it --entrypoint /bin/sh recipe-ui-service:latest

# Check resource usage
docker stats recipe-ui-service
```

### Performance Issues

#### Bundle Size

```bash
# Analyze bundle size
npm run analyze

# Check for large dependencies
npm run size-limit
```

#### Runtime Performance

```bash
# Profile with Lighthouse
npm run perf:lighthouse

# Monitor Core Web Vitals
npm run perf:vitals
```

### Security Issues

#### Container Security

```bash
# Scan for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image recipe-ui-service:latest

# Check Dockerfile best practices
hadolint Dockerfile
```

#### Dependency Security

```bash
# Audit dependencies
npm audit --audit-level high

# Check for secrets
npx secretlint .
```

## 📊 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security scans clean
- [ ] Performance benchmarks met
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Monitoring configured

### Deployment

- [ ] Blue-green deployment ready
- [ ] Health checks configured
- [ ] Load balancer updated
- [ ] SSL certificates valid
- [ ] CDN purged
- [ ] Monitoring alerts enabled

### Post-Deployment

- [ ] Health checks passing
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User flows working
- [ ] Rollback plan ready
- [ ] Team notified

## 🚀 Advanced Deployment Patterns

### Blue-Green Deployment

```bash
# Deploy to green environment
kubectl apply -f k8s/green-deployment.yaml

# Test green environment
curl -H "Host: recipe-app.example.com" http://green-service/api/health

# Switch traffic to green
kubectl patch service recipe-ui-service -p '{"spec":{"selector":{"version":"green"}}}'

# Cleanup blue environment
kubectl delete -f k8s/blue-deployment.yaml
```

### Canary Deployment

```bash
# Deploy canary version (10% traffic)
kubectl apply -f k8s/canary-deployment.yaml

# Monitor metrics
kubectl get pods -l version=canary

# Promote to 100% traffic
kubectl apply -f k8s/production-deployment.yaml
```

## 📞 Support

- **Deployment Issues**: [GitHub Issues](https://github.com/jsamuelsen/recipe-web-app/issues)
- **Documentation**: [GitHub Discussions](https://github.com/jsamuelsen/recipe-web-app/discussions)
- **Emergency Contact**: [jsamuelsen11@gmail.com](mailto:jsamuelsen11@gmail.com)
