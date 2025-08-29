# Contributing to Recipe UI Service

Thank you for your interest in contributing to Recipe UI Service! This document provides guidelines and
instructions for contributing to the project.

## 🚀 Getting Started

### Development Setup

1. **Fork the repository** and clone your fork:

   ```bash
   git clone https://github.com/your-username/recipe-web-app.git
   cd recipe-web-app/recipe-ui-service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Standards

- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code will be automatically formatted on save and commit
- **Components**: Keep components small, focused, and reusable
- **Testing**: Add tests for new features and bug fixes

### Project Structure

Follow the established folder structure:

```text
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── stores/             # State management
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

### Naming Conventions

- **Files**: Use kebab-case for file names (`recipe-card.tsx`)
- **Components**: Use PascalCase (`RecipeCard`)
- **Functions/Variables**: Use camelCase (`getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Types/Interfaces**: Use PascalCase (`User`, `ApiResponse`)

## 🧪 Testing

### Test Requirements

- **Unit tests** for utilities and pure functions
- **Component tests** for React components
- **Integration tests** for complex interactions
- **E2E tests** for critical user flows

### Running Tests

```bash
# Unit tests
npm run test
npm run test:watch
npm run test:coverage

# End-to-end tests
npm run test:e2e
npm run test:e2e:headed
```

### Test Structure

- Place component tests next to the component or in `__tests__/`
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies appropriately

## 🏗️ Code Quality

### Pre-commit Hooks

The project uses Husky and lint-staged to ensure code quality:

- **Linting**: ESLint runs on staged files
- **Formatting**: Prettier formats code automatically
- **Type checking**: TypeScript validates types

### Manual Quality Checks

```bash
# Linting
npm run lint
npm run lint:check

# Formatting
npm run format
npm run format:check

# Type checking
npm run type-check
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Run quality checks:**

   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Update documentation** if needed

5. **Commit your changes** with clear, descriptive messages:

   ```bash
   git commit -m "feat: add recipe search functionality"
   ```

### PR Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Tests**: Include relevant test changes
- **Documentation**: Update docs for significant changes
- **Breaking Changes**: Clearly document any breaking changes

### Review Process

1. All PRs require code review
2. Automated checks must pass (linting, tests, type checking)
3. Address reviewer feedback promptly
4. Maintainers will merge approved PRs

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Reproduce the bug** with minimal steps
3. **Check recent changes** that might be related

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**

- OS: [e.g. macOS]
- Browser: [e.g. Chrome]
- Version: [e.g. 22]
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** for similar requests
2. **Consider the scope** - does it fit the project goals?
3. **Think about implementation** - is it feasible?

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you like it to work?

**Alternatives Considered**
Other solutions you considered

**Additional Context**
Any other relevant information
```

## 🏷️ Commit Message Guidelines

Use conventional commits for clear change history:

### Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add user authentication system
fix(api): handle network timeout errors
docs: update contributing guidelines
test(components): add unit tests for RecipeCard
```

## 📚 Additional Resources

- **Architecture**: Review existing code patterns before implementing
- **Dependencies**: Prefer existing dependencies over adding new ones
- **Performance**: Consider performance implications of changes
- **Accessibility**: Ensure new UI components are accessible
- **Security**: Follow security best practices for sensitive data

## 🤝 Community Guidelines

- **Be respectful** and constructive in all interactions
- **Help others** learn and grow
- **Ask questions** when you're unsure
- **Share knowledge** through clear documentation
- **Celebrate successes** and learn from mistakes

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Code Review**: Request feedback on complex changes
- **Documentation**: Check existing docs first

Thank you for contributing to Recipe UI Service! 🎉
