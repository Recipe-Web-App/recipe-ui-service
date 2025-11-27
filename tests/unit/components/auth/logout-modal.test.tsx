import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LogoutModal } from '@/components/auth/logout-modal';
import { useLogout } from '@/hooks/auth/useAuth';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock auth hook
const mockMutateAsync = jest.fn();
jest.mock('@/hooks/auth/useAuth', () => ({
  useLogout: jest.fn(() => ({
    mutateAsync: mockMutateAsync,
  })),
}));

// Mock Modal components to avoid Portal issues in tests
jest.mock('@/components/ui/modal', () => ({
  Modal: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="modal">{children}</div> : null,
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-content">{children}</div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  ),
  ModalTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="modal-title">{children}</h2>
  ),
  ModalDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="modal-description">{children}</p>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-footer">{children}</div>
  ),
}));

// Mock Button
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('LogoutModal', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLogout as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  it('renders nothing when closed', () => {
    render(<LogoutModal open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    render(<LogoutModal open={true} onOpenChange={mockOnOpenChange} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    // Title
    expect(
      screen.getByRole('heading', { name: 'Log Out' })
    ).toBeInTheDocument();
    // Button
    expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to log out of your account?')
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when Cancel is clicked', () => {
    render(<LogoutModal open={true} onOpenChange={mockOnOpenChange} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls logout and redirects when Log Out is clicked', async () => {
    mockMutateAsync.mockResolvedValue(undefined);

    render(<LogoutModal open={true} onOpenChange={mockOnOpenChange} />);

    const logoutButton = screen.getByRole('button', { name: 'Log Out' });

    fireEvent.click(logoutButton);

    expect(mockMutateAsync).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading state during logout', async () => {
    // Create a promise that we can resolve manually
    let resolveLogout: () => void;
    const logoutPromise = new Promise<void>(resolve => {
      resolveLogout = resolve;
    });

    mockMutateAsync.mockReturnValue(logoutPromise);

    render(<LogoutModal open={true} onOpenChange={mockOnOpenChange} />);

    const logoutButton = screen.getByRole('button', { name: 'Log Out' });

    fireEvent.click(logoutButton);

    // Should show loading text
    expect(screen.getByText('Logging out...')).toBeInTheDocument();
    expect(logoutButton).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();

    // Resolve the promise
    resolveLogout!();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('handles logout error', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockMutateAsync.mockRejectedValue(new Error('Logout failed'));

    render(<LogoutModal open={true} onOpenChange={mockOnOpenChange} />);

    const logoutButton = screen.getByRole('button', { name: 'Log Out' });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Log Out' })
      ).toBeInTheDocument(); // Should revert back from "Logging out..."
      expect(logoutButton).not.toBeDisabled();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
