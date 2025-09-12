/**
 * Media Management Service types
 * Generated from OpenAPI specification
 */

// Common types
export type { MediaId, ProcessingStatus } from './common';

// Health check types
export type {
  DependencyCheck,
  ReadinessDependencyCheck,
  HealthResponse,
  ReadinessResponse,
} from './health';

// Media types
export type {
  MediaDto,
  PaginationInfo,
  PaginatedMediaResponse,
  UploadMediaResponse,
  InitiateUploadRequest,
  InitiateUploadResponse,
  UploadStatusResponse,
} from './media';

// Error types
export type { ErrorResponse } from './errors';
