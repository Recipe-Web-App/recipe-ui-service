import { useMutation, useQueryClient } from '@tanstack/react-query';
import { oauth2Api } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthorizationCodeRequest } from '@/types/auth';

export const useBuildAuthorizeUrl = () => {
  return useMutation({
    mutationFn: (params: {
      clientId: string;
      redirectUri: string;
      scope?: string;
      state?: string;
    }) => oauth2Api.buildAuthorizeUrl(params),
  });
};

export const useExchangeCodeForToken = () => {
  const queryClient = useQueryClient();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: AuthorizationCodeRequest) =>
      oauth2Api.exchangeCodeForToken(data),
    onSuccess: response => {
      setToken(response.access_token);
      queryClient.invalidateQueries({ queryKey: ['auth', 'userInfo'] });
    },
  });
};

export const useIntrospectToken = () => {
  return useMutation({
    mutationFn: (token: string) => oauth2Api.introspectToken({ token }),
  });
};

export const useRevokeToken = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) => oauth2Api.revokeToken({ token }),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: ['auth', 'userInfo'] });
    },
  });
};
