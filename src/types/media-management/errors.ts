/**
 * Error types for Media Management Service
 * Generated from OpenAPI specification
 */

/**
 * Standardized error response format
 */
export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
