import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms/LoginForm';
import { useLogin } from '@/hooks/auth/useAuth';

// Mock the hooks
jest.mock('@/hooks/auth/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockMutateAsync = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);

    mockUseLogin.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: 'idle',
      submittedAt: 0,
    } as any);
  });

  it('renders login form fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);
    await user.tab(); // Blur the email field

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password is not empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    const passwordInput = screen.getByLabelText(/password/i);
    await user.click(passwordInput);
    await user.tab(); // Blur the password field

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({
      user: {
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      token: {
        access_token: 'token',
        token_type: 'Bearer' as const,
        expires_in: 3600,
      },
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';

    mockUseLogin.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: true,
      error: new Error(errorMessage),
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 1,
      failureReason: new Error(errorMessage),
      isPaused: false,
      status: 'error',
      submittedAt: 0,
    } as any);

    render(<LoginForm />);

    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables form fields while submitting', async () => {
    mockUseLogin.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
      isError: false,
      error: null,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: 'pending',
      submittedAt: Date.now(),
    } as any);

    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('redirects to custom URL on success', async () => {
    const user = userEvent.setup();
    const customRedirect = '/dashboard';

    mockMutateAsync.mockResolvedValue({
      user: {
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      token: {
        access_token: 'token',
        token_type: 'Bearer' as const,
        expires_in: 3600,
      },
    });

    render(<LoginForm redirectUrl={customRedirect} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(customRedirect);
    });
  });

  it('applies custom className', () => {
    const customClass = 'custom-form-class';
    const { container } = render(<LoginForm className={customClass} />);

    expect(container.querySelector(`.${customClass}`)).toBeInTheDocument();
  });
});
