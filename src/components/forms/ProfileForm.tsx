import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormTextarea } from './FormField';
import { useProfileForm } from '@/hooks/forms/useProfileForm';
import type { ProfileFormData } from '@/lib/validation/profile-schemas';
import { getBioCharacterCount } from '@/lib/validation/profile-schemas';
import type { UserProfileResponse } from '@/types/user-management';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

/**
 * Props for ProfileForm component
 */
export interface ProfileFormProps {
  onSuccess?: (user: UserProfileResponse) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  showCard?: boolean;
  className?: string;
  title?: string;
}

/**
 * ProfileForm component for user profile editing
 */
export function ProfileForm({
  onSuccess,
  onError,
  onCancel,
  showCard = true,
  className,
  title = 'Edit Profile',
}: ProfileFormProps) {
  const {
    form,
    handleSubmit,
    isUpdating,
    isLoading,
    validateUsername,
    hasUnsavedChanges,
    cancelChanges,
  } = useProfileForm({
    onSuccess,
    onError,
    onCancel,
  });

  // State for username validation
  const [isValidatingUsername, setIsValidatingUsername] = React.useState(false);
  const [usernameAvailable, setUsernameAvailable] = React.useState<
    boolean | null
  >(null);
  const [lastCheckedUsername, setLastCheckedUsername] = React.useState<
    string | null
  >(null);

  // Watch bio value for character counter
  const bioValue = form.watch('bio');
  const bioCharCount = getBioCharacterCount(bioValue);

  // Watch username value for validation
  const usernameValue = form.watch('username');

  // Debounced username validation
  React.useEffect(() => {
    if (!usernameValue || usernameValue === lastCheckedUsername) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingUsername(true);
      try {
        const isAvailable = await validateUsername(usernameValue);
        setUsernameAvailable(isAvailable);
        setLastCheckedUsername(usernameValue);

        if (!isAvailable) {
          form.setError('username', {
            type: 'manual',
            message: 'Username is already taken',
          });
        } else {
          form.clearErrors('username');
        }
      } catch {
        setUsernameAvailable(null);
      } finally {
        setIsValidatingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameValue, validateUsername, lastCheckedUsername, form]);

  // Username validation indicator
  const getUsernameIndicator = () => {
    if (isValidatingUsername) {
      return <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />;
    }

    if (usernameAvailable === true && !form.formState.errors.username) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }

    if (usernameAvailable === false || form.formState.errors.username) {
      return <XCircle className="text-destructive h-4 w-4" />;
    }

    return null;
  };

  // Form content
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <span className="text-muted-foreground ml-2">Loading profile...</span>
        </div>
      ) : (
        <>
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Basic Information</h3>

            {/* Username */}
            <div className="relative">
              <FormInput
                form={form as UseFormReturn<ProfileFormData>}
                name="username"
                label="Username"
                placeholder="Enter your username"
                helperText="3-30 characters, letters, numbers, underscores, and hyphens only"
                required
              />
              {usernameValue && (
                <div className="absolute top-9 right-3">
                  {getUsernameIndicator()}
                </div>
              )}
            </div>

            {/* Email */}
            <FormInput
              form={form as UseFormReturn<ProfileFormData>}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
              helperText="Optional - used for notifications and account recovery"
            />

            {/* Full Name */}
            <FormInput
              form={form as UseFormReturn<ProfileFormData>}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              helperText="Optional - displayed on your public profile"
            />
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">About</h3>

            {/* Bio */}
            <div className="space-y-2">
              <FormTextarea
                form={form as UseFormReturn<ProfileFormData>}
                name="bio"
                label="Bio"
                placeholder="Tell us about yourself..."
                helperText="Share a bit about your cooking interests, favorite cuisines, or anything else you'd like others to know"
                rows={4}
              />
              <div className="flex justify-end">
                <Badge
                  variant={bioCharCount > 500 ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {bioCharCount} / 500 characters
                </Badge>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="text-xs">
                  Unsaved changes
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={cancelChanges}
                disabled={isUpdating || !hasUnsavedChanges}
                className="flex-1 sm:flex-none"
              >
                {onCancel ? 'Cancel' : 'Reset'}
              </Button>

              <Button
                type="submit"
                disabled={
                  isUpdating ||
                  !hasUnsavedChanges ||
                  !!form.formState.errors.username ||
                  isValidatingUsername
                }
                loading={isUpdating}
                className="flex-1 sm:flex-none"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  );

  // Render with or without card wrapper
  if (showCard) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {title && <h2 className="mb-6 text-xl font-bold">{title}</h2>}
      {formContent}
    </div>
  );
}
