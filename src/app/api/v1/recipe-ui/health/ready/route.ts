import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import v8 from 'node:v8';

export async function GET() {
  const requestId = `ready-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  console.log('[Ready] Probe initiated', { requestId });

  try {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    console.log('[Ready] Process info', {
      requestId,
      uptime: `${Math.floor(uptime)}s`,
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV,
      hostname: process.env.HOSTNAME,
      port: process.env.PORT,
    });

    // Readiness checks - more comprehensive than liveness
    const heapStats = v8.getHeapStatistics();
    const memoryUsagePercent =
      (memoryUsage.heapUsed / heapStats.heap_size_limit) * 100;
    const checks = {
      uptime: uptime > 5, // Allow faster startup while ensuring Next.js is initialized
      memory: memoryUsagePercent < 95,
      environment: !!process.env.NODE_ENV,
      nextjs: true, // Next.js specific check - could verify build artifacts
    };

    console.log('[Ready] Readiness checks', {
      requestId,
      uptime: { value: uptime, passed: checks.uptime, threshold: '> 5s' },
      memory: {
        value: `${memoryUsagePercent.toFixed(2)}%`,
        passed: checks.memory,
        threshold: '< 95%',
      },
      environment: { value: process.env.NODE_ENV, passed: checks.environment },
      nextjs: { passed: checks.nextjs },
    });

    // Check if any critical dependencies are configured
    const hasRequiredEnv = process.env.NODE_ENV !== undefined;
    checks.environment = hasRequiredEnv;

    // All checks must pass for readiness
    const isReady = Object.values(checks).every(check => check === true);

    if (!isReady) {
      const failedChecks = Object.entries(checks)
        .filter(([_, passed]) => !passed)
        .map(([name]) => name);
      console.warn('[Ready] Probe FAILED', {
        requestId,
        failedChecks,
      });
    } else {
      console.log('[Ready] Probe PASSED', { requestId });
    }

    const responseData = {
      status: isReady ? 'ready' : 'not_ready',
      timestamp,
      uptime: `${Math.floor(uptime)}s`,
      checks,
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapLimit: `${Math.round(heapStats.heap_size_limit / 1024 / 1024)}MB`,
        usagePercent: `${Math.round((memoryUsage.heapUsed / heapStats.heap_size_limit) * 100)}%`,
      },
      requestId,
    };

    const statusCode = isReady
      ? StatusCodes.OK
      : StatusCodes.SERVICE_UNAVAILABLE;
    console.log('[Ready] Returning status', { requestId, statusCode });

    return NextResponse.json(responseData, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('[Ready] Check EXCEPTION', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: 'Readiness check failed',
        errorDetails: error instanceof Error ? error.message : String(error),
        checks: {
          uptime: false,
          memory: false,
          environment: false,
          nextjs: false,
        },
        requestId,
      },
      {
        status: StatusCodes.SERVICE_UNAVAILABLE,
        headers: {
          'X-Request-Id': requestId,
        },
      }
    );
  }
}
