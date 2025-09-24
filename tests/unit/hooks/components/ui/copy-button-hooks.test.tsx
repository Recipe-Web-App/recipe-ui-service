import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCopyButton } from '@/hooks/components/ui/copy-button-hooks';

// Mock the clipboard API
const mockClipboard = {
  writeText: jest.fn(),
  readText: jest.fn(),
  write: jest.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock document.execCommand
document.execCommand = jest.fn();

// Mock window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
});

/**
 * Mock component to test useCopyButton hook
 */
const TestHookComponent: React.FC<{ content?: string }> = ({
  content = 'test',
}) => {
  const { copyToClipboard, status, error, isSupported, resetStatus } =
    useCopyButton();

  return (
    <div>
      <button onClick={() => copyToClipboard(content)}>Copy</button>
      <div data-testid="status">{status}</div>
      <div data-testid="error">{error?.message || 'No error'}</div>
      <div data-testid="supported">{isSupported.toString()}</div>
      <button onClick={resetStatus}>Reset</button>
    </div>
  );
};

describe('useCopyButton Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  test('provides copy functionality', async () => {
    render(<TestHookComponent content="test content" />);

    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('test content');
  });

  test('tracks copy status', async () => {
    render(<TestHookComponent />);

    const statusElement = screen.getByTestId('status');
    expect(statusElement).toHaveTextContent('idle');

    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(statusElement).toHaveTextContent('success');
    });
  });

  test('tracks errors', async () => {
    mockClipboard.writeText.mockRejectedValue(new Error('Test error'));
    render(<TestHookComponent />);

    const errorElement = screen.getByTestId('error');
    expect(errorElement).toHaveTextContent('No error');

    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(errorElement).toHaveTextContent('Test error');
    });
  });

  test('detects clipboard support', () => {
    render(<TestHookComponent />);

    const supportedElement = screen.getByTestId('supported');
    expect(supportedElement).toHaveTextContent('true');
  });

  test('provides reset functionality', async () => {
    render(<TestHookComponent />);

    // Trigger an error
    mockClipboard.writeText.mockRejectedValue(new Error('Test error'));
    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error');
    });

    // Reset status
    const resetButton = screen.getByText('Reset');
    await userEvent.click(resetButton);

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  test('handles empty content', async () => {
    render(<TestHookComponent content="" />);

    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error');
      expect(screen.getByTestId('error')).toHaveTextContent(
        'No content provided to copy'
      );
    });
  });

  test('falls back to execCommand when clipboard API fails', async () => {
    mockClipboard.writeText.mockRejectedValue(
      new Error('Clipboard API failed')
    );
    document.execCommand = jest.fn().mockReturnValue(true);

    // Mock the clipboard API as not supported
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });

    render(<TestHookComponent content="test" />);
    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('shows error when no clipboard support', async () => {
    // Remove all clipboard support
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    document.execCommand = jest.fn().mockReturnValue(false);

    render(<TestHookComponent />);
    const copyButton = screen.getByText('Copy');
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error');
    });
  });
});
