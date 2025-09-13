/**
 * Presigned upload hooks for media management
 * Implements presigned URL upload flow from OpenAPI specification
 */

import { useMutation } from '@tanstack/react-query';
import {
  mediaApi,
  type PresignedUploadParams,
} from '@/lib/api/media-management';
import type {
  InitiateUploadRequest,
  UploadMediaResponse,
} from '@/types/media-management';

/**
 * Hook to initiate a presigned upload session
 * Maps to POST /media/upload-request endpoint
 */
export const useInitiateUpload = () => {
  return useMutation({
    mutationFn: (request: InitiateUploadRequest) =>
      mediaApi.initiateUpload(request),
  });
};

/**
 * Hook to upload file to presigned URL
 * Maps to PUT /media/upload/{token} endpoint
 */
export const useUploadToPresignedUrl = () => {
  return useMutation({
    mutationFn: ({
      token,
      file,
      params,
    }: {
      token: string;
      file: File;
      params: PresignedUploadParams;
    }) => mediaApi.uploadToPresignedUrl(token, file, params),
  });
};

/**
 * Combined hook for complete presigned upload flow
 * Handles both initiation and upload steps
 */
export const usePresignedUpload = () => {
  const initiateMutation = useInitiateUpload();
  const uploadMutation = useUploadToPresignedUrl();

  /**
   * Complete upload flow:
   * 1. Initiate upload session
   * 2. Upload file to presigned URL
   */
  const uploadFile = async (file: File): Promise<UploadMediaResponse> => {
    // Step 1: Initiate upload session
    const initiateRequest: InitiateUploadRequest = {
      filename: file.name,
      content_type: file.type,
      file_size: file.size,
    };

    const initiateResponse =
      await initiateMutation.mutateAsync(initiateRequest);

    // Step 2: Extract params from the presigned URL
    const url = new URL(initiateResponse.upload_url);
    const params: PresignedUploadParams = {
      signature: url.searchParams.get('signature') ?? '',
      expires: parseInt(url.searchParams.get('expires') ?? '0', 10),
      size: parseInt(url.searchParams.get('size') ?? '0', 10),
      type: url.searchParams.get('type') ?? '',
    };

    // Step 3: Upload file to presigned URL
    const uploadResponse = await uploadMutation.mutateAsync({
      token: initiateResponse.upload_token,
      file,
      params,
    });

    return uploadResponse;
  };

  const isInitiating = initiateMutation.isPending;
  const isUploading = uploadMutation.isPending;
  const isLoading = isInitiating || isUploading;

  const error = initiateMutation.error ?? uploadMutation.error;

  return {
    uploadFile,
    isInitiating,
    isUploading,
    isLoading,
    error,
    initiateData: initiateMutation.data,
    uploadData: uploadMutation.data,
  };
};

/**
 * Hook for managing presigned upload with progress tracking
 * Provides detailed status for each upload phase
 */
export const usePresignedUploadWithProgress = () => {
  const initiateMutation = useInitiateUpload();
  const uploadMutation = useUploadToPresignedUrl();

  /**
   * Complete upload flow:
   * 1. Initiate upload session
   * 2. Upload file to presigned URL
   */
  const uploadFile = async (file: File): Promise<UploadMediaResponse> => {
    // Step 1: Initiate upload session
    const initiateRequest: InitiateUploadRequest = {
      filename: file.name,
      content_type: file.type,
      file_size: file.size,
    };

    const initiateResponse =
      await initiateMutation.mutateAsync(initiateRequest);

    // Step 2: Extract params from the presigned URL
    const url = new URL(initiateResponse.upload_url);
    const params: PresignedUploadParams = {
      signature: url.searchParams.get('signature') ?? '',
      expires: parseInt(url.searchParams.get('expires') ?? '0', 10),
      size: parseInt(url.searchParams.get('size') ?? '0', 10),
      type: url.searchParams.get('type') ?? '',
    };

    // Step 3: Upload file to presigned URL
    const uploadResponse = await uploadMutation.mutateAsync({
      token: initiateResponse.upload_token,
      file,
      params,
    });

    return uploadResponse;
  };

  const isInitiating = initiateMutation.isPending;
  const isUploading = uploadMutation.isPending;
  const isLoading = isInitiating || isUploading;
  const isError = initiateMutation.isError || uploadMutation.isError;
  const error = initiateMutation.error ?? uploadMutation.error;

  const getUploadPhase = () => {
    if (isInitiating) return 'initiating';
    if (isUploading) return 'uploading';
    if (isError) return 'error';
    return 'idle';
  };

  const getProgressMessage = () => {
    switch (getUploadPhase()) {
      case 'initiating':
        return 'Preparing upload session...';
      case 'uploading':
        return 'Uploading file...';
      case 'error':
        return `Upload failed: ${error?.message ?? 'Unknown error'}`;
      default:
        return 'Ready to upload';
    }
  };

  return {
    uploadFile,
    phase: getUploadPhase(),
    message: getProgressMessage(),
    isLoading,
    error,
  };
};
