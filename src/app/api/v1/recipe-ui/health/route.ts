import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import v8 from 'node:v8';

export async function GET() {
  const requestId = `health-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  console.log('[Health] Check initiated', { requestId });

  try {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    console.log('[Health] System metrics', {
      requestId,
      uptime: `${Math.floor(uptime)}s`,
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV,
      hostname: process.env.HOSTNAME,
      port: process.env.PORT,
    });

    // Calculate memory usage percentages
    const heapStats = v8.getHeapStatistics();
    const memoryUsagePercent =
      (memoryUsage.heapUsed / heapStats.heap_size_limit) * 100;

    console.log('[Health] Memory details', {
      requestId,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapLimit: `${Math.round(heapStats.heap_size_limit / 1024 / 1024)}MB`,
      usagePercent: `${memoryUsagePercent.toFixed(2)}%`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      arrayBuffers: `${Math.round(memoryUsage.arrayBuffers / 1024 / 1024)}MB`,
    });

    // Check critical thresholds
    const isCritical = memoryUsagePercent > 85 || uptime < 10;

    if (isCritical) {
      console.warn('[Health] Check DEGRADED', {
        requestId,
        memoryOverThreshold: memoryUsagePercent > 85,
        insufficientUptime: uptime < 10,
        memoryUsagePercent: `${memoryUsagePercent.toFixed(2)}%`,
        uptime: `${Math.floor(uptime)}s`,
      });
    } else {
      console.log('[Health] Check HEALTHY', { requestId });
    }

    const healthData = {
      status: isCritical ? 'degraded' : 'healthy',
      timestamp,
      uptime: `${Math.floor(uptime)}s`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapLimit: `${Math.round(heapStats.heap_size_limit / 1024 / 1024)}MB`,
        usagePercent: `${Math.round(memoryUsagePercent)}%`,
      },
      cpu: {
        user: `${Math.round(cpuUsage.user / 1000)}ms`,
        system: `${Math.round(cpuUsage.system / 1000)}ms`,
      },
      environment: process.env.NODE_ENV ?? 'development',
      version: process.env.npm_package_version ?? '0.1.0',
      hostname: process.env.HOSTNAME ?? 'unknown',
      pid: process.pid,
      requestId,
    };

    const statusCode = isCritical
      ? StatusCodes.SERVICE_UNAVAILABLE
      : StatusCodes.OK;
    console.log('[Health] Returning status', { requestId, statusCode });

    return NextResponse.json(healthData, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('[Health] Check EXCEPTION', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        errorDetails: error instanceof Error ? error.message : String(error),
        requestId,
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        headers: {
          'X-Request-Id': requestId,
        },
      }
    );
  }
}
