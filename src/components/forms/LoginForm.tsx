'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '@/lib/forms/auth-schemas';
import { useLogin } from '@/hooks/auth/useAuth';
import { FormInput } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface LoginFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
  className?: string;
}

export function LoginForm({
  onSuccess,
  redirectUrl = '/',
  className,
}: LoginFormProps) {
  const router = useRouter();
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to home or specified URL
      router.push(redirectUrl);
    } catch (error) {
      // Error is handled by the mutation, just log it
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <div className="space-y-4">
        {/* Display mutation error if present */}
        {loginMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <h3 className="font-medium">Login failed</h3>
              <p className="text-sm">
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          </Alert>
        )}

        <FormInput
          form={form}
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          required
          disabled={loginMutation.isPending}
        />

        <FormInput
          form={form}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          disabled={loginMutation.isPending}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}
