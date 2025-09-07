import { useMutation } from '@tanstack/react-query';
import { userAuthApi } from '@/lib/api/auth';
import type {
  UserPasswordResetRequest,
  UserPasswordResetConfirmRequest,
} from '@/types/auth';

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (data: UserPasswordResetRequest) =>
      userAuthApi.requestPasswordReset(data),
  });
};

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: (data: UserPasswordResetConfirmRequest) =>
      userAuthApi.confirmPasswordReset(data),
  });
};
