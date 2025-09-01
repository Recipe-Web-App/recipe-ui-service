# Recipe UI Service - Production Dockerfile
# Multi-stage build for optimal production image size

# syntax=docker/dockerfile:1.7
# escape=\

# Global build arguments
ARG APP_VERSION
ARG BUILD_DATE
ARG VCS_REF

# Stage 1: Dependencies
FROM node:23-alpine3.19 AS deps
LABEL stage=deps \
      org.opencontainers.image.title="Recipe UI Service - Dependencies" \
      org.opencontainers.image.description="Dependencies stage for Recipe UI Service" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="Recipe App Team" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/jsamuelsen/recipe-web-app"

WORKDIR /app

# Install security updates and required packages
# Using latest versions from Alpine 3.19 repository
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        libc6-compat \
        ca-certificates \
        tzdata && \
    rm -rf /var/cache/apk/*

# Set timezone
ENV TZ=UTC

# Copy package files with specific ownership
COPY --chown=node:node package*.json ./

# Verify package integrity and install dependencies
RUN npm ci --only=production --frozen-lockfile --audit=false --fund=false && \
    npm cache clean --force

# Remove package files to reduce attack surface
RUN rm -f package*.json

# Stage 2: Builder
FROM node:23-alpine3.19 AS builder
LABEL stage=builder \
      org.opencontainers.image.title="Recipe UI Service - Builder" \
      org.opencontainers.image.description="Build stage for Recipe UI Service" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}"

WORKDIR /app

# Install build dependencies
# Using latest versions from Alpine 3.19 repository
RUN apk add --no-cache \
        python3 \
        make \
        g++ \
        git && \
    rm -rf /var/cache/apk/*

# Copy production node_modules from deps stage
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy package files
COPY --chown=node:node package*.json ./

# Install all dependencies (including devDependencies) with mount cache
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/.next/cache \
    npm ci --frozen-lockfile --prefer-offline

# Copy source code with proper ownership and .dockerignore respect
COPY --chown=node:node . .

# Set build environment variables
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=2048" \
    GENERATE_SOURCEMAP=false

# Build the application with optimizations
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build && \
    npm run analyze && \
    npm prune --production && \
    npm cache clean --force

# Verify build artifacts
RUN test -d .next || (echo "Build failed: .next not found" && exit 1)

# Stage 3: Runtime Security Scanner (Optional)
FROM builder AS security-scanner
LABEL stage=security-scanner

# Install security scanning tools
# Using latest versions from Alpine 3.19 repository
RUN apk add --no-cache \
        curl \
        jq && \
    rm -rf /var/cache/apk/*

# Run security scans (optional, can be skipped in CI)
RUN npm audit --production --audit-level=high || true

# Stage 4: Final Runtime
FROM node:23-alpine3.19 AS runner
LABEL stage=runner \
      org.opencontainers.image.title="Recipe UI Service" \
      org.opencontainers.image.description="Production-ready Recipe UI Service" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="Recipe App Team" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/jsamuelsen/recipe-web-app" \
      org.opencontainers.image.documentation="https://github.com/jsamuelsen/recipe-web-app/tree/main/recipe-ui-service" \
      org.opencontainers.image.authors="Jonathan Samuelsen <jsamuelsen11@gmail.com>" \
      maintainer="Recipe App Team"

# Install runtime security updates and essential packages
# Using latest versions from Alpine 3.19 repository
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        ca-certificates \
        tzdata \
        tini && \
    rm -rf /var/cache/apk/* && \
    # Create app directory with secure permissions
    mkdir -p /app && \
    # Create non-root user with specific UID/GID
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs --home /app nextjs

# Set secure environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--unhandled-rejections=strict --enable-source-maps" \
    TZ=UTC \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    # Security hardening
    NODE_TLS_REJECT_UNAUTHORIZED=1

WORKDIR /app

# Copy built application with proper ownership and minimal files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Health checks handled by Kubernetes probes

# Set final permissions and switch to non-root user
RUN chown -R nextjs:nodejs /app && \
    chmod 755 /app
USER nextjs

# Create non-root owned directories for Next.js
RUN mkdir -p .next/cache && \
    mkdir -p .next/server && \
    chmod 755 .next/cache .next/server

# Expose port (non-privileged)
EXPOSE 3000

# Health checks handled by Kubernetes probes in production

# Add resource limits and performance optimizations
ENV NODE_OPTIONS="--max-old-space-size=896"

# Use tini for proper signal handling (alternative to dumb-init)
ENTRYPOINT ["tini", "--"]

# Add startup script with graceful shutdown
CMD ["sh", "-c", "trap 'echo Received SIGTERM, shutting down gracefully; kill -TERM $PID; wait $PID' TERM; npm start & PID=$!; wait $PID"]

# Add build metadata as labels (populated by CI/CD)
LABEL build.number="${BUILD_NUMBER:-unknown}" \
      build.url="${BUILD_URL:-unknown}" \
      git.branch="${GIT_BRANCH:-unknown}" \
      git.commit="${GIT_COMMIT:-unknown}"

# Security: Run as non-root, read-only root filesystem ready
# Note: Use --read-only flag when running the container
# docker run --read-only --tmpfs /tmp --tmpfs /app/.next/cache recipe-ui-service
