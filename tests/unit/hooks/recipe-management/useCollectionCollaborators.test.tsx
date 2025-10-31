import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { collectionCollaboratorsApi } from '@/lib/api/recipe-management';
import {
  useCollectionCollaborators,
  useAddCollaborator,
  useRemoveCollaborator,
} from '@/hooks/recipe-management/useCollectionCollaborators';
import type {
  CollaboratorDto,
  AddCollaboratorRequest,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  collectionCollaboratorsApi: {
    getCollaborators: jest.fn(),
    addCollaborator: jest.fn(),
    removeCollaborator: jest.fn(),
  },
}));

const mockedCollectionCollaboratorsApi =
  collectionCollaboratorsApi as jest.Mocked<typeof collectionCollaboratorsApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useCollectionCollaborators hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCollectionCollaborators', () => {
    it('should fetch collaborators successfully', async () => {
      const mockCollaborators: CollaboratorDto[] = [
        {
          userId: 'user123',
          username: 'john_doe',
          grantedBy: 'owner456',
          grantedAt: '2024-01-01T00:00:00Z',
        },
        {
          userId: 'user789',
          username: 'jane_smith',
          grantedBy: 'owner456',
          grantedAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockedCollectionCollaboratorsApi.getCollaborators.mockResolvedValue(
        mockCollaborators
      );

      const { result } = renderHook(() => useCollectionCollaborators(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCollaborators);
      expect(
        mockedCollectionCollaboratorsApi.getCollaborators
      ).toHaveBeenCalledWith(1);
    });

    it('should not fetch when collectionId is 0', () => {
      const { result } = renderHook(() => useCollectionCollaborators(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(
        mockedCollectionCollaboratorsApi.getCollaborators
      ).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch collaborators');
      mockedCollectionCollaboratorsApi.getCollaborators.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useCollectionCollaborators(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAddCollaborator', () => {
    it('should add collaborator successfully', async () => {
      const newCollaborator: CollaboratorDto = {
        userId: 'user999',
        username: 'new_user',
        grantedBy: 'owner456',
        grantedAt: '2024-01-03T00:00:00Z',
      };

      mockedCollectionCollaboratorsApi.addCollaborator.mockResolvedValue(
        newCollaborator
      );

      const { result } = renderHook(() => useAddCollaborator(), {
        wrapper: createWrapper(),
      });

      const collaboratorData: AddCollaboratorRequest = {
        userId: 'user999',
      };

      result.current.mutate({
        collectionId: 1,
        data: collaboratorData,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        mockedCollectionCollaboratorsApi.addCollaborator
      ).toHaveBeenCalledWith(1, collaboratorData);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add collaborator');
      mockedCollectionCollaboratorsApi.addCollaborator.mockRejectedValue(error);

      const { result } = renderHook(() => useAddCollaborator(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        collectionId: 1,
        data: { userId: 'user999' },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRemoveCollaborator', () => {
    it('should remove collaborator successfully', async () => {
      mockedCollectionCollaboratorsApi.removeCollaborator.mockResolvedValue(
        undefined
      );

      const { result } = renderHook(() => useRemoveCollaborator(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        collectionId: 1,
        userId: 'user123',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        mockedCollectionCollaboratorsApi.removeCollaborator
      ).toHaveBeenCalledWith(1, 'user123');
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to remove collaborator');
      mockedCollectionCollaboratorsApi.removeCollaborator.mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useRemoveCollaborator(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        collectionId: 1,
        userId: 'user123',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });
});
