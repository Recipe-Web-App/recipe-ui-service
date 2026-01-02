import { authClient, handleAuthApiError } from './client';
import type {
  SessionStats,
  SessionStatsParams,
  ClearSessionsResponse,
  ClearAllCachesResponse,
  ForceLogoutResponse,
} from '@/types/auth';

export const authAdminApi = {
  async getSessionStats(params?: SessionStatsParams): Promise<SessionStats> {
    try {
      const response = await authClient.get('/admin/cache/sessions/stats', {
        params,
      });
      return response.data as SessionStats;
    } catch (error) {
      handleAuthApiError(error);
      throw error;
    }
  },

  async clearSessions(): Promise<ClearSessionsResponse> {
    try {
      const response = await authClient.delete('/admin/cache/sessions');
      return response.data as ClearSessionsResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error;
    }
  },

  async clearAllCaches(): Promise<ClearAllCachesResponse> {
    try {
      const response = await authClient.post('/admin/cache/clear');
      return response.data as ClearAllCachesResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error;
    }
  },

  async forceLogout(userId: string): Promise<ForceLogoutResponse> {
    try {
      const response = await authClient.post(
        `/admin/user-management/${userId}/force-logout`
      );
      return response.data as ForceLogoutResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error;
    }
  },
};
