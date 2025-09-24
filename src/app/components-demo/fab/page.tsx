'use client';

import React, { useState } from 'react';
import {
  FloatingActionButton,
  SpeedDial,
  FABGroup,
} from '@/components/ui/floating-action-button';
import type { SpeedDialAction } from '@/types/ui/floating-action-button';
import {
  Plus,
  Edit,
  Trash,
  Share,
  Heart,
  Download,
  Camera,
  Search,
  Filter,
  Settings,
  ChefHat,
  BookOpen,
  Clock,
  ShoppingCart,
  Sparkles,
  Copy,
  Save,
  Check,
  Menu,
} from 'lucide-react';

export default function FABDemoPage() {
  const [loading, setLoading] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const handleFABClick = () => {
    setNotification('FAB clicked!');
    setTimeout(() => setNotification(''), 2000);
  };

  const handleAsyncClick = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setNotification('Action completed!');
    setTimeout(() => setNotification(''), 2000);
  };

  const speedDialActions: SpeedDialAction[] = [
    {
      id: 'manual',
      icon: <Edit className="h-5 w-5" />,
      label: 'Create Manually',
      onClick: () => setNotification('Create manually clicked'),
    },
    {
      id: 'import',
      icon: <Download className="h-5 w-5" />,
      label: 'Import from URL',
      onClick: () => setNotification('Import from URL clicked'),
    },
    {
      id: 'camera',
      icon: <Camera className="h-5 w-5" />,
      label: 'Scan Recipe',
      onClick: () => setNotification('Scan recipe clicked'),
    },
    {
      id: 'ai',
      icon: <Sparkles className="h-5 w-5" />,
      label: 'Generate with AI',
      onClick: () => setNotification('Generate with AI clicked'),
    },
  ];

  const recipeSpeedDialActions: SpeedDialAction[] = [
    {
      id: 'edit',
      icon: <Edit className="h-4 w-4" />,
      label: 'Edit Recipe',
      onClick: () => setNotification('Edit recipe'),
    },
    {
      id: 'share',
      icon: <Share className="h-4 w-4" />,
      label: 'Share Recipe',
      onClick: () => setNotification('Share recipe'),
    },
    {
      id: 'copy',
      icon: <Copy className="h-4 w-4" />,
      label: 'Duplicate Recipe',
      onClick: () => setNotification('Duplicate recipe'),
    },
    {
      id: 'delete',
      icon: <Trash className="h-4 w-4" />,
      label: 'Delete Recipe',
      onClick: () => setNotification('Delete recipe'),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          Floating Action Button
        </h1>
        <p className="text-muted-foreground text-lg">
          Quick access to primary actions with Material Design-inspired floating
          buttons
        </p>
      </header>

      {/* Notification */}
      {notification && (
        <div className="bg-primary text-primary-foreground animate-in fade-in slide-in-from-top-2 fixed top-4 left-1/2 z-[100] -translate-x-1/2 transform rounded-md px-4 py-2 shadow-lg">
          {notification}
        </div>
      )}

      {/* Basic Variants Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Basic Variants</h2>
        <div className="bg-surface/50 border-border relative rounded-lg border p-32">
          <div className="text-muted-foreground absolute top-4 left-4 text-sm">
            Click any FAB to see interaction
          </div>

          {/* Primary */}
          <FloatingActionButton
            icon={<Plus className="h-5 w-5" />}
            variant="primary"
            position="bottom-right"
            onClick={handleFABClick}
            ariaLabel="Add recipe"
            usePortal={false}
          />

          {/* Secondary */}
          <FloatingActionButton
            icon={<Search className="h-5 w-5" />}
            variant="secondary"
            position="bottom-left"
            onClick={handleFABClick}
            ariaLabel="Search recipes"
            usePortal={false}
          />

          {/* Success */}
          <FloatingActionButton
            icon={<Check className="h-5 w-5" />}
            variant="success"
            position="top-right"
            onClick={handleFABClick}
            ariaLabel="Success action"
            usePortal={false}
          />

          {/* Destructive */}
          <FloatingActionButton
            icon={<Trash className="h-5 w-5" />}
            variant="destructive"
            position="top-left"
            onClick={handleFABClick}
            ariaLabel="Delete item"
            usePortal={false}
          />
        </div>
      </section>

      {/* Size Variations */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Size Variations</h2>
        <div className="bg-surface/50 border-border flex items-center gap-8 rounded-lg border p-8">
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Small (40px)</p>
            <FloatingActionButton
              icon={<Plus className="h-4 w-4" />}
              size="sm"
              onClick={handleFABClick}
              ariaLabel="Small FAB"
              usePortal={false}
              className="position-static relative"
            />
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Medium (56px)</p>
            <FloatingActionButton
              icon={<Plus className="h-5 w-5" />}
              size="md"
              onClick={handleFABClick}
              ariaLabel="Medium FAB"
              usePortal={false}
              className="position-static relative"
            />
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Large (64px)</p>
            <FloatingActionButton
              icon={<Plus className="h-6 w-6" />}
              size="lg"
              onClick={handleFABClick}
              ariaLabel="Large FAB"
              usePortal={false}
              className="position-static relative"
            />
          </div>
        </div>
      </section>

      {/* Extended FAB */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Extended FAB</h2>
        <div className="bg-surface/50 border-border flex flex-wrap gap-4 rounded-lg border p-8">
          <FloatingActionButton
            icon={<Plus className="h-5 w-5" />}
            label="Add Recipe"
            extended
            variant="primary"
            onClick={handleFABClick}
            ariaLabel="Add new recipe"
            usePortal={false}
            className="position-static relative"
          />
          <FloatingActionButton
            icon={<ChefHat className="h-5 w-5" />}
            label="Quick Cook"
            extended
            variant="secondary"
            onClick={handleFABClick}
            usePortal={false}
            className="position-static relative"
          />
          <FloatingActionButton
            icon={<BookOpen className="h-5 w-5" />}
            label="Browse Recipes"
            extended
            variant="outline"
            onClick={handleFABClick}
            usePortal={false}
            className="position-static relative"
          />
        </div>
      </section>

      {/* Loading State */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Loading State</h2>
        <div className="bg-surface/50 border-border flex gap-4 rounded-lg border p-8">
          <FloatingActionButton
            icon={<Save className="h-5 w-5" />}
            loading={loading}
            onClick={handleAsyncClick}
            ariaLabel="Save with loading"
            usePortal={false}
            className="position-static relative"
          />
          <FloatingActionButton
            icon={<Save className="h-5 w-5" />}
            label="Save Recipe"
            extended
            loading={loading}
            onClick={handleAsyncClick}
            ariaLabel="Save recipe with loading"
            usePortal={false}
            className="position-static relative"
          />
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          Click to simulate a 2-second async operation
        </p>
      </section>

      {/* Speed Dial */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Speed Dial</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Upward Speed Dial */}
          <div className="bg-surface/50 border-border relative h-64 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">Direction: Up</p>
            <SpeedDial
              actions={speedDialActions}
              icon={<Plus className="h-5 w-5" />}
              direction="up"
              position="bottom-right"
              usePortal={false}
              ariaLabel="Recipe actions"
            />
          </div>

          {/* Right Speed Dial */}
          <div className="bg-surface/50 border-border relative h-64 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Direction: Right
            </p>
            <SpeedDial
              actions={recipeSpeedDialActions}
              icon={<Menu className="h-5 w-5" />}
              direction="right"
              position="bottom-left"
              size="sm"
              variant="secondary"
              usePortal={false}
              ariaLabel="Recipe menu"
            />
          </div>
        </div>
      </section>

      {/* Controlled Speed Dial */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Controlled Speed Dial</h2>
        <div className="bg-surface/50 border-border relative h-64 rounded-lg border p-4">
          <div className="mb-4">
            <button
              onClick={() => setSpeedDialOpen(!speedDialOpen)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
            >
              {speedDialOpen ? 'Close' : 'Open'} Speed Dial
            </button>
          </div>
          <SpeedDial
            actions={speedDialActions}
            open={speedDialOpen}
            onOpenChange={setSpeedDialOpen}
            icon={<Settings className="h-5 w-5" />}
            variant="outline"
            position="bottom-right"
            usePortal={false}
            ariaLabel="Controlled speed dial"
          />
        </div>
      </section>

      {/* FAB Group Demo */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">FAB Group (Manual Demo)</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Vertical Group */}
          <div className="bg-surface/50 border-border relative h-64 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">Vertical Stack</p>
            <div className="absolute right-4 bottom-4 flex flex-col items-center gap-3">
              <FloatingActionButton
                icon={<Filter className="h-4 w-4" />}
                size="sm"
                variant="surface"
                onClick={() => setNotification('Filter clicked')}
                ariaLabel="Filter recipes"
                usePortal={false}
                className="position-static relative"
              />
              <FloatingActionButton
                icon={<Plus className="h-5 w-5" />}
                size="md"
                variant="primary"
                onClick={() => setNotification('Add clicked')}
                ariaLabel="Add recipe"
                usePortal={false}
                className="position-static relative"
              />
            </div>
          </div>

          {/* Horizontal Group */}
          <div className="bg-surface/50 border-border relative h-64 rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Horizontal Stack
            </p>
            <div className="absolute right-4 bottom-4 flex flex-row gap-3">
              <FloatingActionButton
                icon={<Heart className="h-4 w-4" />}
                size="sm"
                variant="destructive"
                onClick={() => setNotification('Favorite clicked')}
                ariaLabel="Add to favorites"
                usePortal={false}
                className="position-static relative"
              />
              <FloatingActionButton
                icon={<Share className="h-4 w-4" />}
                size="sm"
                variant="secondary"
                onClick={() => setNotification('Share clicked')}
                ariaLabel="Share recipe"
                usePortal={false}
                className="position-static relative"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real FAB Group */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Real FAB Group (Portal)</h2>
        <div className="bg-surface/50 border-border rounded-lg border p-8">
          <p className="text-muted-foreground mb-4 text-sm">
            The actual FABGroup component renders at bottom-right of viewport
          </p>
          <button
            onClick={() =>
              setNotification('Check bottom-right of your screen!')
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
          >
            Show Real FAB Group
          </button>
          <FABGroup position="bottom-right" direction="vertical" spacing={12}>
            <FloatingActionButton
              icon={<Settings className="h-4 w-4" />}
              size="sm"
              variant="outline"
              onClick={() => setNotification('Settings clicked')}
              ariaLabel="Settings"
            />
            <FloatingActionButton
              icon={<Plus className="h-5 w-5" />}
              size="md"
              variant="primary"
              onClick={() => setNotification('Main action clicked')}
              ariaLabel="Main action"
            />
          </FABGroup>
        </div>
      </section>

      {/* Recipe App Examples */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Recipe App Examples</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Recipe List FAB */}
          <div className="bg-surface/50 border-border relative h-48 rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">Recipe List View</p>
            <p className="text-muted-foreground text-xs">Primary add action</p>
            <div className="absolute right-4 bottom-4">
              <FloatingActionButton
                icon={<Plus className="h-5 w-5" />}
                variant="primary"
                onClick={() => setNotification('Navigate to new recipe')}
                tooltipLabel="Add new recipe"
                usePortal={false}
                className="position-static relative"
              />
            </div>
          </div>

          {/* Recipe Detail FAB */}
          <div className="bg-surface/50 border-border relative h-48 rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">Recipe Detail View</p>
            <p className="text-muted-foreground text-xs">Quick actions menu</p>
            <div className="absolute right-4 bottom-4">
              <SpeedDial
                actions={[
                  {
                    id: 'cook',
                    icon: <ChefHat className="h-4 w-4" />,
                    label: 'Start Cooking',
                    onClick: () => setNotification('Start cooking mode'),
                  },
                  {
                    id: 'cart',
                    icon: <ShoppingCart className="h-4 w-4" />,
                    label: 'Add to List',
                    onClick: () => setNotification('Added to shopping list'),
                  },
                  {
                    id: 'timer',
                    icon: <Clock className="h-4 w-4" />,
                    label: 'Set Timer',
                    onClick: () => setNotification('Timer set'),
                  },
                ]}
                size="sm"
                variant="primary"
                usePortal={false}
                ariaLabel="Recipe actions"
                className="position-static relative"
              />
            </div>
          </div>

          {/* Meal Plan FAB */}
          <div className="bg-surface/50 border-border relative h-48 rounded-lg border p-4">
            <p className="mb-2 text-sm font-medium">Meal Planner</p>
            <p className="text-muted-foreground text-xs">Extended with label</p>
            <div className="absolute right-4 bottom-4">
              <FloatingActionButton
                icon={<Plus className="h-5 w-5" />}
                label="Plan Meal"
                extended
                variant="success"
                onClick={() => setNotification('Open meal planner')}
                usePortal={false}
                className="position-static relative"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Disabled State</h2>
        <div className="bg-surface/50 border-border flex gap-4 rounded-lg border p-8">
          <FloatingActionButton
            icon={<Plus className="h-5 w-5" />}
            disabled
            ariaLabel="Disabled FAB"
            usePortal={false}
            className="position-static relative"
          />
          <FloatingActionButton
            icon={<Edit className="h-5 w-5" />}
            label="Edit Recipe"
            extended
            disabled
            ariaLabel="Disabled extended FAB"
            usePortal={false}
            className="position-static relative"
          />
        </div>
      </section>

      {/* Custom Styling */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Custom Styling</h2>
        <div className="bg-surface/50 border-border flex gap-4 rounded-lg border p-8">
          <FloatingActionButton
            icon={<Heart className="h-5 w-5" />}
            className="position-static relative bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            onClick={handleFABClick}
            ariaLabel="Custom gradient FAB"
            usePortal={false}
          />
          <FloatingActionButton
            icon={<Sparkles className="h-5 w-5" />}
            className="position-static relative bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            onClick={handleFABClick}
            ariaLabel="Custom gradient FAB 2"
            usePortal={false}
          />
        </div>
      </section>
    </div>
  );
}
