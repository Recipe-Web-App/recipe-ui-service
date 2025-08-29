# Pull Request

## 📋 Description

<!-- Provide a brief description of what this PR does -->

### 🎯 Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] 🚀 New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Code style/formatting changes
- [ ] ♻️ Refactoring (no functional changes, no api changes)
- [ ] ⚡ Performance improvements
- [ ] 🔒 Security fix
- [ ] 🧪 Tests (adding missing tests or correcting existing tests)
- [ ] 🔧 Build/CI changes
- [ ] 🏗️ Infrastructure changes

## 🔗 Related Issues

<!-- Link to related issues -->

Closes #
Fixes #
Relates to #

## 🧪 Testing

### Test Coverage

<!-- Check all that apply -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] Performance tests added/updated
- [ ] Security tests added/updated

### Test Results

<!-- Provide test results -->

```bash
# Paste relevant test output here
npm run test
npm run test:e2e
npm run lint
npm run type-check
```

## 📸 Screenshots/Demo

<!-- If applicable, add screenshots or demo links to help explain your changes -->

| Before                             | After                              |
| ---------------------------------- | ---------------------------------- |
| <!-- Screenshot or description --> | <!-- Screenshot or description --> |

## 🔄 Breaking Changes

<!-- If this PR introduces breaking changes, describe them here -->

- **Breaking Change 1**: Description and migration guide
- **Breaking Change 2**: Description and migration guide

## 📋 Checklist

### Code Quality

<!-- Check all that apply before submitting -->

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

### Security

- [ ] I have reviewed my code for security vulnerabilities
- [ ] No sensitive information (passwords, keys, tokens) is exposed
- [ ] Input validation is properly implemented where needed
- [ ] Authentication/authorization is properly handled

### Performance

- [ ] I have considered the performance impact of my changes
- [ ] Bundle size impact is acceptable (run `npm run analyze`)
- [ ] No memory leaks introduced
- [ ] Database queries are optimized (if applicable)

### Accessibility

- [ ] UI changes meet WCAG 2.1 AA standards
- [ ] Proper ARIA labels and semantic HTML used
- [ ] Keyboard navigation works properly
- [ ] Screen reader compatibility verified

### Documentation

- [ ] I have updated the documentation accordingly
- [ ] README.md updated if needed
- [ ] API documentation updated if needed
- [ ] CHANGELOG.md updated for user-facing changes

## 🌐 Browser Testing

<!-- Check browsers where you've tested your changes -->

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 📱 Responsive Testing

<!-- Check screen sizes where you've tested your changes -->

- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

## 🚀 Deployment Notes

<!-- Any special deployment considerations -->

### Environment Variables

<!-- List any new environment variables needed -->

- `NEW_ENV_VAR`: Description of what it does

### Database Changes

<!-- Describe any database migrations or schema changes -->

- [ ] No database changes
- [ ] Database migration required
- [ ] Backward compatible changes only

### Infrastructure Changes

<!-- Describe any infrastructure or configuration changes -->

- [ ] No infrastructure changes
- [ ] Docker configuration updated
- [ ] CI/CD pipeline updated
- [ ] Dependencies updated

## 📊 Performance Impact

<!-- If applicable, include performance metrics -->

### Bundle Size

- Before: X KB
- After: Y KB
- Change: +/- Z KB

### Lighthouse Scores

- Performance: X/100 → Y/100
- Accessibility: X/100 → Y/100
- Best Practices: X/100 → Y/100
- SEO: X/100 → Y/100

## 🎯 Focus Areas for Review

<!-- Highlight specific areas where you'd like focused review -->

- [ ] Security implementation
- [ ] Performance optimization
- [ ] Error handling
- [ ] User experience
- [ ] Code architecture
- [ ] Test coverage

## 📝 Additional Notes

<!-- Any additional information that reviewers should know -->

---

### For Reviewers

**Review Checklist:**

- [ ] Code follows project conventions and best practices
- [ ] Security considerations have been addressed
- [ ] Performance impact is acceptable
- [ ] Tests are comprehensive and pass
- [ ] Documentation is updated and accurate
- [ ] Accessibility requirements are met
- [ ] Breaking changes are properly documented

**Estimated Review Time:** <!-- e.g., 15 minutes, 1 hour -->

/cc @reviewer1 @reviewer2
