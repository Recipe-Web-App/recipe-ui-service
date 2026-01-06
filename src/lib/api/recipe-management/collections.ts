import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  CollectionDto,
  CollectionDetailsDto,
  PageCollectionDto,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  SearchCollectionsRequest,
} from '@/types/recipe-management';

export const collectionsApi = {
  /**
   * Get accessible collections with pagination
   * GET /collections
   */
  async getCollections(params?: PaginationParams): Promise<PageCollectionDto> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/collections${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PageCollectionDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Create new collection
   * POST /collections
   */
  async createCollection(
    data: CreateCollectionRequest
  ): Promise<CollectionDto> {
    try {
      const response = await recipeManagementClient.post('/collections', data);
      return response.data as CollectionDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get collection by ID with all recipes
   * GET /collections/{collectionId}
   */
  async getCollectionById(collectionId: number): Promise<CollectionDetailsDto> {
    try {
      const response = await recipeManagementClient.get(
        `/collections/${collectionId}`
      );
      return response.data as CollectionDetailsDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Update collection metadata
   * PUT /collections/{collectionId}
   */
  async updateCollection(
    collectionId: number,
    data: UpdateCollectionRequest
  ): Promise<CollectionDto> {
    try {
      const response = await recipeManagementClient.put(
        `/collections/${collectionId}`,
        data
      );
      return response.data as CollectionDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete collection
   * DELETE /collections/{collectionId}
   */
  async deleteCollection(collectionId: number): Promise<void> {
    try {
      await recipeManagementClient.delete(`/collections/${collectionId}`);
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Search collections with filters and pagination
   * POST /collections/search
   */
  async searchCollections(
    data: SearchCollectionsRequest,
    params?: PaginationParams
  ): Promise<PageCollectionDto> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.post(
        `/collections/search${queryString ? `?${queryString}` : ''}`,
        data
      );
      return response.data as PageCollectionDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get trending collections with pagination
   * GET /collections/trending
   * Results are pre-sorted by trending score (descending)
   */
  async getTrendingCollections(
    params?: Omit<PaginationParams, 'sort'>
  ): Promise<PageCollectionDto> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/collections/trending${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PageCollectionDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
