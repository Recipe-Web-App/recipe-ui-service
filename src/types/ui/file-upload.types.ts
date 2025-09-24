import type { ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { fileUploadVariants } from '@/lib/ui/file-upload-variants';

/**
 * File with preview information
 */
export interface FileWithPreview extends File {
  preview?: string;
  id: string;
  progress?: number;
  error?: string;
}

/**
 * File upload error interface
 */
export interface FileUploadError {
  message: string;
  code?:
    | 'FILE_TOO_LARGE'
    | 'INVALID_TYPE'
    | 'MAX_FILES_EXCEEDED'
    | 'UPLOAD_FAILED';
  file?: File;
}

/**
 * Base props for FileUpload component
 */
export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onDrop'>,
    VariantProps<typeof fileUploadVariants> {
  /**
   * Accepted file types (e.g., "image/*", ".pdf,.doc")
   */
  accept?: string;

  /**
   * Maximum file size in bytes
   */
  maxSize?: number;

  /**
   * Maximum number of files
   */
  maxFiles?: number;

  /**
   * Whether multiple files can be selected
   */
  multiple?: boolean;

  /**
   * Whether the upload zone is disabled
   */
  disabled?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Error state message
   */
  error?: string | FileUploadError;

  /**
   * Current files
   */
  files?: FileWithPreview[];

  /**
   * Callback when files are dropped or selected
   */
  onDrop?: (files: File[]) => void;

  /**
   * Callback when files change
   */
  onChange?: (files: FileWithPreview[]) => void;

  /**
   * Callback when a file is removed
   */
  onDelete?: (file: FileWithPreview) => void;

  /**
   * Callback for upload progress
   */
  onUpload?: (file: FileWithPreview) => Promise<void>;

  /**
   * Custom drop zone content
   */
  children?: ReactNode;

  /**
   * Show file preview for images
   */
  showPreview?: boolean;

  /**
   * Custom icon for the drop zone
   */
  icon?: ReactNode;

  /**
   * Drop zone label text
   */
  label?: string;

  /**
   * Drop zone description text
   */
  description?: string;

  /**
   * Whether to show file list
   */
  showFileList?: boolean;

  /**
   * Custom class for the drop zone
   */
  dropZoneClassName?: string;

  /**
   * Custom class for file items
   */
  fileItemClassName?: string;
}

/**
 * Props for FileUploadDropZone component
 */
export interface FileUploadDropZoneProps
  extends Omit<FileUploadProps, 'files' | 'onChange' | 'onDelete'> {
  /**
   * Whether the drop zone is being dragged over
   */
  isDragActive?: boolean;

  /**
   * Reference to the file input element
   */
  inputRef?: React.RefObject<HTMLInputElement>;
}

/**
 * Props for FileUploadItem component
 */
export interface FileUploadItemProps {
  /**
   * The file to display
   */
  file: FileWithPreview;

  /**
   * Whether to show preview image
   */
  showPreview?: boolean;

  /**
   * Callback when delete is clicked
   */
  onDelete?: (file: FileWithPreview) => void;

  /**
   * Whether the item is disabled
   */
  disabled?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for FileUploadProgress component
 */
export interface FileUploadProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Whether to show the percentage text
   */
  showPercentage?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for recipe-specific image upload
 */
export interface RecipeImageUploadProps
  extends Omit<FileUploadProps, 'accept' | 'maxFiles'> {
  /**
   * Maximum number of images
   */
  maxImages?: number;

  /**
   * Image quality for compression (0-1)
   */
  quality?: number;

  /**
   * Whether to auto-orient images based on EXIF
   */
  autoOrient?: boolean;
}

/**
 * Props for recipe document upload
 */
export interface RecipeDocumentUploadProps
  extends Omit<FileUploadProps, 'accept' | 'showPreview'> {
  /**
   * Allowed document types
   */
  documentTypes?: ('pdf' | 'doc' | 'docx' | 'txt')[];
}

/**
 * File validation options
 */
export interface FileValidationOptions {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  currentFileCount?: number;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  errors: FileUploadError[];
}
