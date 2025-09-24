'use client';

import React, { useState } from 'react';
import {
  FileUpload,
  FileUploadProgress,
  RecipeImageUpload,
  RecipeDocumentUpload,
} from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import type { FileWithPreview } from '@/types/ui/file-upload.types';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Camera,
  Cloud,
} from 'lucide-react';

export default function FileUploadDemo() {
  const [basicFiles, setBasicFiles] = useState<FileWithPreview[]>([]);
  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);
  const [documentFiles, setDocumentFiles] = useState<FileWithPreview[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Simulated upload function
  const simulateUpload = async (_file: FileWithPreview) => {
    setIsUploading(true);
    setUploadProgress(0);
    for (let i = 10; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsUploading(false);
    setUploadProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          File Upload Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Drag-and-drop upload zones with validation, preview support, and
          progress tracking. Perfect for recipe images, documents, and
          user-generated content.
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Upload */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Basic File Upload</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Simple drag-and-drop or click to upload files.
          </p>
          <FileUpload
            files={basicFiles}
            onChange={setBasicFiles}
            onDelete={file =>
              setBasicFiles(basicFiles.filter(f => f.id !== file.id))
            }
            maxSize={10 * 1024 * 1024}
            label="Click or drag files here"
            description="Any file up to 10MB"
          />
        </div>

        {/* Variants */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Upload Zone Variants</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Different visual styles for various contexts.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Default</p>
              <FileUpload variant="default" size="sm" label="Default style" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Outlined</p>
              <FileUpload variant="outlined" size="sm" label="Outlined style" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Filled</p>
              <FileUpload variant="filled" size="sm" label="Filled style" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Dashed</p>
              <FileUpload variant="dashed" size="sm" label="Dashed border" />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Upload Zone Sizes</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Three sizes to fit different layouts.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Small</p>
              <FileUpload
                size="sm"
                icon={<Upload />}
                label="Small upload zone"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Medium</p>
              <FileUpload
                size="md"
                icon={<Upload />}
                label="Medium upload zone"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Large</p>
              <FileUpload
                size="lg"
                icon={<Upload />}
                label="Large upload zone"
              />
            </div>
          </div>
        </div>

        {/* Image Upload with Preview */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Image Upload with Preview
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Upload images with automatic thumbnail preview.
          </p>
          <FileUpload
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            maxFiles={5}
            multiple
            files={imageFiles}
            onChange={setImageFiles}
            onDelete={file =>
              setImageFiles(imageFiles.filter(f => f.id !== file.id))
            }
            showPreview
            icon={<Camera />}
            label="Upload Recipe Photos"
            description="JPG, PNG, or WEBP - Max 5MB each"
          />
        </div>

        {/* Document Upload */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Document Upload</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Upload documents without preview thumbnails.
          </p>
          <FileUpload
            accept=".pdf,.doc,.docx,.txt"
            maxSize={20 * 1024 * 1024}
            multiple
            files={documentFiles}
            onChange={setDocumentFiles}
            onDelete={file =>
              setDocumentFiles(documentFiles.filter(f => f.id !== file.id))
            }
            showPreview={false}
            icon={<FileText />}
            label="Upload Recipe Documents"
            description="PDF, DOC, DOCX, or TXT files"
          />
        </div>

        {/* Multiple Files */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Multiple File Upload</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Upload multiple files at once with validation.
          </p>
          <FileUpload
            multiple
            maxFiles={10}
            maxSize={5 * 1024 * 1024}
            files={multipleFiles}
            onChange={setMultipleFiles}
            onDelete={file =>
              setMultipleFiles(multipleFiles.filter(f => f.id !== file.id))
            }
            icon={<Cloud />}
            label="Drop multiple files here"
            description="Up to 10 files, 5MB each"
          />
        </div>

        {/* Upload Progress */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Upload Progress</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Visual progress indicators for file uploads.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Progress Bar Sizes</p>
              <div className="space-y-3">
                <FileUploadProgress value={30} size="sm" />
                <FileUploadProgress value={60} size="md" showPercentage />
                <FileUploadProgress value={90} size="lg" showPercentage />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Simulated Upload</p>
              <Button
                onClick={() => simulateUpload({} as FileWithPreview)}
                disabled={isUploading}
                className="mb-3"
              >
                {isUploading ? 'Uploading...' : 'Start Upload'}
              </Button>
              {isUploading && (
                <FileUploadProgress
                  key={uploadProgress}
                  value={uploadProgress}
                  showPercentage
                />
              )}
            </div>
          </div>
        </div>

        {/* Recipe-Specific Components */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Recipe-Specific Uploads</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Pre-configured upload components for common recipe use cases.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 font-medium">Recipe Image Upload</h4>
              <RecipeImageUpload maxImages={4} maxSize={8 * 1024 * 1024} />
            </div>

            <div>
              <h4 className="mb-3 font-medium">Recipe Document Upload</h4>
              <RecipeDocumentUpload
                documentTypes={['pdf', 'doc', 'docx']}
                maxSize={10 * 1024 * 1024}
              />
            </div>
          </div>
        </div>

        {/* States */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Component States</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Different states for user feedback.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Loading State</p>
              <FileUpload
                size="sm"
                loading
                label="Uploading..."
                description="Please wait"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Disabled State</p>
              <FileUpload
                size="sm"
                disabled
                label="Upload disabled"
                description="Not available"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Error State</p>
              <FileUpload
                size="sm"
                error="File size exceeds limit"
                label="Upload failed"
                description="Please try again"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Success State</p>
              <FileUpload
                size="sm"
                variant="filled"
                icon={<ImageIcon aria-hidden="true" />}
                label="Upload complete"
                description="Files uploaded successfully"
              />
            </div>
          </div>
        </div>

        {/* Validation Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">File Validation</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Built-in validation for file type, size, and count.
          </p>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Images Only (Max 2MB)</p>
              <FileUpload
                accept="image/jpeg,image/png"
                maxSize={2 * 1024 * 1024}
                label="JPEG or PNG only"
                description="Maximum file size: 2MB"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Single File Only</p>
              <FileUpload
                multiple={false}
                maxFiles={1}
                label="Single file upload"
                description="Only one file allowed"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Specific Extensions</p>
              <FileUpload
                accept=".csv,.xlsx,.json"
                label="Data files only"
                description="CSV, XLSX, or JSON format"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
