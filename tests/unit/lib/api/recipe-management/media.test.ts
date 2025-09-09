import { mediaApi } from '@/lib/api/recipe-management/media';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  PageMediaDto,
  MediaDto,
  MediaUploadRequest,
  CreateMediaResponse,
  DeleteMediaResponse,
} from '@/types/recipe-management';
import {
  MediaType,
  MediaFormat,
  ProcessingStatus,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
  buildQueryParams: jest.requireActual('@/lib/api/recipe-management/client')
    .buildQueryParams,
  createFormData: jest.requireActual('@/lib/api/recipe-management/client')
    .createFormData,
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Media API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMedia: MediaDto = {
    userId: 'mock-user',
    mediaId: 1,
    mediaType: MediaType.IMAGE_JPEG,
    fileSize: 2048000,
    processingStatus: ProcessingStatus.COMPLETE,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
  };

  const mockPageMedia: PageMediaDto = {
    content: [mockMedia],
    pageable: {
      pageNumber: 0,
      pageSize: 20,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalElements: 1,
    totalPages: 1,
    last: true,
    first: true,
    numberOfElements: 1,
    size: 20,
    number: 0,
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
    empty: false,
  };

  const mockUploadRequest: MediaUploadRequest = {
    file: new File(['binary data'], 'test-image.jpg', { type: 'image/jpeg' }),
    originalFilename: 'test-image.jpg',
    mediaType: MediaType.IMAGE_JPEG,
    fileSize: 2048000,
    description: 'Recipe main image',
    altText: 'Delicious pasta dish',
  };

  const mockCreateResponse: CreateMediaResponse = {
    mediaId: 1,
    originalFilename: 'recipe-image.jpg',
    processingStatus: ProcessingStatus.PROCESSING,
  };

  const mockDeleteResponse: DeleteMediaResponse = {
    mediaId: 1,
    deleted: true,
    deletedAt: '2023-01-01T10:00:00Z',
  };

  describe('Recipe Media', () => {
    describe('getRecipeMedia', () => {
      it('should get recipe media without pagination', async () => {
        mockedClient.get.mockResolvedValue({ data: mockPageMedia });

        const result = await mediaApi.getRecipeMedia(1);

        expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/media');
        expect(result).toEqual(mockPageMedia);
      });

      it('should get recipe media with pagination', async () => {
        mockedClient.get.mockResolvedValue({ data: mockPageMedia });

        const params = { page: 1, size: 10 };
        await mediaApi.getRecipeMedia(1, params);

        expect(mockedClient.get).toHaveBeenCalledWith(
          '/recipes/1/media?page=1&size=10'
        );
      });

      it('should handle empty media list', async () => {
        const emptyResponse: PageMediaDto = {
          content: [],
          pageable: {
            pageNumber: 0,
            pageSize: 20,
            sort: {
              sorted: false,
              unsorted: true,
              empty: true,
            },
            offset: 0,
            paged: true,
            unpaged: false,
          },
          totalElements: 0,
          totalPages: 0,
          last: true,
          first: true,
          numberOfElements: 0,
          size: 20,
          number: 0,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          empty: true,
        };

        mockedClient.get.mockResolvedValue({ data: emptyResponse });

        const result = await mediaApi.getRecipeMedia(1);

        expect(result.empty).toBe(true);
        expect(result.content).toHaveLength(0);
      });

      it('should handle recipe not found error', async () => {
        const error = new Error('Recipe not found');
        mockedClient.get.mockRejectedValue(error);

        await expect(mediaApi.getRecipeMedia(999)).rejects.toThrow(
          'Recipe not found'
        );
      });
    });

    describe('uploadRecipeMedia', () => {
      it('should upload recipe media file', async () => {
        mockedClient.post.mockResolvedValue({ data: mockCreateResponse });

        const result = await mediaApi.uploadRecipeMedia(1, mockUploadRequest);

        expect(mockedClient.post).toHaveBeenCalledWith(
          '/recipes/1/media',
          expect.any(FormData),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        expect(result).toEqual(mockCreateResponse);
      });

      it('should handle large file uploads', async () => {
        const largeFile = new File(['x'.repeat(10000000)], 'large-image.jpg', {
          type: 'image/jpeg',
        });
        const largeUploadRequest = {
          ...mockUploadRequest,
          file: largeFile,
        };

        const largeFileResponse = {
          ...mockCreateResponse,
          processingStatus: 'PROCESSING' as ProcessingStatus,
        };

        mockedClient.post.mockResolvedValue({ data: largeFileResponse });

        const result = await mediaApi.uploadRecipeMedia(1, largeUploadRequest);

        expect(result.processingStatus).toBe('PROCESSING');
      });

      it('should handle file upload validation errors', async () => {
        const invalidUpload: MediaUploadRequest = {
          file: new File([''], 'empty.txt', { type: 'text/plain' }),
          description: 'Invalid file type',
          originalFilename: 'empty.txt',
          mediaType: 'text/plain' as MediaType,
          fileSize: 0,
          altText: 'This should fail',
        };

        const error = new Error('Invalid file type. Only images are allowed.');
        mockedClient.post.mockRejectedValue(error);

        await expect(
          mediaApi.uploadRecipeMedia(1, invalidUpload)
        ).rejects.toThrow('Invalid file type. Only images are allowed.');
      });

      it('should handle file size limit errors', async () => {
        const oversizedFile = new File(['x'.repeat(50000000)], 'huge.jpg', {
          type: 'image/jpeg',
        });
        const oversizedUpload = {
          ...mockUploadRequest,
          file: oversizedFile,
        };

        const error = new Error('File size exceeds limit');
        mockedClient.post.mockRejectedValue(error);

        await expect(
          mediaApi.uploadRecipeMedia(1, oversizedUpload)
        ).rejects.toThrow('File size exceeds limit');
      });
    });

    describe('deleteRecipeMedia', () => {
      it('should delete recipe media', async () => {
        mockedClient.delete.mockResolvedValue({ data: mockDeleteResponse });

        const result = await mediaApi.deleteRecipeMedia(1, 1);

        expect(mockedClient.delete).toHaveBeenCalledWith('/recipes/1/media/1');
        expect(result).toEqual(mockDeleteResponse);
      });

      it('should handle media not found during deletion', async () => {
        const error = new Error('Media not found');
        mockedClient.delete.mockRejectedValue(error);

        await expect(mediaApi.deleteRecipeMedia(1, 999)).rejects.toThrow(
          'Media not found'
        );
      });

      it('should handle permission denied for media deletion', async () => {
        const error = new Error('Permission denied');
        mockedClient.delete.mockRejectedValue(error);

        await expect(mediaApi.deleteRecipeMedia(1, 1)).rejects.toThrow(
          'Permission denied'
        );
      });
    });
  });

  describe('Ingredient Media', () => {
    describe('getIngredientMedia', () => {
      it('should get ingredient media', async () => {
        mockedClient.get.mockResolvedValue({ data: mockPageMedia });

        const result = await mediaApi.getIngredientMedia(1, 1);

        expect(mockedClient.get).toHaveBeenCalledWith(
          '/recipes/1/ingredients/1/media'
        );
        expect(result).toEqual(mockPageMedia);
      });

      it('should get ingredient media with pagination', async () => {
        mockedClient.get.mockResolvedValue({ data: mockPageMedia });

        const params = { page: 0, size: 5 };
        await mediaApi.getIngredientMedia(1, 1, params);

        expect(mockedClient.get).toHaveBeenCalledWith(
          '/recipes/1/ingredients/1/media?page=0&size=5'
        );
      });

      it('should handle ingredient not found error', async () => {
        const error = new Error('Ingredient not found');
        mockedClient.get.mockRejectedValue(error);

        await expect(mediaApi.getIngredientMedia(1, 999)).rejects.toThrow(
          'Ingredient not found'
        );
      });
    });

    describe('uploadIngredientMedia', () => {
      it('should upload ingredient media', async () => {
        mockedClient.post.mockResolvedValue({ data: mockCreateResponse });

        const result = await mediaApi.uploadIngredientMedia(
          1,
          1,
          mockUploadRequest
        );

        expect(mockedClient.post).toHaveBeenCalledWith(
          '/recipes/1/ingredients/1/media',
          expect.any(FormData),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        expect(result).toEqual(mockCreateResponse);
      });

      it('should handle ingredient media upload with video', async () => {
        const videoUpload: MediaUploadRequest = {
          file: new File(['video data'], 'ingredient-prep.mp4', {
            type: 'video/mp4',
          }),
          description: 'How to prepare this ingredient',
          originalFilename: 'ingredient-prep.mp4',
          mediaType: MediaType.VIDEO_MP4,
          fileSize: 5242880, // 5MB
          altText: 'Video showing ingredient preparation',
        };

        const videoResponse = {
          ...mockCreateResponse,
          originalFilename: 'ingredient-prep.mp4',
        };

        mockedClient.post.mockResolvedValue({ data: videoResponse });

        const result = await mediaApi.uploadIngredientMedia(1, 1, videoUpload);

        expect(result.originalFilename).toBe('ingredient-prep.mp4');
      });
    });

    describe('deleteIngredientMedia', () => {
      it('should delete ingredient media', async () => {
        mockedClient.delete.mockResolvedValue({ data: mockDeleteResponse });

        const result = await mediaApi.deleteIngredientMedia(1, 1, 1);

        expect(mockedClient.delete).toHaveBeenCalledWith(
          '/recipes/1/ingredients/1/media/1'
        );
        expect(result).toEqual(mockDeleteResponse);
      });

      it('should handle cascade deletion errors', async () => {
        const error = new Error(
          'Cannot delete media: ingredient is referenced by steps'
        );
        mockedClient.delete.mockRejectedValue(error);

        await expect(mediaApi.deleteIngredientMedia(1, 1, 1)).rejects.toThrow(
          'Cannot delete media: ingredient is referenced by steps'
        );
      });
    });
  });

  describe('Step Media', () => {
    describe('getStepMedia', () => {
      it('should get step media', async () => {
        const stepMediaResponse = {
          ...mockPageMedia,
          content: [
            {
              ...mockMedia,
              mediaType: MediaType.VIDEO_MP4,
              originalFilename: 'step-demo.mp4',
            },
          ],
        };

        mockedClient.get.mockResolvedValue({ data: stepMediaResponse });

        const result = await mediaApi.getStepMedia(1, 1);

        expect(mockedClient.get).toHaveBeenCalledWith(
          '/recipes/1/steps/1/media'
        );
        expect(result.content[0].mediaType).toBe(MediaType.VIDEO_MP4);
      });

      it('should get step media with custom pagination', async () => {
        mockedClient.get.mockResolvedValue({ data: mockPageMedia });

        const params = { page: 2, size: 3 };
        await mediaApi.getStepMedia(1, 1, params);

        expect(mockedClient.get).toHaveBeenCalledWith(
          '/recipes/1/steps/1/media?page=2&size=3'
        );
      });

      it('should handle step not found error', async () => {
        const error = new Error('Step not found');
        mockedClient.get.mockRejectedValue(error);

        await expect(mediaApi.getStepMedia(1, 999)).rejects.toThrow(
          'Step not found'
        );
      });
    });

    describe('uploadStepMedia', () => {
      it('should upload step media', async () => {
        mockedClient.post.mockResolvedValue({ data: mockCreateResponse });

        const result = await mediaApi.uploadStepMedia(1, 1, mockUploadRequest);

        expect(mockedClient.post).toHaveBeenCalledWith(
          '/recipes/1/steps/1/media',
          expect.any(FormData),
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        expect(result).toEqual(mockCreateResponse);
      });

      it('should handle step instructional video upload', async () => {
        const instructionalVideo: MediaUploadRequest = {
          file: new File(['video content'], 'step-instruction.mp4', {
            type: 'video/mp4',
          }),
          description: 'Step-by-step cooking demonstration',
          altText: 'Cooking demonstration for step 1',
          originalFilename: 'step-instruction.mp4',
          mediaType: MediaType.VIDEO_MP4,
          fileSize: 10485760, // 10MB
        };

        const videoResponse = {
          ...mockCreateResponse,
          fileName: 'step-instruction.mp4',
          processingStatus: 'PROCESSING' as ProcessingStatus,
        };

        mockedClient.post.mockResolvedValue({ data: videoResponse });

        const result = await mediaApi.uploadStepMedia(1, 1, instructionalVideo);

        expect(result.processingStatus).toBe('PROCESSING');
      });

      it('should handle step media upload limits', async () => {
        const error = new Error(
          'Maximum number of media files per step exceeded'
        );
        mockedClient.post.mockRejectedValue(error);

        await expect(
          mediaApi.uploadStepMedia(1, 1, mockUploadRequest)
        ).rejects.toThrow('Maximum number of media files per step exceeded');
      });
    });

    describe('deleteStepMedia', () => {
      it('should delete step media', async () => {
        mockedClient.delete.mockResolvedValue({ data: mockDeleteResponse });

        const result = await mediaApi.deleteStepMedia(1, 1, 1);

        expect(mockedClient.delete).toHaveBeenCalledWith(
          '/recipes/1/steps/1/media/1'
        );
        expect(result).toEqual(mockDeleteResponse);
      });

      it('should handle step media not found', async () => {
        const error = new Error('Step media not found');
        mockedClient.delete.mockRejectedValue(error);

        await expect(mediaApi.deleteStepMedia(1, 1, 999)).rejects.toThrow(
          'Step media not found'
        );
      });

      it('should handle processing media deletion', async () => {
        const error = new Error('Cannot delete media while processing');
        mockedClient.delete.mockRejectedValue(error);

        await expect(mediaApi.deleteStepMedia(1, 1, 1)).rejects.toThrow(
          'Cannot delete media while processing'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors consistently across all endpoints', async () => {
      const networkError = new Error('Network timeout');

      mockedClient.get.mockRejectedValue(networkError);
      mockedClient.post.mockRejectedValue(networkError);
      mockedClient.delete.mockRejectedValue(networkError);

      await expect(mediaApi.getRecipeMedia(1)).rejects.toThrow(
        'Network timeout'
      );
      await expect(
        mediaApi.uploadRecipeMedia(1, mockUploadRequest)
      ).rejects.toThrow('Network timeout');
      await expect(mediaApi.deleteRecipeMedia(1, 1)).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should handle server errors with proper error messages', async () => {
      const serverError = new Error('Internal server error');

      mockedClient.get.mockRejectedValue(serverError);

      await expect(mediaApi.getIngredientMedia(1, 1)).rejects.toThrow(
        'Internal server error'
      );
      await expect(mediaApi.getStepMedia(1, 1)).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Unauthorized: Invalid token');

      mockedClient.post.mockRejectedValue(authError);

      await expect(
        mediaApi.uploadIngredientMedia(1, 1, mockUploadRequest)
      ).rejects.toThrow('Unauthorized: Invalid token');
      await expect(
        mediaApi.uploadStepMedia(1, 1, mockUploadRequest)
      ).rejects.toThrow('Unauthorized: Invalid token');
    });
  });
});
