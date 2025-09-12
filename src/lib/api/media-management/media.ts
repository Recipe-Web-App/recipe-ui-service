/**
 * Media endpoints for media-management service
 * Generated from OpenAPI specification
 */

import { mediaManagementClient, handleMediaManagementApiError } from './client';
import type {
  MediaDto,
  PaginatedMediaResponse,
  UploadMediaResponse,
  InitiateUploadRequest,
  InitiateUploadResponse,
  UploadStatusResponse,
  MediaId,
} from '@/types/media-management';

/**
 * Query parameters for listing media files
 */
export interface MediaListParams {
  cursor?: string;
  limit?: number;
  status?: 'Pending' | 'Processing' | 'Complete' | 'Failed';
}

/**
 * Query parameters for presigned upload
 */
export interface PresignedUploadParams {
  signature: string;
  expires: number;
  size: number;
  type: string;
}

/**
 * API client for media operations
 */
export const mediaApi = {
  /**
   * POST /media - Upload media file
   * Upload a new media file to the system with automatic content-addressable storage and deduplication
   */
  async uploadMedia(
    file: File,
    filename?: string
  ): Promise<UploadMediaResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', filename ?? file.name);

      const response = await mediaManagementClient.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as UploadMediaResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media - List media files
   * Retrieve a list of media files with efficient cursor-based pagination and optional filtering
   */
  async listMedia(params?: MediaListParams): Promise<PaginatedMediaResponse> {
    try {
      const response = await mediaManagementClient.get('/media', { params });
      return response.data as PaginatedMediaResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media/{id} - Get media by ID
   * Retrieve detailed information about a specific media file
   */
  async getMediaById(id: MediaId): Promise<MediaDto> {
    try {
      const response = await mediaManagementClient.get(`/media/${id}`);
      return response.data as MediaDto;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * DELETE /media/{id} - Delete media file
   * Permanently delete a media file and its associated database record
   */
  async deleteMedia(id: MediaId): Promise<void> {
    try {
      await mediaManagementClient.delete(`/media/${id}`);
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media/{id}/download - Download media file
   * Download the actual media file binary data
   */
  async downloadMedia(id: MediaId): Promise<Blob> {
    try {
      const response = await mediaManagementClient.get(
        `/media/${id}/download`,
        {
          responseType: 'blob',
        }
      );
      return response.data as Blob;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * POST /media/upload-request - Initiate presigned upload session
   * Creates a presigned upload session for secure, UI-friendly file uploads with progress tracking
   */
  async initiateUpload(
    request: InitiateUploadRequest
  ): Promise<InitiateUploadResponse> {
    try {
      const response = await mediaManagementClient.post(
        '/media/upload-request',
        request
      );
      return response.data as InitiateUploadResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * PUT /media/upload/{token} - Upload file to presigned URL
   * Uploads the actual file content using the presigned URL from upload initiation
   */
  async uploadToPresignedUrl(
    token: string,
    file: File,
    params: PresignedUploadParams
  ): Promise<UploadMediaResponse> {
    try {
      const response = await mediaManagementClient.put(
        `/media/upload/${token}`,
        file,
        {
          params,
          headers: {
            'Content-Type': file.type,
          },
        }
      );
      return response.data as UploadMediaResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media/{id}/status - Get upload/processing status
   * Retrieves the current status of a media upload, including processing progress and any error information
   */
  async getUploadStatus(id: MediaId): Promise<UploadStatusResponse> {
    try {
      const response = await mediaManagementClient.get(`/media/${id}/status`);
      return response.data as UploadStatusResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media/recipe/{recipe_id} - Get media IDs by recipe
   * Retrieve media IDs associated with a specific recipe
   */
  async getMediaByRecipe(recipeId: number): Promise<MediaId[]> {
    try {
      const response = await mediaManagementClient.get(
        `/media/recipe/${recipeId}`
      );
      return response.data as MediaId[];
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media/recipe/{recipe_id}/ingredient/{ingredient_id} - Get media IDs by recipe ingredient
   * Retrieve media IDs associated with a specific ingredient in a recipe
   */
  async getMediaByIngredient(
    recipeId: number,
    ingredientId: number
  ): Promise<MediaId[]> {
    try {
      const response = await mediaManagementClient.get(
        `/media/recipe/${recipeId}/ingredient/${ingredientId}`
      );
      return response.data as MediaId[];
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  /**
   * GET /media/recipe/{recipe_id}/step/{step_id} - Get media IDs by recipe step
   * Retrieve media IDs associated with a specific step in a recipe
   */
  async getMediaByStep(recipeId: number, stepId: number): Promise<MediaId[]> {
    try {
      const response = await mediaManagementClient.get(
        `/media/recipe/${recipeId}/step/${stepId}`
      );
      return response.data as MediaId[];
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },
};
