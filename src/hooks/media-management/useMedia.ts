/**
 * Media management hooks for basic CRUD operations
 * Only implements endpoints from OpenAPI specification
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi, type MediaListParams } from '@/lib/api/media-management';
import { QUERY_KEYS } from '@/constants';
import type { UploadMediaResponse, MediaId } from '@/types/media-management';

/**
 * Hook to fetch a list of media items with pagination
 * Maps to GET /media endpoint
 */
export const useMediaList = (params?: MediaListParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA_LIST, params],
    queryFn: () => mediaApi.listMedia(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a specific media item by ID
 * Maps to GET /media/{id} endpoint
 */
export const useMedia = (mediaId: MediaId, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA, mediaId],
    queryFn: () => mediaApi.getMediaById(mediaId),
    enabled: enabled && !!mediaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to upload media files
 * Maps to POST /media endpoint
 */
export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, filename }: { file: File; filename?: string }) =>
      mediaApi.uploadMedia(file, filename),
    onSuccess: (response: UploadMediaResponse) => {
      // Invalidate media list queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA_LIST,
      });

      // Set the new media data in cache if we have full media info
      // Note: UploadMediaResponse doesn't contain full MediaDto, so we just invalidate
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA, response.media_id],
      });
    },
  });
};

/**
 * Hook to delete media
 * Maps to DELETE /media/{id} endpoint
 */
export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: MediaId) => mediaApi.deleteMedia(mediaId),
    onSuccess: (_, mediaId) => {
      // Remove the media from cache
      queryClient.removeQueries({
        queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA, mediaId],
      });

      // Invalidate media list queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA_LIST,
      });
    },
  });
};

/**
 * Hook to download media file
 * Maps to GET /media/{id}/download endpoint
 */
export const useDownloadMedia = () => {
  return useMutation({
    mutationFn: (mediaId: MediaId) => mediaApi.downloadMedia(mediaId),
  });
};

/**
 * Hook to check upload/processing status by media ID
 * Maps to GET /media/{id}/status endpoint
 */
export const useUploadStatus = (mediaId: MediaId, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA_MANAGEMENT.UPLOAD_STATUS, mediaId],
    queryFn: () => mediaApi.getUploadStatus(mediaId),
    enabled: enabled && !!mediaId,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: query => {
      // Stop polling if upload is complete or failed
      const status = query.state.data?.status;
      if (status === 'Complete' || status === 'Failed') {
        return false;
      }
      return 5000; // Poll every 5 seconds while processing
    },
    retry: 3,
  });
};

/**
 * Hook to manage basic media operations
 * Provides unified interface for common media operations
 */
export const useMediaManager = () => {
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();
  const downloadMutation = useDownloadMedia();

  const uploadMedia = (file: File, filename?: string) => {
    return uploadMutation.mutateAsync({ file, filename });
  };

  const deleteMedia = (mediaId: MediaId) => {
    return deleteMutation.mutateAsync(mediaId);
  };

  const downloadMedia = (mediaId: MediaId) => {
    return downloadMutation.mutateAsync(mediaId);
  };

  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isDownloading = downloadMutation.isPending;

  const error =
    uploadMutation.error ?? deleteMutation.error ?? downloadMutation.error;

  return {
    uploadMedia,
    deleteMedia,
    downloadMedia,
    isUploading,
    isDeleting,
    isDownloading,
    isLoading: isUploading || isDeleting || isDownloading,
    error,
  };
};

/**
 * Helper hook to invalidate all media-related queries
 */
export const useInvalidateMedia = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA_LIST,
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.MEDIA,
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.UPLOAD_STATUS,
    });
  };
};
