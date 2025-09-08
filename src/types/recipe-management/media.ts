import {
  MediaType,
  MediaFormat,
  ProcessingStatus,
  PageableInfo,
  PageInfo,
} from './common';

export interface MediaDto {
  mediaId: number;
  userId: string;
  mediaType: MediaType;
  originalFilename?: string;
  fileSize?: number;
  contentHash?: string;
  processingStatus: ProcessingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageMediaDto extends PageInfo {
  content: MediaDto[];
  pageable: PageableInfo;
}

export interface MediaUploadRequest {
  file: string;
  originalFilename: string;
  mediaType: MediaType;
  fileSize: number;
  contentHash?: string;
}

export interface CreateMediaResponse {
  mediaId?: number;
  recipeId?: number;
  ingredientId?: number;
  stepId?: number;
  originalFilename?: string;
  mediaType?: MediaType;
  mediaFormat?: MediaFormat;
  fileSize?: number;
  contentHash?: string;
  processingStatus?: ProcessingStatus;
  uploadedAt?: string;
}

export interface DeleteMediaResponse {
  mediaId?: number;
  recipeId?: number;
  deleted?: boolean;
  deletedAt?: string;
}
