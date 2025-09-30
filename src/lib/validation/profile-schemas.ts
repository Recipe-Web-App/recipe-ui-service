import { z } from 'zod';
import type {
  UserProfileUpdateRequest,
  UserProfileResponse,
} from '@/types/user-management';

/**
 * Username validation schema
 */
export const usernameSchema = z
  .string()
  .transform(val => val.trim())
  .pipe(
    z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      )
  );

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .transform(val => val.trim())
  .pipe(
    z
      .string()
      .email('Invalid email address')
      .max(254, 'Email must not exceed 254 characters')
  )
  .optional()
  .or(z.literal(''));

/**
 * Full name validation schema
 */
export const fullNameSchema = z
  .string()
  .transform(val => val.trim())
  .pipe(
    z
      .string()
      .min(1, 'Full name must be at least 1 character')
      .max(100, 'Full name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'Full name can only contain letters, spaces, hyphens, and apostrophes'
      )
  )
  .optional()
  .or(z.literal(''));

/**
 * Bio validation schema
 */
export const bioSchema = z
  .string()
  .transform(val => val.trim())
  .pipe(z.string().max(500, 'Bio must not exceed 500 characters'))
  .optional()
  .or(z.literal(''));

/**
 * Profile form validation schema
 */
export const profileFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  fullName: fullNameSchema,
  bio: bioSchema,
});

/**
 * Inferred TypeScript type from schema
 */
export type ProfileFormData = z.infer<typeof profileFormSchema>;

/**
 * Validation options for react-hook-form
 */
export const validationOptions = {
  mode: 'onChange' as const,
  reValidateMode: 'onChange' as const,
  criteriaMode: 'all' as const,
  shouldFocusError: true,
} as const;

/**
 * Convert form data to UserProfileUpdateRequest
 */
export function convertToUserProfileUpdateRequest(
  formData: ProfileFormData
): UserProfileUpdateRequest {
  return {
    username: formData.username,
    email: formData.email === '' ? null : formData.email,
    fullName: formData.fullName === '' ? null : formData.fullName,
    bio: formData.bio === '' ? null : formData.bio,
  };
}

/**
 * Convert UserProfileResponse to form data
 */
export function convertFromUserProfileResponse(
  user: UserProfileResponse
): ProfileFormData {
  return {
    username: user.username,
    email: user.email ?? '',
    fullName: user.fullName ?? '',
    bio: user.bio ?? '',
  };
}

/**
 * Default values for profile form
 */
export const profileFormDefaultValues: ProfileFormData = {
  username: '',
  email: '',
  fullName: '',
  bio: '',
};

/**
 * Check if form has changes compared to original user data
 */
export function hasProfileChanges(
  formData: ProfileFormData,
  originalUser: UserProfileResponse
): boolean {
  const normalizeValue = (val: string | null | undefined): string | null => {
    return val === '' || val === undefined ? null : val;
  };

  return (
    formData.username !== originalUser.username ||
    normalizeValue(formData.email) !== normalizeValue(originalUser.email) ||
    normalizeValue(formData.fullName) !==
      normalizeValue(originalUser.fullName) ||
    normalizeValue(formData.bio) !== normalizeValue(originalUser.bio)
  );
}

/**
 * Get character count for bio field
 */
export function getBioCharacterCount(bio: string | null | undefined): number {
  return (bio ?? '').length;
}

/**
 * Check if bio is within character limit
 */
export function isBioWithinLimit(bio: string | null | undefined): boolean {
  return getBioCharacterCount(bio) <= 500;
}
