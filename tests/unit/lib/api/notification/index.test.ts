import * as notificationApi from '@/lib/api/notification';

describe('Notification API Index', () => {
  it('should export client utilities', () => {
    expect(notificationApi.notificationClient).toBeDefined();
    expect(notificationApi.NotificationApiError).toBeDefined();
    expect(notificationApi.handleNotificationApiError).toBeDefined();
    expect(notificationApi.buildQueryParams).toBeDefined();
  });

  it('should export API modules', () => {
    expect(notificationApi.shareApi).toBeDefined();
    expect(notificationApi.managementApi).toBeDefined();
  });

  it('should export enums', () => {
    expect(notificationApi.NotificationStatus).toBeDefined();
    expect(notificationApi.NotificationType).toBeDefined();
  });

  it('should have all expected exports', () => {
    const expectedExports = [
      'notificationClient',
      'NotificationApiError',
      'handleNotificationApiError',
      'buildQueryParams',
      'shareApi',
      'managementApi',
      'NotificationStatus',
      'NotificationType',
    ];

    expectedExports.forEach(exportName => {
      expect(notificationApi).toHaveProperty(exportName);
    });
  });
});
