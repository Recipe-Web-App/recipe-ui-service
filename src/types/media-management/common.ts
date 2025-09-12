/**
 * Common types for Media Management Service
 * Generated from OpenAPI specification
 */

/**
 * Unique identifier for media files (database big serial)
 */
export type MediaId = number;

/**
 * Current processing status of the media file
 */
export type ProcessingStatus = 'Pending' | 'Processing' | 'Complete' | 'Failed';
