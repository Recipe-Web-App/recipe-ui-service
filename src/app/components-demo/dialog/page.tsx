'use client';

import { useState } from 'react';
import {
  Trash2,
  Save,
  Download,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogButton,
  DialogIcon,
  ConfirmationDialog,
  RecipeConfirmationDialog,
  AlertDialog,
} from '@/components/ui/dialog';

export default function DialogDemo() {
  const [basicDialog, setBasicDialog] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);
  const [currentSize, setCurrentSize] = useState<string | null>(null);
  const [currentConfirmation, setCurrentConfirmation] = useState<string | null>(
    null
  );
  const [currentRecipeAction, setCurrentRecipeAction] = useState<string | null>(
    null
  );
  const [currentAlert, setCurrentAlert] = useState<string | null>(null);
  const [iconDialog, setIconDialog] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessibilityDialog, setAccessibilityDialog] = useState(false);

  const handleLoadingAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoadingDialog(false);
      alert('Action completed successfully!');
    }, 2000);
  };

  const variants = [
    { variant: 'default', label: 'Default', color: 'bg-blue-600' },
    { variant: 'destructive', label: 'Destructive', color: 'bg-red-600' },
    { variant: 'success', label: 'Success', color: 'bg-green-600' },
    { variant: 'warning', label: 'Warning', color: 'bg-yellow-600' },
    { variant: 'info', label: 'Info', color: 'bg-blue-500' },
  ];

  const sizes = [
    { size: 'sm', label: 'Small' },
    { size: 'default', label: 'Default' },
    { size: 'lg', label: 'Large' },
    { size: 'xl', label: 'Extra Large' },
    { size: 'full', label: 'Full Screen' },
  ];

  const confirmations = [
    {
      type: 'save',
      title: 'Save Changes',
      description: 'Do you want to save your changes before continuing?',
      icon: <Save className="h-6 w-6" />,
      color: 'bg-green-600',
    },
    {
      type: 'delete',
      title: 'Delete Item',
      description:
        'This action cannot be undone. Are you sure you want to delete this item?',
      icon: <Trash2 className="h-6 w-6" />,
      color: 'bg-red-600',
    },
    {
      type: 'discard',
      title: 'Discard Changes',
      description:
        'Your unsaved changes will be lost. Do you want to continue?',
      icon: <X className="h-6 w-6" />,
      color: 'bg-yellow-600',
    },
    {
      type: 'publish',
      title: 'Publish Content',
      description: 'Make this content publicly visible to all users?',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-blue-600',
    },
  ];

  const recipeActions = [
    { action: 'delete-recipe', label: 'Delete Recipe', color: 'bg-red-600' },
    { action: 'save-recipe', label: 'Save Recipe', color: 'bg-green-600' },
    { action: 'publish-recipe', label: 'Publish Recipe', color: 'bg-blue-600' },
    { action: 'share-recipe', label: 'Share Recipe', color: 'bg-purple-600' },
    { action: 'export-recipe', label: 'Export Recipe', color: 'bg-orange-600' },
    {
      action: 'duplicate-recipe',
      label: 'Duplicate Recipe',
      color: 'bg-indigo-600',
    },
  ];

  const alerts = [
    {
      variant: 'default',
      title: 'Information',
      description: 'This is an informational alert message.',
      icon: <Info className="h-6 w-6" />,
    },
    {
      variant: 'success',
      title: 'Success!',
      description: 'Your operation completed successfully.',
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      variant: 'warning',
      title: 'Warning',
      description: 'Please review the information before proceeding.',
      icon: <AlertTriangle className="h-6 w-6" />,
    },
    {
      variant: 'destructive',
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      icon: <X className="h-6 w-6" />,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-6">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Dialog Component Demo
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Comprehensive dialog system for confirmations, alerts, and
          recipe-specific actions. Built on Radix UI with full accessibility
          support and smooth animations.
        </p>
      </div>

      {/* Basic Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Basic Dialog</h2>
        <p className="text-gray-600">
          The foundation dialog component with header, content, and footer
          sections.
        </p>
        <div className="flex gap-2">
          <DialogButton onClick={() => setBasicDialog(true)}>
            Open Basic Dialog
          </DialogButton>
        </div>

        <Dialog open={basicDialog} onOpenChange={setBasicDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Basic Dialog Example</DialogTitle>
              <DialogDescription>
                This is a basic dialog with standard content layout, header, and
                footer actions. You can customize the content, styling, and
                behavior as needed.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                This area can contain any custom content, forms, or additional
                information.
              </p>
            </div>
            <DialogFooter>
              <DialogButton
                intent="secondary"
                onClick={() => setBasicDialog(false)}
              >
                Cancel
              </DialogButton>
              <DialogButton
                intent="primary"
                onClick={() => setBasicDialog(false)}
              >
                OK
              </DialogButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Dialog Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Dialog Variants
        </h2>
        <p className="text-gray-600">
          Different styling variants for various contexts and purposes.
        </p>
        <div className="flex flex-wrap gap-2">
          {variants.map(v => (
            <div key={v.variant}>
              <DialogButton
                intent="secondary"
                className={`${v.color} border-transparent text-white hover:opacity-90`}
                onClick={() => setCurrentVariant(v.variant)}
              >
                {v.label}
              </DialogButton>
              <Dialog
                open={currentVariant === v.variant}
                onOpenChange={open => !open && setCurrentVariant(null)}
              >
                <DialogContent
                  variant={
                    v.variant as
                      | 'default'
                      | 'destructive'
                      | 'success'
                      | 'warning'
                      | 'info'
                  }
                >
                  <DialogHeader
                    variant={
                      v.variant as
                        | 'default'
                        | 'destructive'
                        | 'success'
                        | 'warning'
                        | 'info'
                    }
                  >
                    <DialogTitle
                      variant={
                        v.variant as
                          | 'default'
                          | 'destructive'
                          | 'success'
                          | 'warning'
                          | 'info'
                      }
                    >
                      {v.label} Dialog
                    </DialogTitle>
                    <DialogDescription
                      variant={
                        v.variant as
                          | 'default'
                          | 'destructive'
                          | 'success'
                          | 'warning'
                          | 'info'
                      }
                    >
                      This demonstrates the {v.variant} variant with contextual
                      styling and colors. Each variant provides appropriate
                      visual cues for different types of content.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogButton
                      intent="secondary"
                      onClick={() => setCurrentVariant(null)}
                    >
                      Cancel
                    </DialogButton>
                    <DialogButton
                      intent={
                        v.variant === 'destructive' ? 'destructive' : 'primary'
                      }
                      onClick={() => setCurrentVariant(null)}
                    >
                      Confirm
                    </DialogButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </section>

      {/* Dialog Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Dialog Sizes</h2>
        <p className="text-gray-600">
          Various size options to accommodate different content lengths and
          layouts.
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <div key={s.size}>
              <DialogButton
                intent="secondary"
                onClick={() => setCurrentSize(s.size)}
              >
                {s.label}
              </DialogButton>
              <Dialog
                open={currentSize === s.size}
                onOpenChange={open => !open && setCurrentSize(null)}
              >
                <DialogContent
                  size={s.size as 'sm' | 'default' | 'lg' | 'xl' | 'full'}
                >
                  <DialogHeader>
                    <DialogTitle>{s.label} Dialog Size</DialogTitle>
                    <DialogDescription>
                      This dialog demonstrates the {s.size} size variant. The
                      content area automatically adjusts to accommodate
                      different amounts of content while maintaining proper
                      proportions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="mb-4 text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    {s.size === 'xl' || s.size === 'full' ? (
                      <p className="text-sm text-gray-600">
                        Larger dialogs can accommodate more complex content,
                        forms, tables, or detailed information. They provide
                        ample space for comprehensive user interfaces while
                        maintaining focus and accessibility.
                      </p>
                    ) : null}
                  </div>
                  <DialogFooter>
                    <DialogButton
                      intent="secondary"
                      onClick={() => setCurrentSize(null)}
                    >
                      Close
                    </DialogButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </section>

      {/* Confirmation Dialogs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Confirmation Dialogs
        </h2>
        <p className="text-gray-600">
          Pre-built confirmation dialogs with contextual styling and icons for
          common actions.
        </p>
        <div className="flex flex-wrap gap-2">
          {confirmations.map(c => (
            <div key={c.type}>
              <DialogButton
                intent="secondary"
                className={`${c.color} border-transparent text-white hover:opacity-90`}
                onClick={() => setCurrentConfirmation(c.type)}
              >
                {c.title}
              </DialogButton>
              <ConfirmationDialog
                open={currentConfirmation === c.type}
                onOpenChange={open => !open && setCurrentConfirmation(null)}
                title={c.title}
                description={c.description}
                icon={c.icon}
                type={
                  c.type as
                    | 'save'
                    | 'delete'
                    | 'discard'
                    | 'publish'
                    | 'archive'
                }
                onConfirm={() => {
                  alert(`${c.title} confirmed!`);
                  setCurrentConfirmation(null);
                }}
                onCancel={() => setCurrentConfirmation(null)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Recipe Confirmation Dialogs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Recipe Confirmation Dialogs
        </h2>
        <p className="text-gray-600">
          Specialized confirmation dialogs for recipe-specific actions with
          contextual styling and messaging.
        </p>
        <div className="flex flex-wrap gap-2">
          {recipeActions.map(action => (
            <div key={action.action}>
              <DialogButton
                intent="secondary"
                className={`${action.color} border-transparent text-white hover:opacity-90`}
                onClick={() => setCurrentRecipeAction(action.action)}
              >
                {action.label}
              </DialogButton>
              <RecipeConfirmationDialog
                open={currentRecipeAction === action.action}
                onOpenChange={open => !open && setCurrentRecipeAction(null)}
                action={
                  action.action as
                    | 'delete-recipe'
                    | 'save-recipe'
                    | 'publish-recipe'
                    | 'share-recipe'
                    | 'export-recipe'
                    | 'duplicate-recipe'
                }
                recipeName="Chocolate Chip Cookies"
                onConfirm={() => {
                  alert(
                    `${action.label} confirmed for Chocolate Chip Cookies!`
                  );
                  setCurrentRecipeAction(null);
                }}
                onCancel={() => setCurrentRecipeAction(null)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Alert Dialogs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Alert Dialogs</h2>
        <p className="text-gray-600">
          Simple alert dialogs for notifications and single-action
          confirmations.
        </p>
        <div className="flex flex-wrap gap-2">
          {alerts.map(alertItem => (
            <div key={alertItem.variant}>
              <DialogButton
                intent="secondary"
                onClick={() => setCurrentAlert(alertItem.variant)}
              >
                {alertItem.title}
              </DialogButton>
              <AlertDialog
                open={currentAlert === alertItem.variant}
                onOpenChange={open => !open && setCurrentAlert(null)}
                title={alertItem.title}
                description={alertItem.description}
                variant={
                  alertItem.variant as
                    | 'default'
                    | 'success'
                    | 'warning'
                    | 'destructive'
                }
                onAction={() => {
                  alert(`${alertItem.title} acknowledged!`);
                  setCurrentAlert(null);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Dialog with Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Dialog with Icons
        </h2>
        <p className="text-gray-600">
          Enhanced dialogs with icon support for better visual communication.
        </p>
        <div className="flex gap-2">
          <DialogButton onClick={() => setIconDialog(true)}>
            Open Dialog with Icon
          </DialogButton>
        </div>

        <Dialog open={iconDialog} onOpenChange={setIconDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogIcon variant="destructive" className="mb-4">
                <Trash2 className="h-6 w-6" />
              </DialogIcon>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be
                undone and all associated data will be permanently removed from
                our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h4 className="mb-1 font-medium text-red-900">Warning</h4>
                <p className="text-sm text-red-700">
                  This action will permanently delete the item and cannot be
                  reversed.
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogButton
                intent="secondary"
                onClick={() => setIconDialog(false)}
              >
                Cancel
              </DialogButton>
              <DialogButton
                intent="destructive"
                onClick={() => setIconDialog(false)}
              >
                Delete Permanently
              </DialogButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Loading States</h2>
        <p className="text-gray-600">
          Proper handling of loading states during async operations.
        </p>
        <div className="flex gap-2">
          <DialogButton onClick={() => setLoadingDialog(true)}>
            Dialog with Loading
          </DialogButton>
        </div>

        <ConfirmationDialog
          open={loadingDialog}
          onOpenChange={setLoadingDialog}
          title="Process Request"
          description="This action may take a few moments to complete. Please wait for the operation to finish."
          confirmText="Start Processing"
          isLoading={isLoading}
          type="save"
          icon={<Download className="h-6 w-6" />}
          onConfirm={handleLoadingAction}
          onCancel={() => setLoadingDialog(false)}
        />
      </section>

      {/* Accessibility Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Accessibility Features
        </h2>
        <p className="text-gray-600">
          Comprehensive accessibility support with keyboard navigation and
          screen reader compatibility.
        </p>

        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">
            Accessibility Features Include:
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>Focus management and trap within dialog</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>Keyboard navigation (Tab, Shift+Tab, Enter, Escape)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>ARIA attributes and proper roles</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>Screen reader announcements and descriptions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>High contrast focus indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>Backdrop click and escape key handling</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <DialogButton onClick={() => setAccessibilityDialog(true)}>
            Test Keyboard Navigation
          </DialogButton>
        </div>

        <Dialog
          open={accessibilityDialog}
          onOpenChange={setAccessibilityDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessibility Test Dialog</DialogTitle>
              <DialogDescription>
                Try navigating this dialog with your keyboard:
                <br />• Tab to move between focusable elements
                <br />• Enter or Space to activate buttons
                <br />• Escape to close the dialog
                <br />• Screen readers will announce dialog content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div>
                <label
                  htmlFor="test-input"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Test Input Field
                </label>
                <input
                  id="test-input"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Try tabbing here"
                />
              </div>
              <div className="flex gap-2">
                <DialogButton intent="secondary" size="sm">
                  Focusable Button 1
                </DialogButton>
                <DialogButton intent="secondary" size="sm">
                  Focusable Button 2
                </DialogButton>
              </div>
            </div>
            <DialogFooter>
              <DialogButton
                intent="secondary"
                onClick={() => setAccessibilityDialog(false)}
              >
                Cancel
              </DialogButton>
              <DialogButton
                intent="primary"
                onClick={() => setAccessibilityDialog(false)}
              >
                Confirm
              </DialogButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Usage Guidelines */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Usage Guidelines
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-900">
              <CheckCircle className="h-5 w-5" />
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Use clear, actionable titles and descriptions</li>
              <li>• Provide appropriate confirmation buttons for the action</li>
              <li>
                • Use RecipeConfirmationDialog for recipe-specific actions
              </li>
              <li>• Include icons to provide visual context</li>
              <li>• Handle loading states for async operations</li>
              <li>• Test keyboard navigation and screen readers</li>
            </ul>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-900">
              <X className="h-5 w-5" />
              Things to Avoid
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li>• Don&apos;t use dialogs for non-critical information</li>
              <li>• Don&apos;t create deeply nested dialog chains</li>
              <li>• Don&apos;t ignore loading states for slow operations</li>
              <li>
                • Don&apos;t use vague button text like &quot;OK&quot; or
                &quot;Submit&quot;
              </li>
              <li>• Don&apos;t forget to handle the escape key</li>
              <li>• Don&apos;t make dialogs too small for their content</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
