'use client';

import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToastStore } from '@/stores/ui/toast-store';
import { useCollections } from '@/hooks/recipe-management/useCollections';
import { useAddRecipeToCollection } from '@/hooks/recipe-management/useCollectionRecipes';
import { useCreateCollection } from '@/hooks/recipe-management/useCollections';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

/**
 * Props for AddToCollectionModal component
 */
export interface AddToCollectionModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** The recipe to add to a collection */
  recipe: RecipeCardRecipe;
}

/**
 * AddToCollectionModal Component
 *
 * Modal for adding a recipe to an existing collection or creating a new collection.
 * Displays user's collections and allows selecting one or creating a new collection with basic settings.
 *
 * @example
 * ```tsx
 * <AddToCollectionModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   recipe={recipe}
 * />
 * ```
 */
export const AddToCollectionModal = React.forwardRef<
  HTMLDivElement,
  AddToCollectionModalProps
>(({ open, onOpenChange, recipe }, ref) => {
  const { addSuccessToast, addErrorToast } = useToastStore();

  // State for toggling between "select existing" and "create new" modes
  const [mode, setMode] = React.useState<'select' | 'create'>('select');
  const [selectedCollectionId, setSelectedCollectionId] = React.useState<
    number | null
  >(null);

  // State for new collection form
  const [newCollectionName, setNewCollectionName] = React.useState('');
  const [newCollectionDescription, setNewCollectionDescription] =
    React.useState('');
  const [newCollectionVisibility, setNewCollectionVisibility] =
    React.useState<CollectionVisibility>(CollectionVisibility.PRIVATE);
  const [newCollectionCollabMode, setNewCollectionCollabMode] =
    React.useState<CollaborationMode>(CollaborationMode.OWNER_ONLY);

  // Fetch user's collections
  const {
    data: collectionsPage,
    isLoading: isLoadingCollections,
    isError: isCollectionsError,
  } = useCollections({ page: 0, size: 50 });

  const collections = React.useMemo(
    () => collectionsPage?.content ?? [],
    [collectionsPage?.content]
  );

  // Mutations
  const addToCollectionMutation = useAddRecipeToCollection();
  const createCollectionMutation = useCreateCollection();

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
    // Reset state on close
    setTimeout(() => {
      setMode('select');
      setSelectedCollectionId(null);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setNewCollectionVisibility(CollectionVisibility.PRIVATE);
      setNewCollectionCollabMode(CollaborationMode.OWNER_ONLY);
    }, 300);
  }, [onOpenChange]);

  const handleAddToExisting = React.useCallback(async () => {
    if (!selectedCollectionId) {
      addErrorToast('Please select a collection');
      return;
    }

    try {
      await addToCollectionMutation.mutateAsync({
        collectionId: selectedCollectionId,
        recipeId: recipe.recipeId,
      });

      const collectionName =
        collections.find(c => c.collectionId === selectedCollectionId)?.name ??
        'collection';

      addSuccessToast(`Recipe added to "${collectionName}"`, {
        duration: 3000,
      });
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add recipe';
      addErrorToast(errorMessage, { duration: 5000 });
    }
  }, [
    selectedCollectionId,
    recipe.recipeId,
    collections,
    addToCollectionMutation,
    addSuccessToast,
    addErrorToast,
    handleClose,
  ]);

  const handleCreateAndAdd = React.useCallback(async () => {
    if (!newCollectionName.trim()) {
      addErrorToast('Collection name is required');
      return;
    }

    try {
      // Create the collection first
      const newCollection = await createCollectionMutation.mutateAsync({
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || undefined,
        visibility: newCollectionVisibility,
        collaborationMode: newCollectionCollabMode,
      });

      // Add the recipe to the newly created collection
      await addToCollectionMutation.mutateAsync({
        collectionId: newCollection.collectionId,
        recipeId: recipe.recipeId,
      });

      addSuccessToast(
        `Collection "${newCollectionName}" created and recipe added`,
        { duration: 3000 }
      );
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create collection and add recipe';
      addErrorToast(errorMessage, { duration: 5000 });
    }
  }, [
    newCollectionName,
    newCollectionDescription,
    newCollectionVisibility,
    newCollectionCollabMode,
    recipe.recipeId,
    createCollectionMutation,
    addToCollectionMutation,
    addSuccessToast,
    addErrorToast,
    handleClose,
  ]);

  const isSubmitting =
    addToCollectionMutation.isPending || createCollectionMutation.isPending;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent ref={ref} size="lg" showClose>
        <ModalHeader>
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" aria-hidden="true" />
            <ModalTitle>Add to Collection</ModalTitle>
          </div>
          <ModalDescription>
            Add &quot;{recipe.title}&quot; to a collection
          </ModalDescription>
        </ModalHeader>

        <ModalBody scrollable>
          {/* Recipe Preview */}
          <div className="border-border bg-muted/50 mb-4 rounded-lg border p-3">
            <div className="flex gap-3">
              {recipe.imageUrl && (
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground truncate text-sm font-medium">
                  {recipe.title}
                </h4>
                {recipe.description && (
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                    {recipe.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant={mode === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('select')}
              disabled={isSubmitting}
            >
              Select Existing
            </Button>
            <Button
              type="button"
              variant={mode === 'create' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('create')}
              disabled={isSubmitting}
            >
              <Plus className="mr-1 h-4 w-4" />
              Create New
            </Button>
          </div>

          {/* Select Existing Collection Mode */}
          {mode === 'select' && (
            <div className="space-y-3">
              {isLoadingCollections ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isCollectionsError ? (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Failed to load collections. Please try again.
                  </p>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <FolderPlus className="h-12 w-12 opacity-50" />
                  <p className="text-sm">No collections found</p>
                  <p className="text-xs">
                    Create your first collection to organize your recipes
                  </p>
                </div>
              ) : (
                <div className="h-[240px] overflow-y-auto">
                  <div className="space-y-2 pr-4">
                    {collections.map(collection => (
                      <button
                        key={collection.collectionId}
                        type="button"
                        onClick={() =>
                          setSelectedCollectionId(collection.collectionId)
                        }
                        disabled={isSubmitting}
                        className={`border-border hover:bg-accent focus-visible:ring-ring w-full rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                          selectedCollectionId === collection.collectionId
                            ? 'bg-accent border-primary'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h5 className="truncate text-sm font-medium">
                              {collection.name}
                            </h5>
                            {collection.description && (
                              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                                {collection.description}
                              </p>
                            )}
                            <p className="text-muted-foreground mt-1 text-xs">
                              {collection.recipeCount}{' '}
                              {collection.recipeCount === 1
                                ? 'recipe'
                                : 'recipes'}
                            </p>
                          </div>
                          {selectedCollectionId === collection.collectionId && (
                            <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create New Collection Mode */}
          {mode === 'create' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="collection-name"
                  className="text-sm font-medium"
                >
                  Collection Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="collection-name"
                  type="text"
                  placeholder="e.g., Summer Favorites, Quick Dinners"
                  value={newCollectionName}
                  onChange={e => setNewCollectionName(e.target.value)}
                  disabled={isSubmitting}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="collection-description"
                  className="text-sm font-medium"
                >
                  Description (optional)
                </label>
                <Input
                  id="collection-description"
                  type="text"
                  placeholder="Add a description for your collection"
                  value={newCollectionDescription}
                  onChange={e => setNewCollectionDescription(e.target.value)}
                  disabled={isSubmitting}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="collection-visibility"
                  className="text-sm font-medium"
                >
                  Visibility
                </label>
                <Select
                  value={newCollectionVisibility}
                  onValueChange={value =>
                    setNewCollectionVisibility(value as CollectionVisibility)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="collection-visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="FRIENDS_ONLY">Friends Only</SelectItem>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="collection-collab-mode"
                  className="text-sm font-medium"
                >
                  Collaboration Mode
                </label>
                <Select
                  value={newCollectionCollabMode}
                  onValueChange={value =>
                    setNewCollectionCollabMode(value as CollaborationMode)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="collection-collab-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER_ONLY">Owner Only</SelectItem>
                    <SelectItem value="SPECIFIC_USERS">
                      Specific Users
                    </SelectItem>
                    <SelectItem value="ALL_USERS">All Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {mode === 'select' ? (
            <Button
              onClick={handleAddToExisting}
              disabled={!selectedCollectionId || isSubmitting}
              loading={isSubmitting}
            >
              Add to Collection
            </Button>
          ) : (
            <Button
              onClick={handleCreateAndAdd}
              disabled={!newCollectionName.trim() || isSubmitting}
              loading={isSubmitting}
            >
              Create & Add Recipe
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

AddToCollectionModal.displayName = 'AddToCollectionModal';
