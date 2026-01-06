# Contributing to Recipe UI Service

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to
this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Security](#security)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report
unacceptable behavior through the project's issue tracker.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/recipe-ui-service.git
   cd recipe-ui-service
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/Recipe-Web-App/recipe-ui-service.git
   ```

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Docker and Docker Compose (for backend services)

### Initial Setup

1. **Install dependencies**:

   ```bash
   npm ci
   ```

2. **Set up environment**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local configuration
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Run tests frequently**:

   ```bash
   npm test
   ```

4. **Commit your changes** following commit guidelines

5. **Keep your branch updated**:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

- Write unit tests for all new functionality
- Integration tests for API integration and user workflows
- E2E tests for critical user journeys
- Aim for 85%+ code coverage
- Test edge cases and error conditions

### Test Guidelines

- Use React Testing Library for component tests
- Use descriptive test names
- Mock API calls appropriately
- Include accessibility testing
- Clean up resources in test teardown

## Code Style

### Code Quality Commands

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Run linter (auto-fixes issues)
npm run lint

# Check linting without auto-fix
npm run lint:check

# Type checking
npm run type-check

# Run all checks
npm run quality
```

### Style Guidelines

- Follow TypeScript and React best practices
- Use meaningful variable and function names
- Keep functions small and focused
- Document complex logic
- Use proper TypeScript types (avoid `any`)
- Follow existing code patterns

### Project Structure

- `src/app/` - Next.js 15 App Router
- `src/components/` - React components
- `src/hooks/` - Service-specific React hooks
- `src/lib/api/` - API clients for microservices
- `src/types/` - TypeScript type definitions
- `src/stores/` - Zustand state stores

## Commit Guidelines

### Commit Message Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes
- `security`: Security fixes
- `deps`: Dependency updates

### Examples

```text
feat(recipe-card): add favorite button to recipe cards

Implements functionality to mark recipes as favorites.
Users can now click the heart icon to save recipes.

Closes #123
```

```text
fix(api): handle network timeout errors gracefully

Added retry logic and user-friendly error messages
for API timeout scenarios.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Run all checks**:

   ```bash
   npm run quality
   npm run test
   npm run build
   ```

2. **Update documentation** if needed:
   - README.md
   - CLAUDE.md
   - API documentation
   - Code comments

3. **Ensure no secrets** are committed:
   - Check for API keys, tokens, passwords
   - Review `.env` files
   - Use `.gitignore` appropriately

### PR Requirements

- [ ] Clear description of changes
- [ ] Related issue linked
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All CI checks passing
- [ ] No merge conflicts
- [ ] Commits follow convention
- [ ] No sensitive data committed

### PR Template

The project uses a PR template. Fill it out completely:

- Description of changes
- Type of change
- Testing performed
- Security considerations
- Breaking changes
- Performance impact

### Review Process

1. Maintainers will review your PR
2. Address feedback and requested changes
3. Keep PR updated with main branch
4. Once approved, maintainer will merge

### CI/CD Pipeline

PRs must pass:

- TypeScript build
- Unit tests
- Integration tests
- E2E tests
- Linting (ESLint)
- Type checking
- Code formatting checks
- Security scanning

## Security

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Use [GitHub Security Advisories](https://github.com/Recipe-Web-App/recipe-ui-service/security/advisories/new) to
report security issues privately.

### Security Guidelines

- Never commit secrets or credentials
- Validate all inputs
- Follow React security best practices
- Use secure dependencies
- Implement proper authentication/authorization
- Be cautious with user-generated content

## Questions?

- Check the [README](../README.md)
- Review [CLAUDE.md](../CLAUDE.md) for development commands
- Review existing [issues](https://github.com/Recipe-Web-App/recipe-ui-service/issues)
- Start a [discussion](https://github.com/Recipe-Web-App/recipe-ui-service/discussions)
- See [SUPPORT.md](SUPPORT.md) for help resources

Thank you for contributing!
