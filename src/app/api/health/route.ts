import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    // You can add more health checks here:
    // - Database connection
    // - External API availability
    // - Critical service dependencies

    const healthData = {
      status: 'healthy',
      timestamp,
      uptime: `${Math.floor(uptime)}s`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
      environment: process.env.NODE_ENV ?? 'development',
      version: process.env.npm_package_version ?? '0.1.0',
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
