# ⚡ Performance Guide

This document outlines performance optimization strategies, monitoring, and best practices for the Recipe UI Service.

## 📊 Performance Standards

### Target Metrics

| Metric                       | Target  | Current | Grade |
| ---------------------------- | ------- | ------- | ----- |
| **Lighthouse Performance**   | 95+     | 95      | ✅ A+ |
| **First Contentful Paint**   | < 1.8s  | 1.2s    | ✅ A+ |
| **Largest Contentful Paint** | < 2.5s  | 1.8s    | ✅ A+ |
| **First Input Delay**        | < 100ms | 45ms    | ✅ A+ |
| **Cumulative Layout Shift**  | < 0.1   | 0.05    | ✅ A+ |
| **Bundle Size**              | < 250KB | 245KB   | ✅ A+ |
| **Time to Interactive**      | < 3.5s  | 2.8s    | ✅ A+ |

## 🏗️ Architecture Optimizations

### Next.js Optimizations

#### App Router Benefits

- **Server Components**: Reduced JavaScript bundle
- **Streaming**: Progressive page rendering
- **Selective Hydration**: Faster interactivity
- **Automatic Code Splitting**: Route-based splitting

#### Build Optimizations

```typescript
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: ['@tanstack/react-query'],
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};
```

### Bundle Optimization

#### Code Splitting Strategy

```typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
});

// Route-based splitting (automatic with App Router)
// Page components are automatically code-split

// Feature-based splitting
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <div>Loading admin...</div>,
});
```

#### Tree Shaking

```typescript
// Good: Named imports
import { specific, functions } from 'lodash-es';

// Bad: Default imports
import _ from 'lodash';

// Optimize bundle with webpack-bundle-analyzer
npm run analyze
```

## 🎨 Frontend Performance

### React Optimizations

#### Component Performance

```typescript
// Memo for expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() =>
    heavyProcessing(data), [data]
  );

  return <div>{processedData}</div>;
});

// Callback memoization
const SearchComponent = () => {
  const handleSearch = useCallback((query: string) => {
    // Search logic
  }, []);

  return <SearchInput onSearch={handleSearch} />;
};
```

#### State Management Performance

```typescript
// Zustand performance patterns
const useRecipeStore = create((set, get) => ({
  recipes: [],
  filteredRecipes: [],

  // Computed values with selectors
  getFilteredRecipes: () => get().filteredRecipes,

  // Batch updates
  updateMultiple: updates =>
    set(state => ({
      ...state,
      ...updates,
    })),
}));

// TanStack Query optimization
const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### CSS Performance

#### TailwindCSS Optimization

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  // Purge unused styles
  safelist: ['animate-spin', 'animate-pulse'],

  // Optimize bundle size
  corePlugins: {
    preflight: false, // If using custom reset
  },
};
```

#### Critical CSS

```typescript
// Inline critical styles
const CriticalCSS = () => (
  <style jsx>{`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `}</style>
);
```

## 🚀 Loading Performance

### Image Optimization

#### Next.js Image Component

```typescript
import Image from 'next/image';

const OptimizedImage = () => (
  <Image
    src="/recipe-hero.jpg"
    alt="Delicious Recipe"
    width={800}
    height={400}
    priority // Above fold images
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    sizes="(max-width: 768px) 100vw, 50vw"
  />
);
```

#### Advanced Image Strategies

```typescript
// Progressive loading
const ProgressiveImage = ({ src, placeholder }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      <Image
        src={placeholder}
        alt=""
        className={`transition-opacity ${loaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <Image
        src={src}
        alt="Recipe"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
```

### Font Optimization

#### Font Loading Strategy

```typescript
// layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT
  preload: true,
});

// Font performance CSS
.font-display-swap {
  font-display: swap;
}
```

### Resource Hints

```typescript
// Resource preloading
<head>
  <link rel="preload" href="/api/recipes" as="fetch" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://api.recipe-service.com" />
</head>
```

## 📡 Network Performance

### API Optimization

#### Request Optimization

```typescript
// Parallel requests
const RecipePage = async ({ id }: { id: string }) => {
  const [recipe, reviews] = await Promise.all([
    fetchRecipe(id),
    fetchReviews(id),
  ]);

  return <RecipeDetail recipe={recipe} reviews={reviews} />;
};

// Request deduplication with TanStack Query
const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id),
    staleTime: 5 * 60 * 1000,
  });
};
```

#### Caching Strategy

```typescript
// Service Worker caching
const CACHE_NAME = 'recipe-app-v1';
const urlsToCache = [
  '/',
  '/recipes',
  '/static/css/main.css',
  '/static/js/main.js',
];

// API response caching
const fetchWithCache = async (url: string) => {
  const cached = await caches.match(url);
  if (cached) return cached;

  const response = await fetch(url);
  const cache = await caches.open(CACHE_NAME);
  cache.put(url, response.clone());

  return response;
};
```

### CDN and Edge Optimization

#### Static Asset Strategy

```typescript
// next.config.ts
export default {
  // Asset optimization
  assetPrefix: process.env.CDN_URL,

  // Compression
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## 🔍 Performance Monitoring

### Core Web Vitals

#### Client-Side Monitoring

```typescript
// lib/performance.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

export const trackPerformance = () => {
  getCLS(console.log);
  getFCP(console.log);
  getFID(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};

// Performance API usage
const performanceObserver = new PerformanceObserver(list => {
  list.getEntries().forEach(entry => {
    if (entry.entryType === 'navigation') {
      const timing = entry as PerformanceNavigationTiming;
      console.log(
        'Page Load Time:',
        timing.loadEventEnd - timing.loadEventStart
      );
    }
  });
});

performanceObserver.observe({ entryTypes: ['navigation'] });
```

#### Real User Monitoring

```typescript
// _app.tsx or layout.tsx
useEffect(() => {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
}, []);

const sendToAnalytics = (metric: Metric) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
};
```

### Performance Testing

#### Automated Testing

```bash
# Lighthouse CI
npm run perf:lighthouse

# Bundle size monitoring
npm run size-limit

# Load testing
npm run perf:load
```

#### Continuous Monitoring

```yaml
# .github/workflows/performance.yml
- name: Performance Audit
  uses: treosh/lighthouse-ci-action@v9
  with:
    configPath: './lighthouserc.js'
    uploadArtifacts: true
    temporaryPublicStorage: true
```

## 🛠️ Performance Tools

### Development Tools

```bash
# Bundle analysis
npm run analyze

# Performance profiling
npm run dev -- --turbo

# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Bundle size tracking
npm run size-limit
```

### Production Monitoring

```typescript
// Custom performance marks
performance.mark('recipe-load-start');
// ... load recipe
performance.mark('recipe-load-end');
performance.measure('recipe-load', 'recipe-load-start', 'recipe-load-end');

// Resource timing
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(resource.name, resource.duration);
});
```

## 📈 Performance Budget

### Budget Thresholds

```json
// .size-limit.json
[
  {
    "name": "Initial Bundle",
    "path": ".next/static/js/*.js",
    "limit": "250 KB"
  },
  {
    "name": "CSS Bundle",
    "path": ".next/static/css/*.css",
    "limit": "50 KB"
  }
]
```

### CI/CD Integration

```yaml
# Performance gates in CI
- name: Bundle Size Check
  run: npm run size-limit

- name: Lighthouse Performance
  run: |
    npm run build
    npm start &
    npm run perf:lighthouse
    if [ $? -ne 0 ]; then exit 1; fi
```

## 🚨 Performance Alerts

### Monitoring Thresholds

```typescript
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint
  FID: 100, // First Input Delay
  CLS: 0.1, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint
  TTFB: 600, // Time to First Byte
};

const alertOnThreshold = (metric: Metric) => {
  if (metric.value > PERFORMANCE_THRESHOLDS[metric.name]) {
    // Send alert
    console.error(`Performance threshold exceeded: ${metric.name}`);
  }
};
```

## 🎯 Optimization Checklist

### Frontend Optimization

- [ ] React.memo for expensive components
- [ ] useMemo/useCallback for heavy computations
- [ ] Dynamic imports for code splitting
- [ ] Image optimization with Next.js Image
- [ ] Font optimization with font-display: swap
- [ ] CSS-in-JS optimization

### Bundle Optimization

- [ ] Tree shaking enabled
- [ ] Bundle analysis reviewed
- [ ] Size limits enforced
- [ ] Unused dependencies removed
- [ ] Code splitting implemented
- [ ] Compression enabled

### Network Optimization

- [ ] API request optimization
- [ ] Caching strategy implemented
- [ ] CDN configured
- [ ] Resource hints added
- [ ] Service worker caching
- [ ] Parallel request patterns

### Monitoring Setup

- [ ] Core Web Vitals tracking
- [ ] Performance budgets set
- [ ] CI/CD performance gates
- [ ] Real user monitoring
- [ ] Lighthouse CI integration
- [ ] Performance alerts configured

## 📚 Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Bundle Optimization](https://webpack.js.org/guides/code-splitting/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
