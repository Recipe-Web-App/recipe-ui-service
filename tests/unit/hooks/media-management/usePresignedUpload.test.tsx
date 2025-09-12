/**
 * Unit tests for presigned upload hooks
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useInitiateUpload,
  useUploadToPresignedUrl,
  usePresignedUpload,
  usePresignedUploadWithProgress,
} from '@/hooks/media-management/usePresignedUpload';
import {
  mediaApi,
  type PresignedUploadParams,
} from '@/lib/api/media-management';
import type {
  InitiateUploadRequest,
  InitiateUploadResponse,
  UploadMediaResponse,
} from '@/types/media-management';

// Mock the media API
jest.mock('@/lib/api/media-management', () => ({
  mediaApi: {
    initiateUpload: jest.fn(),
    uploadToPresignedUrl: jest.fn(),
  },
}));

const mockedMediaApi = mediaApi as jest.Mocked<typeof mediaApi>;

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useInitiateUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate upload successfully', async () => {
    const mockRequest: InitiateUploadRequest = {
      filename: 'test.jpg',
      content_type: 'image/jpeg',
      file_size: 1048576,
    };
    const mockResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url:
        'http://example.com/upload?signature=mock-sig&expires=123&size=1048576&type=image%2Fjpeg',
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'Pending',
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useInitiateUpload(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync(mockRequest);

    expect(mockedMediaApi.initiateUpload).toHaveBeenCalledWith(mockRequest);
    expect(response).toEqual(mockResponse);
  });

  it('should handle initiate errors', async () => {
    const mockRequest: InitiateUploadRequest = {
      filename: 'test.jpg',
      content_type: 'image/jpeg',
      file_size: 1048576,
    };

    mockedMediaApi.initiateUpload.mockRejectedValue(
      new Error('Initiate failed')
    );

    const { result } = renderHook(() => useInitiateUpload(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(mockRequest)).rejects.toThrow(
      'Initiate failed'
    );
  });
});

describe('useUploadToPresignedUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload to presigned URL successfully', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockParams: PresignedUploadParams = {
      signature: 'mock-signature',
      expires: 1704067200,
      size: 1048576,
      type: 'image%2Fjpeg',
    };
    const mockResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'mock-content-hash',
      processing_status: 'Processing',
      upload_url: null,
    };

    mockedMediaApi.uploadToPresignedUrl.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploadToPresignedUrl(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      token: 'upload_token123',
      file: mockFile,
      params: mockParams,
    });

    expect(mockedMediaApi.uploadToPresignedUrl).toHaveBeenCalledWith(
      'upload_token123',
      mockFile,
      mockParams
    );
    expect(response).toEqual(mockResponse);
  });

  it('should handle upload errors', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockParams: PresignedUploadParams = {
      signature: 'mock-signature',
      expires: 1704067200,
      size: 1048576,
      type: 'image%2Fjpeg',
    };

    mockedMediaApi.uploadToPresignedUrl.mockRejectedValue(
      new Error('Upload failed')
    );

    const { result } = renderHook(() => useUploadToPresignedUrl(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        token: 'upload_token123',
        file: mockFile,
        params: mockParams,
      })
    ).rejects.toThrow('Upload failed');
  });
});

describe('usePresignedUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full upload flow successfully', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url:
        'http://example.com/upload?signature=mock-sig&expires=1704067200&size=12&type=image%2Fjpeg',
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'Pending',
    };
    const mockUploadResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'mock-content-hash',
      processing_status: 'Processing',
      upload_url: null,
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);
    mockedMediaApi.uploadToPresignedUrl.mockResolvedValue(mockUploadResponse);

    const { result } = renderHook(() => usePresignedUpload(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.uploadFile(mockFile);

    expect(mockedMediaApi.initiateUpload).toHaveBeenCalledWith({
      filename: 'test.jpg',
      content_type: 'image/jpeg',
      file_size: 12,
    });

    expect(mockedMediaApi.uploadToPresignedUrl).toHaveBeenCalledWith(
      'mock-upload-token',
      mockFile,
      {
        signature: 'mock-sig',
        expires: 1704067200,
        size: 12,
        type: 'image/jpeg',
      }
    );

    expect(response).toEqual(mockUploadResponse);
  });

  it('should handle initiation errors', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    mockedMediaApi.initiateUpload.mockRejectedValue(
      new Error('Initiate failed')
    );

    const { result } = renderHook(() => usePresignedUpload(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.uploadFile(mockFile)).rejects.toThrow(
      'Initiate failed'
    );
  });

  it('should handle upload errors after successful initiation', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url:
        'http://example.com/upload?signature=mock-sig&expires=1704067200&size=12&type=image%2Fjpeg',
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'Pending',
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);
    mockedMediaApi.uploadToPresignedUrl.mockRejectedValue(
      new Error('Upload failed')
    );

    const { result } = renderHook(() => usePresignedUpload(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.uploadFile(mockFile)).rejects.toThrow(
      'Upload failed'
    );
  });

  it('should provide loading states', () => {
    const { result } = renderHook(() => usePresignedUpload(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isInitiating).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle missing URL parameters with fallback values', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url: 'http://example.com/upload', // URL without any query parameters
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'success',
    };

    const mockUploadResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'abc123',
      processing_status: 'Complete',
      upload_url: null,
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);
    mockedMediaApi.uploadToPresignedUrl.mockResolvedValue(mockUploadResponse);

    const { result } = renderHook(() => usePresignedUpload(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.uploadFile(mockFile);
      expect(response).toEqual(mockUploadResponse);
    });

    // Verify the upload was called with fallback values
    expect(mockedMediaApi.uploadToPresignedUrl).toHaveBeenCalledWith(
      'mock-upload-token',
      mockFile,
      {
        signature: '', // Fallback value
        expires: 0, // Fallback value
        size: 0, // Fallback value
        type: '', // Fallback value
      }
    );
  });

  it('should handle URL with partial parameters', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url:
        'http://example.com/upload?signature=test-sig&type=image%2Fjpeg', // Only signature and type
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'success',
    };

    const mockUploadResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'abc123',
      processing_status: 'Complete',
      upload_url: null,
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);
    mockedMediaApi.uploadToPresignedUrl.mockResolvedValue(mockUploadResponse);

    const { result } = renderHook(() => usePresignedUpload(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.uploadFile(mockFile);
      expect(response).toEqual(mockUploadResponse);
    });

    // Verify the upload was called with mix of actual and fallback values
    expect(mockedMediaApi.uploadToPresignedUrl).toHaveBeenCalledWith(
      'mock-upload-token',
      mockFile,
      {
        signature: 'test-sig', // Actual value
        expires: 0, // Fallback value
        size: 0, // Fallback value
        type: 'image/jpeg', // Actual value (URL decoded)
      }
    );
  });
});

describe('usePresignedUploadWithProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide upload phase and messages', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url:
        'http://example.com/upload?signature=mock-sig&expires=1704067200&size=12&type=image%2Fjpeg',
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'Pending',
    };
    const mockUploadResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'mock-content-hash',
      processing_status: 'Processing',
      upload_url: null,
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);
    mockedMediaApi.uploadToPresignedUrl.mockResolvedValue(mockUploadResponse);

    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.message).toBe('Ready to upload');

    const uploadPromise = result.current.uploadFile(mockFile);
    await uploadPromise;

    expect(result.current.phase).toBe('idle');
    expect(result.current.isLoading).toBe(false);
  });

  it('should show "Preparing upload session..." message when initiating', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    // Mock a pending initiate call that never resolves
    mockedMediaApi.initiateUpload.mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    // Trigger the upload which should put it in initiating state
    let uploadPromise: Promise<any>;
    act(() => {
      uploadPromise = result.current.uploadFile(mockFile);
    });

    // Allow React Query to process the mutation state change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    expect(result.current.phase).toBe('initiating');
    expect(result.current.message).toBe('Preparing upload session...');
  });

  it('should show "Uploading file..." message when uploading', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url:
        'http://example.com/upload?signature=mock-sig&expires=1704067200&size=12&type=image%2Fjpeg',
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'Pending',
    };

    // Complete initiate quickly
    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);

    // Create a pending upload promise
    mockedMediaApi.uploadToPresignedUrl.mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep it pending
    );

    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    // Start the upload and wait for initiate to complete
    await act(async () => {
      result.current.uploadFile(mockFile).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check that we're in the uploading phase with correct message
    expect(result.current.phase).toBe('uploading');
    expect(result.current.message).toBe('Uploading file...');
  });

  it('should show specific error message when error has message', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockError = new Error('Specific upload error message');
    mockedMediaApi.initiateUpload.mockRejectedValue(mockError);

    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      // Don't await here - let the mutation handle the error internally
      result.current.uploadFile(mockFile).catch(() => {
        // Expected to reject, but we need the mutation to track the error
      });
    });

    // Wait for the error state to be set
    await waitFor(() => {
      expect(result.current.phase).toBe('error');
    });

    expect(result.current.message).toBe(
      'Upload failed: Specific upload error message'
    );
  });

  it('should show "Unknown error" when error has no message', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockError = { status: 500 }; // Error without message property
    mockedMediaApi.initiateUpload.mockRejectedValue(mockError);

    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      // Don't await here - let the mutation handle the error internally
      result.current.uploadFile(mockFile).catch(() => {
        // Expected to reject, but we need the mutation to track the error
      });
    });

    // Wait for the error state to be set
    await waitFor(() => {
      expect(result.current.phase).toBe('error');
    });

    expect(result.current.message).toBe('Upload failed: Unknown error');
  });

  it('should provide error message format', () => {
    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    expect(result.current.phase).toBe('idle');
    expect(result.current.message).toBe('Ready to upload');

    // Test the message formatting by checking the underlying structure
    expect(typeof result.current.message).toBe('string');
    expect(typeof result.current.phase).toBe('string');
  });

  it('should handle missing URL parameters in usePresignedUploadWithProgress', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockInitiateResponse: InitiateUploadResponse = {
      media_id: 123,
      upload_url: 'http://example.com/upload', // URL without any query parameters
      upload_token: 'mock-upload-token',
      expires_at: '2024-01-01T12:00:00Z',
      status: 'Pending',
    };

    const mockUploadResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'abc123',
      processing_status: 'Complete',
      upload_url: null,
    };

    mockedMediaApi.initiateUpload.mockResolvedValue(mockInitiateResponse);
    mockedMediaApi.uploadToPresignedUrl.mockResolvedValue(mockUploadResponse);

    const { result } = renderHook(() => usePresignedUploadWithProgress(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.uploadFile(mockFile);
      expect(response).toEqual(mockUploadResponse);
    });

    // Verify the upload was called with fallback values
    expect(mockedMediaApi.uploadToPresignedUrl).toHaveBeenCalledWith(
      'mock-upload-token',
      mockFile,
      {
        signature: '', // Fallback value
        expires: 0, // Fallback value
        size: 0, // Fallback value
        type: '', // Fallback value
      }
    );
  });
});
