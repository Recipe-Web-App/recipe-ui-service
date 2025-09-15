import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  avatarVariants,
  avatarImageVariants,
  avatarFallbackVariants,
  avatarStatusVariants,
  avatarGroupVariants,
  recipeAuthorVariants,
} from '@/lib/ui/avatar-variants';

/**
 * Avatar root component props interface
 */
export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

/**
 * Avatar root component
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarVariants({ size, variant, className }))}
      {...props}
    />
  )
);
Avatar.displayName = 'Avatar';

/**
 * Avatar image component props interface
 */
export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

/**
 * Avatar image component with fallback support
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, fallback, onError, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(event);
      },
      [onError]
    );

    React.useEffect(() => {
      setHasError(false);
    }, [src]);

    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element -- Avatar component needs precise error handling control
      <img
        ref={ref}
        className={cn(avatarImageVariants({ className }))}
        src={src}
        alt={alt}
        onError={handleError}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = 'AvatarImage';

/**
 * Avatar fallback component props interface
 */
export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarFallbackVariants> {}

/**
 * Avatar fallback component for initials or icons
 */
const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, size, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarFallbackVariants({ size, variant, className }))}
      {...props}
    >
      {children}
    </div>
  )
);
AvatarFallback.displayName = 'AvatarFallback';

/**
 * Avatar status indicator component props interface
 */
export interface AvatarStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStatusVariants> {
  'aria-label'?: string;
}

/**
 * Avatar status indicator component
 */
const AvatarStatus = React.forwardRef<HTMLDivElement, AvatarStatusProps>(
  ({ className, size, status, 'aria-label': ariaLabel, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarStatusVariants({ size, status, className }))}
      aria-label={ariaLabel}
      role="img"
      {...props}
    />
  )
);
AvatarStatus.displayName = 'AvatarStatus';

/**
 * Avatar group component props interface
 */
export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  children: React.ReactNode;
  showCount?: boolean;
  totalCount?: number;
}

/**
 * Avatar group component for displaying multiple avatars
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      children,
      size,
      max = 4,
      showCount = true,
      totalCount,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);
    const maxCount = max ?? 4;
    const visibleChildren = childrenArray.slice(0, maxCount);
    const remainingCount = totalCount
      ? totalCount - maxCount
      : Math.max(0, childrenArray.length - maxCount);

    return (
      <div
        ref={ref}
        className={cn(avatarGroupVariants({ size, max, className }))}
        {...props}
      >
        {visibleChildren}
        {showCount && remainingCount > 0 && (
          <Avatar size={size} variant="outlined">
            <AvatarFallback size={size} variant="default">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

/**
 * User avatar component props interface for specific user types
 */
export interface UserAvatarProps extends Omit<AvatarProps, 'variant'> {
  src?: string;
  alt?: string;
  name: string;
  role?: 'user' | 'chef' | 'admin' | 'guest';
  status?:
    | 'online'
    | 'offline'
    | 'away'
    | 'busy'
    | 'verified'
    | 'chef'
    | 'premium';
  showStatus?: boolean;
  fallbackVariant?: VariantProps<typeof avatarFallbackVariants>['variant'];
}

/**
 * User avatar component with automatic initials and status
 */
const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  (
    {
      src,
      alt,
      name,
      role = 'user',
      status,
      showStatus = false,
      size,
      fallbackVariant,
      className,
      ...props
    },
    ref
  ) => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
    };

    const getAvatarVariant = () => {
      switch (role) {
        case 'chef':
          return 'chef';
        case 'admin':
          return 'premium';
        default:
          return 'default';
      }
    };

    const getFallbackVariant = () => {
      return fallbackVariant ?? role;
    };

    return (
      <Avatar
        ref={ref}
        size={size}
        variant={getAvatarVariant()}
        className={className}
        {...props}
      >
        <AvatarImage
          src={src}
          alt={alt ?? `${name} avatar`}
          fallback={
            <AvatarFallback size={size} variant={getFallbackVariant()}>
              {getInitials(name)}
            </AvatarFallback>
          }
        />
        {showStatus && status && (
          <AvatarStatus
            size={size}
            status={status}
            aria-label={`${name} is ${status}`}
          />
        )}
      </Avatar>
    );
  }
);
UserAvatar.displayName = 'UserAvatar';

/**
 * Recipe author component props interface
 */
export interface RecipeAuthorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof recipeAuthorVariants> {
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: 'user' | 'chef' | 'admin';
    verified?: boolean;
    rating?: number;
    recipeCount?: number;
  };
  showStats?: boolean;
  showRole?: boolean;
  avatarSize?: VariantProps<typeof avatarVariants>['size'];
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * Recipe author component for displaying recipe creators
 */
const RecipeAuthor = React.forwardRef<HTMLDivElement, RecipeAuthorProps>(
  (
    {
      className,
      author,
      showStats = true,
      showRole = true,
      avatarSize = 'default',
      interactive = false,
      onClick,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const getStatusFromRole = () => {
      if (author.verified) return 'verified';
      if (author.role === 'chef') return 'chef';
      return undefined;
    };

    const getRoleDisplay = () => {
      switch (author.role) {
        case 'chef':
          return '👨‍🍳 Chef';
        case 'admin':
          return '👑 Admin';
        default:
          return 'Home Cook';
      }
    };

    if (interactive) {
      return (
        <button
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
          className={cn(
            recipeAuthorVariants({ variant, size, className }),
            'cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          )}
          onClick={onClick}
          type="button"
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          <UserAvatar
            name={author.name}
            src={author.avatar}
            role={author.role}
            size={avatarSize}
            status={getStatusFromRole()}
            showStatus={Boolean(author.verified) || author.role === 'chef'}
          />

          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{author.name}</h4>
              {author.verified && (
                <svg
                  className="h-4 w-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            {showRole && (
              <p className="text-sm text-gray-600">{getRoleDisplay()}</p>
            )}

            {showStats && (
              <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                {author.rating && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-3 w-3 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {author.rating.toFixed(1)}
                  </span>
                )}
                {author.recipeCount && (
                  <span>{author.recipeCount} recipes</span>
                )}
              </div>
            )}
          </div>
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(recipeAuthorVariants({ variant, size, className }))}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        <UserAvatar
          name={author.name}
          src={author.avatar}
          role={author.role}
          size={avatarSize}
          status={getStatusFromRole()}
          showStatus={Boolean(author.verified) || author.role === 'chef'}
        />

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">{author.name}</h4>
            {author.verified && (
              <svg
                className="h-4 w-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {showRole && (
            <p className="text-sm text-gray-600">{getRoleDisplay()}</p>
          )}

          {showStats && (
            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
              {author.rating && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-3 w-3 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {author.rating.toFixed(1)}
                </span>
              )}
              {author.recipeCount && <span>{author.recipeCount} recipes</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
);
RecipeAuthor.displayName = 'RecipeAuthor';

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
  UserAvatar,
  RecipeAuthor,
};
