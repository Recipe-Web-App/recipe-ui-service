import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import v8 from 'node:v8';

export async function GET() {
  const requestId = `live-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  console.log('[Live] Probe initiated', { requestId });

  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    console.log('[Live] Process state', {
      requestId,
      uptime: `${Math.floor(uptime)}s`,
      pid: process.pid,
      memoryRss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    });

    // Liveness check - only check if process is responsive
    // Memory checks belong in readiness probe, not liveness
    const heapStats = v8.getHeapStatistics();
    const memoryUsagePercent =
      (memoryUsage.heapUsed / heapStats.heap_size_limit) * 100;
    const hasMinimumUptime = uptime > 5;

    // Simple liveness check - only restart if process startup failed
    const isAlive = hasMinimumUptime;

    console.log('[Live] Liveness check', {
      requestId,
      hasMinimumUptime,
      uptime: `${Math.floor(uptime)}s`,
      threshold: '> 5s',
      result: isAlive ? 'PASSED' : 'FAILED',
    });

    if (!isAlive) {
      console.warn('[Live] Probe FAILED: insufficient uptime', {
        requestId,
        uptime: `${Math.floor(uptime)}s`,
        threshold: '5s',
      });
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          reason: 'insufficient_uptime',
          uptime: `${Math.floor(uptime)}s`,
          memoryUsage: `${Math.round(memoryUsagePercent)}%`,
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

    console.log('[Live] Probe PASSED', { requestId });

    return NextResponse.json(
      {
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime)}s`,
        memoryUsage: `${Math.round(memoryUsagePercent)}%`,
        requestId,
      },
      {
        status: StatusCodes.OK,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Request-Id': requestId,
        },
      }
    );
  } catch (error) {
    console.error('[Live] Check EXCEPTION', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Liveness check failed',
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
