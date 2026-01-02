import * as notificationApi from '@/lib/api/notification';

describe('Notification API Index', () => {
  it('should export client utilities', () => {
    expect(notificationApi.notificationClient).toBeDefined();
    expect(notificationApi.NotificationApiError).toBeDefined();
    expect(notificationApi.handleNotificationApiError).toBeDefined();
    expect(notificationApi.buildQueryParams).toBeDefined();
  });

  it('should export user notifications API', () => {
    expect(notificationApi.userNotificationsApi).toBeDefined();
  });

  it('should export notification sending APIs', () => {
    expect(notificationApi.recipeNotificationsApi).toBeDefined();
    expect(notificationApi.socialNotificationsApi).toBeDefined();
    expect(notificationApi.activityNotificationsApi).toBeDefined();
    expect(notificationApi.systemNotificationsApi).toBeDefined();
  });

  it('should export management API', () => {
    expect(notificationApi.managementApi).toBeDefined();
  });

  it('should export admin API', () => {
    expect(notificationApi.adminApi).toBeDefined();
  });

  it('should export health API', () => {
    expect(notificationApi.healthApi).toBeDefined();
  });

  it('should have all expected exports', () => {
    const expectedExports = [
      // Client utilities
      'notificationClient',
      'NotificationApiError',
      'handleNotificationApiError',
      'buildQueryParams',
      // APIs
      'userNotificationsApi',
      'recipeNotificationsApi',
      'socialNotificationsApi',
      'activityNotificationsApi',
      'systemNotificationsApi',
      'managementApi',
      'adminApi',
      'healthApi',
    ];

    expectedExports.forEach(exportName => {
      expect(notificationApi).toHaveProperty(exportName);
    });
  });
});
