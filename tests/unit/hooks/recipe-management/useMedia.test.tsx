import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRecipeMedia,
  useIngredientMedia,
  useStepMedia,
  useUploadRecipeMedia,
  useUploadIngredientMedia,
  useUploadStepMedia,
  useDeleteRecipeMedia,
  useDeleteIngredientMedia,
  useDeleteStepMedia,
  useMediaManager,
  useInvalidateMedia,
} from '@/hooks/recipe-management/useMedia';
import { mediaApi } from '@/lib/api/recipe-management';
import {
  MediaType,
  ProcessingStatus,
  type MediaDto,
  type PageMediaDto,
  type MediaUploadRequest,
  type CreateMediaResponse,
  type DeleteMediaResponse,
} from '@/types/recipe-management';

// Mock the API
jest.mock('@/lib/api/recipe-management', () => ({
  mediaApi: {
    getRecipeMedia: jest.fn(),
    getIngredientMedia: jest.fn(),
    getStepMedia: jest.fn(),
    uploadRecipeMedia: jest.fn(),
    uploadIngredientMedia: jest.fn(),
    uploadStepMedia: jest.fn(),
    deleteRecipeMedia: jest.fn(),
    deleteIngredientMedia: jest.fn(),
    deleteStepMedia: jest.fn(),
  },
}));

const mockedMediaApi = mediaApi as jest.Mocked<typeof mediaApi>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Create a mock File object for testing
const createMockFile = (name: string, size: number, type: string): File => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('useMedia hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMediaDto: MediaDto = {
    mediaId: 1,
    userId: '123',
    mediaType: MediaType.IMAGE_JPEG,
    originalFilename: 'recipe-image.jpg',
    fileSize: 1024000,
    contentHash: 'abc123',
    processingStatus: ProcessingStatus.COMPLETE,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockPageMediaResponse: PageMediaDto = {
    content: [mockMediaDto],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0,
    numberOfElements: 1,
    first: true,
    last: true,
    empty: false,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      offset: 0,
      paged: true,
      unpaged: false,
    },
  };

  const mockUploadRequest: MediaUploadRequest = {
    file: createMockFile('test.jpg', 1024000, 'image/jpeg'),
    originalFilename: 'test.jpg',
    mediaType: MediaType.IMAGE_JPEG,
    fileSize: 1024000,
    contentHash: 'hash123',
  };

  const mockCreateResponse: CreateMediaResponse = {
    mediaId: 1,
    recipeId: 1,
    originalFilename: 'test.jpg',
    mediaType: MediaType.IMAGE_JPEG,
    fileSize: 1024000,
    contentHash: 'hash123',
    processingStatus: ProcessingStatus.PROCESSING,
  };

  const mockDeleteResponse: DeleteMediaResponse = {
    mediaId: 1,
    recipeId: 1,
    deleted: true,
    deletedAt: '2023-01-01T00:00:00Z',
  };

  describe('useRecipeMedia', () => {
    it('should fetch recipe media successfully', async () => {
      mockedMediaApi.getRecipeMedia.mockResolvedValue(mockPageMediaResponse);

      const { result } = renderHook(() => useRecipeMedia(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.getRecipeMedia).toHaveBeenCalledWith(1, undefined);
      expect(result.current.data).toEqual(mockPageMediaResponse);
    });

    it('should fetch recipe media with pagination parameters', async () => {
      const paginationParams = { page: 1, size: 5 };
      mockedMediaApi.getRecipeMedia.mockResolvedValue(mockPageMediaResponse);

      const { result } = renderHook(() => useRecipeMedia(1, paginationParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.getRecipeMedia).toHaveBeenCalledWith(
        1,
        paginationParams
      );
    });

    it('should not fetch when recipeId is falsy', () => {
      const { result } = renderHook(() => useRecipeMedia(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMediaApi.getRecipeMedia).not.toHaveBeenCalled();
    });

    it('should handle empty media response', async () => {
      const emptyResponse: PageMediaDto = {
        ...mockPageMediaResponse,
        content: [],
        totalElements: 0,
        numberOfElements: 0,
        empty: true,
      };

      mockedMediaApi.getRecipeMedia.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useRecipeMedia(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.content).toHaveLength(0);
      expect(result.current.data?.empty).toBe(true);
    });
  });

  describe('useIngredientMedia', () => {
    it('should fetch ingredient media successfully', async () => {
      mockedMediaApi.getIngredientMedia.mockResolvedValue(
        mockPageMediaResponse
      );

      const { result } = renderHook(() => useIngredientMedia(1, 2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.getIngredientMedia).toHaveBeenCalledWith(
        1,
        2,
        undefined
      );
      expect(result.current.data).toEqual(mockPageMediaResponse);
    });

    it('should fetch ingredient media with pagination', async () => {
      const paginationParams = { page: 0, size: 20 };
      mockedMediaApi.getIngredientMedia.mockResolvedValue(
        mockPageMediaResponse
      );

      const { result } = renderHook(
        () => useIngredientMedia(1, 2, paginationParams),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedMediaApi.getIngredientMedia).toHaveBeenCalledWith(
        1,
        2,
        paginationParams
      );
    });

    it('should not fetch when recipeId is falsy', () => {
      const { result } = renderHook(() => useIngredientMedia(0, 2), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMediaApi.getIngredientMedia).not.toHaveBeenCalled();
    });

    it('should not fetch when ingredientId is falsy', () => {
      const { result } = renderHook(() => useIngredientMedia(1, 0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMediaApi.getIngredientMedia).not.toHaveBeenCalled();
    });
  });

  describe('useStepMedia', () => {
    it('should fetch step media successfully', async () => {
      mockedMediaApi.getStepMedia.mockResolvedValue(mockPageMediaResponse);

      const { result } = renderHook(() => useStepMedia(1, 3), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.getStepMedia).toHaveBeenCalledWith(1, 3, undefined);
      expect(result.current.data).toEqual(mockPageMediaResponse);
    });

    it('should fetch step media with pagination', async () => {
      const paginationParams = { page: 2, size: 15 };
      mockedMediaApi.getStepMedia.mockResolvedValue(mockPageMediaResponse);

      const { result } = renderHook(
        () => useStepMedia(1, 3, paginationParams),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockedMediaApi.getStepMedia).toHaveBeenCalledWith(
        1,
        3,
        paginationParams
      );
    });

    it('should not fetch when recipeId is falsy', () => {
      const { result } = renderHook(() => useStepMedia(0, 3), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMediaApi.getStepMedia).not.toHaveBeenCalled();
    });

    it('should not fetch when stepId is falsy', () => {
      const { result } = renderHook(() => useStepMedia(1, 0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMediaApi.getStepMedia).not.toHaveBeenCalled();
    });
  });

  describe('useUploadRecipeMedia', () => {
    it('should upload recipe media successfully', async () => {
      mockedMediaApi.uploadRecipeMedia.mockResolvedValue(mockCreateResponse);

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUploadRecipeMedia(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.uploadRecipeMedia).toHaveBeenCalledWith(
        1,
        mockUploadRequest
      );
      expect(result.current.data).toEqual(mockCreateResponse);
      expect(invalidateSpy).toHaveBeenCalledTimes(3); // Recipe media, recipe, recipes list
    });

    it('should handle upload failure', async () => {
      const error = new Error('Upload failed');
      mockedMediaApi.uploadRecipeMedia.mockRejectedValue(error);

      const { result } = renderHook(() => useUploadRecipeMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should invalidate correct queries on success', async () => {
      mockedMediaApi.uploadRecipeMedia.mockResolvedValue(mockCreateResponse);

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUploadRecipeMedia(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'recipeMedia',
          1,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining(['recipeManagement', 'recipe', 1]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining(['recipeManagement', 'recipes']),
      });
    });
  });

  describe('useUploadIngredientMedia', () => {
    it('should upload ingredient media successfully', async () => {
      mockedMediaApi.uploadIngredientMedia.mockResolvedValue(
        mockCreateResponse
      );

      const { result } = renderHook(() => useUploadIngredientMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 2,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.uploadIngredientMedia).toHaveBeenCalledWith(
        1,
        2,
        mockUploadRequest
      );
      expect(result.current.data).toEqual(mockCreateResponse);
    });

    it('should invalidate ingredient-related queries', async () => {
      mockedMediaApi.uploadIngredientMedia.mockResolvedValue(
        mockCreateResponse
      );

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUploadIngredientMedia(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 2,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'media',
          'ingredient',
          1,
          2,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'recipeIngredients',
          1,
        ]),
      });
    });
  });

  describe('useUploadStepMedia', () => {
    it('should upload step media successfully', async () => {
      mockedMediaApi.uploadStepMedia.mockResolvedValue(mockCreateResponse);

      const { result } = renderHook(() => useUploadStepMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        stepId: 3,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.uploadStepMedia).toHaveBeenCalledWith(
        1,
        3,
        mockUploadRequest
      );
      expect(result.current.data).toEqual(mockCreateResponse);
    });

    it('should invalidate step-related queries', async () => {
      mockedMediaApi.uploadStepMedia.mockResolvedValue(mockCreateResponse);

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUploadStepMedia(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        stepId: 3,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'media',
          'step',
          1,
          3,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'recipeSteps',
          1,
        ]),
      });
    });
  });

  describe('useDeleteRecipeMedia', () => {
    it('should delete recipe media successfully', async () => {
      mockedMediaApi.deleteRecipeMedia.mockResolvedValue(mockDeleteResponse);

      const { result } = renderHook(() => useDeleteRecipeMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        mediaId: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.deleteRecipeMedia).toHaveBeenCalledWith(1, 1);
      expect(result.current.data).toEqual(mockDeleteResponse);
    });

    it('should handle delete failure', async () => {
      const error = new Error('Delete failed');
      mockedMediaApi.deleteRecipeMedia.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteRecipeMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        mediaId: 1,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });

    it('should invalidate recipe-related queries after deletion', async () => {
      mockedMediaApi.deleteRecipeMedia.mockResolvedValue(mockDeleteResponse);

      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useDeleteRecipeMedia(), {
        wrapper,
      });

      result.current.mutate({
        recipeId: 1,
        mediaId: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('useDeleteIngredientMedia', () => {
    it('should delete ingredient media successfully', async () => {
      mockedMediaApi.deleteIngredientMedia.mockResolvedValue(
        mockDeleteResponse
      );

      const { result } = renderHook(() => useDeleteIngredientMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        ingredientId: 2,
        mediaId: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.deleteIngredientMedia).toHaveBeenCalledWith(
        1,
        2,
        1
      );
      expect(result.current.data).toEqual(mockDeleteResponse);
    });
  });

  describe('useDeleteStepMedia', () => {
    it('should delete step media successfully', async () => {
      mockedMediaApi.deleteStepMedia.mockResolvedValue(mockDeleteResponse);

      const { result } = renderHook(() => useDeleteStepMedia(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        recipeId: 1,
        stepId: 3,
        mediaId: 1,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedMediaApi.deleteStepMedia).toHaveBeenCalledWith(1, 3, 1);
      expect(result.current.data).toEqual(mockDeleteResponse);
    });
  });

  describe('useMediaManager', () => {
    it('should provide unified interface for media operations', () => {
      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.uploadMedia).toBe('function');
      expect(typeof result.current.deleteMedia).toBe('function');
      expect(typeof result.current.isUploading).toBe('boolean');
      expect(typeof result.current.isDeleting).toBe('boolean');
      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should upload recipe media through manager', async () => {
      mockedMediaApi.uploadRecipeMedia.mockResolvedValue(mockCreateResponse);

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      await result.current.uploadMedia('recipe', 1, mockUploadRequest);

      expect(mockedMediaApi.uploadRecipeMedia).toHaveBeenCalledWith(
        1,
        mockUploadRequest
      );
    });

    it('should upload ingredient media through manager', async () => {
      mockedMediaApi.uploadIngredientMedia.mockResolvedValue(
        mockCreateResponse
      );

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      await result.current.uploadMedia('ingredient', 1, mockUploadRequest, 2);

      expect(mockedMediaApi.uploadIngredientMedia).toHaveBeenCalledWith(
        1,
        2,
        mockUploadRequest
      );
    });

    it('should upload step media through manager', async () => {
      mockedMediaApi.uploadStepMedia.mockResolvedValue(mockCreateResponse);

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      await result.current.uploadMedia('step', 1, mockUploadRequest, 3);

      expect(mockedMediaApi.uploadStepMedia).toHaveBeenCalledWith(
        1,
        3,
        mockUploadRequest
      );
    });

    it('should throw error when ingredientId is missing for ingredient upload', () => {
      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      expect(() =>
        result.current.uploadMedia('ingredient', 1, mockUploadRequest)
      ).toThrow('ingredientId is required');
    });

    it('should throw error when stepId is missing for step upload', () => {
      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      expect(() =>
        result.current.uploadMedia('step', 1, mockUploadRequest)
      ).toThrow('stepId is required');
    });

    it('should throw error for unsupported media type', () => {
      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      expect(() =>
        result.current.uploadMedia('unsupported' as any, 1, mockUploadRequest)
      ).toThrow('Unsupported media type: unsupported');
    });

    it('should delete recipe media through manager', async () => {
      mockedMediaApi.deleteRecipeMedia.mockResolvedValue(mockDeleteResponse);

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteMedia('recipe', 1, 1);

      expect(mockedMediaApi.deleteRecipeMedia).toHaveBeenCalledWith(1, 1);
    });

    it('should delete ingredient media through manager', async () => {
      mockedMediaApi.deleteIngredientMedia.mockResolvedValue(
        mockDeleteResponse
      );

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteMedia('ingredient', 1, 1, 2);

      expect(mockedMediaApi.deleteIngredientMedia).toHaveBeenCalledWith(
        1,
        2,
        1
      );
    });

    it('should delete step media through manager', async () => {
      mockedMediaApi.deleteStepMedia.mockResolvedValue(mockDeleteResponse);

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteMedia('step', 1, 1, 3);

      expect(mockedMediaApi.deleteStepMedia).toHaveBeenCalledWith(1, 3, 1);
    });

    it('should provide loading states correctly', () => {
      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      // Check that loading states are boolean values
      expect(typeof result.current.isUploading).toBe('boolean');
      expect(typeof result.current.isDeleting).toBe('boolean');
      expect(typeof result.current.isLoading).toBe('boolean');

      // Initially should not be loading
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors from underlying mutations', async () => {
      const error = new Error('Upload failed');
      mockedMediaApi.uploadRecipeMedia.mockRejectedValue(error);

      const { result } = renderHook(() => useMediaManager(), {
        wrapper: createWrapper(),
      });

      // Should throw the error when called
      await expect(
        result.current.uploadMedia('recipe', 1, mockUploadRequest)
      ).rejects.toThrow('Upload failed');
    });
  });

  describe('useInvalidateMedia', () => {
    it('should return a function that invalidates all media queries for a recipe', () => {
      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useInvalidateMedia(), {
        wrapper,
      });

      expect(typeof result.current).toBe('function');

      // Call the returned function
      result.current(1);

      expect(invalidateSpy).toHaveBeenCalledTimes(3);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'recipeMedia',
          1,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'media',
          'ingredient',
          1,
        ]),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: expect.arrayContaining([
          'recipeManagement',
          'media',
          'step',
          1,
        ]),
      });
    });

    it('should handle multiple recipe invalidations', () => {
      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useInvalidateMedia(), {
        wrapper,
      });

      // Invalidate multiple recipes
      result.current(1);
      result.current(2);
      result.current(3);

      expect(invalidateSpy).toHaveBeenCalledTimes(9); // 3 calls per recipe × 3 recipes
    });
  });

  describe('Integration tests', () => {
    it('should work together: fetch media, upload new media, and invalidate', async () => {
      mockedMediaApi.getRecipeMedia.mockResolvedValue(mockPageMediaResponse);
      mockedMediaApi.uploadRecipeMedia.mockResolvedValue(mockCreateResponse);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false },
        },
      });
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result: mediaResult } = renderHook(() => useRecipeMedia(1), {
        wrapper,
      });
      const { result: uploadResult } = renderHook(
        () => useUploadRecipeMedia(),
        { wrapper }
      );

      // First fetch media
      await waitFor(() => expect(mediaResult.current.isSuccess).toBe(true));

      // Then upload new media
      uploadResult.current.mutate({
        recipeId: 1,
        data: mockUploadRequest,
      });

      await waitFor(() => expect(uploadResult.current.isSuccess).toBe(true));

      // Verify invalidation happened
      expect(invalidateSpy).toHaveBeenCalled();
    });

    it('should handle different media types and file formats', async () => {
      const mediaTypes = [
        MediaType.IMAGE_JPEG,
        MediaType.IMAGE_PNG,
        MediaType.VIDEO_MP4,
        MediaType.IMAGE_WEBP,
      ];

      for (const mediaType of mediaTypes) {
        const uploadRequest = {
          ...mockUploadRequest,
          mediaType,
          file: createMockFile(
            `test.${mediaType.toLowerCase()}`,
            1024000,
            `image/${mediaType.toLowerCase()}`
          ),
        };

        mockedMediaApi.uploadRecipeMedia.mockResolvedValue({
          ...mockCreateResponse,
          mediaType,
        });

        const { result } = renderHook(() => useUploadRecipeMedia(), {
          wrapper: createWrapper(),
        });

        result.current.mutate({
          recipeId: 1,
          data: uploadRequest,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.mediaType).toBe(mediaType);
      }
    });

    it('should handle media manager with different file sizes', async () => {
      const fileSizes = [1024, 1024000, 5242880]; // 1KB, 1MB, 5MB

      for (const fileSize of fileSizes) {
        const uploadRequest = {
          ...mockUploadRequest,
          fileSize,
          file: createMockFile('test.jpg', fileSize, 'image/jpeg'),
        };

        mockedMediaApi.uploadRecipeMedia.mockResolvedValue({
          ...mockCreateResponse,
          fileSize,
        });

        const { result } = renderHook(() => useMediaManager(), {
          wrapper: createWrapper(),
        });

        await result.current.uploadMedia('recipe', 1, uploadRequest);

        expect(mockedMediaApi.uploadRecipeMedia).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ fileSize })
        );
      }
    });
  });
});
