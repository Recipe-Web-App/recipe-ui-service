'use client';

import React, { useState } from 'react';
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Lightbulb,
  Share,
  Download,
  Upload,
  Settings,
  Heart,
} from 'lucide-react';
import {
  BaseAlert,
  RecipeAlert,
  ToastAlert,
  BannerAlert,
  InlineAlert,
  AlertProvider,
  useAlert,
  AlertButton,
} from '@/components/ui/alert';

function AlertProviderDemo() {
  const { showAlert, showToast, showBanner, clearAlerts, alerts } = useAlert();

  const handleShowAlert = () => {
    showAlert({
      variant: 'success',
      title: 'Global Alert Example',
      description:
        'This alert was created using the global alert provider system.',
      icon: <CheckCircle className="h-4 w-4" />,
      dismissible: true,
    });
  };

  const handleShowToast = () => {
    showToast({
      variant: 'info',
      title: 'Toast Notification',
      description: 'This is a toast notification with auto-dismiss.',
      icon: <Bell className="h-4 w-4" />,
      duration: 4000,
      position: 'top-right',
    });
  };

  const handleShowBanner = () => {
    showBanner({
      variant: 'warning',
      title: 'System Announcement',
      description: 'This is a banner alert for system-wide notifications.',
      position: 'top',
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold">Alert Provider Controls</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleShowAlert}
            className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
          >
            Show Global Alert
          </button>
          <button
            onClick={handleShowToast}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            Show Toast
          </button>
          <button
            onClick={handleShowBanner}
            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
          >
            Show Banner
          </button>
          <button
            onClick={clearAlerts}
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
          >
            Clear All ({alerts.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlertDemo() {
  const [dismissibleAlerts, setDismissibleAlerts] = useState([
    {
      id: 1,
      title: 'Dismissible Info',
      description: 'You can close this alert.',
    },
    {
      id: 2,
      title: 'Another Alert',
      description: 'This one can also be dismissed.',
    },
  ]);

  type ToastNotification = {
    id: number;
    variant: 'default' | 'destructive' | 'success' | 'warning' | 'info';
    title: string;
    description: string;
    icon: React.ReactNode;
  };

  type BannerAlert = {
    id: number;
    variant:
      | 'info'
      | 'maintenance'
      | 'default'
      | 'destructive'
      | 'success'
      | 'warning';
    title: string;
    description: string;
  };

  type FormData = {
    email: string;
    password: string;
    recipeName: string;
  };

  type FormErrors = {
    email?: string;
    password?: string;
    recipeName?: string;
  };

  const [toastNotifications, setToastNotifications] = useState<
    ToastNotification[]
  >([]);
  const [toastCounter, setToastCounter] = useState(0);

  const [bannerAlerts, setBannerAlerts] = useState<BannerAlert[]>([
    {
      id: 1,
      variant: 'info',
      title: 'New Feature Available',
      description: 'Recipe collections are now available in your dashboard.',
    },
    {
      id: 2,
      variant: 'maintenance',
      title: 'Scheduled Maintenance',
      description: 'System maintenance tonight from 2-4 AM EST.',
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    recipeName: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleDismissAlert = (id: number) => {
    setDismissibleAlerts(prev => prev.filter(alertItem => alertItem.id !== id));
  };

  const resetDismissibleAlerts = () => {
    setDismissibleAlerts([
      {
        id: 1,
        title: 'Dismissible Info',
        description: 'You can close this alert.',
      },
      {
        id: 2,
        title: 'Another Alert',
        description: 'This one can also be dismissed.',
      },
    ]);
  };

  const showToastNotification = (
    variant: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  ) => {
    const id = toastCounter;
    setToastCounter(prev => prev + 1);

    const newToast = {
      id,
      variant,
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `This is a ${variant} toast notification.`,
      icon:
        variant === 'success' ? (
          <CheckCircle className="h-4 w-4" />
        ) : variant === 'warning' ? (
          <AlertTriangle className="h-4 w-4" />
        ) : variant === 'destructive' ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <Info className="h-4 w-4" />
        ),
    };

    setToastNotifications(prev => [...prev, newToast]);

    setTimeout(() => {
      setToastNotifications(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToastNotifications(prev => prev.filter(t => t.id !== id));
  };

  const closeBanner = (id: number) => {
    setBannerAlerts(prev => prev.filter(b => b.id !== id));
  };

  const resetBanners = () => {
    setBannerAlerts([
      {
        id: 1,
        variant: 'info',
        title: 'New Feature Available',
        description: 'Recipe collections are now available in your dashboard.',
      },
      {
        id: 2,
        variant: 'maintenance',
        title: 'Scheduled Maintenance',
        description: 'System maintenance tonight from 2-4 AM EST.',
      },
    ]);
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required'; // pragma: allowlist secret
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'; // pragma: allowlist secret
    }

    if (!formData.recipeName) {
      errors.recipeName = 'Recipe name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <AlertProvider maxAlerts={5}>
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Alert Component Demo
          </h1>
          <p className="text-gray-600">
            Comprehensive alert system for notifications, status messages, and
            user feedback.
          </p>
        </div>

        {/* Overview Section */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Overview</h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium">Features:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Multiple alert types and variants</li>
                <li>• Recipe-specific alert messages</li>
                <li>• Toast notifications with auto-dismiss</li>
                <li>• Banner alerts for system announcements</li>
                <li>• Inline alerts for form validation</li>
                <li>• Global alert provider system</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Accessibility:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• ARIA role=&quot;alert&quot; for screen readers</li>
                <li>• Keyboard navigation support</li>
                <li>• High contrast focus indicators</li>
                <li>• Semantic HTML structure</li>
                <li>• Live region announcements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Basic Alerts */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Basic Alert Variants</h2>
          <div className="space-y-4">
            <BaseAlert
              variant="default"
              title="Default Alert"
              description="This is a default alert for general information."
              icon={<Info className="h-4 w-4" />}
            />
            <BaseAlert
              variant="info"
              title="Information Alert"
              description="This alert provides helpful information to users."
              icon={<Bell className="h-4 w-4" />}
            />
            <BaseAlert
              variant="success"
              title="Success Alert"
              description="This alert confirms successful completion of an action."
              icon={<CheckCircle className="h-4 w-4" />}
            />
            <BaseAlert
              variant="warning"
              title="Warning Alert"
              description="This alert warns users about potential issues or important information."
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            <BaseAlert
              variant="destructive"
              title="Error Alert"
              description="This alert indicates an error or failed operation that needs attention."
              icon={<XCircle className="h-4 w-4" />}
            />
            <BaseAlert
              variant="secondary"
              title="Secondary Alert"
              description="This alert provides secondary information with subtle styling."
              icon={<Lightbulb className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* Alert Sizes */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Alert Sizes</h2>
          <div className="space-y-4">
            <BaseAlert
              size="sm"
              variant="info"
              title="Small Alert"
              description="Compact alert with smaller padding and text."
              icon={<Info className="h-3 w-3" />}
            />
            <BaseAlert
              size="default"
              variant="info"
              title="Default Alert"
              description="Standard alert size with balanced spacing."
              icon={<Info className="h-4 w-4" />}
            />
            <BaseAlert
              size="lg"
              variant="info"
              title="Large Alert"
              description="Larger alert with increased padding for more prominent display."
              icon={<Info className="h-5 w-5" />}
            />
          </div>
        </section>

        {/* Dismissible Alerts */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Dismissible Alerts</h2>
          <div className="space-y-4">
            {dismissibleAlerts.map(alertItem => (
              <BaseAlert
                key={alertItem.id}
                variant="info"
                title={alertItem.title}
                description={alertItem.description}
                icon={<Info className="h-4 w-4" />}
                dismissible
                onClose={() => handleDismissAlert(alertItem.id)}
              />
            ))}
            {dismissibleAlerts.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p className="mb-4">All alerts have been dismissed.</p>
                <button
                  onClick={resetDismissibleAlerts}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Reset Alerts
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Alerts with Actions */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Alerts with Actions</h2>
          <div className="space-y-4">
            <BaseAlert
              variant="warning"
              title="Update Available"
              description="A new version of the recipe app is available for download."
              icon={<Download className="h-4 w-4" />}
              actions={
                <>
                  <AlertButton intent="secondary" size="sm">
                    Later
                  </AlertButton>
                  <AlertButton intent="primary" size="sm">
                    Update Now
                  </AlertButton>
                </>
              }
            />
            <BaseAlert
              variant="info"
              title="Share Recipe Collection"
              description="Would you like to share your recipe collection with the community?"
              icon={<Share className="h-4 w-4" />}
              actions={
                <>
                  <AlertButton intent="secondary" size="sm">
                    Not Now
                  </AlertButton>
                  <AlertButton intent="success" size="sm">
                    Share Collection
                  </AlertButton>
                </>
              }
            />
            <BaseAlert
              variant="success"
              title="Backup Complete"
              description="Your recipes have been successfully backed up to cloud storage."
              icon={<Upload className="h-4 w-4" />}
              actions={
                <AlertButton intent="primary" size="sm">
                  View Backup
                </AlertButton>
              }
            />
          </div>
        </section>

        {/* Recipe-Specific Alerts */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Recipe-Specific Alerts</h2>
          <div className="space-y-4">
            <RecipeAlert
              type="recipe-saved"
              recipeName="Chocolate Chip Cookies"
              dismissible
            />
            <RecipeAlert
              type="recipe-published"
              recipeName="Beef Stew"
              dismissible
            />
            <RecipeAlert
              type="recipe-shared"
              recipeName="Caesar Salad"
              dismissible
            />
            <RecipeAlert
              type="recipe-imported"
              recipeName="Thai Green Curry"
              dismissible
            />
            <RecipeAlert
              type="recipe-error"
              recipeName="Apple Pie"
              description="Failed to save recipe due to network error. Please try again."
              dismissible
            />
            <RecipeAlert
              type="cooking-tip"
              title="Pro Tip"
              description="For best results, let your cookie dough chill for at least 30 minutes before baking."
              dismissible
            />
            <RecipeAlert
              type="nutritional-info"
              title="Nutrition Calculated"
              description="Nutritional information has been calculated based on ingredient data."
              dismissible
            />
            <RecipeAlert
              type="seasonal-suggestion"
              title="Seasonal Ingredients"
              description="Consider using fresh spring vegetables that are currently in season."
              dismissible
            />
          </div>
        </section>

        {/* Toast Notifications */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Toast Notifications</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => showToastNotification('default')}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              >
                Default Toast
              </button>
              <button
                onClick={() => showToastNotification('success')}
                className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
              >
                Success Toast
              </button>
              <button
                onClick={() => showToastNotification('warning')}
                className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
              >
                Warning Toast
              </button>
              <button
                onClick={() => showToastNotification('destructive')}
                className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Error Toast
              </button>
              <button
                onClick={() => setToastNotifications([])}
                className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
              >
                Clear Toasts ({toastNotifications.length})
              </button>
            </div>

            {/* Toast Container */}
            <div className="pointer-events-none fixed top-4 right-4 z-50 space-y-2">
              {toastNotifications.map(toast => (
                <ToastAlert
                  key={toast.id}
                  variant={toast.variant}
                  position="top-right"
                  title={toast.title}
                  description={toast.description}
                  icon={toast.icon}
                  autoClose={false}
                  onClose={() => removeToast(toast.id)}
                  className="pointer-events-auto"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Banner Alerts */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Banner Alerts</h2>
          <div className="space-y-4">
            {bannerAlerts.map(banner => (
              <BannerAlert
                key={banner.id}
                variant={banner.variant}
                title={banner.title}
                description={banner.description}
                onClose={() => closeBanner(banner.id)}
              />
            ))}
            {bannerAlerts.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p className="mb-4">All banners have been dismissed.</p>
                <button
                  onClick={resetBanners}
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Reset Banners
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Inline Alerts (Form Validation) */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Inline Alerts (Form Validation)
          </h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <InlineAlert
                  variant="destructive"
                  icon={<XCircle className="h-3 w-3" />}
                  description={formErrors.email}
                  className="mt-1"
                />
              )}
              {formData.email && !formErrors.email && (
                <InlineAlert
                  variant="success"
                  icon={<CheckCircle className="h-3 w-3" />}
                  description="Valid email address"
                  className="mt-1"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={e =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <InlineAlert
                  variant="destructive"
                  icon={<XCircle className="h-3 w-3" />}
                  description={formErrors.password}
                  className="mt-1"
                />
              )}
              {formData.password && formData.password.length >= 6 && (
                <InlineAlert
                  variant="success"
                  icon={<CheckCircle className="h-3 w-3" />}
                  description="Password strength: Good"
                  className="mt-1"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Recipe Name *
              </label>
              <input
                type="text"
                value={formData.recipeName}
                onChange={e =>
                  setFormData(prev => ({ ...prev, recipeName: e.target.value }))
                }
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter recipe name"
              />
              {formErrors.recipeName && (
                <InlineAlert
                  variant="destructive"
                  icon={<XCircle className="h-3 w-3" />}
                  description={formErrors.recipeName}
                  className="mt-1"
                />
              )}
              {!formErrors.recipeName && (
                <InlineAlert
                  variant="info"
                  icon={<Info className="h-3 w-3" />}
                  description="Choose a descriptive name for your recipe"
                  className="mt-1"
                />
              )}
            </div>

            <button
              onClick={validateForm}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Validate Form
            </button>
          </div>
        </section>

        {/* Global Alert Provider */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Global Alert Provider</h2>
          <p className="mb-4 text-gray-600">
            Use the global alert provider to show alerts from anywhere in your
            application.
          </p>
          <AlertProviderDemo />
        </section>

        {/* Accessibility Testing */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Accessibility Testing</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold">Keyboard Navigation:</h3>
              <p className="mb-2 text-sm text-gray-600">
                Test keyboard navigation by using Tab, Enter, and Escape keys.
              </p>
              <BaseAlert
                variant="info"
                title="Keyboard Test Alert"
                description="This alert includes focusable elements for keyboard navigation testing."
                icon={<Settings className="h-4 w-4" />}
                dismissible
                actions={
                  <>
                    <AlertButton intent="secondary" size="sm">
                      Secondary Action
                    </AlertButton>
                    <AlertButton intent="primary" size="sm">
                      Primary Action
                    </AlertButton>
                  </>
                }
              />
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold">Screen Reader Testing:</h3>
              <p className="mb-2 text-sm text-gray-600">
                This alert will be announced to screen readers with proper ARIA
                attributes.
              </p>
              <BaseAlert
                variant="success"
                title="Screen Reader Announcement"
                description="This alert demonstrates proper ARIA labeling and will be announced to assistive technologies."
                icon={<Heart className="h-4 w-4" />}
              />
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Usage Guidelines</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-green-600">✅ Do&apos;s</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use appropriate variants for message types</li>
                <li>• Provide clear, actionable descriptions</li>
                <li>• Include relevant icons for visual context</li>
                <li>• Make non-critical alerts dismissible</li>
                <li>• Test with keyboard navigation</li>
                <li>• Use auto-dismiss for temporary notifications</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-red-600">❌ Don&apos;ts</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Don&apos;t show too many alerts at once</li>
                <li>• Don&apos;t use alerts for critical system failures</li>
                <li>• Don&apos;t make all alerts dismissible</li>
                <li>• Don&apos;t use vague or unclear messaging</li>
                <li>• Don&apos;t forget to handle alert overflow</li>
                <li>• Don&apos;t ignore accessibility requirements</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AlertProvider>
  );
}
