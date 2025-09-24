import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  FileUpload,
  FileUploadDropZone,
  FileUploadItem,
  FileUploadProgress,
  RecipeImageUpload,
  RecipeDocumentUpload,
} from '@/components/ui/file-upload';
import type {
  FileUploadProps,
  FileWithPreview,
} from '@/types/ui/file-upload.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/test');
global.URL.revokeObjectURL = jest.fn();

/**
 * Helper function to create mock files
 */
const createMockFile = (
  name: string,
  size: number,
  type: string,
  lastModified: number = Date.now()
): File => {
  const file = new File(['test content'], name, { type, lastModified });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

/**
 * Helper function to create mock file with preview
 */
const createMockFileWithPreview = (
  name: string,
  size: number,
  type: string
): FileWithPreview => {
  const file = createMockFile(name, size, type) as FileWithPreview;
  file.id = `${name}-${size}-${Date.now()}`;
  if (type.startsWith('image/')) {
    file.preview = 'blob:http://localhost/test';
  }
  return file;
};

/**
 * Helper function to render FileUpload with default props
 */
const renderFileUpload = (props: Partial<FileUploadProps> = {}) => {
  const defaultProps: FileUploadProps = {
    ...props,
  };

  return render(<FileUpload {...defaultProps} />);
};

describe('FileUpload', () => {
  describe('Basic Rendering', () => {
    test('renders upload zone', () => {
      renderFileUpload();
      expect(
        screen.getByRole('button', { name: /upload files/i })
      ).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      renderFileUpload({ label: 'Upload Images' });
      expect(screen.getByText('Upload Images')).toBeInTheDocument();
    });

    test('renders with custom description', () => {
      renderFileUpload({ description: 'Max 5MB per file' });
      expect(screen.getByText('Max 5MB per file')).toBeInTheDocument();
    });

    test('applies variant classes', () => {
      const { container } = renderFileUpload({ variant: 'dashed' });
      const dropZone = container.querySelector('[role="button"]');
      expect(dropZone).toHaveClass('border-dashed');
    });

    test('applies size classes', () => {
      const { container } = renderFileUpload({ size: 'lg' });
      const dropZone = container.querySelector('[role="button"]');
      expect(dropZone).toHaveClass('p-8', 'min-h-[200px]');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<FileUpload ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('File Input Interaction', () => {
    test('triggers file input on click', () => {
      const { container } = renderFileUpload();
      const dropZone = screen.getByRole('button', { name: /upload files/i });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      const clickSpy = jest.spyOn(input, 'click');
      fireEvent.click(dropZone);

      expect(clickSpy).toHaveBeenCalled();
    });

    test('triggers file input on Enter key', () => {
      const { container } = renderFileUpload();
      const dropZone = screen.getByRole('button', { name: /upload files/i });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      const clickSpy = jest.spyOn(input, 'click');
      fireEvent.keyDown(dropZone, { key: 'Enter' });

      expect(clickSpy).toHaveBeenCalled();
    });

    test('triggers file input on Space key', () => {
      const { container } = renderFileUpload();
      const dropZone = screen.getByRole('button', { name: /upload files/i });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      const clickSpy = jest.spyOn(input, 'click');
      fireEvent.keyDown(dropZone, { key: ' ' });

      expect(clickSpy).toHaveBeenCalled();
    });

    test('handles file selection', () => {
      const onDrop = jest.fn();
      const onChange = jest.fn();
      const { container } = renderFileUpload({ onDrop, onChange });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      const file = createMockFile('test.png', 1024, 'image/png');

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      expect(onDrop).toHaveBeenCalledWith([file]);
      expect(onChange).toHaveBeenCalled();
    });

    test('accepts specified file types', () => {
      const { container } = renderFileUpload({ accept: 'image/*' });
      const input = container.querySelector('input[type="file"]');

      expect(input).toHaveAttribute('accept', 'image/*');
    });

    test('allows multiple file selection when enabled', () => {
      const { container } = renderFileUpload({ multiple: true });
      const input = container.querySelector('input[type="file"]');

      expect(input).toHaveAttribute('multiple');
    });
  });

  describe('Drag and Drop', () => {
    test('handles drag over', () => {
      const { container } = renderFileUpload();
      const dropZone = container.querySelector('[role="button"]');

      fireEvent.dragOver(dropZone!, { dataTransfer: { files: [] } });

      expect(dropZone).toHaveClass('border-primary');
    });

    test('handles drag leave', () => {
      const { container } = renderFileUpload();
      const dropZone = container.querySelector('[role="button"]');

      fireEvent.dragOver(dropZone!, { dataTransfer: { files: [] } });
      fireEvent.dragLeave(dropZone!);

      expect(dropZone).not.toHaveClass('border-primary');
    });

    test('handles file drop', () => {
      const onDrop = jest.fn();
      const { container } = renderFileUpload({ onDrop });
      const dropZone = container.querySelector('[role="button"]');

      const file = createMockFile('test.png', 1024, 'image/png');
      const dataTransfer = {
        files: [file],
        items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
        types: ['Files'],
      };

      fireEvent.drop(dropZone!, { dataTransfer });

      expect(onDrop).toHaveBeenCalledWith([file]);
    });

    test('prevents drop when disabled', () => {
      const onDrop = jest.fn();
      const { container } = renderFileUpload({ onDrop, disabled: true });
      const dropZone = container.querySelector('[role="button"]');

      const file = createMockFile('test.png', 1024, 'image/png');
      const dataTransfer = { files: [file] };

      fireEvent.drop(dropZone!, { dataTransfer });

      expect(onDrop).not.toHaveBeenCalled();
    });
  });

  describe('File Validation', () => {
    test('validates file type', () => {
      const onChange = jest.fn();
      const { container } = renderFileUpload({
        accept: 'image/*',
        onChange,
      });
      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      const invalidFile = createMockFile('test.pdf', 1024, 'application/pdf');

      Object.defineProperty(input, 'files', {
        value: [invalidFile],
        writable: false,
      });

      fireEvent.change(input);

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText(/file type not accepted/i)).toBeInTheDocument();
    });

    test('validates file size', () => {
      const onChange = jest.fn();
      renderFileUpload({
        maxSize: 1024, // 1KB
        onChange,
      });

      const largeFile = createMockFile('test.png', 2048, 'image/png');
      const dropZone = screen.getByRole('button', { name: /upload files/i });

      const dataTransfer = { files: [largeFile] };
      fireEvent.drop(dropZone, { dataTransfer });

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText(/file too large/i)).toBeInTheDocument();
    });

    test('validates max files', () => {
      const onChange = jest.fn();
      const files = [
        createMockFileWithPreview('existing.png', 1024, 'image/png'),
      ];

      const { container } = renderFileUpload({
        maxFiles: 1,
        files,
        onChange,
      });

      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const newFile = createMockFile('new.png', 1024, 'image/png');

      Object.defineProperty(input, 'files', {
        value: [newFile],
        writable: false,
      });

      fireEvent.change(input);

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText(/maximum 1 files allowed/i)).toBeInTheDocument();
    });

    test('accepts valid files', () => {
      const onChange = jest.fn();
      const { container } = renderFileUpload({
        accept: 'image/*',
        maxSize: 2048,
        onChange,
      });

      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const validFile = createMockFile('test.png', 1024, 'image/png');

      Object.defineProperty(input, 'files', {
        value: [validFile],
        writable: false,
      });

      fireEvent.change(input);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('File List Display', () => {
    test('displays uploaded files', () => {
      const files = [
        createMockFileWithPreview('file1.png', 1024, 'image/png'),
        createMockFileWithPreview('file2.pdf', 2048, 'application/pdf'),
      ];

      renderFileUpload({ files });

      expect(screen.getByText('file1.png')).toBeInTheDocument();
      expect(screen.getByText('file2.pdf')).toBeInTheDocument();
    });

    test('shows file size', () => {
      const files = [
        createMockFileWithPreview('test.png', 1536, 'image/png'), // 1.5 KB
      ];

      renderFileUpload({ files });

      expect(screen.getByText('1.5 KB')).toBeInTheDocument();
    });

    test('shows image preview when enabled', () => {
      const files = [createMockFileWithPreview('test.png', 1024, 'image/png')];

      renderFileUpload({ files, showPreview: true });

      const preview = screen.getByAltText('test.png');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'blob:http://localhost/test');
    });

    test('hides file list when showFileList is false', () => {
      const files = [createMockFileWithPreview('test.png', 1024, 'image/png')];

      renderFileUpload({ files, showFileList: false });

      expect(screen.queryByText('test.png')).not.toBeInTheDocument();
    });

    test('handles file deletion', () => {
      const onDelete = jest.fn();
      const onChange = jest.fn();
      const files = [createMockFileWithPreview('test.png', 1024, 'image/png')];

      renderFileUpload({ files, onDelete, onChange });

      const deleteButton = screen.getByLabelText(/remove test.png/i);
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(files[0]);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    test('renders disabled state', () => {
      renderFileUpload({ disabled: true });
      const dropZone = screen.getByRole('button', { name: /upload files/i });

      expect(dropZone).toHaveAttribute('aria-disabled', 'true');
      expect(dropZone).toHaveClass('disabled:opacity-50');
    });

    test('renders loading state', () => {
      renderFileUpload({ loading: true });
      const dropZone = screen.getByRole('button', { name: /upload files/i });

      expect(dropZone).toHaveAttribute('aria-busy', 'true');
    });

    test('renders error state', () => {
      renderFileUpload({ error: 'Upload failed' });

      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });

    test('renders error object', () => {
      renderFileUpload({
        error: {
          message: 'Custom error message',
          code: 'UPLOAD_FAILED',
        },
      });

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  describe('Upload Progress', () => {
    test('shows upload progress', () => {
      const files = [
        {
          ...createMockFileWithPreview('test.png', 1024, 'image/png'),
          progress: 50,
        },
      ];

      renderFileUpload({ files });

      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    test('calls onUpload callback', async () => {
      const onUpload = jest.fn().mockResolvedValue(undefined);
      const { container } = renderFileUpload({ onUpload });

      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = createMockFile('test.png', 1024, 'image/png');

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });
    });

    test('handles upload error', async () => {
      const onUpload = jest.fn().mockRejectedValue(new Error('Upload failed'));
      const { container } = renderFileUpload({ onUpload });

      const input = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = createMockFile('test.png', 1024, 'image/png');

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });
    });
  });

  describe('FileUploadProgress', () => {
    test('renders progress bar', () => {
      render(<FileUploadProgress value={50} />);
      const progressBar = screen.getByRole('progressbar');

      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    test('shows percentage when enabled', () => {
      render(<FileUploadProgress value={75} showPercentage />);

      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    test('clamps value between 0 and 100', () => {
      const { rerender } = render(<FileUploadProgress value={150} />);
      let progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');

      rerender(<FileUploadProgress value={-50} />);
      progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('RecipeImageUpload', () => {
    test('renders with image-specific settings', () => {
      const { container } = render(<RecipeImageUpload />);
      const input = container.querySelector('input[type="file"]');

      expect(input).toHaveAttribute('accept', 'image/*');
      expect(screen.getByText('Upload Recipe Images')).toBeInTheDocument();
    });

    test('respects maxImages prop', () => {
      render(<RecipeImageUpload maxImages={3} />);

      expect(screen.getByText(/add up to 3 images/i)).toBeInTheDocument();
    });
  });

  describe('RecipeDocumentUpload', () => {
    test('renders with document-specific settings', () => {
      const { container } = render(<RecipeDocumentUpload />);
      const input = container.querySelector('input[type="file"]');

      expect(input).toHaveAttribute('accept', '.pdf,.doc,.docx,.txt');
      expect(screen.getByText('Upload Recipe Documents')).toBeInTheDocument();
    });

    test('respects documentTypes prop', () => {
      const { container } = render(
        <RecipeDocumentUpload documentTypes={['pdf', 'doc']} />
      );
      const input = container.querySelector('input[type="file"]');

      expect(input).toHaveAttribute('accept', '.pdf,.doc');
      expect(screen.getByText(/PDF, DOC/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations', async () => {
      const { container } = renderFileUpload();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has proper ARIA attributes', () => {
      renderFileUpload({ disabled: true, loading: true });
      const dropZone = screen.getByRole('button', { name: /upload files/i });

      expect(dropZone).toHaveAttribute('aria-disabled', 'true');
      expect(dropZone).toHaveAttribute('aria-busy', 'true');
      expect(dropZone).toHaveAttribute('tabIndex', '-1');
    });

    test('supports keyboard navigation', () => {
      renderFileUpload();
      const dropZone = screen.getByRole('button', { name: /upload files/i });

      expect(dropZone).toHaveAttribute('tabIndex', '0');
    });

    test('has accessible file input', () => {
      const { container } = renderFileUpload();
      const input = container.querySelector('input[type="file"]');

      expect(input).toHaveClass('sr-only');
      expect(input).toHaveAttribute('aria-label', 'File input');
    });
  });

  describe('Cleanup', () => {
    test('revokes object URLs on unmount', () => {
      const files = [createMockFileWithPreview('test.png', 1024, 'image/png')];

      const { unmount } = renderFileUpload({ files });

      unmount();

      expect(URL.revokeObjectURL).toHaveBeenCalledWith(
        'blob:http://localhost/test'
      );
    });

    test('revokes object URLs when file is deleted', () => {
      const files = [createMockFileWithPreview('test.png', 1024, 'image/png')];

      renderFileUpload({ files });

      const deleteButton = screen.getByLabelText(/remove test.png/i);
      fireEvent.click(deleteButton);

      expect(URL.revokeObjectURL).toHaveBeenCalledWith(
        'blob:http://localhost/test'
      );
    });
  });
});
