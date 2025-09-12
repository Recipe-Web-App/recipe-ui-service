export interface ServiceInfo {
  name: string;
  version: string;
  description: string;
  environment: string;
  uptime: number;
  timestamp: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  pid: number;
}

export interface SafeConfiguration {
  environment: string;
  port: number;
  logLevel: string;
  corsOrigins: string[];
  rateLimit: {
    ttl: number;
    limit: number;
  };
  database: {
    maxRetries: number;
    retryDelay: number;
    healthCheckInterval: number;
    logQueries: boolean;
  };
  oauth2: {
    serviceEnabled: boolean;
    serviceToServiceEnabled: boolean;
    introspectionEnabled: boolean;
    clientId: string;
  };
  logging: {
    level: string;
    consoleFormat: string;
    fileEnabled: boolean;
    maxSize: string;
    maxFiles: string;
  };
}
