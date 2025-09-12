/**
 * Unit tests for media hooks
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useMediaList,
  useMedia,
  useUploadMedia,
  useDeleteMedia,
  useDownloadMedia,
  useUploadStatus,
  useMediaManager,
  useInvalidateMedia,
} from '@/hooks/media-management/useMedia';
import { mediaApi, type MediaListParams } from '@/lib/api/media-management';
import type {
  MediaDto,
  PaginatedMediaResponse,
  UploadMediaResponse,
  UploadStatusResponse,
} from '@/types/media-management';

// Mock the media API
jest.mock('@/lib/api/media-management', () => ({
  mediaApi: {
    listMedia: jest.fn(),
    getMediaById: jest.fn(),
    uploadMedia: jest.fn(),
    deleteMedia: jest.fn(),
    downloadMedia: jest.fn(),
    getUploadStatus: jest.fn(),
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

describe('useMediaList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch media list successfully', async () => {
    const mockResponse: PaginatedMediaResponse = {
      data: [
        {
          id: 1,
          content_hash: 'mock-content-hash',
          original_filename: 'test.jpg',
          media_type: 'image/jpeg',
          media_path: 'mock/path/content-hash',
          file_size: 1024,
          processing_status: 'Complete',
          uploaded_at: '2025-01-01T10:00:00Z',
          updated_at: '2025-01-01T10:00:00Z',
        },
      ],
      pagination: {
        next_cursor: null,
        prev_cursor: null,
        page_size: 1,
        has_next: false,
        has_prev: false,
      },
    };

    mockedMediaApi.listMedia.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMediaList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.listMedia).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should fetch media list with params', async () => {
    const params: MediaListParams = {
      cursor: 'eyJpZCI6MTIzfQ==',
      limit: 10,
      status: 'Complete',
    };
    const mockResponse: PaginatedMediaResponse = {
      data: [],
      pagination: {
        next_cursor: null,
        prev_cursor: null,
        page_size: 0,
        has_next: false,
        has_prev: false,
      },
    };

    mockedMediaApi.listMedia.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMediaList(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.listMedia).toHaveBeenCalledWith(params);
  });

  it('should handle errors', async () => {
    mockedMediaApi.listMedia.mockRejectedValue(new Error('List failed'));

    const { result } = renderHook(() => useMediaList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('List failed'));
  });
});

describe('useMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch media by ID successfully', async () => {
    const mockResponse: MediaDto = {
      id: 123,
      content_hash: 'mock-content-hash',
      original_filename: 'test.jpg',
      media_type: 'image/jpeg',
      media_path: 'mock/path/content-hash',
      file_size: 1024,
      processing_status: 'Complete',
      uploaded_at: '2025-01-01T10:00:00Z',
      updated_at: '2025-01-01T10:00:00Z',
    };

    mockedMediaApi.getMediaById.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMedia(123), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.getMediaById).toHaveBeenCalledWith(123);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should not fetch when disabled', () => {
    const { result } = renderHook(() => useMedia(123, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockedMediaApi.getMediaById).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    mockedMediaApi.getMediaById.mockRejectedValue(new Error('Get failed'));

    const { result } = renderHook(() => useMedia(123), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('Get failed'));
  });
});

describe('useUploadMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload media successfully', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'mock-content-hash',
      processing_status: 'Pending',
      upload_url: null,
    };

    mockedMediaApi.uploadMedia.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploadMedia(), {
      wrapper: createWrapper(),
    });

    const uploadResult = await result.current.mutateAsync({
      file: mockFile,
      filename: 'custom.jpg',
    });

    expect(mockedMediaApi.uploadMedia).toHaveBeenCalledWith(
      mockFile,
      'custom.jpg'
    );
    expect(uploadResult).toEqual(mockResponse);
  });

  it('should handle upload errors', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    mockedMediaApi.uploadMedia.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useUploadMedia(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({ file: mockFile })
    ).rejects.toThrow('Upload failed');
  });
});

describe('useDeleteMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete media successfully', async () => {
    mockedMediaApi.deleteMedia.mockResolvedValue();

    const { result } = renderHook(() => useDeleteMedia(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(123);

    expect(mockedMediaApi.deleteMedia).toHaveBeenCalledWith(123);
  });

  it('should handle delete errors', async () => {
    mockedMediaApi.deleteMedia.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useDeleteMedia(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(123)).rejects.toThrow(
      'Delete failed'
    );
  });
});

describe('useDownloadMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should download media successfully', async () => {
    const mockBlob = new Blob(['file content'], { type: 'image/jpeg' });
    mockedMediaApi.downloadMedia.mockResolvedValue(mockBlob);

    const { result } = renderHook(() => useDownloadMedia(), {
      wrapper: createWrapper(),
    });

    const blob = await result.current.mutateAsync(123);

    expect(mockedMediaApi.downloadMedia).toHaveBeenCalledWith(123);
    expect(blob).toBe(mockBlob);
  });

  it('should handle download errors', async () => {
    mockedMediaApi.downloadMedia.mockRejectedValue(
      new Error('Download failed')
    );

    const { result } = renderHook(() => useDownloadMedia(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(123)).rejects.toThrow(
      'Download failed'
    );
  });
});

describe('useUploadStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get upload status successfully', async () => {
    const mockResponse: UploadStatusResponse = {
      media_id: 123,
      status: 'Complete',
      progress: 100,
      error_message: null,
      download_url: 'http://example.com/media/123/download',
      processing_time_ms: 2500,
      uploaded_at: '2024-01-01T12:00:00Z',
      completed_at: '2024-01-01T12:00:02Z',
    };

    mockedMediaApi.getUploadStatus.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploadStatus(123), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedMediaApi.getUploadStatus).toHaveBeenCalledWith(123);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should not fetch when disabled', () => {
    const { result } = renderHook(() => useUploadStatus(123, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockedMediaApi.getUploadStatus).not.toHaveBeenCalled();
  });
});

describe('useMediaManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide unified media operations', async () => {
    const mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    const mockBlob = new Blob(['file content'], { type: 'image/jpeg' });
    const mockUploadResponse: UploadMediaResponse = {
      media_id: 123,
      content_hash: 'mock-content-hash',
      processing_status: 'Pending',
      upload_url: null,
    };

    mockedMediaApi.uploadMedia.mockResolvedValue(mockUploadResponse);
    mockedMediaApi.deleteMedia.mockResolvedValue();
    mockedMediaApi.downloadMedia.mockResolvedValue(mockBlob);

    const { result } = renderHook(() => useMediaManager(), {
      wrapper: createWrapper(),
    });

    // Test upload
    const uploadResult = await result.current.uploadMedia(
      mockFile,
      'custom.jpg'
    );
    expect(uploadResult).toEqual(mockUploadResponse);

    // Test delete
    await result.current.deleteMedia(123);
    expect(mockedMediaApi.deleteMedia).toHaveBeenCalledWith(123);

    // Test download
    const downloadResult = await result.current.downloadMedia(123);
    expect(downloadResult).toBe(mockBlob);
  });

  it('should handle loading states', () => {
    const { result } = renderHook(() => useMediaManager(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.isDownloading).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useInvalidateMedia', () => {
  it('should provide invalidation function', () => {
    const { result } = renderHook(() => useInvalidateMedia(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current).toBe('function');

    // Function should run without errors
    expect(() => result.current()).not.toThrow();
  });
});
