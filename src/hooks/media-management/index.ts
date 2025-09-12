/**
 * Media Management Service Hooks
 * Barrel exports for all media management hooks
 */

// Health and monitoring hooks
export {
  useMediaManagementHealth,
  useMediaManagementReadiness,
  useMediaManagementMetrics,
  useMediaManagementMonitoring,
  useMediaManagementHealthManager,
} from './useHealth';

// Basic CRUD hooks
export {
  useMediaList,
  useMedia,
  useUploadMedia,
  useDeleteMedia,
  useDownloadMedia,
  useUploadStatus,
  useMediaManager,
} from './useMedia';

// Presigned upload hooks
export {
  useInitiateUpload,
  useUploadToPresignedUrl,
  usePresignedUpload,
  usePresignedUploadWithProgress,
} from './usePresignedUpload';

// Recipe integration hooks
export {
  useRecipeMedia,
  useIngredientMedia,
  useStepMedia,
  useAllRecipeMedia,
  useRecipeMediaManager,
} from './useRecipeMedia';
