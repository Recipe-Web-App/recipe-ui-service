/**
 * Unit tests for media API endpoints
 */

import {
  mediaApi,
  type MediaListParams,
  type PresignedUploadParams,
} from '@/lib/api/media-management/media';
import {
  mediaManagementClient,
  handleMediaManagementApiError,
} from '@/lib/api/media-management/client';
import type {
  MediaDto,
  PaginatedMediaResponse,
  UploadMediaResponse,
  InitiateUploadRequest,
  InitiateUploadResponse,
  UploadStatusResponse,
} from '@/types/media-management';

// Mock the client and error handler
jest.mock('@/lib/api/media-management/client', () => ({
  mediaManagementClient: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  },
  handleMediaManagementApiError: jest.fn().mockImplementation(error => {
    throw error;
  }),
}));

const mockedClient = mediaManagementClient as jest.Mocked<
  typeof mediaManagementClient
>;
const mockedErrorHandler = handleMediaManagementApiError as jest.MockedFunction<
  typeof handleMediaManagementApiError
>;

describe('mediaApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadMedia', () => {
    it('should upload media file with filename', async () => {
      const mockFile = new File(['test content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const mockResponse: UploadMediaResponse = {
        media_id: 123,
        content_hash: 'mock-content-hash',
        processing_status: 'Pending',
        upload_url: null,
      };

      mockedClient.post.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.uploadMedia(mockFile, 'custom.jpg');

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/media',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should use file name when no filename provided', async () => {
      const mockFile = new File(['test content'], 'original.jpg', {
        type: 'image/jpeg',
      });
      const mockResponse: UploadMediaResponse = {
        media_id: 123,
        content_hash: 'mock-content-hash',
        processing_status: 'Pending',
        upload_url: null,
      };

      mockedClient.post.mockResolvedValue({ data: mockResponse });

      await mediaApi.uploadMedia(mockFile);

      const formDataCall = mockedClient.post.mock.calls[0][1] as FormData;
      expect(formDataCall.get('filename')).toBe('original.jpg');
    });

    it('should handle errors', async () => {
      const mockFile = new File(['test content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const mockError = new Error('Upload failed');

      mockedClient.post.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.uploadMedia(mockFile)).rejects.toThrow(
        'Upload failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('listMedia', () => {
    it('should list media files without params', async () => {
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

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.listMedia();

      expect(mockedClient.get).toHaveBeenCalledWith('/media', {
        params: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should list media files with params', async () => {
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

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.listMedia(params);

      expect(mockedClient.get).toHaveBeenCalledWith('/media', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockError = new Error('List failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.listMedia()).rejects.toThrow('List failed');
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getMediaById', () => {
    it('should get media by ID', async () => {
      const mockResponse: MediaDto = {
        id: 123,
        content_hash: 'mock-content-hash',
        original_filename: 'test.jpg',
        media_type: 'image/jpeg',
        media_path: 'mock/path/content-hash',
        file_size: 1048576,
        processing_status: 'Complete',
        uploaded_at: '2025-01-15T10:30:00Z',
        updated_at: '2025-01-15T10:30:00Z',
      };

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.getMediaById(123);

      expect(mockedClient.get).toHaveBeenCalledWith('/media/123');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Get failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.getMediaById(123)).rejects.toThrow('Get failed');
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteMedia', () => {
    it('should delete media by ID', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await mediaApi.deleteMedia(123);

      expect(mockedClient.delete).toHaveBeenCalledWith('/media/123');
    });

    it('should handle errors', async () => {
      const mockError = new Error('Delete failed');

      mockedClient.delete.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.deleteMedia(123)).rejects.toThrow('Delete failed');
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('downloadMedia', () => {
    it('should download media file', async () => {
      const mockBlob = new Blob(['file content'], { type: 'image/jpeg' });

      mockedClient.get.mockResolvedValue({ data: mockBlob });

      const result = await mediaApi.downloadMedia(123);

      expect(mockedClient.get).toHaveBeenCalledWith('/media/123/download', {
        responseType: 'blob',
      });
      expect(result).toBe(mockBlob);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Download failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.downloadMedia(123)).rejects.toThrow(
        'Download failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('initiateUpload', () => {
    it('should initiate presigned upload', async () => {
      const mockRequest: InitiateUploadRequest = {
        filename: 'test.jpg',
        content_type: 'image/jpeg',
        file_size: 1048576,
      };
      const mockResponse: InitiateUploadResponse = {
        media_id: 123,
        upload_url: 'http://example.com/upload',
        upload_token: 'mock-upload-token',
        expires_at: '2024-01-01T12:00:00Z',
        status: 'Pending',
      };

      mockedClient.post.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.initiateUpload(mockRequest);

      expect(mediaManagementClient.post).toHaveBeenCalledWith(
        '/media/upload-request',
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockRequest: InitiateUploadRequest = {
        filename: 'test.jpg',
        content_type: 'image/jpeg',
        file_size: 1048576,
      };
      const mockError = new Error('Initiate failed');

      mockedClient.post.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.initiateUpload(mockRequest)).rejects.toThrow(
        'Initiate failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('uploadToPresignedUrl', () => {
    it('should upload to presigned URL', async () => {
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

      mockedClient.put.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.uploadToPresignedUrl(
        'upload_token123',
        mockFile,
        mockParams
      );

      expect(mockedClient.put).toHaveBeenCalledWith(
        '/media/upload/upload_token123',
        mockFile,
        {
          params: mockParams,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockFile = new File(['test content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const mockParams: PresignedUploadParams = {
        signature: 'mock-signature',
        expires: 1704067200,
        size: 1048576,
        type: 'image%2Fjpeg',
      };
      const mockError = new Error('Presigned upload failed');

      mockedClient.put.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(
        mediaApi.uploadToPresignedUrl('upload_token123', mockFile, mockParams)
      ).rejects.toThrow('Presigned upload failed');
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getUploadStatus', () => {
    it('should get upload status', async () => {
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

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.getUploadStatus(123);

      expect(mockedClient.get).toHaveBeenCalledWith('/media/123/status');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Status failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.getUploadStatus(123)).rejects.toThrow(
        'Status failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getMediaByRecipe', () => {
    it('should get media IDs by recipe', async () => {
      const mockResponse = [1, 2, 3];

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.getMediaByRecipe(123);

      expect(mockedClient.get).toHaveBeenCalledWith('/media/recipe/123');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Recipe media failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.getMediaByRecipe(123)).rejects.toThrow(
        'Recipe media failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getMediaByIngredient', () => {
    it('should get media IDs by ingredient', async () => {
      const mockResponse = [4, 5];

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.getMediaByIngredient(123, 456);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/media/recipe/123/ingredient/456'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Ingredient media failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.getMediaByIngredient(123, 456)).rejects.toThrow(
        'Ingredient media failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getMediaByStep', () => {
    it('should get media IDs by step', async () => {
      const mockResponse = [6, 7, 8];

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await mediaApi.getMediaByStep(123, 789);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/media/recipe/123/step/789'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Step media failed');

      mockedClient.get.mockRejectedValue(mockError);
      mockedErrorHandler.mockImplementation(() => {
        throw mockError;
      });

      await expect(mediaApi.getMediaByStep(123, 789)).rejects.toThrow(
        'Step media failed'
      );
      expect(mockedErrorHandler).toHaveBeenCalledWith(mockError);
    });
  });
});
