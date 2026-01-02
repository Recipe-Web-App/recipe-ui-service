'use client';

import React, { useState } from 'react';
import {
  NotificationBell,
  NotificationItem,
  NotificationList,
  NotificationPanel,
} from '@/components/notification';
import { Button } from '@/components/ui/button';
import type {
  UserNotification,
  NotificationCategory,
} from '@/types/notification';
import type { NotificationFilter } from '@/types/ui/notification';

// Mock notifications for demo using the new notification service schema
const mockNotifications: UserNotification[] = [
  {
    notificationId: '1',
    userId: 'user-1',
    title: 'New follower',
    message: 'John Doe started following you',
    notificationCategory: 'NEW_FOLLOWER' as NotificationCategory,
    isRead: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    notificationData: {
      templateVersion: '1.0',
      followerId: 'user-2',
      followerName: 'John Doe',
    },
  },
  {
    notificationId: '2',
    userId: 'user-1',
    title: 'Recipe shared',
    message: 'Sarah shared "Chocolate Cake" with you',
    notificationCategory: 'RECIPE_SHARED' as NotificationCategory,
    isRead: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    notificationData: {
      templateVersion: '1.0',
      recipeId: 123,
      recipeTitle: 'Chocolate Cake',
      actorId: 'user-3',
      actorName: 'Sarah',
    },
  },
  {
    notificationId: '3',
    userId: 'user-1',
    title: 'New comment',
    message: 'Mike commented on your recipe "Pasta Carbonara"',
    notificationCategory: 'RECIPE_COMMENTED' as NotificationCategory,
    isRead: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    notificationData: {
      templateVersion: '1.0',
      recipeId: 456,
      recipeTitle: 'Pasta Carbonara',
      actorId: 'user-4',
      actorName: 'Mike',
      commentId: 789,
    },
  },
  {
    notificationId: '4',
    userId: 'user-1',
    title: 'Recipe liked',
    message: '5 people liked your recipe "Thai Green Curry"',
    notificationCategory: 'RECIPE_LIKED' as NotificationCategory,
    isRead: true,
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notificationData: {
      templateVersion: '1.0',
      recipeId: 101,
      recipeTitle: 'Thai Green Curry',
      actorName: '5 people',
    },
  },
  {
    notificationId: '5',
    userId: 'user-1',
    title: 'Welcome!',
    message: 'Welcome to RecipeApp! Start exploring recipes.',
    notificationCategory: 'WELCOME' as NotificationCategory,
    isRead: true,
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notificationData: { templateVersion: '1.0', username: 'user-1' },
  },
];

export default function NotificationDemo() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.notificationId !== notificationId)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Notification System
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete notification system with bell icon, dropdown panel, and
          real-time updates. Designed for user engagement and activity tracking.
        </p>
      </div>

      <div className="space-y-8">
        {/* NotificationBell */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Notification Bell</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Bell icon with unread count badge. Animates when there are unread
            notifications.
          </p>

          <div className="space-y-6">
            {/* States */}
            <div>
              <h4 className="mb-3 font-medium">States</h4>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={0} />
                  <span className="text-muted-foreground text-xs">
                    No unread
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={3} />
                  <span className="text-muted-foreground text-xs">
                    3 unread
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={99} />
                  <span className="text-muted-foreground text-xs">
                    99 unread
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={150} />
                  <span className="text-muted-foreground text-xs">
                    99+ unread
                  </span>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="mb-3 font-medium">Sizes</h4>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={5} size="sm" />
                  <span className="text-muted-foreground text-xs">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={5} size="default" />
                  <span className="text-muted-foreground text-xs">Default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotificationBell unreadCount={5} size="lg" />
                  <span className="text-muted-foreground text-xs">Large</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NotificationItem */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Notification Item</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Individual notification display with color-coded left border by type
            (social=blue, activity=green, system=orange).
          </p>

          <div className="bg-muted/30 space-y-2 rounded-lg">
            <NotificationItem
              notification={mockNotifications[0]!}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
            <NotificationItem
              notification={mockNotifications[1]!}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
            <NotificationItem
              notification={mockNotifications[2]!}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
            <NotificationItem
              notification={mockNotifications[3]!}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
            <NotificationItem
              notification={mockNotifications[4]!}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* NotificationList */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Notification List</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Container for notifications with loading and empty states.
          </p>

          <div className="space-y-6">
            {/* Normal state */}
            <div>
              <h4 className="mb-3 font-medium">With Notifications</h4>
              <div className="bg-muted/30 rounded-lg border">
                <NotificationList
                  notifications={notifications}
                  loading={loading}
                  filter={filter}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  maxItems={5}
                />
              </div>
            </div>

            {/* Loading state */}
            <div>
              <h4 className="mb-3 font-medium">Loading State</h4>
              <Button onClick={simulateLoading} size="sm" className="mb-3">
                Simulate Loading
              </Button>
              <div className="bg-muted/30 rounded-lg border">
                <NotificationList
                  notifications={[]}
                  loading={true}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </div>
            </div>

            {/* Empty state */}
            <div>
              <h4 className="mb-3 font-medium">Empty State</h4>
              <div className="bg-muted/30 rounded-lg border">
                <NotificationList
                  notifications={[]}
                  loading={false}
                  filter="all"
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>

        {/* NotificationPanel */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Notification Panel</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Complete dropdown panel with filter tabs, notification list, and
            &ldquo;View all&rdquo; link. Click the bell to see it in action.
          </p>

          <div className="flex items-center gap-4">
            <NotificationPanel
              notifications={notifications}
              loading={loading}
              open={isPanelOpen}
              onOpenChange={setIsPanelOpen}
              filter={filter}
              onFilterChange={setFilter}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              onMarkAllAsRead={handleMarkAllAsRead}
            >
              <NotificationBell
                unreadCount={unreadCount}
                onClick={() => setIsPanelOpen(!isPanelOpen)}
              />
            </NotificationPanel>

            <div className="text-muted-foreground text-sm">
              <p>Click the bell to open the notification panel</p>
              <p className="mt-1">Current unread count: {unreadCount}</p>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
          <div className="space-y-4">
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Basic NotificationBell usage`}
              </div>
              <div>{`<NotificationBell unreadCount={5} />`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// NotificationBellContainer (Smart Component)`}
              </div>
              <div>{`// This is the component to use in your TopNav/header`}</div>
              <div className="mt-2">{`import { NotificationBellContainer } from '@/components/notification';`}</div>
              <div className="mt-2">{`<NotificationBellContainer`}</div>
              <div>{`  bellSize="default"`}</div>
              <div>{`  panelSize="default"`}</div>
              <div>{`  viewAllUrl="/account/notifications"`}</div>
              <div>{`/>`}</div>
            </div>

            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// NotificationPanel with custom setup`}
              </div>
              <div>{`<NotificationPanel`}</div>
              <div>{`  notifications={notifications}`}</div>
              <div>{`  loading={isLoading}`}</div>
              <div>{`  open={isPanelOpen}`}</div>
              <div>{`  onOpenChange={setIsPanelOpen}`}</div>
              <div>{`  filter={filter}`}</div>
              <div>{`  onFilterChange={setFilter}`}</div>
              <div>{`  onMarkAsRead={handleMarkAsRead}`}</div>
              <div>{`  onDelete={handleDelete}`}</div>
              <div>{`  onMarkAllAsRead={handleMarkAllAsRead}`}</div>
              <div>{`>`}</div>
              <div>{`  <NotificationBell unreadCount={unreadCount} />`}</div>
              <div>{`</NotificationPanel>`}</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Features</h3>
          <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
            <li>Real-time updates with auto-polling (every 30 seconds)</li>
            <li>Color-coded notification types (social, activity, system)</li>
            <li>Unread count badge with &ldquo;99+&rdquo; formatting</li>
            <li>
              Filter notifications by type (All, Social, Activity, System)
            </li>
            <li>Mark individual or all notifications as read</li>
            <li>Delete notifications with optimistic updates</li>
            <li>Responsive design (desktop, tablet, mobile)</li>
            <li>Keyboard navigation and screen reader support</li>
            <li>Loading and empty states</li>
            <li>Relative timestamps (e.g., &ldquo;2h ago&rdquo;)</li>
          </ul>
        </div>

        {/* Accessibility */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Accessibility</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              The Notification system follows accessibility best practices:
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Proper ARIA labels for screen readers</li>
              <li>Keyboard navigation support (Tab, Enter, Escape)</li>
              <li>Focus management in panel and items</li>
              <li>Color is not the only indicator (text + icons)</li>
              <li>High contrast support</li>
              <li>Semantic HTML structure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
