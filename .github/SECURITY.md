# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version  | Supported          |
| -------- | ------------------ |
| latest   | :white_check_mark: |
| < latest | :x:                |

We recommend always running the latest version for security patches.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### Private Reporting (Preferred)

Report security vulnerabilities using [GitHub Security Advisories](https://github.com/Recipe-Web-App/recipe-ui-service/security/advisories/new).

This allows us to:

- Discuss the vulnerability privately
- Develop and test a fix
- Coordinate disclosure timing
- Issue a CVE if necessary

### What to Include

When reporting a vulnerability, please include:

1. **Description** - Clear description of the vulnerability
2. **Impact** - What can an attacker achieve?
3. **Reproduction Steps** - Step-by-step instructions to reproduce
4. **Affected Components** - Which parts of the service are affected
5. **Suggested Fix** - If you have ideas for remediation
6. **Environment** - Version, browser, configuration details
7. **Proof of Concept** - Code or requests demonstrating the issue (if safe to share)

### Example Report

```text
Title: XSS Vulnerability in Recipe Display

Description: User-provided recipe descriptions are not properly sanitized...

Impact: An attacker could inject malicious scripts...

Steps to Reproduce:
1. Create a recipe with description containing <script> tags
2. View the recipe on the recipe detail page
3. Script executes in the browser

Affected: src/components/RecipeCard.tsx

Suggested Fix: Implement DOMPurify for HTML sanitization

Environment: Next.js 15, Chrome 120
```

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity (critical: days, high: weeks, medium: months)

## Severity Levels

### Critical

- Remote code execution
- Authentication bypass
- Mass data exposure
- Privilege escalation

### High

- XSS with significant impact
- CSRF vulnerabilities
- SQL injection (if applicable)
- Unauthorized access to sensitive data

### Medium

- XSS with limited impact
- Information disclosure (limited)
- Session fixation
- Security misconfigurations

### Low

- Verbose error messages
- Security header issues
- Best practice violations

## Security Features

This service implements multiple security layers:

### Frontend Security

- **Input Validation** - All user inputs are validated and sanitized
- **XSS Protection** - React's built-in XSS protection + additional sanitization
- **CSRF Protection** - Token-based CSRF protection for state-changing operations
- **Content Security Policy** - Strict CSP headers to prevent XSS
- **Secure Headers** - HSTS, X-Frame-Options, X-Content-Type-Options

### Authentication & Authorization

- **JWT Validation** - All API requests validated with JWT tokens
- **Role-Based Access** - Proper authorization checks for protected resources
- **Secure Session Management** - HttpOnly cookies for session tokens
- **Token Expiration** - Short-lived access tokens with refresh mechanism

### API Security

- **CORS Protection** - Configured CORS policies for API calls
- **Rate Limiting** - Client-side throttling for API requests
- **Input Sanitization** - All inputs sanitized before API calls
- **Error Handling** - No sensitive information in error messages

### Dependency Security

- **Automated Scanning** - Dependabot and npm audit
- **Regular Updates** - Dependencies kept current
- **License Compliance** - Automated license checking

## Security Best Practices

### For Operators

1. **Use HTTPS** - Always deploy with HTTPS in production
2. **Set Security Headers** - Configure proper CSP and security headers
3. **Monitor Dependencies** - Keep npm packages updated
4. **Review Logs** - Monitor for suspicious activity
5. **Configure CORS** - Whitelist only trusted origins
6. **Use Environment Variables** - Never hardcode secrets
7. **Enable Rate Limiting** - Protect against abuse
8. **Regular Security Scans** - Run npm audit regularly
9. **Backup Configuration** - Securely store configuration backups
10. **Access Controls** - Implement proper access controls

### For Developers

1. **Never Commit Secrets** - Use `.env.local` (gitignored)
2. **Validate Inputs** - Sanitize all user inputs
3. **Avoid Dangerous Functions** - No `dangerouslySetInnerHTML` without sanitization
4. **Handle Errors Securely** - Don't leak sensitive info in errors
5. **Run Security Checks** - Use `npm audit` and lint security rules
6. **Review Dependencies** - Check for known vulnerabilities
7. **Follow React Best Practices** - Avoid XSS vulnerabilities
8. **Test Security** - Include security test cases
9. **Use TypeScript** - Leverage type safety
10. **Code Reviews** - Security-focused code reviews

## Security Checklist

Before deploying:

- [ ] HTTPS configured with valid certificate
- [ ] Security headers enabled (CSP, HSTS, etc.)
- [ ] CORS properly configured
- [ ] Environment variables used for secrets
- [ ] No secrets in code or version control
- [ ] Dependencies updated (`npm audit` clean)
- [ ] Input validation implemented
- [ ] XSS protection verified
- [ ] CSRF protection enabled
- [ ] Authentication/authorization working
- [ ] Error handling doesn't leak information
- [ ] Security scanning passed
- [ ] Monitoring and logging configured

## Known Security Considerations

### Client-Side Storage

- No sensitive data in localStorage or sessionStorage
- Use HttpOnly cookies for authentication tokens
- Clear storage on logout

### Third-Party Dependencies

- Regular npm audit scans
- Automated Dependabot updates
- License compliance checking
- Minimal dependency footprint

### API Integration

- All API calls use HTTPS
- JWT tokens for authentication
- Proper error handling
- Request/response validation

## Disclosure Policy

We follow **coordinated disclosure**:

1. Vulnerability reported privately
2. We confirm and develop fix
3. Fix tested and released
4. Public disclosure after fix is deployed
5. Credit given to reporter (if desired)

## Security Updates

Subscribe to:

- [GitHub Security Advisories](https://github.com/Recipe-Web-App/recipe-ui-service/security/advisories)
- [Release Notes](https://github.com/Recipe-Web-App/recipe-ui-service/releases)
- Watch repository for security patches

## Contact

For security concerns: Use [GitHub Security Advisories](https://github.com/Recipe-Web-App/recipe-ui-service/security/advisories/new)

For general questions: See [SUPPORT.md](SUPPORT.md)

## Acknowledgments

We thank security researchers who responsibly disclose vulnerabilities. Contributors will be acknowledged (with
permission) in:

- Security advisories
- Release notes
- This document

Thank you for helping keep this project secure!
