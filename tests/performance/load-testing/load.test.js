// @ts-ignore - autocannon is external library
const autocannon = require('autocannon');
const { spawn } = require('child_process');

/**
 * @typedef {Object} AutocannonResult
 * @property {Object} requests
 * @property {number} requests.average
 * @property {Object} latency
 * @property {number} latency.average
 * @property {number} latency.p99
 * @property {number} latency.max
 * @property {number} latency.stddev
 * @property {Object} throughput
 * @property {number} throughput.average
 * @property {number} errors
 */

// Helper function to safely extract autocannon results
function validateAndExtractResult(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid autocannon result');
  }

  // Safe numeric extraction helper
  function getNumericValue(obj, prop) {
    return obj && typeof obj === 'object' && typeof obj[prop] === 'number'
      ? obj[prop]
      : 0;
  }

  // Safe object extraction
  function getObjectValue(obj, prop) {
    return obj &&
      typeof obj === 'object' &&
      obj[prop] &&
      typeof obj[prop] === 'object'
      ? obj[prop]
      : {};
  }

  const requestsObj = getObjectValue(result, 'requests');
  const latencyObj = getObjectValue(result, 'latency');
  const throughputObj = getObjectValue(result, 'throughput');
  const errorsCount = getNumericValue(result, 'errors');

  return {
    requests: {
      average: getNumericValue(requestsObj, 'average'),
    },
    latency: {
      average: getNumericValue(latencyObj, 'average'),
      p99: getNumericValue(latencyObj, 'p99'),
      max: getNumericValue(latencyObj, 'max'),
      stddev: getNumericValue(latencyObj, 'stddev'),
    },
    throughput: {
      average: getNumericValue(throughputObj, 'average'),
    },
    errors: errorsCount,
  };
}

describe('Load Testing Performance', () => {
  let serverProcess;
  const baseURL = 'http://localhost:3001'; // Different port to avoid conflicts

  beforeAll(async () => {
    // Start the Next.js server for testing
    console.log('Starting Next.js server for load testing...');

    return new Promise((resolve, reject) => {
      serverProcess = spawn('bun', ['run', 'start'], {
        env: { ...process.env, PORT: '3001' },
        stdio: 'pipe',
      });

      serverProcess.stdout.on('data', data => {
        const dataStr =
          data && typeof data.toString === 'function'
            ? data.toString()
            : String(data);
        const output = typeof dataStr === 'string' ? dataStr : '';
        if (
          typeof output.includes === 'function' &&
          output.includes('Ready on')
        ) {
          console.log('Server is ready for load testing');
          setTimeout(resolve, 2000); // Give it a moment to fully initialize
        }
      });

      serverProcess.stderr.on('data', data => {
        const dataStr =
          data && typeof data.toString === 'function'
            ? data.toString()
            : String(data);
        const errorOutput = typeof dataStr === 'string' ? dataStr : '';
        console.error('Server error:', errorOutput);
      });

      setTimeout(() => reject(new Error('Server failed to start')), 30000);
    });
  });

  afterAll(async () => {
    if (serverProcess && typeof serverProcess.kill === 'function') {
      if (typeof serverProcess.kill === 'function') {
        serverProcess.kill('SIGTERM');
      }
      console.log('Server stopped');
    }
  });

  test('should handle moderate concurrent load on homepage', async () => {
    const rawResult = await autocannon({
      url: baseURL,
      connections: 10,
      pipelining: 1,
      duration: 10, // 10 seconds
    }); // AutocannonResult

    const result = validateAndExtractResult(rawResult);

    console.log('Homepage Load Test Results:');
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency avg: ${result.latency.average}ms`);
    console.log(`Latency p99: ${result.latency.p99}ms`);
    console.log(`Errors: ${result.errors}`);

    // Performance assertions
    expect(result.requests.average).toBeGreaterThan(50); // At least 50 req/sec
    expect(result.latency.average).toBeLessThan(200); // Avg latency under 200ms
    expect(result.latency.p99).toBeLessThan(1000); // 99th percentile under 1s
    expect(result.errors).toBe(0); // No errors
  }, 30000);

  test('should handle API endpoint load', async () => {
    const rawResult = await autocannon({
      url: `${baseURL}/api/health`, // Assuming we'll have a health endpoint
      connections: 20,
      pipelining: 1,
      duration: 15,
    }); // AutocannonResult

    const result = validateAndExtractResult(rawResult);

    console.log('API Load Test Results:');
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency avg: ${result.latency.average}ms`);
    console.log(`Throughput: ${result.throughput.average} bytes/sec`);

    // API should be faster than HTML pages
    expect(result.requests.average).toBeGreaterThan(100);
    expect(result.latency.average).toBeLessThan(100);
    expect(result.errors).toBe(0);
  }, 30000);

  test('should maintain performance under sustained load', async () => {
    const rawResult = await autocannon({
      url: baseURL,
      connections: 5,
      pipelining: 1,
      duration: 30, // Longer test
    }); // AutocannonResult

    const result = validateAndExtractResult(rawResult);

    console.log('Sustained Load Test Results:');
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency avg: ${result.latency.average}ms`);
    console.log(`Memory usage would be monitored separately`);

    // Should maintain consistent performance over time
    expect(result.requests.average).toBeGreaterThan(30);
    expect(result.latency.average).toBeLessThan(300);

    // Check that performance doesn't degrade significantly
    const latencyStdDev = result.latency.stddev;
    const latencyAverage =
      result.latency.average > 0 ? result.latency.average : 1;
    expect(latencyStdDev).toBeLessThan(latencyAverage * 0.5); // StdDev < 50% of avg
  }, 45000);

  test('should handle spike load gracefully', async () => {
    // Simulate a traffic spike
    const rawResult = await autocannon({
      url: baseURL,
      connections: 50, // High concurrency
      pipelining: 2,
      duration: 5, // Short burst
    }); // AutocannonResult

    const result = validateAndExtractResult(rawResult);

    console.log('Spike Load Test Results:');
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency avg: ${result.latency.average}ms`);
    console.log(`Latency max: ${result.latency.max}ms`);

    // Should not crash under spike load
    expect(result.errors).toBe(0);

    // Performance may degrade but should be reasonable
    expect(result.latency.average).toBeLessThan(1000); // Under 1 second avg
    expect(result.latency.max).toBeLessThan(5000); // Max under 5 seconds
  }, 15000);

  test('should have consistent response times for static assets', async () => {
    const rawResult = await autocannon({
      url: `${baseURL}/_next/static/css/app.css`, // Assuming CSS exists after build
      connections: 20,
      pipelining: 5,
      duration: 10,
    }); // AutocannonResult

    const result = validateAndExtractResult(rawResult);

    console.log('Static Asset Load Test Results:');
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency avg: ${result.latency.average}ms`);

    // Static assets should be very fast
    expect(result.requests.average).toBeGreaterThan(200);
    expect(result.latency.average).toBeLessThan(50);
    expect(result.errors).toBe(0);
  }, 20000);

  test('should handle mixed load patterns', async () => {
    // Test multiple endpoints simultaneously
    const endpoints = [baseURL, `${baseURL}/api/health`];

    const rawResults = await Promise.all(
      endpoints.map(
        url =>
          autocannon({
            url,
            connections: 5,
            duration: 10,
          }) // Promise<AutocannonResult>
      )
    );

    // Validate results array
    if (!Array.isArray(rawResults)) {
      throw new Error('Expected results to be an array');
    }

    rawResults.forEach((rawResult, index) => {
      if (index >= 0 && index < endpoints.length) {
        const endpoint = endpoints.at(index);
        if (endpoint && rawResult) {
          const result = validateAndExtractResult(rawResult);

          console.log(`Endpoint ${endpoint} Results:`);
          console.log(`  Requests/sec: ${result.requests.average}`);
          console.log(`  Latency avg: ${result.latency.average}ms`);
          console.log(`  Errors: ${result.errors}`);

          expect(result.errors).toBe(0);
          expect(result.latency.average).toBeLessThan(500);
        }
      }
    });
  }, 25000);
});

// Helper function to wait for server to be ready (unused but kept for reference)
// function waitForServer(url: string, timeout = 30000): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const startTime = Date.now();
//
//     const checkServer = () => {
//       fetch(url)
//         .then(() => resolve())
//         .catch(() => {
//           if (Date.now() - startTime > timeout) {
//             reject(new Error('Server failed to start within timeout'));
//           } else {
//             setTimeout(checkServer, 1000);
//           }
//         });
//     };
//
//     checkServer();
//   });
// }
