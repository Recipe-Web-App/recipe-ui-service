// @ts-expect-error - Storybook types not available in this environment
import type { StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  FileUpload,
  RecipeImageUpload,
  RecipeDocumentUpload,
  FileUploadProgress,
} from './file-upload';
import type { FileWithPreview } from '@/types/ui/file-upload.types';

const meta = {
  title: 'UI/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive drag-and-drop file upload component with validation, preview, and progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled', 'dashed'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the upload zone',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the upload is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    showPreview: {
      control: 'boolean',
      description: 'Show image preview',
    },
    showFileList: {
      control: 'boolean',
      description: 'Show uploaded files list',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default file upload zone
 */
export const Default: Story = {
  args: {
    variant: 'dashed',
    size: 'md',
    label: 'Click or drag files to upload',
    description: 'PNG, JPG, PDF up to 10MB',
  },
};

/**
 * Interactive file upload example with state management
 */
export const Interactive: Story = {
  render: function Render(args: Record<string, unknown>) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleDrop = (droppedFiles: File[]) => {
      console.log('Files dropped:', droppedFiles);
    };

    const handleUpload = async (file: FileWithPreview) => {
      setUploading(true);
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        file.progress = i;
        setFiles(prev => [...prev]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setUploading(false);
    };

    return (
      <div className="w-[500px]">
        <FileUpload
          {...args}
          files={files}
          onDrop={handleDrop}
          onChange={setFiles}
          onDelete={file => {
            setFiles(files.filter(f => f.id !== file.id));
          }}
          onUpload={handleUpload}
          loading={uploading}
        />
      </div>
    );
  },
  args: {
    multiple: true,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    accept: 'image/*,.pdf',
    showPreview: true,
    showFileList: true,
  },
};

/**
 * All variants showcase
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Default</h3>
          <FileUpload variant="default" size="sm" />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Outlined</h3>
          <FileUpload variant="outlined" size="sm" />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Filled</h3>
          <FileUpload variant="filled" size="sm" />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Dashed</h3>
          <FileUpload variant="dashed" size="sm" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Small</h3>
        <FileUpload size="sm" label="Small upload zone" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Medium</h3>
        <FileUpload size="md" label="Medium upload zone" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Large</h3>
        <FileUpload size="lg" label="Large upload zone" />
      </div>
    </div>
  ),
};

/**
 * Error states
 */
export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-4">
      <FileUpload
        error="File size exceeds maximum limit"
        label="Upload failed"
        description="Please try again with a smaller file"
      />
      <FileUpload
        error={{
          message: 'Invalid file type',
          code: 'INVALID_TYPE',
        }}
        label="Wrong file type"
        description="Only images are accepted"
      />
    </div>
  ),
};

/**
 * Image upload with preview
 */
export const ImageUpload: Story = {
  render: function Render() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    return (
      <div className="w-[500px]">
        <FileUpload
          accept="image/*"
          multiple
          maxFiles={3}
          files={files}
          onChange={setFiles}
          onDelete={file => {
            setFiles(files.filter(f => f.id !== file.id));
          }}
          label="Upload Images"
          description="Drop your images here (max 3)"
          showPreview
        />
      </div>
    );
  },
};

/**
 * Document upload without preview
 */
export const DocumentUpload: Story = {
  render: function Render() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    return (
      <div className="w-[500px]">
        <FileUpload
          accept=".pdf,.doc,.docx,.txt"
          multiple
          files={files}
          onChange={setFiles}
          onDelete={file => {
            setFiles(files.filter(f => f.id !== file.id));
          }}
          label="Upload Documents"
          description="PDF, DOC, DOCX, or TXT files"
          showPreview={false}
        />
      </div>
    );
  },
};

/**
 * Recipe-specific image upload
 */
export const RecipeImages: Story = {
  render: function Render() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    return (
      <div className="w-[500px]">
        <RecipeImageUpload
          files={files}
          onChange={setFiles}
          onDelete={file => {
            setFiles(files.filter(f => f.id !== file.id));
          }}
          maxImages={5}
        />
      </div>
    );
  },
};

/**
 * Recipe document upload
 */
export const RecipeDocuments: Story = {
  render: function Render() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    return (
      <div className="w-[500px]">
        <RecipeDocumentUpload
          files={files}
          onChange={setFiles}
          onDelete={file => {
            setFiles(files.filter(f => f.id !== file.id));
          }}
          documentTypes={['pdf', 'doc', 'docx']}
        />
      </div>
    );
  },
};

/**
 * Upload progress demonstration
 */
export const ProgressExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Small Progress</h3>
        <FileUploadProgress value={30} size="sm" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">
          Medium Progress with Percentage
        </h3>
        <FileUploadProgress value={60} size="md" showPercentage />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Large Progress</h3>
        <FileUploadProgress value={90} size="lg" />
      </div>
    </div>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Upload disabled',
    description: 'File upload is currently not available',
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    loading: true,
    label: 'Uploading...',
    description: 'Please wait while your files are being processed',
  },
};
