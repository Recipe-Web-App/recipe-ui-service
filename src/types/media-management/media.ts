/**
 * Media types for Media Management Service
 * Generated from OpenAPI specification
 */

import { MediaId, ProcessingStatus } from './common';

/**
 * Complete media file information
 */
export interface MediaDto {
  id: MediaId;
  content_hash: string;
  original_filename: string;
  media_type: string;
  media_path: string;
  file_size: number;
  processing_status: ProcessingStatus;
  uploaded_at: string;
  updated_at: string;
}

/**
 * Pagination metadata with cursor information
 */
export interface PaginationInfo {
  next_cursor: string | null;
  prev_cursor: string | null;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * Paginated list response for media files
 */
export interface PaginatedMediaResponse {
  data: MediaDto[];
  pagination: PaginationInfo;
}

/**
 * Response after successful media upload
 */
export interface UploadMediaResponse {
  media_id: MediaId;
  content_hash: string;
  processing_status: ProcessingStatus;
  upload_url: string | null;
}

/**
 * Request to start presigned upload session
 */
export interface InitiateUploadRequest {
  filename: string;
  content_type: string;
  file_size: number;
}

/**
 * Presigned upload session details
 */
export interface InitiateUploadResponse {
  media_id: MediaId;
  upload_url: string;
  upload_token: string;
  expires_at: string;
  status: string;
}

/**
 * Current upload/processing status
 */
export interface UploadStatusResponse {
  media_id: MediaId;
  status: ProcessingStatus;
  progress: number | null;
  error_message: string | null;
  download_url: string | null;
  processing_time_ms: number | null;
  uploaded_at: string | null;
  completed_at: string | null;
}
