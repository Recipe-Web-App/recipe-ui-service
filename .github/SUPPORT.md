# Support

Thank you for using the Recipe UI Service! This document provides resources to help you get support.

## Documentation

Before asking for help, please check our documentation:

### Primary Documentation

- **[README.md](../README.md)** - Complete feature overview, setup instructions, and architecture
- **[CLAUDE.md](../CLAUDE.md)** - Development commands, testing guide, and developer workflows
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and development workflow
- **[SECURITY.md](SECURITY.md)** - Security features, best practices, and vulnerability reporting

### Code Examples

- **[`.env.example`](../.env.example)** - Configuration examples
- **[Docker Compose](../docker-compose.yml)** - Deployment examples (if applicable)
- **[Package.json](../package.json)** - Available scripts and dependencies

## Getting Help

### 1. Search Existing Resources

Before creating a new issue, please search:

- [Existing Issues](https://github.com/Recipe-Web-App/recipe-ui-service/issues) - Someone may have already
  asked
- [Closed Issues](https://github.com/Recipe-Web-App/recipe-ui-service/issues?q=is%3Aissue+is%3Aclosed) - Your
  question may already be answered
- [Discussions](https://github.com/Recipe-Web-App/recipe-ui-service/discussions) - Community Q&A

### 2. GitHub Discussions (Recommended for Questions)

For general questions, use [GitHub Discussions](https://github.com/Recipe-Web-App/recipe-ui-service/discussions):

**When to use Discussions:**

- "How do I...?" questions
- Configuration help
- Best practice advice
- Integration questions with backend services
- Troubleshooting (non-bug)
- Next.js/React questions specific to this project

**Categories:**

- **Q&A** - Ask questions and get answers
- **Ideas** - Share feature ideas and proposals
- **Show and Tell** - Share your implementations
- **General** - Everything else

### 3. GitHub Issues (For Bugs and Features)

Use [GitHub Issues](https://github.com/Recipe-Web-App/recipe-ui-service/issues/new/choose) for:

- Bug reports
- Feature requests
- Performance issues
- Documentation problems
- Security vulnerabilities (low severity - use Security Advisories for critical)

**Issue Templates:**

- **Bug Report** - Report unexpected behavior
- **Feature Request** - Suggest new functionality
- **Performance Issue** - Report performance problems
- **Documentation** - Documentation improvements
- **Security Vulnerability** - Low-severity security issues
- **Task** - Development work items

### 4. Security Issues

**IMPORTANT:** For security vulnerabilities, use:

- [GitHub Security Advisories](https://github.com/Recipe-Web-App/recipe-ui-service/security/advisories/new) (private)
- See [SECURITY.md](SECURITY.md) for details

**Never report security issues publicly through issues or discussions.**

## Common Questions

### Setup and Configuration

**Q: How do I get started?**
A: See the Quick Start section in [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md#commands)

**Q: What environment variables are required?**
A: Check [`.env.example`](../.env.example) for all configuration options. You need to configure URLs for the 6
backend microservices.

**Q: How do I connect to backend services?**
A: Configure the service URLs in your `.env.local` file. See [CLAUDE.md](../CLAUDE.md#architecture) for
the microservices architecture.

**Q: What Node.js version do I need?**
A: Node.js 20 or higher is required. See package.json for the exact version.

### Development

**Q: How do I run the development server?**
A: Run `npm run dev` to start the Next.js development server with Turbopack.

**Q: How do I run tests?**
A: Run `npm test` for all tests, or see [CLAUDE.md](../CLAUDE.md#commands) for specific test commands.

**Q: What's the code structure?**
A: See Architecture Overview in [CLAUDE.md](../CLAUDE.md#architecture) for the full project structure.

**Q: How do I add a new API integration?**
A: Follow the API Integration Pattern in [CLAUDE.md](../CLAUDE.md#patterns) - create client, add
methods, create React hooks.

### Troubleshooting

**Q: Service fails to start?**

- Check logs: `npm run dev` output
- Verify Node.js version (`node --version`)
- Check dependencies are installed (`npm ci`)
- Review environment variables
- Check backend service connectivity

**Q: API calls are failing?**

- Verify backend services are running
- Check service URLs in `.env.local`
- Verify network connectivity
- Check browser console for errors
- Review CORS configuration

**Q: Tests are failing?**

- Run `npm ci` to ensure dependencies are fresh
- Check test output for specific errors
- Verify backend services are available for integration tests
- See [TESTING.md](../TESTING.md) for testing guidelines

**Q: Build is failing?**

- Run `npm run type-check` to find TypeScript errors
- Run `npm run lint` to find linting issues
- Check for missing environment variables
- Review build output for specific errors

**Q: Performance issues?**

- Run `npm run analyze` to check bundle size
- Use `npm run perf:lighthouse` for performance audit
- Check for large dependencies
- See [Performance Issue Template](.github/ISSUE_TEMPLATE/performance_issue.yml)

### Components and Hooks

**Q: How do I create a new component?**
A: Follow existing patterns in `src/components/`. See [CLAUDE.md](../CLAUDE.md#patterns) for guidelines.

**Q: How do I integrate with a backend service?**
A: Create API client in `src/lib/api/[service]/`, add types in `src/types/[service]/`, create hooks in `src/hooks/[service]/`.

**Q: How do I manage state?**
A: Use TanStack Query for server state, Zustand for client state. See [CLAUDE.md](../CLAUDE.md#architecture).

## Response Times

We aim to:

- Acknowledge issues/discussions within 48 hours
- Respond to questions within 1 week
- Fix critical bugs as priority
- Review PRs within 1-2 weeks

Note: This is a community project. Response times may vary.

## Community Guidelines

When asking for help:

- **Be specific** - Include exact error messages, versions, configurations
- **Provide context** - What were you trying to do? What happened instead?
- **Include details** - Environment, browser, relevant logs
- **Be patient** - Maintainers help in their free time
- **Be respectful** - Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
- **Search first** - Check if your question was already answered
- **Give back** - Help others when you can

## Bug Report Best Practices

When reporting bugs, include:

- Node.js version (`node --version`)
- npm version (`npm --version`)
- Browser and version
- Operating system
- Exact error messages
- Steps to reproduce
- Expected vs actual behavior
- Relevant configuration (redact secrets!)
- Console logs (redact sensitive info!)

Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) - it helps ensure you provide all needed information.

## Additional Resources

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js 15 Release](https://nextjs.org/blog/next-15)
- [App Router Documentation](https://nextjs.org/docs/app)

### React Resources

- [React Documentation](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### TypeScript Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Related Libraries

- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [TailwindCSS](https://tailwindcss.com/)

## Still Need Help?

If you can't find an answer:

1. Check [Discussions](https://github.com/Recipe-Web-App/recipe-ui-service/discussions)
2. Ask a new question in [Q&A](https://github.com/Recipe-Web-App/recipe-ui-service/discussions/new?category=q-a)
3. For bugs, create an [Issue](https://github.com/Recipe-Web-App/recipe-ui-service/issues/new/choose)

We're here to help!
