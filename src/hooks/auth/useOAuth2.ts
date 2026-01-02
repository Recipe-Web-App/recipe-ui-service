import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { oauth2Api } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { QUERY_KEYS } from '@/constants';
import type {
  AuthorizationCodeRequest,
  ClientRegistrationRequest,
  ClientSecretRotationRequest,
} from '@/types/auth';

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
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.USER_INFO });
    },
  });
};

export const useRegisterClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientRegistrationRequest) =>
      oauth2Api.registerClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.CLIENTS });
    },
  });
};

export const useClient = (clientId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.AUTH.CLIENT, clientId],
    queryFn: () => oauth2Api.getClient(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRotateClientSecret = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: ClientSecretRotationRequest;
    }) => oauth2Api.rotateClientSecret(clientId, data),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.AUTH.CLIENT, clientId],
      });
    },
  });
};
