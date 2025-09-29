'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  avatarGroupVariants,
  avatarGroupItemVariants,
  avatarGroupOverflowVariants,
  avatarGroupTooltipVariants,
  avatarGroupLabelVariants,
} from '@/lib/ui/avatar-group';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import type {
  AvatarGroupProps,
  AvatarGroupUser,
  AvatarGroupOverflowProps,
  AvatarGroupWithContextProps,
} from '@/types/ui/avatar-group';

/**
 * AvatarGroupOverflow - Component for displaying overflow count
 */
const AvatarGroupOverflow = React.forwardRef<
  HTMLDivElement,
  AvatarGroupOverflowProps
>(({ count, size = 'md', onClick, className }, ref) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      ref={ref}
      className={cn(
        avatarGroupOverflowVariants({
          size,
          clickable: isClickable,
          layout: 'stacked',
        }),
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={`${count} more ${count === 1 ? 'user' : 'users'}`}
    >
      +{count}
    </div>
  );
});
AvatarGroupOverflow.displayName = 'AvatarGroupOverflow';

/**
 * AvatarGroupItem - Individual avatar with tooltip support
 */
const AvatarGroupItem = React.forwardRef<
  HTMLDivElement,
  {
    user: AvatarGroupUser;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showTooltip?: boolean;
    showStatus?: boolean;
    animated?: boolean;
    layout?: 'stacked' | 'grid' | 'inline';
    onClick?: (user: AvatarGroupUser) => void;
  }
>(
  (
    {
      user,
      size = 'md',
      showTooltip = false,
      showStatus = false,
      animated = false,
      layout = 'stacked',
      onClick,
    },
    ref
  ) => {
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const isClickable = Boolean(onClick);

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
    };

    const getAvatarSize = () => {
      switch (size) {
        case 'xs':
          return 'xs';
        case 'sm':
          return 'sm';
        case 'lg':
          return 'lg';
        case 'xl':
          return 'xl';
        case 'md':
        default:
          return 'default';
      }
    };

    const handleClick = () => {
      if (onClick) {
        onClick(user);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          avatarGroupItemVariants({
            layout,
            animated,
            clickable: isClickable,
          }),
          'relative'
        )}
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={`${user.name}${
          user.role ? ` (${user.role})` : ''
        }${user.verified ? ' - verified' : ''}`}
      >
        <Avatar
          size={getAvatarSize()}
          variant={
            user.role === 'chef'
              ? 'chef'
              : user.role === 'admin'
                ? 'premium'
                : 'default'
          }
        >
          <AvatarImage
            src={user.avatar}
            alt={user.name}
            fallback={
              <AvatarFallback
                size={getAvatarSize()}
                variant={user.role ?? 'default'}
              >
                {getInitials(user.name)}
              </AvatarFallback>
            }
          />
        </Avatar>

        {showStatus && user.status && (
          <div
            className={cn(
              'border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2',
              {
                'bg-online': user.status === 'online',
                'bg-offline': user.status === 'offline',
                'bg-away': user.status === 'away',
                'bg-busy': user.status === 'busy',
              }
            )}
            aria-label={`Status: ${user.status}`}
          />
        )}

        {showTooltip && (
          <div
            className={cn(
              avatarGroupTooltipVariants({
                position: 'top',
                visible: tooltipVisible,
              })
            )}
            role="tooltip"
          >
            {user.name}
            {user.role && (
              <span className="ml-1 opacity-75">({user.role})</span>
            )}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroupItem.displayName = 'AvatarGroupItem';

/**
 * AvatarGroup - Main component for displaying multiple user avatars
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      users,
      max = 4,
      layout = 'stacked',
      size = 'md',
      showTooltip = false,
      showStatus = false,
      animated = false,
      renderOverflow,
      onUserClick,
      onOverflowClick,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const visibleUsers = users.slice(0, max);
    const overflowCount = Math.max(0, users.length - max);

    return (
      <div
        ref={ref}
        className={cn(
          avatarGroupVariants({ layout, size, animated }),
          className
        )}
        role="group"
        aria-label={
          ariaLabel ??
          `Group of ${users.length} ${users.length === 1 ? 'user' : 'users'}`
        }
        {...props}
      >
        {visibleUsers.map(user => (
          <AvatarGroupItem
            key={user.id}
            user={user}
            size={size ?? undefined}
            showTooltip={showTooltip}
            showStatus={showStatus}
            animated={animated}
            layout={layout}
            onClick={onUserClick}
          />
        ))}

        {overflowCount > 0 && (
          <>
            {renderOverflow ? (
              renderOverflow(overflowCount)
            ) : (
              <AvatarGroupOverflow
                count={overflowCount}
                size={size ?? undefined}
                onClick={onOverflowClick}
              />
            )}
          </>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

/**
 * AvatarGroupWithContext - Extended component with context information
 */
const AvatarGroupWithContext = React.forwardRef<
  HTMLDivElement,
  AvatarGroupWithContextProps
>(({ context, className, ...props }, ref) => {
  const getContextLabel = () => {
    if (!context) return null;

    const { type, title, isPublic } = context;
    const typeLabel = type === 'meal-plan' ? 'meal plan' : type;

    if (title) {
      return `Collaborators on ${title}`;
    }

    return `Shared ${typeLabel}${isPublic ? ' (public)' : ''}`;
  };

  const contextLabel = getContextLabel();

  return (
    <div className={cn('flex items-center', className)}>
      {contextLabel && (
        <span
          className={cn(
            avatarGroupLabelVariants({
              position: 'before',
              size: props.size,
            })
          )}
        >
          {contextLabel}:
        </span>
      )}
      <AvatarGroup ref={ref} {...props} />
    </div>
  );
});
AvatarGroupWithContext.displayName = 'AvatarGroupWithContext';

export {
  AvatarGroup,
  AvatarGroupOverflow,
  AvatarGroupItem,
  AvatarGroupWithContext,
};
export type { AvatarGroupProps, AvatarGroupUser, AvatarGroupWithContextProps };
