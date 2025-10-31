import { collectionCollaboratorsApi } from '@/lib/api/recipe-management/collection-collaborators';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  CollaboratorDto,
  AddCollaboratorRequest,
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
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Collection Collaborators API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCollaboratorDto: CollaboratorDto = {
    userId: 'user-456',
    username: 'john_doe',
    grantedBy: 'user-123',
    grantedAt: '2024-01-01T00:00:00Z',
  };

  const mockCollaborators: CollaboratorDto[] = [
    mockCollaboratorDto,
    {
      userId: 'user-789',
      username: 'jane_smith',
      grantedBy: 'user-123',
      grantedAt: '2024-01-02T00:00:00Z',
    },
  ];

  describe('getCollaborators', () => {
    it('should get collaborators for a collection', async () => {
      mockedClient.get.mockResolvedValue({ data: mockCollaborators });

      const result = await collectionCollaboratorsApi.getCollaborators(1);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/collections/1/collaborators'
      );
      expect(result).toEqual(mockCollaborators);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch collaborators');
      mockedClient.get.mockRejectedValue(error);

      await expect(
        collectionCollaboratorsApi.getCollaborators(1)
      ).rejects.toThrow('Failed to fetch collaborators');
    });
  });

  describe('addCollaborator', () => {
    it('should add a collaborator to a collection', async () => {
      const addRequest: AddCollaboratorRequest = {
        userId: 'user-999',
      };

      mockedClient.post.mockResolvedValue({ data: mockCollaboratorDto });

      const result = await collectionCollaboratorsApi.addCollaborator(
        1,
        addRequest
      );

      expect(mockedClient.post).toHaveBeenCalledWith(
        '/collections/1/collaborators',
        addRequest
      );
      expect(result).toEqual(mockCollaboratorDto);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to add collaborator');
      mockedClient.post.mockRejectedValue(error);

      await expect(
        collectionCollaboratorsApi.addCollaborator(1, { userId: 'user-999' })
      ).rejects.toThrow('Failed to add collaborator');
    });
  });

  describe('removeCollaborator', () => {
    it('should remove a collaborator from a collection', async () => {
      mockedClient.delete.mockResolvedValue({ data: undefined });

      await collectionCollaboratorsApi.removeCollaborator(1, 'user-456');

      expect(mockedClient.delete).toHaveBeenCalledWith(
        '/collections/1/collaborators/user-456'
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to remove collaborator');
      mockedClient.delete.mockRejectedValue(error);

      await expect(
        collectionCollaboratorsApi.removeCollaborator(1, 'user-456')
      ).rejects.toThrow('Failed to remove collaborator');
    });
  });
});
