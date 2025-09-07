import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userAuthApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import type { UserRegistrationRequest } from '@/types/auth';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setAuthUser, setTokenData } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserRegistrationRequest) => userAuthApi.register(data),
    onSuccess: response => {
      setAuthUser(response.user);
      if (response.token) {
        setTokenData(response.token);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'userInfo'] });
    },
  });
};
