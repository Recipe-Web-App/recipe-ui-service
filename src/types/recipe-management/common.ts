export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

export enum IngredientUnit {
  G = 'G',
  KG = 'KG',
  OZ = 'OZ',
  LB = 'LB',
  ML = 'ML',
  L = 'L',
  CUP = 'CUP',
  TBSP = 'TBSP',
  TSP = 'TSP',
  PIECE = 'PIECE',
  CLOVE = 'CLOVE',
  SLICE = 'SLICE',
  PINCH = 'PINCH',
  CAN = 'CAN',
  BOTTLE = 'BOTTLE',
  PACKET = 'PACKET',
  UNIT = 'UNIT',
}

export enum MediaType {
  IMAGE_JPEG = 'IMAGE_JPEG',
  IMAGE_PNG = 'IMAGE_PNG',
  IMAGE_GIF = 'IMAGE_GIF',
  IMAGE_WEBP = 'IMAGE_WEBP',
  IMAGE_AVIF = 'IMAGE_AVIF',
  IMAGE_SVG_XML = 'IMAGE_SVG_XML',
  IMAGE_HEIC = 'IMAGE_HEIC',
  IMAGE_TIFF = 'IMAGE_TIFF',
  VIDEO_MP4 = 'VIDEO_MP4',
  VIDEO_WEBM = 'VIDEO_WEBM',
  VIDEO_OGG = 'VIDEO_OGG',
  VIDEO_QUICKTIME = 'VIDEO_QUICKTIME',
}

export enum MediaFormat {
  JPEG = 'JPEG',
  PNG = 'PNG',
  WEBP = 'WEBP',
  AVIF = 'AVIF',
  GIF = 'GIF',
  MP4 = 'MP4',
  WEBM = 'WEBM',
  MOV = 'MOV',
  AVI = 'AVI',
  MP3 = 'MP3',
  WAV = 'WAV',
  FLAC = 'FLAC',
  OGG = 'OGG',
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export enum RevisionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum RevisionCategory {
  INGREDIENT = 'INGREDIENT',
  STEP = 'STEP',
}

export enum CollectionVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
}

export enum CollaborationMode {
  OWNER_ONLY = 'OWNER_ONLY',
  ALL_USERS = 'ALL_USERS',
  SPECIFIC_USERS = 'SPECIFIC_USERS',
}

export interface RecipeManagementErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
  details?: Record<string, unknown>;
}

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageInfo {
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}
