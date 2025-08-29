# 🚀 GitHub Actions Workflows Documentation

This document provides comprehensive documentation for all GitHub Actions workflows in this repository.
Our CI/CD pipeline is designed with enterprise-grade standards, security-first approach, and maximum
automation.

## 🎯 Overview

Our workflow system consists of **7 core workflows** that handle every aspect of the development lifecycle:

1. **🔄 CI Pipeline** - Core continuous integration
2. **🧪 Advanced Testing** - Comprehensive testing suite
3. **🛡️ Security & Compliance** - Security scanning and compliance checks
4. **🚀 Deployment Pipeline** - Production deployment with safety checks
5. **📦 Release Management** - Automated release creation and distribution
6. **⚡ Performance Monitoring** - Performance testing and monitoring
7. **🔧 Maintenance & Monitoring** - Repository health and automated maintenance

## 📊 Workflow Architecture

```mermaid
graph TD
    A[Push to Branch] --> B{Branch Type}
    B -->|Feature Branch| C[CI Pipeline]
    B -->|Main Branch| D[Full Pipeline]

    C --> E[Code Quality]
    C --> F[Security Scan]
    C --> G[Unit Tests]
    C --> H[Integration Tests]

    D --> I[Advanced Testing]
    D --> J[Performance Tests]
    D --> K[Deployment Pipeline]

    K --> L[Staging Deploy]
    L --> M[Production Approval]
    M --> N[Production Deploy]

    O[Schedule/Manual] --> P[Maintenance]
    O --> Q[Security Scans]

    R[Tag Push] --> S[Release Management]
```

---

## 1. 🔄 CI Pipeline (`ci.yml`)

### Purpose

Core continuous integration pipeline that runs on every push and pull request to ensure code quality and stability.

### Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual dispatch

### Jobs Overview

```yaml
Jobs: 7 parallel jobs + 1 consolidation job
Duration: ~10-15 minutes
Matrix: Node.js 18, 20, 22
```

#### Job Breakdown

1. **🔍 Code Quality**
   - ESLint analysis with 60+ rules
   - Prettier formatting validation
   - TypeScript type checking
   - Secret detection (Secretlint)

2. **🛡️ Security Scan**
   - npm audit for vulnerabilities
   - Dockerfile security (Hadolint)
   - Container scanning (Trivy)
   - CodeQL static analysis

3. **🧪 Unit Tests**
   - Jest test runner
   - Coverage reporting (Codecov)
   - Coverage threshold enforcement (90% for critical files)
   - Multi-Node.js version matrix

4. **🔗 Integration Tests**
   - Frontend integration tests (mocked APIs)
   - Backend integration tests (real endpoints)
   - Parallel execution for speed

5. **🏗️ Build Verification**
   - Next.js production build
   - Bundle size analysis
   - Build artifact caching

6. **⚡ Performance Validation**
   - Lighthouse CI performance audits
   - Bundle size limit enforcement
   - Core Web Vitals validation

7. **📦 Dependency Check**
   - Unused dependency detection (Knip)
   - Circular dependency detection (Madge)
   - License compliance verification

### Success Criteria

All jobs must pass for the CI pipeline to succeed. Failure in any job blocks merging.

### Notifications

- Slack notifications on main branch
- PR comments with coverage reports
- Security alerts for vulnerabilities

---

## 2. 🧪 Advanced Testing Suite (`test-suite.yml`)

### Purpose

Comprehensive testing across multiple browsers, devices, and scenarios to ensure application quality.

### Triggers

- Push/PR to main branches
- Daily scheduled runs (2 AM UTC)
- Manual dispatch with test type selection

### Jobs Overview

```yaml
Jobs: 7 specialized testing jobs
Duration: ~20-45 minutes
Matrix: 3 browsers × 4 shards (E2E), 3 OS × 2 browsers (Cross-browser)
```

#### Job Breakdown

1. **🎭 E2E Tests**
   - Playwright across Chromium, Firefox, WebKit
   - Sharded execution (4 parallel shards per browser)
   - Critical user journey validation
   - Automatic retry on failure

2. **👁️ Visual Regression**
   - Screenshot comparison testing
   - Component-level visual validation
   - Baseline management
   - Cross-browser visual consistency

3. **♿ Accessibility Tests**
   - axe-core compliance validation
   - WCAG 2.1 AA standard verification
   - Keyboard navigation testing
   - Screen reader compatibility

4. **⚡ Performance Tests**
   - Core Web Vitals measurement
   - Lighthouse performance audits
   - Load testing with realistic traffic
   - Performance budget enforcement

5. **🌐 Cross-Browser Tests**
   - Ubuntu, macOS, Windows testing
   - Multiple browser combinations
   - Platform-specific behavior validation

6. **📱 Mobile Tests**
   - iPhone, Android, iPad simulation
   - Touch interaction testing
   - Responsive design validation

7. **📊 Test Report Consolidation**
   - Unified test reporting
   - Artifact management
   - PR comment integration

### Test Types Selection

Manual dispatch allows selective test execution:

- `all` - Complete test suite
- `e2e` - End-to-end tests only
- `visual` - Visual regression only
- `accessibility` - A11y tests only
- `performance` - Performance tests only
- `cross-browser` - Cross-browser validation

---

## 3. 🛡️ Security & Compliance (`security.yml`)

### Purpose

Multi-layered security scanning and compliance validation to ensure application security.

### Triggers

- Push/PR to main branches
- Daily scheduled scans (1 AM UTC)
- Manual dispatch with scan type selection

### Jobs Overview

```yaml
Jobs: 6 security domains + 1 compliance report
Duration: ~15-25 minutes
Security Tools: 15+ integrated scanners
```

#### Job Breakdown

1. **🔍 SAST Analysis**
   - CodeQL static analysis
   - Semgrep security patterns
   - ESLint security plugin
   - Custom security rules

2. **📦 Dependency Security**
   - npm audit vulnerability scanning
   - Snyk dependency analysis
   - License compliance checking
   - SBOM (Software Bill of Materials) generation

3. **🐳 Container Security**
   - Hadolint Dockerfile analysis
   - Trivy container vulnerability scanning
   - Docker Scout security analysis
   - Multi-stage build security

4. **🔐 Secret Detection**
   - Secretlint pattern matching
   - TruffleHog secret scanning
   - GitLeaks historical analysis
   - Custom secret patterns

5. **☸️ Kubernetes Security**
   - kube-score best practices
   - kubeval manifest validation
   - Conftest policy enforcement (OPA)
   - Kubesec security scoring

6. **📋 Compliance Report**
   - Unified security dashboard
   - Risk assessment scoring
   - Compliance status tracking
   - Remediation recommendations

### Security Standards

- **SAST**: Static Application Security Testing
- **SCA**: Software Composition Analysis
- **Container**: Container and Infrastructure Security
- **Secrets**: Secret and Credential Management
- **Policy**: Security Policy Enforcement

### Compliance Integration

- SARIF format for GitHub Security tab
- Automated security advisory creation
- Integration with security information systems
- Audit trail maintenance

---

## 4. 🚀 Deployment Pipeline (`deploy.yml`)

### Purpose

Production-ready deployment pipeline with blue-green deployment strategy and comprehensive safety checks.

### Triggers

- Push to `main` branch
- Git tags (`v*.*.*`)
- Manual dispatch with environment selection

### Jobs Overview

```yaml
Jobs: 7 deployment stages
Duration: ~25-40 minutes
Strategy: Blue-Green Deployment
Environments: Staging → Production
```

#### Job Breakdown

1. **✅ Pre-deployment Checks**
   - Security pre-flight validation
   - Critical test execution
   - Build verification
   - Version extraction

2. **🐳 Build & Push Image**
   - Multi-arch Docker builds (amd64, arm64)
   - Container signing (Cosign)
   - SBOM generation
   - Security scanning

3. **🎪 Deploy to Staging**
   - Kubernetes deployment
   - Health check validation
   - Smoke test execution
   - Environment verification

4. **🔗 Staging Integration Tests**
   - Full integration test suite
   - Performance validation
   - End-to-end testing
   - User acceptance criteria

5. **🔐 Production Approval**
   - Manual approval gate
   - Stakeholder notification
   - Deployment readiness check
   - Change management integration

6. **🌟 Deploy to Production**
   - Blue-green deployment strategy
   - Traffic switching validation
   - Soak period monitoring
   - Automatic rollback capability

7. **📊 Post-deployment Monitoring**
   - Performance monitoring
   - Health check validation
   - Success metrics collection
   - Alert configuration

### Deployment Strategy

#### Blue-Green Deployment

1. Deploy new version (Green) alongside current (Blue)
2. Validate Green deployment health
3. Switch traffic from Blue to Green
4. Monitor during soak period
5. Clean up Blue deployment on success

#### Safety Mechanisms

- **Health Checks**: Comprehensive application health validation
- **Rollback**: Automatic rollback on failure detection
- **Monitoring**: Real-time performance and error monitoring
- **Approvals**: Manual gates for production deployments

### Environment Configuration

- **Staging**: `staging.recipe-app.example.com`
- **Production**: `recipe-app.example.com`
- **Monitoring**: Integrated with alerting systems

---

## 5. 📦 Release Management (`release.yml`)

### Purpose

Automated release creation with semantic versioning, changelog generation, and multi-platform distribution.

### Triggers

- Push to `main` branch (auto-analysis)
- Manual dispatch with release type selection

### Jobs Overview

```yaml
Jobs: 7 release stages
Duration: ~20-35 minutes
Strategy: Conventional Commits → Semantic Versioning
Artifacts: GitHub Release, Docker Images, Platform Binaries
```

#### Job Breakdown

1. **🔍 Analyze Commits**
   - Conventional commit parsing
   - Semantic version calculation
   - Breaking change detection
   - Changelog generation

2. **📝 Create Release PR**
   - Version bump automation
   - CHANGELOG.md updates
   - Release branch creation
   - PR with release notes

3. **🏗️ Build Release Assets**
   - Multi-platform binary builds
   - Archive creation (tar.gz, zip)
   - Asset verification
   - Platform-specific packaging

4. **🎉 Create GitHub Release**
   - Git tag creation
   - Release notes generation
   - Asset upload
   - Release publication

5. **🐳 Build Release Images**
   - Multi-arch Docker builds
   - Image signing and verification
   - Registry push (ghcr.io)
   - Latest tag management

6. **📚 Update Documentation**
   - Version badge updates
   - API documentation generation
   - Release documentation
   - Change log maintenance

7. **📢 Post-release Notifications**
   - Team notifications
   - Release announcements
   - Integration webhooks
   - Success confirmations

### Release Types

#### Semantic Versioning

- **Major** (`X.0.0`): Breaking changes (`feat!:`, `BREAKING CHANGE`)
- **Minor** (`0.X.0`): New features (`feat:`)
- **Patch** (`0.0.X`): Bug fixes (`fix:`)
- **Prerelease** (`0.0.0-beta.X`): Beta releases

#### Conventional Commits

```text
feat: add new recipe search functionality
fix: resolve authentication token expiry
feat!: change API response structure
docs: update deployment documentation
```

### Distribution Channels

- **GitHub Releases**: Source code and binaries
- **Container Registry**: Docker images (ghcr.io)
- **npm Registry**: Package distribution (if applicable)
- **Documentation Sites**: Auto-generated docs

---

## 6. ⚡ Performance Monitoring (`performance.yml`)

### Purpose

Comprehensive performance testing and monitoring to ensure optimal application performance.

### Triggers

- Push/PR to main branches
- Daily performance tests (3 AM UTC)
- Weekly comprehensive analysis (Sundays 2 AM UTC)
- Manual dispatch with test type selection

### Jobs Overview

```yaml
Jobs: 6 performance domains + 1 regression analysis
Duration: ~20-30 minutes
Tools: Lighthouse, Playwright, Clinic.js, Autocannon
```

#### Job Breakdown

1. **🏮 Lighthouse Audit**
   - Performance score validation
   - Core Web Vitals measurement
   - Best practices compliance
   - SEO optimization checks
   - Matrix: 4 pages × 2 devices

2. **🎯 Core Web Vitals**
   - LCP (Largest Contentful Paint) < 2.5s
   - CLS (Cumulative Layout Shift) < 0.1
   - FID (First Input Delay) < 100ms
   - FCP (First Contentful Paint) < 1.8s
   - TTFB (Time to First Byte) < 600ms

3. **🔥 Load Testing**
   - Concurrent user simulation
   - Response time measurement
   - Throughput analysis
   - Error rate monitoring
   - Scenarios: Normal, Peak, Stress testing

4. **📦 Bundle Analysis**
   - Bundle size monitoring
   - Code splitting validation
   - Dependency analysis
   - Performance budget enforcement
   - Tree shaking effectiveness

5. **🧠 Memory Profiling**
   - Memory usage analysis
   - Leak detection
   - GC performance monitoring
   - Resource optimization
   - Clinic.js integration

6. **📈 Regression Detection**
   - Performance comparison
   - Baseline establishment
   - Trend analysis
   - Alert generation
   - PR performance impact

### Performance Thresholds

#### Load Testing Scenarios

```yaml
Normal Load: 50 users,  300s duration, <500ms P95, >100 RPS
Peak Load: 200 users,  180s duration, <1000ms P95, >50 RPS
Stress Test: 500 users,  120s duration, <2000ms P95, >20 RPS
```

#### Bundle Size Limits

```yaml
Total Bundle: < 250KB gzipped
First Load JS: < 128KB gzipped
Largest Bundle: < 244KB gzipped
```

### Performance Budget

Automated enforcement of performance budgets with build failure on regression.

---

## 7. 🔧 Maintenance & Monitoring (`maintenance.yml`)

### Purpose

Automated repository maintenance, health monitoring, and proactive issue detection.

### Triggers

- Daily maintenance (4 AM UTC)
- Weekly comprehensive maintenance (Sundays 1 AM UTC)
- Monthly deep maintenance (1st day 12 AM UTC)
- Manual dispatch with maintenance type selection

### Jobs Overview

```yaml
Jobs: 6 maintenance domains + 1 comprehensive summary
Duration: ~15-25 minutes
Health Score: 0-100 repository health rating
```

#### Job Breakdown

1. **🏥 Repository Health**
   - Dependency freshness analysis
   - Security vulnerability assessment
   - Code quality metrics
   - Test coverage validation
   - Overall health scoring (0-100)

2. **📦 Dependency Management**
   - Outdated package identification
   - Unused dependency detection
   - Security audit execution
   - License compliance verification
   - Clean installation verification

3. **🔒 Security Maintenance**
   - Secret detection scanning
   - Git history analysis
   - Certificate status checking
   - Security policy validation
   - Vulnerability trend analysis

4. **🧹 Repository Cleanup**
   - Old workflow run cleanup
   - Stale issue management
   - PR lifecycle management
   - Branch cleanup recommendations
   - Storage optimization

5. **💾 Backup Validation**
   - Repository integrity checking
   - Backup completeness verification
   - Critical file validation
   - Cloud backup status
   - Recovery procedure testing

6. **📊 Monitoring & Alerts**
   - Health threshold monitoring
   - Trend analysis and alerting
   - Performance baseline tracking
   - Incident response preparation
   - Dashboard generation

### Health Scoring System

#### Score Calculation

```yaml
Base Score: 100 points
Deductions:
  - Critical vulnerabilities: -30 points each
  - High vulnerabilities: -15 points each
  - >10 outdated dependencies: -10 points
  - >5 unused dependencies: -5 points
  - Coverage below threshold: -10 points
  - >5 large files (500+ lines): -5 points
```

#### Health Status

- **90-100**: ✅ Excellent - Repository in great shape
- **80-89**: 🟡 Good - Minor issues to address
- **70-79**: 🟠 Fair - Needs attention
- **<70**: 🔴 Poor - Immediate action required

### Automated Actions

- **Dependency Updates**: Via Renovate integration
- **Security Patches**: Auto-merge critical security updates
- **Cleanup Tasks**: Old data and artifact removal
- **Health Reporting**: Regular health status updates

---

## 🔄 Dependency Management (Renovate)

### Purpose

Intelligent dependency management with automated updates, security patching, and compatibility testing.

### Configuration (`renovate.json`)

Enterprise-grade Renovate configuration with sophisticated update strategies and security-first approach.

### Key Features

#### 🚨 Security-First Approach

```json
{
  "vulnerabilityAlerts": {
    "enabled": true,
    "schedule": ["at any time"],
    "automerge": true,
    "prPriority": 10
  }
}
```

#### 📦 Intelligent Grouping

- **Security Updates**: Immediate, auto-merged
- **Dev Dependencies**: Auto-merge patches
- **Framework Updates**: Careful review (Next.js, React)
- **Testing Tools**: Grouped updates
- **Build Tools**: Batched updates

#### ⏰ Smart Scheduling

```yaml
Security: At any time (immediate)
Dev Patches: Immediate
Production: Weekdays 3-5 AM UTC
Minor Updates: Mondays 3-5 AM UTC
Major Updates: Sundays 3-5 AM UTC
```

#### 🔍 Update Strategy

- **Patch**: Auto-merge for dev dependencies
- **Minor**: Grouped by category
- **Major**: Manual review required, 7-day aging
- **Security**: Immediate with thorough testing

### Package Categories

1. **🚨 Security Updates**
   - Highest priority
   - Auto-merge enabled
   - Immediate deployment

2. **⚡ Framework Updates**
   - Next.js, React, Node.js
   - 5-day minimum aging
   - Manual review required

3. **🧪 Testing Tools**
   - Jest, Playwright, Testing Library
   - Grouped updates on Fridays
   - Automated compatibility testing

4. **📏 Code Quality**
   - ESLint, Prettier, TypeScript
   - Auto-merge enabled
   - Grouped updates on Thursdays

5. **🎨 UI/Styling**
   - TailwindCSS, UI libraries
   - Grouped updates on Saturdays
   - Visual regression testing

### Quality Gates

- **Status Checks**: All CI checks must pass
- **Test Coverage**: Maintain coverage thresholds
- **Performance**: Bundle size limits enforced
- **Security**: No new vulnerabilities introduced

---

## 🚀 Getting Started

### 1. Repository Setup

Ensure the following secrets are configured in your repository:

```yaml
Required Secrets:
  GITHUB_TOKEN: GitHub personal access token
  RELEASE_TOKEN: Token with release permissions
  SLACK_WEBHOOK_URL: Slack notification webhook
  CODECOV_TOKEN: Code coverage reporting
  LIGHTHOUSE_CI_TOKEN: Lighthouse CI integration

Optional Secrets:
  SNYK_TOKEN: Snyk security scanning
  SEMGREP_APP_TOKEN: Semgrep security analysis
  DOCKER_SCOUT_TOKEN: Docker security scanning
  STAGING_KUBECONFIG: Staging Kubernetes config
  PRODUCTION_KUBECONFIG: Production Kubernetes config
```

### 2. Branch Protection

Configure branch protection rules for `main`:

```yaml
Required:
  - Require status checks to pass
  - Require branches to be up to date
  - Require review from code owners
  - Dismiss stale reviews
  - Require signed commits

Status Checks:
  - ci/github-actions-ci
  - security/github-actions-security
  - test-suite/advanced-testing
```

### 3. Environment Configuration

Set up GitHub environments:

```yaml
Environments:
  - staging (auto-deploy)
  - production-approval (manual approval)
  - production (protected)
```

### 4. Renovate Setup

Enable Renovate app in your repository and ensure the configuration file is present.

---

## 📊 Monitoring & Observability

### Workflow Monitoring

Track workflow performance and success rates:

- **Success Rate**: Target >95% for all workflows
- **Duration Monitoring**: Alert on significant increases
- **Failure Analysis**: Root cause analysis for failures
- **Resource Usage**: Monitor runner usage and costs

### Performance Baselines

Maintain performance baselines and alert on regressions:

- **Core Web Vitals**: Monthly baseline updates
- **Bundle Size**: Progressive size limit adjustments
- **Test Duration**: Optimize for faster feedback
- **Deployment Time**: Target <20 minutes for full deployment

### Security Monitoring

Continuous security posture monitoring:

- **Vulnerability Trends**: Track vulnerability introduction/resolution
- **Dependency Health**: Monitor dependency age and security
- **Secret Detection**: Prevent credential leakage
- **Compliance Drift**: Maintain security compliance standards

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. CI Pipeline Failures

```bash
# Check logs in GitHub Actions
# Common causes:
- Test failures
- Linting errors
- Security vulnerabilities
- Build issues
```

#### 2. Deployment Issues

```bash
# Kubernetes deployment problems:
kubectl get pods -n staging
kubectl logs -f deployment/recipe-ui-service -n staging

# Health check failures:
curl -f https://staging.recipe-app.example.com/api/health
```

#### 3. Performance Regressions

```bash
# Bundle size analysis:
npm run analyze

# Performance profiling:
npm run perf:vitals
npm run perf:lighthouse
```

#### 4. Security Scan Failures

```bash
# Local security scanning:
npm audit --audit-level=high
npx secretlint "**/*"
```

### Debug Mode

Enable debug mode for workflows by setting repository variable:

```yaml
ACTIONS_STEP_DEBUG: true
ACTIONS_RUNNER_DEBUG: true
```

---

## 🎯 Best Practices

### 1. Commit Messages

Use conventional commits for automatic release management:

```bash
feat: add user authentication system
fix: resolve memory leak in data processing
feat!: change API response format (breaking change)
docs: update deployment documentation
test: add integration tests for payment flow
```

### 2. Pull Request Guidelines

- **Small, focused changes**: Easier to review and test
- **Descriptive titles**: Clear description of changes
- **Test coverage**: Ensure adequate test coverage
- **Documentation**: Update docs for user-facing changes
- **Performance impact**: Consider bundle size and performance

### 3. Security Guidelines

- **No secrets in code**: Use environment variables and secrets management
- **Regular updates**: Keep dependencies updated
- **Least privilege**: Minimal required permissions
- **Audit trail**: Maintain comprehensive logs

### 4. Performance Guidelines

- **Bundle size awareness**: Monitor and optimize bundle size
- **Code splitting**: Implement proper code splitting
- **Image optimization**: Optimize images and assets
- **Caching strategy**: Implement effective caching

---

## 📚 Additional Resources

### Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Renovate Configuration Reference](https://docs.renovatebot.com/)
- [Semantic Versioning Specification](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Tools & Integrations

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Playwright](https://playwright.dev/)
- [CodeQL](https://codeql.github.com/)
- [Trivy](https://trivy.dev/)

### Community

- [GitHub Community](https://github.community/)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [DevSecOps Community](https://www.devsecops.org/)

---

## 🤝 Contributing

When contributing to workflow improvements:

1. **Test locally**: Use `act` or similar tools for local testing
2. **Incremental changes**: Make small, testable improvements
3. **Documentation**: Update this documentation for changes
4. **Validation**: Ensure all existing functionality continues to work
5. **Security review**: Consider security implications of changes

### Workflow Development

```bash
# Install act for local testing
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test workflow locally
act -W .github/workflows/ci.yml
```

---

**Generated**: This documentation is automatically updated as workflows evolve. Last updated: $(date)

**Maintainer**: [Jonathan Samuelsen](mailto:jsamuelsen11@gmail.com)
**Support**: [GitHub Issues](https://github.com/your-org/your-repo/issues)
