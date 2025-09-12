/**
 * Media Management Service API
 * Barrel exports for all API endpoints
 */

// Client and error handling
export { mediaManagementClient, handleMediaManagementApiError } from './client';

// Health endpoints
export { healthApi } from './health';

// Media endpoints
export {
  mediaApi,
  type MediaListParams,
  type PresignedUploadParams,
} from './media';
