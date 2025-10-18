'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  registerSchema,
  type RegisterFormData,
} from '@/lib/forms/auth-schemas';
import { useRegister } from '@/hooks/auth/useRegister';
import { FormInput, FormTextarea } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export interface RegisterFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
  className?: string;
}

export function RegisterForm({
  onSuccess,
  redirectUrl = '/',
  className,
}: RegisterFormProps) {
  const router = useRouter();
  const registerMutation = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      full_name: '',
      bio: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Filter out empty optional fields and exclude confirm_password
      const requestData = {
        username: data.username,
        email: data.email,
        password: data.password,
        ...(data.full_name && { full_name: data.full_name }),
        ...(data.bio && { bio: data.bio }),
      };

      await registerMutation.mutateAsync(requestData);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to home or specified URL
      router.push(redirectUrl);
    } catch (error) {
      // Error is handled by the mutation, just log it
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <div className="space-y-4">
        {/* Display mutation error if present */}
        {registerMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <h3 className="font-medium">Registration failed</h3>
              <p className="text-sm">
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          </Alert>
        )}

        <FormInput
          form={form}
          name="username"
          label="Username"
          placeholder="johndoe"
          required
          disabled={registerMutation.isPending}
        />

        <FormInput
          form={form}
          name="email"
          type="email"
          label="Email"
          placeholder="john@example.com"
          required
          disabled={registerMutation.isPending}
        />

        <FormInput
          form={form}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          disabled={registerMutation.isPending}
          helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
        />

        <FormInput
          form={form}
          name="confirm_password"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          required
          disabled={registerMutation.isPending}
        />

        <FormInput
          form={form}
          name="full_name"
          label="Full Name"
          placeholder="John Doe"
          disabled={registerMutation.isPending}
        />

        <FormTextarea
          form={form}
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself (optional)"
          disabled={registerMutation.isPending}
          type="description"
          rows={3}
          maxLength={500}
          showCharacterCount
        />

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending || !form.formState.isValid}
          loading={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
}
