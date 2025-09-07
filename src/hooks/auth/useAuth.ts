import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAuthApi, oauth2Api } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import type {
  UserLoginRequest,
  UserLogoutResponse,
  UserRefreshRequest,
  UserInfo,
} from '@/types/auth';

const QUERY_KEYS = {
  USER_INFO: ['auth', 'userInfo'] as const,
  DISCOVERY: ['auth', 'discovery'] as const,
} as const;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuthUser, setTokenData } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserLoginRequest) => userAuthApi.login(data),
    onSuccess: response => {
      setAuthUser(response.user);
      setTokenData(response.token);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_INFO });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (): Promise<UserLogoutResponse> => userAuthApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_INFO });
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  const { setTokenData } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserRefreshRequest) => userAuthApi.refresh(data),
    onSuccess: response => {
      setTokenData(response.token);
    },
  });
};

export const useUserInfo = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.USER_INFO,
    queryFn: (): Promise<UserInfo> => oauth2Api.getUserInfo(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOAuthDiscovery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DISCOVERY,
    queryFn: () => oauth2Api.getDiscoveryDocument(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};
