'use client';

import * as React from 'react';
import { UseFormReturn, Controller, useWatch } from 'react-hook-form';
import { Search, UserPlus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useSearchUsers, useSuggestedUsers } from '@/hooks/user-management';
import { useAuthStore } from '@/stores/auth-store';
import { createCollaboratorFormData } from '@/types/collection/create-collection-form';
import { CollaborationMode } from '@/types/recipe-management/common';
import { cn } from '@/lib/utils';
import type {
  CreateCollectionFormData,
  CollaboratorFormData,
  SectionComponentProps,
} from '@/types/collection/create-collection-form';
import { CREATE_COLLECTION_LIMITS } from '@/types/collection/create-collection-form';

/**
 * Props for the CollaboratorPickerSection component.
 */
export interface CollaboratorPickerSectionProps extends SectionComponentProps {
  /** React Hook Form instance */
  form: UseFormReturn<CreateCollectionFormData>;
}

/**
 * CollaboratorPickerSection Component
 *
 * Section for selecting collaborators when using SPECIFIC_USERS mode.
 */
export function CollaboratorPickerSection({
  form,
  isActive = true,
}: CollaboratorPickerSectionProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = form;
  const [searchInput, setSearchInput] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');

  // Watch collaboration mode and collaborators
  const collaborationMode = useWatch({ control, name: 'collaborationMode' });
  const collaborators = useWatch({ control, name: 'collaborators' });

  // Only show this section if collaboration mode is SPECIFIC_USERS
  const isSpecificUsersMode =
    collaborationMode === CollaborationMode.SPECIFIC_USERS;

  // Get current user ID from auth store to filter from search results
  const { user, authUser } = useAuthStore();
  const currentUserId = user?.id ?? authUser?.user_id;

  // Search for users - only triggers when submittedQuery changes (on button click/Enter)
  const {
    data: searchResponse,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchUsers(submittedQuery, { page: 0, size: 10 });

  // Fetch suggested users when no search has been performed
  const {
    data: suggestedResponse,
    isLoading: isSuggestedLoading,
    error: suggestedError,
  } = useSuggestedUsers(5, !submittedQuery && isSpecificUsersMode);

  // Handle search submission
  const handleSearch = React.useCallback(() => {
    if (searchInput.trim().length >= 2) {
      setSubmittedQuery(searchInput.trim());
    }
  }, [searchInput]);

  // Handle Enter key press
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Filter out the current user from search results
  const filteredSearchResults = React.useMemo(() => {
    const results = searchResponse?.results ?? [];
    if (!currentUserId) return results;
    return results.filter(user => user.userId !== currentUserId);
  }, [searchResponse?.results, currentUserId]);

  // Filter out the current user from suggested users
  const filteredSuggestedUsers = React.useMemo(() => {
    const results = suggestedResponse?.results ?? [];
    if (!currentUserId) return results;
    return results.filter(user => user.userId !== currentUserId);
  }, [suggestedResponse?.results, currentUserId]);

  // Create set of selected user IDs for quick lookup
  const selectedUserIds = React.useMemo(
    () => new Set(collaborators.map(c => c.userId)),
    [collaborators]
  );

  // Handle adding a collaborator
  const handleAddCollaborator = React.useCallback(
    (user: { userId: string; username: string; fullName?: string | null }) => {
      if (selectedUserIds.has(user.userId)) return;
      if (collaborators.length >= CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS)
        return;

      const newCollaborator = createCollaboratorFormData({
        userId: user.userId,
        username: user.username,
        displayName: user.fullName ?? undefined,
        avatarUrl: undefined, // UserSearchResult doesn't have avatarUrl
      });

      setValue('collaborators', [...collaborators, newCollaborator], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [collaborators, selectedUserIds, setValue]
  );

  // Handle removing a collaborator
  const handleRemoveCollaborator = React.useCallback(
    (collaboratorId: string) => {
      const updatedCollaborators = collaborators.filter(
        c => c.id !== collaboratorId
      );
      setValue('collaborators', updatedCollaborators, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [collaborators, setValue]
  );

  if (!isActive) return null;

  // If not in SPECIFIC_USERS mode, show informational message
  if (!isSpecificUsersMode) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl">Collaborators</CardTitle>
          <CardDescription>
            Change collaboration mode to &quot;Specific Users&quot; to invite
            collaborators.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="text-muted-foreground bg-muted/50 flex items-center justify-center rounded-lg py-8 text-sm">
            Collaborator selection is only available in &quot;Specific
            Users&quot; mode.
          </div>
        </CardContent>
      </Card>
    );
  }

  const isMaxCollaboratorsReached =
    collaborators.length >= CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Add Collaborators</CardTitle>
        <CardDescription>
          Search for users to invite as collaborators to your collection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Collaborator count and limit indicator */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            {collaborators.length} /{' '}
            {CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS} collaborators selected
          </span>
          {collaborators.length === 0 && isSpecificUsersMode && (
            <span className="text-destructive text-sm">
              At least 1 collaborator required
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="collaborator-search"
                label="Search Users"
                placeholder="Search by username..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                leftIcon={<Search className="h-4 w-4" />}
                disabled={isMaxCollaboratorsReached}
                helperText={
                  isMaxCollaboratorsReached
                    ? 'Maximum collaborators reached. Remove some to add more.'
                    : searchInput.length > 0 && searchInput.length < 2
                      ? 'Enter at least 2 characters to search'
                      : undefined
                }
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSearch}
              disabled={
                isMaxCollaboratorsReached || searchInput.trim().length < 2
              }
              className="mt-6"
              aria-label="Search users"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggested Users (shown when no search performed) */}
        {!submittedQuery && filteredSuggestedUsers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggested Users</h4>
            <div className="border-border max-h-[250px] overflow-y-auto rounded-lg border p-2">
              <UserSearchResults
                users={filteredSuggestedUsers}
                selectedUserIds={selectedUserIds}
                onAddUser={handleAddCollaborator}
                isLoading={isSuggestedLoading}
                error={suggestedError?.message ?? null}
                searchQuery=""
              />
            </div>
          </div>
        )}

        {/* Search Results */}
        {submittedQuery && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Search Results</h4>
            <div className="border-border max-h-[250px] overflow-y-auto rounded-lg border p-2">
              <UserSearchResults
                users={filteredSearchResults}
                selectedUserIds={selectedUserIds}
                onAddUser={handleAddCollaborator}
                isLoading={isSearchLoading}
                error={searchError?.message ?? null}
                searchQuery={submittedQuery}
              />
            </div>
          </div>
        )}

        {/* Selected Collaborators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Collaborators</h4>
          <Controller
            name="collaborators"
            control={control}
            render={() => (
              <SelectedCollaboratorsList
                collaborators={collaborators}
                onRemove={handleRemoveCollaborator}
              />
            )}
          />
          {errors.collaborators?.message && (
            <p className="text-destructive text-sm" role="alert">
              {errors.collaborators.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * User search results sub-component.
 */
interface UserSearchResultsProps {
  users: Array<{ userId: string; username: string; fullName?: string | null }>;
  selectedUserIds: Set<string>;
  onAddUser: (user: {
    userId: string;
    username: string;
    fullName?: string | null;
  }) => void;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

function UserSearchResults({
  users,
  selectedUserIds,
  onAddUser,
  isLoading,
  error,
  searchQuery,
}: UserSearchResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className="space-y-2"
        aria-busy="true"
        aria-label="Loading user search results"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-center"
        role="alert"
      >
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  // Empty state - no results
  if (users.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-6">
        <Search className="mb-2 h-6 w-6 opacity-50" aria-hidden="true" />
        <p className="text-sm">No users found for &quot;{searchQuery}&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" role="list" aria-label="User search results">
      {users.map(user => {
        const isSelected = selectedUserIds.has(user.userId);
        return (
          <div
            key={user.userId}
            role="listitem"
            className={cn(
              'flex items-center gap-3 rounded-md p-2 transition-colors',
              isSelected && 'bg-primary/5'
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {user.username}
              </p>
              {user.fullName && (
                <p className="text-muted-foreground truncate text-xs">
                  {user.fullName}
                </p>
              )}
            </div>
            <Button
              variant={isSelected ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => onAddUser(user)}
              disabled={isSelected}
              aria-label={
                isSelected
                  ? `${user.username} already added`
                  : `Add ${user.username}`
              }
            >
              {isSelected ? (
                <span className="text-xs">Added</span>
              ) : (
                <>
                  <UserPlus className="mr-1 h-3 w-3" aria-hidden="true" />
                  <span className="text-xs">Add</span>
                </>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Selected collaborators list sub-component.
 */
interface SelectedCollaboratorsListProps {
  collaborators: CollaboratorFormData[];
  onRemove: (collaboratorId: string) => void;
}

function SelectedCollaboratorsList({
  collaborators,
  onRemove,
}: SelectedCollaboratorsListProps) {
  if (collaborators.length === 0) {
    return (
      <div
        className="text-muted-foreground bg-muted/50 flex items-center justify-center rounded-lg py-8 text-sm"
        role="status"
      >
        No collaborators selected. Search and add users above.
      </div>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Selected collaborators">
      {collaborators.map(collaborator => (
        <div
          key={collaborator.id}
          role="listitem"
          className="bg-card border-border flex items-center gap-3 rounded-lg border p-3"
        >
          <Avatar className="h-10 w-10">
            {collaborator.avatarUrl && (
              <AvatarImage
                src={collaborator.avatarUrl}
                alt={collaborator.username}
              />
            )}
            <AvatarFallback>
              {collaborator.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-medium">
              {collaborator.username}
            </p>
            {collaborator.displayName && (
              <p className="text-muted-foreground truncate text-sm">
                {collaborator.displayName}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(collaborator.id)}
            aria-label={`Remove ${collaborator.username}`}
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

CollaboratorPickerSection.displayName = 'CollaboratorPickerSection';
