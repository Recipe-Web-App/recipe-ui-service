import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import v8 from 'node:v8';

export async function GET() {
  const requestId = `metrics-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  console.log('[Metrics] Collection initiated', { requestId });

  try {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    // Calculate memory usage percentages
    const heapStats = v8.getHeapStatistics();
    const memoryUsagePercent =
      (memoryUsage.heapUsed / heapStats.heap_size_limit) * 100;

    // Format uptime in human-readable format
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

    const metricsData = {
      timestamp,
      uptime: {
        seconds: uptime,
        formatted: uptimeFormatted,
      },
      memory: {
        bytes: {
          rss: memoryUsage.rss,
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          heapLimit: heapStats.heap_size_limit,
          external: memoryUsage.external,
          arrayBuffers: memoryUsage.arrayBuffers,
        },
        megabytes: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          heapLimit: Math.round(heapStats.heap_size_limit / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
          arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024),
        },
        heapUsagePercent: parseFloat(memoryUsagePercent.toFixed(2)),
      },
      cpu: {
        microseconds: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        seconds: {
          user: cpuUsage.user / 1000000,
          system: cpuUsage.system / 1000000,
        },
        milliseconds: {
          user: Math.round(cpuUsage.user / 1000),
          system: Math.round(cpuUsage.system / 1000),
        },
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        environment: process.env.NODE_ENV ?? 'development',
        hostname: process.env.HOSTNAME ?? 'unknown',
      },
      requestId,
    };

    console.log('[Metrics] Collected successfully', { requestId });

    return NextResponse.json(metricsData, {
      status: StatusCodes.OK,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('[Metrics] Collection failed', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        error: 'Metrics collection failed',
        errorDetails: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
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
