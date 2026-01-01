// TODO: [USER-MGMT-UPDATE] This file uses useCurrentUser() which was updated to fetch
// profile via getUserProfile(userId) instead of the non-existent /users/me/profile endpoint.
// Review this component to ensure it works correctly with the updated hook implementation.
// The hook now requires userId from the auth store - verify auth state is available when
// this form is rendered.

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useEffect } from 'react';
import {
  profileFormSchema,
  convertToUserProfileUpdateRequest,
  convertFromUserProfileResponse,
  profileFormDefaultValues,
  validationOptions,
  hasProfileChanges,
} from '@/lib/validation/profile-schemas';
import type { ProfileFormData } from '@/lib/validation/profile-schemas';
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from '@/hooks/user-management/useUser';
import { usersApi } from '@/lib/api/user-management';
import type {
  UserProfileResponse,
  UserProfileUpdateRequest,
} from '@/types/user-management';
import type { UseFormReturn } from 'react-hook-form';

/**
 * Options for profile form hook
 */
interface ProfileFormOptions {
  onSuccess?: (user: UserProfileResponse) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

/**
 * Return type for profile form hook
 */
interface ProfileFormReturn {
  form: UseFormReturn<ProfileFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  resetForm: () => void;
  isUpdating: boolean;
  isLoading: boolean;
  updateError: Error | null;
  currentUser: UserProfileResponse | undefined;
  validateUsername: (username: string) => Promise<boolean>;
  hasUnsavedChanges: boolean;
  cancelChanges: () => void;
}

/**
 * Hook for user profile form with validation and API integration
 */
export function useProfileForm(
  options?: ProfileFormOptions
): ProfileFormReturn {
  const { onSuccess, onError, onCancel } = options ?? {};

  // Fetch current user profile
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: fetchError,
  } = useCurrentUser();

  // Update profile mutation
  const updateMutation = useUpdateCurrentUser();

  // State for tracking initial values
  const [initialValues, setInitialValues] = useState<ProfileFormData>(
    profileFormDefaultValues
  );

  // Initialize form
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
    ...validationOptions,
  });

  // Watch form values for unsaved changes detection
  // React Hook Form's watch() is intentionally not memoized to track form changes
  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = form.watch();

  // Update form when current user data is loaded
  useEffect(() => {
    if (currentUser) {
      const userData = convertFromUserProfileResponse(currentUser);
      setInitialValues(userData);
      form.reset(userData);
    }
  }, [currentUser, form]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      const errorObj =
        fetchError instanceof Error
          ? fetchError
          : new Error('Failed to load profile');
      onError?.(errorObj);
    }
  }, [fetchError, onError]);

  // Submit handler
  const handleSubmit = form.handleSubmit(async (data: ProfileFormData) => {
    try {
      const updateData: UserProfileUpdateRequest =
        convertToUserProfileUpdateRequest(data);

      const updatedUser = await updateMutation.mutateAsync(updateData);

      // Update initial values to new data
      const newValues = convertFromUserProfileResponse(updatedUser);
      setInitialValues(newValues);
      form.reset(newValues);

      onSuccess?.(updatedUser);
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error('Failed to update profile');
      onError?.(errorObj);
    }
  });

  // Reset form to initial values
  const resetForm = useCallback(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  // Cancel changes (reset and call onCancel)
  const cancelChanges = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  // Validate username availability
  const validateUsername = useCallback(
    async (username: string): Promise<boolean> => {
      // If username hasn't changed, it's valid
      if (username === currentUser?.username) {
        return true;
      }

      // Check if username is available
      try {
        const isAvailable = await usersApi.isUsernameAvailable(username);
        return isAvailable;
      } catch {
        // If check fails, assume not available to be safe
        return false;
      }
    },
    [currentUser]
  );

  // Check if there are unsaved changes
  const hasUnsavedChanges = currentUser
    ? hasProfileChanges(formValues, currentUser)
    : false;

  return {
    form,
    handleSubmit,
    resetForm,
    isUpdating: updateMutation.isPending,
    isLoading: isLoadingUser,
    updateError: updateMutation.error as Error | null,
    currentUser,
    validateUsername,
    hasUnsavedChanges,
    cancelChanges,
  };
}
