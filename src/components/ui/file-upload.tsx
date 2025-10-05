import * as React from 'react';
import Image from 'next/image';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  fileUploadVariants,
  fileUploadIconVariants,
  fileUploadTextVariants,
  fileItemVariants,
  filePreviewVariants,
  fileProgressVariants,
  fileProgressFillVariants,
  fileDeleteButtonVariants,
} from '@/lib/ui/file-upload-variants';
import type {
  FileUploadProps,
  FileUploadDropZoneProps,
  FileUploadItemProps,
  FileUploadProgressProps,
  FileWithPreview,
  FileUploadError,
  FileValidationOptions,
  FileValidationResult,
  RecipeImageUploadProps,
  RecipeDocumentUploadProps,
} from '@/types/ui/file-upload.types';

/**
 * Validates files against specified criteria
 */
const validateFiles = (
  files: File[],
  options: FileValidationOptions
): FileValidationResult => {
  const errors: FileUploadError[] = [];
  const validFiles: File[] = [];

  files.forEach(file => {
    // Check file type
    if (options.accept) {
      const acceptedTypes = options.accept.split(',').map(t => t.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      if (!isValidType) {
        errors.push({
          message: `File type not accepted: ${file.name}`,
          code: 'INVALID_TYPE',
          file,
        });
        return;
      }
    }

    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      const sizeMB = (options.maxSize / (1024 * 1024)).toFixed(1);
      errors.push({
        message: `File too large: ${file.name} (max ${sizeMB}MB)`,
        code: 'FILE_TOO_LARGE',
        file,
      });
      return;
    }

    validFiles.push(file);
  });

  // Check max files
  const currentCount = options.currentFileCount ?? 0;
  if (options.maxFiles && currentCount + validFiles.length > options.maxFiles) {
    errors.push({
      message: `Maximum ${options.maxFiles} files allowed`,
      code: 'MAX_FILES_EXCEEDED',
    });
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generates unique ID for file tracking
 */
const generateFileId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`;
};

/**
 * Creates file with preview
 */
const createFileWithPreview = (file: File): FileWithPreview => {
  const fileWithPreview = file as FileWithPreview;
  fileWithPreview.id = generateFileId(file);

  if (file.type.startsWith('image/')) {
    fileWithPreview.preview = URL.createObjectURL(file);
  }

  return fileWithPreview;
};

/**
 * FileUploadDropZone Component
 *
 * The main drop zone area for file uploads
 */
const FileUploadDropZone = React.forwardRef<
  HTMLDivElement,
  FileUploadDropZoneProps
>(
  (
    {
      className,
      variant,
      size,
      disabled,
      loading,
      error,
      isDragActive,
      icon,
      label,
      description,
      children,
      inputRef,
      accept,
      multiple,
      onDrop,
      dropZoneClassName,
      ...props
    },
    ref
  ) => {
    const [internalDragActive, setInternalDragActive] = React.useState(false);
    const internalInputRef = React.useRef<HTMLInputElement>(null);
    const fileInputRef = inputRef ?? internalInputRef;

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setInternalDragActive(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setInternalDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setInternalDragActive(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      onDrop?.(droppedFiles);
    };

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        onDrop?.(selectedFiles);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleClick();
      }
    };

    const isActive = isDragActive ?? internalDragActive;
    const stateVariant = error
      ? 'error'
      : isActive
        ? 'active'
        : loading
          ? 'active'
          : 'idle';

    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileInputChange}
          aria-label="File input"
          tabIndex={-1}
        />
        <div
          ref={ref}
          className={cn(
            fileUploadVariants({ variant, size, state: stateVariant }),
            dropZoneClassName ?? className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ?? 'Upload files'}
          aria-disabled={disabled}
          aria-busy={loading}
          {...props}
        >
          {children ?? (
            <>
              <div
                className={fileUploadIconVariants({
                  size,
                  state: stateVariant,
                })}
              >
                {icon ?? <Upload />}
              </div>

              <div
                className={fileUploadTextVariants({ size, variant: 'label' })}
              >
                {label ??
                  (isActive
                    ? 'Drop files here'
                    : 'Click or drag files to upload')}
              </div>

              {description && (
                <div
                  className={fileUploadTextVariants({
                    size,
                    variant: 'description',
                  })}
                >
                  {description}
                </div>
              )}

              {error && (
                <div
                  className={fileUploadTextVariants({ size, variant: 'error' })}
                >
                  {typeof error === 'string' ? error : error.message}
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }
);

FileUploadDropZone.displayName = 'FileUploadDropZone';

/**
 * FileUploadItem Component
 *
 * Individual file item display with preview and delete
 */
const FileUploadItem = React.forwardRef<HTMLDivElement, FileUploadItemProps>(
  (
    { file, showPreview = true, onDelete, disabled, className, size = 'md' },
    ref
  ) => {
    const isImage = file.type?.startsWith('image/') ?? false;
    const stateVariant = file.error
      ? 'error'
      : file.progress !== undefined && file.progress < 100
        ? 'uploading'
        : 'idle';

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        onDelete?.(file);
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
      <div
        ref={ref}
        className={cn(
          fileItemVariants({ size, state: stateVariant }),
          className
        )}
      >
        {showPreview && (
          <div className={filePreviewVariants({ size })}>
            {isImage && file.preview ? (
              <Image
                src={file.preview}
                alt={file.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="text-muted-foreground">
                {isImage ? (
                  <ImageIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <File className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{file.name}</div>
          <div className="text-muted-foreground text-xs">
            {formatFileSize(file.size)}
            {file.error && (
              <span className="text-destructive ml-2">{file.error}</span>
            )}
          </div>
        </div>

        {file.progress !== undefined && file.progress < 100 && (
          <div className="text-muted-foreground text-xs">{file.progress}%</div>
        )}

        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={disabled}
            className={fileDeleteButtonVariants({ size, variant: 'default' })}
            aria-label={`Remove ${file.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);

FileUploadItem.displayName = 'FileUploadItem';

/**
 * FileUploadProgress Component
 *
 * Progress bar for file uploads
 */
const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  value,
  showPercentage = false,
  className,
  size = 'md',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      <div className={cn(fileProgressVariants({ size }), className)}>
        <div
          className={cn(
            fileProgressFillVariants({ state: 'active' }),
            `[width:${clampedValue}%]`,
            '[background-color:rgb(59,130,246)]' // Force blue color
          )}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showPercentage && (
        <div className="text-muted-foreground mt-1 text-center text-xs">
          {clampedValue}%
        </div>
      )}
    </div>
  );
};

/**
 * FileUpload Component
 *
 * A comprehensive drag-and-drop file upload component with:
 * - Drag and drop support
 * - File type and size validation
 * - Preview for images
 * - Progress tracking
 * - Keyboard navigation
 * - Full accessibility
 *
 * @example
 * ```tsx
 * // Basic upload
 * <FileUpload
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024}
 *   onDrop={(files) => console.log(files)}
 * />
 *
 * // Multiple files with preview
 * <FileUpload
 *   multiple
 *   maxFiles={5}
 *   showPreview
 *   files={uploadedFiles}
 *   onChange={(files) => setUploadedFiles(files)}
 *   onDelete={(file) => removeFile(file)}
 * />
 * ```
 */
const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      variant,
      size,
      disabled,
      loading,
      error,
      accept,
      maxSize,
      maxFiles,
      multiple,
      files = [],
      onDrop,
      onChange,
      onDelete,
      onUpload,
      showPreview = true,
      showFileList = true,
      icon,
      label,
      description,
      dropZoneClassName,
      fileItemClassName,
      children,
      ...props
    },
    ref
  ) => {
    const [internalFiles, setInternalFiles] = React.useState<FileWithPreview[]>(
      []
    );
    const [uploadError, setUploadError] = React.useState<
      string | FileUploadError | undefined
    >(error);

    // Use files from props or internal state
    const displayFiles = files.length > 0 || onChange ? files : internalFiles;

    React.useEffect(() => {
      setUploadError(error);
    }, [error]);

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        displayFiles.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
      };
    }, [displayFiles]);

    const handleDrop = React.useCallback(
      async (droppedFiles: File[]) => {
        setUploadError(undefined);

        // Validate files
        const validation = validateFiles(droppedFiles, {
          accept,
          maxSize,
          maxFiles,
          currentFileCount: displayFiles.length,
        });

        if (!validation.valid) {
          setUploadError(validation.errors[0]);
          return;
        }

        // Create files with preview
        const newFiles = droppedFiles.map(createFileWithPreview);

        // Update state
        const updatedFiles = multiple
          ? [...displayFiles, ...newFiles]
          : newFiles;
        if (onChange) {
          onChange(updatedFiles);
        } else {
          setInternalFiles(updatedFiles);
        }
        onDrop?.(droppedFiles);

        // Upload files if handler provided
        if (onUpload) {
          for (const file of newFiles) {
            try {
              await onUpload(file);
            } catch {
              file.error = 'Upload failed';
            }
          }
        }
      },
      [
        accept,
        maxSize,
        maxFiles,
        multiple,
        displayFiles,
        onChange,
        onDrop,
        onUpload,
      ]
    );

    const handleDelete = React.useCallback(
      (fileToDelete: FileWithPreview) => {
        // Clean up preview URL
        if (fileToDelete.preview) {
          URL.revokeObjectURL(fileToDelete.preview);
        }

        const updatedFiles = displayFiles.filter(f => f.id !== fileToDelete.id);
        if (onChange) {
          onChange(updatedFiles);
        } else {
          setInternalFiles(updatedFiles);
        }
        onDelete?.(fileToDelete);
      },
      [displayFiles, onChange, onDelete]
    );

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        <FileUploadDropZone
          variant={variant}
          size={size}
          disabled={disabled}
          loading={loading}
          error={uploadError}
          accept={accept}
          multiple={multiple}
          onDrop={handleDrop}
          icon={icon}
          label={label}
          description={
            description ??
            (accept
              ? `Accepts: ${accept}`
              : maxSize
                ? `Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
                : undefined)
          }
          dropZoneClassName={dropZoneClassName}
        >
          {children}
        </FileUploadDropZone>

        {showFileList && displayFiles.length > 0 && (
          <div className="space-y-2">
            {displayFiles.map(file => (
              <FileUploadItem
                key={file.id}
                file={file}
                size={size ?? undefined}
                showPreview={showPreview}
                onDelete={handleDelete}
                disabled={disabled}
                className={fileItemClassName}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

/**
 * RecipeImageUpload Component
 *
 * Specialized file upload for recipe images
 */
const RecipeImageUpload = React.forwardRef<
  HTMLDivElement,
  RecipeImageUploadProps
>(({ maxImages = 5, ...props }, ref) => {
  return (
    <FileUpload
      ref={ref}
      accept="image/*"
      maxFiles={maxImages}
      multiple={maxImages > 1}
      showPreview
      icon={<ImageIcon aria-hidden="true" />}
      label="Upload Recipe Images"
      description={`Add up to ${maxImages} images (JPG, PNG, WEBP)`}
      {...props}
    />
  );
});

RecipeImageUpload.displayName = 'RecipeImageUpload';

/**
 * RecipeDocumentUpload Component
 *
 * Specialized file upload for recipe documents
 */
const RecipeDocumentUpload = React.forwardRef<
  HTMLDivElement,
  RecipeDocumentUploadProps
>(({ documentTypes = ['pdf', 'doc', 'docx', 'txt'], ...props }, ref) => {
  const accept = documentTypes.map(type => `.${type}`).join(',');

  return (
    <FileUpload
      ref={ref}
      accept={accept}
      showPreview={false}
      icon={<File aria-hidden="true" />}
      label="Upload Recipe Documents"
      description={`Accepted formats: ${documentTypes.join(', ').toUpperCase()}`}
      {...props}
    />
  );
});

RecipeDocumentUpload.displayName = 'RecipeDocumentUpload';

export {
  FileUpload,
  FileUploadDropZone,
  FileUploadItem,
  FileUploadProgress,
  RecipeImageUpload,
  RecipeDocumentUpload,
};
