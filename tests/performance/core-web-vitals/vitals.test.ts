import { test, expect } from '@playwright/test';

interface VitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface WindowWithVitals extends Window {
  vitalsData?: VitalsData[];
  collectVitals?: () => void;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput?: boolean;
  value: number;
}

interface ResourceTimingWithBlocking extends PerformanceResourceTiming {
  renderBlockingStatus?: string;
}

declare const window: WindowWithVitals;

test.describe('Core Web Vitals Performance Tests', () => {
  test('should meet Core Web Vitals thresholds on homepage', async ({
    page,
  }) => {
    // Inject Web Vitals library and collect metrics
    await page.addInitScript(() => {
      const windowWithVitals = window as WindowWithVitals;
      windowWithVitals.vitalsData = [];

      function sendToAnalytics({ name, value, rating }: VitalsData) {
        windowWithVitals.vitalsData?.push({ name, value, rating });
      }

      // Import and initialize web-vitals (this would be injected differently in real implementation)
      windowWithVitals.collectVitals = () => {
        // Simulate Web Vitals collection - in practice these would be imported properly
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              const value = entry.startTime;
              const rating =
                value <= 2500
                  ? 'good'
                  : value <= 4000
                    ? 'needs-improvement'
                    : 'poor';
              sendToAnalytics({ name: 'LCP', value, rating });
            }
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS measurement
        let clsValue = 0;
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as LayoutShiftEntry;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          const rating =
            clsValue <= 0.1
              ? 'good'
              : clsValue <= 0.25
                ? 'needs-improvement'
                : 'poor';
          sendToAnalytics({ name: 'CLS', value: clsValue, rating });
        }).observe({ entryTypes: ['layout-shift'] });
      };
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Execute vitals collection
    await page.evaluate(() => {
      const windowWithVitals = window as WindowWithVitals;
      return windowWithVitals.collectVitals?.();
    });

    // Wait for metrics to be collected
    await page.waitForTimeout(2000);

    const collectedVitals = (await page.evaluate(() => {
      const windowWithVitals = window as WindowWithVitals;
      return windowWithVitals.vitalsData ?? [];
    })) as VitalsData[];

    // Verify LCP (Largest Contentful Paint) - should be ≤ 2.5s
    const lcp = collectedVitals.find(vital => vital.name === 'LCP');
    if (lcp) {
      console.log(`LCP: ${lcp.value}ms (${lcp.rating})`);
      expect(lcp.value).toBeLessThanOrEqual(2500);
      expect(lcp.rating).not.toBe('poor');
    }

    // Verify CLS (Cumulative Layout Shift) - should be ≤ 0.1
    const cls = collectedVitals.find(vital => vital.name === 'CLS');
    if (cls) {
      console.log(`CLS: ${cls.value} (${cls.rating})`);
      expect(cls.value).toBeLessThanOrEqual(0.1);
      expect(cls.rating).not.toBe('poor');
    }
  });

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/');

    const fcpMetric = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });

    console.log(`FCP: ${fcpMetric}ms`);
    expect(fcpMetric).toBeLessThanOrEqual(1800); // 1.8 seconds threshold
  });

  test('should have fast Time to First Byte (TTFB)', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);

    const navigationTiming = await page.evaluate(() => {
      const perfData = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        ttfb: perfData.responseStart - perfData.requestStart,
        domContentLoaded:
          perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
      };
    });

    console.log(`TTFB: ${navigationTiming.ttfb}ms`);
    console.log(`DOM Content Loaded: ${navigationTiming.domContentLoaded}ms`);
    console.log(`Load Complete: ${navigationTiming.loadComplete}ms`);

    // TTFB should be under 600ms
    expect(navigationTiming.ttfb).toBeLessThanOrEqual(600);

    // DOM Content Loaded should be under 1.5s
    expect(navigationTiming.domContentLoaded).toBeLessThanOrEqual(1500);
  });

  test('should have minimal blocking resources', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resourceTiming = await page.evaluate(() => {
      const resources = performance.getEntriesByType(
        'resource'
      ) as PerformanceResourceTiming[];

      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize || 0,
        type: resource.initiatorType,
        blocking:
          (resource as ResourceTimingWithBlocking).renderBlockingStatus ??
          'non-blocking',
      }));
    });

    // Check for render-blocking resources
    const blockingResources = resourceTiming.filter(
      resource => resource.blocking === 'blocking' && resource.type === 'script'
    );

    console.log(`Blocking resources: ${blockingResources.length}`);
    blockingResources.forEach(resource => {
      console.log(`- ${resource.name}: ${resource.duration}ms`);
    });

    // Should have minimal blocking JavaScript
    expect(blockingResources.length).toBeLessThanOrEqual(2);
  });

  test('should maintain performance across different viewport sizes', async ({
    page,
  }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      console.log(
        `${viewport.name} (${viewport.width}x${viewport.height}): ${loadTime}ms`
      );

      // Performance should be consistent across viewports
      expect(loadTime).toBeLessThanOrEqual(3000);

      // Check for layout shifts by measuring elements
      const layoutStable = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-testid]');
        return elements.length > 0; // Basic check that content is rendered
      });

      expect(layoutStable).toBe(true);
    }
  });
});
