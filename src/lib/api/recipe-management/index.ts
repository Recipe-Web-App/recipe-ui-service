// Base client and utilities
export {
  recipeManagementClient,
  RecipeManagementApiError,
  handleRecipeManagementApiError,
  createFormData,
  buildQueryParams,
  type PaginationParams,
} from './client';

// Recipe Management APIs
export * from './recipes';
export * from './search';
export * from './ingredients';
export * from './steps';
export * from './tags';
export * from './reviews';
export * from './revisions';
export * from './media';
export * from './health';
export * from './monitoring';

// Re-export types for convenience
export type {
  // Common types
  DifficultyLevel,
  IngredientUnit,
  MediaType,
  MediaFormat,
  ProcessingStatus,
  RevisionType,
  RevisionCategory,
  SearchSortBy,
  RecipeManagementErrorResponse,
  RecipeManagementHealthStatus,
  PageableInfo,
  PageInfo,

  // Recipe types
  RecipeDto,
  RecipeFavoriteDto,
  CreateRecipeRequest,
  CreateRecipeIngredientRequest,
  CreateRecipeStepRequest,
  UpdateRecipeRequest,

  // Ingredient types
  RecipeIngredientDto,
  IngredientCommentDto,
  RecipeIngredientsResponse,
  ShoppingListResponse,
  ShoppingListItemDto,
  AddIngredientCommentRequest,
  EditIngredientCommentRequest,
  DeleteIngredientCommentRequest,
  IngredientCommentResponse,

  // Step types
  RecipeStepDto,
  StepCommentDto,
  StepResponse,
  AddStepCommentRequest,
  EditStepCommentRequest,
  DeleteStepCommentRequest,
  StepCommentResponse,

  // Tag types
  RecipeTagDto,
  TagResponse,
  AddTagRequest,
  RemoveTagRequest,

  // Review types
  ReviewDto,
  ReviewResponse,
  AddReviewRequest,
  EditReviewRequest,

  // Revision types
  RecipeRevisionDto,
  RevisionDto,
  RecipeRevisionsResponse,
  StepRevisionsResponse,
  IngredientRevisionsResponse,

  // Media types
  MediaDto,
  PageMediaDto,
  MediaUploadRequest,
  CreateMediaResponse,
  DeleteMediaResponse,

  // Search types
  SearchRecipesRequest,
  SearchRecipesResponse,

  // Health & Monitoring types
  RecipeManagementHealthResponse,
  RecipeManagementHealthComponentDetails,
  RecipeManagementInfoResponse,
  RecipeManagementMetricsResponse,
  RecipeManagementMetricResponse,
  RecipeManagementMetricMeasurement,
  RecipeManagementMetricTag,
  RecipeManagementEnvironmentResponse,
  RecipeManagementPropertyResponse,
  RecipeManagementPropertySource,
  RecipeManagementConfigPropsResponse,
  RecipeManagementConfigPropsBean,
  RecipeManagementConfigPropsContext,
} from '@/types/recipe-management';
