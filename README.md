# Recipe UI Service

[![Build Status](https://github.com/jsamuelsen/recipe-web-app/workflows/CI/badge.svg)](https://github.com/jsamuelsen/recipe-web-app/actions)
[![Security Scan](https://github.com/jsamuelsen/recipe-web-app/workflows/Security/badge.svg)](https://github.com/jsamuelsen/recipe-web-app/actions)
[![Test Coverage](https://codecov.io/gh/jsamuelsen/recipe-web-app/branch/main/graph/badge.svg)](https://codecov.io/gh/jsamuelsen/recipe-web-app)
[![Performance](https://img.shields.io/badge/lighthouse-95%2B-brightgreen)](https://github.com/jsamuelsen/recipe-web-app)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-%3C250kb-success)](https://github.com/jsamuelsen/recipe-web-app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, scalable Next.js application for recipe management with server-side rendering, built with
enterprise-grade tooling and best practices.

## 🌐 Live Demo

- **Production**: [https://recipe-app.example.com](https://recipe-app.example.com)
- **Staging**: [https://staging.recipe-app.example.com](https://staging.recipe-app.example.com)
- **Storybook**: [https://storybook.recipe-app.example.com](https://storybook.recipe-app.example.com)

## 📊 Project Status

| Metric            | Value      | Target |
| ----------------- | ---------- | ------ |
| Build Status      | ✅ Passing | 100%   |
| Test Coverage     | 85%        | 90%    |
| Security Score    | A+         | A+     |
| Performance Score | 95/100     | 90+    |
| Bundle Size       | 245KB      | <250KB |
| Core Web Vitals   | Good       | Good   |

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Server-Side Rendering** for optimal performance and SEO
- **Modern State Management** with Zustand and TanStack Query
- **Comprehensive Testing** with Jest, React Testing Library, and Playwright
- **Code Quality** with ESLint (60+ rules), Prettier, and pre-commit hooks
- **Styling** with TailwindCSS and custom design system
- **Performance Monitoring** with Core Web Vitals and Lighthouse CI
- **Security First** with automated scanning and vulnerability detection
- **Production Ready** with Docker, Kubernetes, and blue-green deployment
- **Enterprise DevOps** with GitHub Actions and automated workflows
- **Dependency Management** with Renovate and security patching

## 📁 Project Structure

```text
src/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks (service-specific)
│   ├── auth/           # Authentication hooks
│   ├── recipe-management/ # Recipe management hooks
│   ├── recipe-scraper/ # Recipe scraper hooks
│   ├── media-management/ # Media management hooks
│   ├── meal-plan-management/ # Meal plan hooks
│   └── user-management/ # User management hooks
├── lib/                # Utilities, API clients, configurations
│   ├── api/            # Microservice API clients
│   │   ├── auth/       # Auth service client
│   │   ├── recipe-management/ # Recipe management client
│   │   ├── recipe-scraper/ # Recipe scraper client
│   │   ├── media-management/ # Media management client
│   │   ├── meal-plan-management/ # Meal plan client
│   │   └── user-management/ # User management client
│   ├── auth/           # Authentication utilities
│   └── utils/          # General utilities
├── stores/             # Zustand state management stores
│   └── ui/             # UI state stores (12 specialized stores)
│       ├── toast-store.ts # Notification management
│       ├── theme-store.ts # Theme & system preferences
│       ├── navigation-store.ts # Navigation state
│       ├── modal-store.ts # Modal stack management
│       ├── loading-store.ts # Loading states
│       ├── search-filter-store.ts # Search & filters
│       ├── layout-store.ts # Layout & pagination
│       ├── interaction-store.ts # User interactions
│       ├── offline-store.ts # Offline & sync
│       ├── accessibility-store.ts # A11y preferences
│       ├── feature-store.ts # Feature flags
│       └── preference-store.ts # User preferences
├── types/              # TypeScript type definitions
│   ├── auth/           # Authentication types
│   ├── recipe-management/ # Recipe management types
│   ├── recipe-scraper/ # Recipe scraper types
│   ├── media-management/ # Media management types
│   ├── meal-plan-management/ # Meal plan types
│   ├── user-management/ # User management types
│   └── ui/             # UI state types
├── styles/             # Global styles and themes
├── utils/              # Helper functions
└── constants/          # App constants and configuration
```

## 🛠️ Tech Stack

### Core

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework

### State Management & Data Fetching

- **TanStack Query** - Server state management with caching and synchronization
- **Zustand** - Client state management with 12 specialized UI stores
  - Toast notifications, Theme management, Navigation state
  - Modal stack, Loading states, Search & filters
  - Layout & pagination, User interactions, Offline support
  - Accessibility, Feature flags, User preferences
- **Axios** - HTTP client with interceptors for auth and error handling

### Development & Quality Tools

- **ESLint** - 60+ rules covering security, performance, and accessibility
- **Prettier** - Code formatting with TailwindCSS plugin
- **TypeScript** - Strict mode with comprehensive type checking
- **Husky** - Git hooks for quality gates
- **lint-staged** - Multi-stage pre-commit pipeline
- **Renovate** - Automated dependency management

### Testing & Quality Assurance

- **Jest** - Unit testing with 90% coverage target
- **React Testing Library** - Component testing
- **Playwright** - E2E testing across 3 browsers
- **Visual Regression** - Screenshot comparison testing
- **Accessibility Testing** - WCAG 2.1 compliance
- **Performance Testing** - Core Web Vitals validation

### DevOps & Production

- **GitHub Actions** - 7 comprehensive CI/CD workflows
- **Docker** - Multi-arch container builds
- **Kubernetes** - Production deployment with health checks
- **Security Scanning** - Multi-layered vulnerability detection
- **Performance Monitoring** - Lighthouse CI and bundle analysis
- **Blue-Green Deployment** - Zero-downtime production releases

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd recipe-ui-service
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development

#### Quick Start (Recommended)

```bash
# One-time security tool setup (required for enterprise features)
./scripts/setup-security-tools.sh  # Install security tools (gitleaks, semgrep, trivy, etc.)

# Development workflow
npm run setup       # Complete setup: install dependencies and build
npm run dev         # Start development server
npm run test        # Run all tests
npm run quality     # Run quality checks (lint, type-check, test)
npm run validate    # Run comprehensive validation (quality + security + performance)
npm run validate:security  # Run all security scans (7-layer validation)
npm run docs:lint   # Fix documentation formatting
npm run deps:check  # Check for circular dependencies and unused code
```

> **Note**: Core tools are included as dev dependencies. Security tools require one-time setup via the included
> script for enterprise-grade validation.

#### NPM Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - Lint and fix code issues
- `npm run lint:check` - Check for linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - TypeScript type checking

### Testing

- `npm run test` - Run all Jest tests
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests
- `npm run test:integration:frontend` - Frontend integration tests
- `npm run test:integration:backend` - Backend integration tests
- `npm run test:e2e` - End-to-end tests with Playwright
- `npm run test:performance` - Performance testing suite
- `npm run test:visual` - Visual regression tests
- `npm run test:a11y` - Accessibility compliance tests
- `npm run test:coverage` - Coverage report with thresholds
- `npm run test:watch` - Interactive test watcher

### Quality & Security

- `npm run knip` - Unused dependencies detection
- `npm run madge` - Circular dependency analysis
- `npm run size-limit` - Bundle size validation
- `npm audit` - Security vulnerability scan

### Performance & Analysis

- `npm run analyze` - Bundle composition analysis
- `npm run perf:lighthouse` - Lighthouse performance audit
- `npm run perf:vitals` - Core Web Vitals measurement
- `npm run perf:bundle` - Bundle performance validation

## 🏗️ Development Workflow

### Enterprise Development Workflow

#### 1. **Multi-Stage Quality Pipeline**

- **11-stage pre-commit hooks** with security, performance, and quality validation
- **TypeScript strict mode** with comprehensive type checking
- **60+ ESLint rules** covering security, performance, and accessibility
- **Automated dependency management** with Renovate

#### 2. **Comprehensive Testing Strategy**

- **Unit tests** (90% coverage target for critical files)
- **Frontend integration tests** with mocked APIs
- **Backend integration tests** with real endpoints
- **E2E tests** across 3 browsers with parallel execution
- **Visual regression tests** for UI consistency
- **Accessibility testing** for WCAG 2.1 compliance
- **Performance testing** with Core Web Vitals validation

#### 3. **Advanced State Management**

- **Server state** managed with TanStack Query for caching and synchronization
- **Client state** managed with Zustand for simplicity and performance
- **Authentication state** with secure token management
- **Optimistic updates** for enhanced user experience

#### 4. **Security-First Development**

- **Multi-layered security scanning** (SAST, SCA, Container, Secrets)
- **Automated vulnerability detection** and patching
- **Content Security Policy** enforcement
- **OWASP compliance** validation

#### 5. **Performance Optimization**

- **Bundle analysis** with size limits enforcement
- **Core Web Vitals** monitoring and optimization
- **Image optimization** with WebP/AVIF support
- **Code splitting** and tree shaking

## 🔧 Configuration

### Environment Variables

See `.env.example` for required environment variables:

#### Core Application

- `NEXT_PUBLIC_APP_URL` - Frontend app URL

#### Microservice Endpoints

- `NEXT_PUBLIC_AUTH_SERVICE_URL` - Authentication service URL (default: http://localhost:8081)
- `NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL` - Recipe management service URL (default: http://localhost:8082)
- `NEXT_PUBLIC_RECIPE_SCRAPER_SERVICE_URL` - Recipe scraper service URL (default: http://localhost:8083)
- `NEXT_PUBLIC_MEDIA_MANAGEMENT_SERVICE_URL` - Media management service URL (default: http://localhost:8084)
- `NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL` - User management service URL (default: http://localhost:8085)
- `NEXT_PUBLIC_MEAL_PLAN_MANAGEMENT_SERVICE_URL` - Meal plan management service URL (default: http://localhost:8086)

#### Additional Configuration

- Service-specific API keys and configurations as needed per microservice

### Microservices API Integration

The application is configured to communicate with multiple backend microservices:

#### Service Architecture

- **6 dedicated microservices** with service-specific API clients
- **Authentication service** - User authentication and authorization
- **Recipe management service** - Recipe CRUD operations and management
- **Recipe scraper service** - Web scraping and recipe import functionality
- **Media management service** - File upload, storage, and optimization
- **User management service** - User profiles and preferences
- **Meal plan management service** - Meal planning and scheduling

#### Integration Features

- **Service-specific API clients** with dedicated interceptors for authentication and error handling
- **Query hooks** organized by service for data fetching with proper caching
- **Mutation hooks** for data updates with optimistic updates
- **Health monitoring** for all microservices with automatic failover
- **Request tracing** with correlation IDs across services

## 🌍 Browser Support

| Browser       | Version | Status             |
| ------------- | ------- | ------------------ |
| Chrome        | 90+     | ✅ Fully Supported |
| Firefox       | 88+     | ✅ Fully Supported |
| Safari        | 14+     | ✅ Fully Supported |
| Edge          | 90+     | ✅ Fully Supported |
| Mobile Safari | 14+     | ✅ Fully Supported |
| Chrome Mobile | 90+     | ✅ Fully Supported |

## 🚀 Production Deployment

### Enterprise Deployment Strategy

- **Blue-Green Deployment** for zero-downtime releases
- **Multi-arch Docker builds** (amd64, arm64) with security scanning
- **Kubernetes orchestration** with health checks and auto-scaling
- **Container signing** with Cosign for supply chain security
- **SBOM generation** for compliance and security tracking

### Build Optimization

- **Turbopack** for faster builds and development
- **Bundle analysis** with automated size limit enforcement
- **Image optimization** with WebP/AVIF support and responsive loading
- **Security headers** and Content Security Policy enforcement
- **Performance budgets** with automated regression detection

### Performance Features

- **Server-Side Rendering** with streaming for improved TTFB
- **Static optimization** with ISR for dynamic content
- **Edge caching** with CDN integration
- **Core Web Vitals** optimization (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- **Resource preloading** and critical path optimization

## 🤝 Contributing

1. **Code Style**: Follow existing patterns and use provided tooling
2. **Testing**: Add tests for new features and bug fixes
3. **Documentation**: Update documentation for significant changes
4. **Git Hooks**: Pre-commit hooks will enforce code quality

### Development Guidelines

- Use TypeScript for all new code
- Follow the established folder structure
- Write tests for new components and utilities
- Use semantic commit messages
- Keep components small and focused

## 📚 Documentation

### Project Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - System design and patterns
- **[Performance Guide](PERFORMANCE.md)** - Optimization strategies
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment
- **[Testing Strategy](TESTING.md)** - Comprehensive testing guide
- **[GitHub Workflows](WORKFLOWS.md)** - CI/CD pipeline documentation
- **[UI/UX Design Guide](UI_GUIDE.md)** - Design system and component library
- **[Claude Code Guide](CLAUDE.md)** - AI-assisted development

### Planned Documentation

The following documentation is planned for future releases:

- **API Documentation** - Backend integration guide
- **Security Guide** - Security best practices and policies
- **Contributing Guidelines** - Development workflow and contribution process
- **Pre-commit Guide** - Quality pipeline setup and usage
- **Troubleshooting** - Common issues and solutions

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev/)
- [Renovate Configuration](https://docs.renovatebot.com/)

## 🏆 Quality Standards

This project maintains enterprise-grade quality standards with comprehensive validation:

### **Pre-commit Validation (Built-in)**

- **📝 Code Quality**: ESLint (60+ rules), Prettier, TypeScript strict mode
- **🔒 Security**: Multi-layer secret detection (secretlint + gitleaks), SAST analysis (semgrep)
- **🐳 Docker Security**: Container security scanning (hadolint + trivy)
- **☸️ Kubernetes**: Manifest validation (kubeval + conftest policy verification)
- **🧪 Testing**: Automated test execution on changes
- **📚 Documentation**: Markdown and YAML linting with formatting
- **🔄 Dependencies**: Circular dependency detection, unused code detection, vulnerability scanning
- **💼 Compliance**: License checking, conventional commit validation

### **Comprehensive Validation (npm scripts)**

- **🛡️ Security Analysis**:
  - `npm run security:scan` - Secret detection, SAST analysis with semgrep
  - `npm run security:deps` - Dependency vulnerabilities with trivy + npm audit
  - `npm run security:docker` - Container security with hadolint + trivy
  - `npm run security:k8s` - Kubernetes manifest validation
  - `npm run security:advanced` - Advanced repository and code analysis
- **⚡ Performance**: Bundle analysis via `npm run perf:bundle`
- **📊 Quality Gates**: `npm run validate` for full validation suite
- **🔍 Deep Analysis**: `npm run deps:check` for dependency analysis
- **🚀 Quick Setup**: `./scripts/setup-security-tools.sh` for automated tool installation

### **Quality Metrics**

- **🧪 Test Coverage**: 85%+ (90%+ for critical files)
- **🔒 Security Score**: A+ rating with 7-layer vulnerability detection (secrets, SAST, dependencies, containers,
  K8s, repository, advanced analysis)
- **⚡ Performance**: Lighthouse score 95+ with automated regression detection
- **📦 Bundle Size**: <250KB with automated enforcement and analysis
- **♿ Accessibility**: WCAG 2.1 AA compliance with automated testing
- **🚀 Deployment**: Zero-downtime with comprehensive pre-push validation

## 🔗 Related Microservices

### Backend Services

- **[Auth Service](../auth-service/)** - Authentication and authorization microservice
- **[Recipe Management Service](../recipe-management-service/)** - Recipe CRUD and management operations
- **[Recipe Scraper Service](../recipe-scraper-service/)** - Web scraping and recipe import functionality
- **[Media Management Service](../media-management-service/)** - File storage, upload, and media processing
- **[User Management Service](../user-management-service/)** - User profiles, preferences, and management
- **[Meal Plan Management Service](../meal-plan-management-service/)** - Meal planning and scheduling

### Supporting Projects

- **[Recipe Mobile App](../recipe-mobile-app/)** - React Native companion app
- **[Recipe Analytics](../recipe-analytics/)** - Data analytics and insights service
- **[Recipe Infrastructure](../infrastructure/)** - Kubernetes manifests, Terraform, and deployment configs
- **[API Gateway](../api-gateway/)** - Service mesh and API gateway configuration

## 📈 Metrics and Monitoring

### Development Metrics

- **Build Time**: ~2-3 minutes (with Turbopack)
- **Test Execution**: ~30-45 seconds (unit + integration)
- **Bundle Build**: ~15-20 seconds
- **E2E Test Suite**: ~5-8 minutes (parallel execution)

### Production Metrics

- **Average Load Time**: <2.5s (LCP)
- **Cumulative Layout Shift**: <0.1 (CLS)
- **First Input Delay**: <100ms (FID)
- **Time to First Byte**: <600ms (TTFB)
- **Uptime**: 99.9% SLA

## 🐛 Troubleshooting

### Quick Fixes

```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json && npm install

# Reset build cache
npm run build --clean

# Run full quality check
npm run lint && npm run type-check && npm run test

# Fix most formatting issues
npm run format && npm run lint
```

### Getting Help

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/jsamuelsen/recipe-web-app/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/jsamuelsen/recipe-web-app/discussions)
- **📖 Documentation**: Check our comprehensive docs above
- **🚀 Feature Requests**: Use our issue templates
- **🔒 Security Issues**: Report security vulnerabilities via [GitHub Security](https://github.com/jsamuelsen/recipe-web-app/security)

---

**Maintained by**: [Jonathan Samuelsen](https://github.com/jsamuelsen)
**Last Updated**: 2025-10-08
