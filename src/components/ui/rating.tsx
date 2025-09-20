'use client';

import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import { Star, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ratingVariants, ratingItemVariants } from '@/lib/ui/rating-variants';
import {
  type RatingProps,
  type RatingItemProps,
} from '@/types/ui/rating.types';

const RatingItem = React.memo(
  forwardRef<HTMLButtonElement, RatingItemProps>(
    (
      {
        index,
        filled,
        halfFilled = false,
        interactive,
        disabled,
        size,
        type,
        variant,
        onRate,
        onHover,
        'aria-label': ariaLabel,
        ...props
      },
      ref
    ) => {
      const [isHovered, setIsHovered] = useState(false);
      const [isHalfHovered, setIsHalfHovered] = useState(false);

      const handleClick = useCallback(
        (event?: React.MouseEvent) => {
          if (!interactive || disabled || !onRate) return;

          // For stars and hearts with half precision, check click position
          if ((type === 'star' || type === 'heart') && event && interactive) {
            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const isLeftHalf = clickX < rect.width / 2;

            if (isLeftHalf) {
              onRate(index + 0.5);
            } else {
              onRate(index + 1);
            }
          } else {
            onRate(index + 1);
          }
        },
        [interactive, disabled, onRate, index, type]
      );

      const handleMouseMove = useCallback(
        (event: React.MouseEvent) => {
          if (!interactive || disabled) return;

          // For stars and hearts, check mouse position for half-hover effect
          if (type === 'star' || type === 'heart') {
            const rect = event.currentTarget.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const isLeftHalf = mouseX < rect.width / 2;

            setIsHalfHovered(isLeftHalf);
            setIsHovered(true);
            onHover?.(index + (isLeftHalf ? 0.5 : 1));
          } else {
            setIsHovered(true);
            setIsHalfHovered(false);
            onHover?.(index + 1);
          }
        },
        [interactive, disabled, onHover, index, type]
      );

      const handleMouseEnter = useCallback(
        (event: React.MouseEvent) => {
          if (!interactive || disabled) return;
          handleMouseMove(event);
        },
        [interactive, disabled, handleMouseMove]
      );

      const handleMouseLeave = useCallback(() => {
        if (!interactive || disabled) return;
        setIsHovered(false);
        setIsHalfHovered(false);
        onHover?.(null);
      }, [interactive, disabled, onHover]);

      const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
          if (!interactive || disabled) return;

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        },
        [interactive, disabled, handleClick]
      );

      const getIcon = () => {
        const shouldShowHalfHover =
          interactive && isHovered && isHalfHovered && !filled;
        const shouldShowFullHover =
          interactive && isHovered && !isHalfHovered && !filled;

        const baseState = (() => {
          if (filled) return 'filled';
          if (shouldShowHalfHover) return 'unfilled'; // Keep base unfilled for half hover
          if (shouldShowFullHover) return 'hover';
          if (interactive && isHovered) return 'hover';
          return 'unfilled';
        })();

        const iconProps = {
          className: cn(
            ratingItemVariants({
              size,
              type,
              variant,
              state: baseState,
              interactive,
            })
          ),
          'aria-hidden': true,
        };

        switch (type) {
          case 'star':
            if (
              (halfFilled && !filled) ||
              shouldShowHalfHover ||
              shouldShowFullHover
            ) {
              const overlayState =
                shouldShowHalfHover || shouldShowFullHover ? 'hover' : 'filled';
              const clipPath =
                shouldShowHalfHover || (halfFilled && !filled)
                  ? 'inset(0 50% 0 0)'
                  : 'inset(0 0 0 0)';
              const overlayIconProps = {
                className: cn(
                  ratingItemVariants({
                    size,
                    type,
                    variant,
                    state: overlayState,
                    interactive,
                  })
                ),
                'aria-hidden': true,
              };
              return (
                <div className="relative">
                  <Star {...iconProps} fill="none" />
                  <Star
                    {...overlayIconProps}
                    fill="currentColor"
                    className={cn(
                      overlayIconProps.className,
                      'absolute inset-0'
                    )}
                    style={{ clipPath }}
                  />
                </div>
              );
            }
            return (
              <Star {...iconProps} fill={filled ? 'currentColor' : 'none'} />
            );
          case 'heart':
            if (
              (halfFilled && !filled) ||
              shouldShowHalfHover ||
              shouldShowFullHover
            ) {
              const overlayState =
                shouldShowHalfHover || shouldShowFullHover ? 'hover' : 'filled';
              const clipPath =
                shouldShowHalfHover || (halfFilled && !filled)
                  ? 'inset(0 50% 0 0)'
                  : 'inset(0 0 0 0)';
              const overlayIconProps = {
                className: cn(
                  ratingItemVariants({
                    size,
                    type,
                    variant,
                    state: overlayState,
                    interactive,
                  })
                ),
                'aria-hidden': true,
              };
              return (
                <div className="relative">
                  <Heart {...iconProps} fill="none" />
                  <Heart
                    {...overlayIconProps}
                    fill="currentColor"
                    className={cn(
                      overlayIconProps.className,
                      'absolute inset-0'
                    )}
                    style={{ clipPath }}
                  />
                </div>
              );
            }
            return (
              <Heart {...iconProps} fill={filled ? 'currentColor' : 'none'} />
            );
          case 'thumbs':
            return index === 0 ? (
              <ThumbsUp
                {...iconProps}
                fill={filled ? 'currentColor' : 'none'}
              />
            ) : (
              <ThumbsDown
                {...iconProps}
                fill={filled ? 'currentColor' : 'none'}
              />
            );
          case 'numeric':
            return (
              <span
                className={cn(
                  ratingItemVariants({
                    size,
                    type,
                    variant,
                    state: baseState,
                    interactive,
                  })
                )}
              >
                {index + 1}
              </span>
            );
          default:
            return null;
        }
      };

      if (!interactive) {
        return (
          <span role="img" aria-label={ariaLabel}>
            {getIcon()}
          </span>
        );
      }

      return (
        <button
          ref={ref}
          type="button"
          onClick={e => handleClick(e)}
          onMouseEnter={e => handleMouseEnter(e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'focus:ring-primary rounded-sm transition-transform focus:ring-2 focus:ring-offset-1 focus:outline-none',
            interactive && 'hover:scale-110 active:scale-95',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          {...props}
        >
          {getIcon()}
        </button>
      );
    }
  )
);

RatingItem.displayName = 'RatingItem';

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      maxValue = 5,
      precision = 'full',
      interactive = false,
      disabled = false,
      readOnly = false,
      showTooltip: _showTooltip = false,
      showValue = false,
      showLabel = false,
      label,
      className,
      size = 'md',
      type = 'star',
      variant = 'default',
      onChange,
      onHover,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const isInteractive = interactive && !disabled && !readOnly;
    const displayValue = hoverValue ?? value;

    const getThumbsLabel = (index: number) =>
      index === 0 ? 'Thumbs up' : 'Thumbs down';

    const items = useMemo(() => {
      const itemCount = type === 'thumbs' ? 2 : maxValue;
      return Array.from({ length: itemCount }, (_, index) => {
        const itemValue = index + 1;
        let filled = false;
        let halfFilled = false;

        if (type === 'thumbs') {
          // For thumbs: index 0 = thumbs up, index 1 = thumbs down
          if (value > 0 && index === 0) filled = true;
          if (value < 0 && index === 1) filled = true;
        } else if (precision === 'half') {
          filled = displayValue >= itemValue;
          halfFilled =
            displayValue >= itemValue - 0.5 && displayValue < itemValue;
        } else {
          filled = displayValue >= itemValue;
        }

        return {
          index,
          filled,
          halfFilled,
          itemValue,
        };
      });
    }, [type, maxValue, displayValue, precision, value]);

    const handleItemRate = useCallback(
      (newValue: number) => {
        if (!isInteractive || !onChange) return;

        if (type === 'thumbs') {
          // For thumbs: 1 = thumbs up, 2 = thumbs down -> convert to 1, -1
          const thumbsValue = newValue === 1 ? 1 : -1;
          onChange(value === thumbsValue ? 0 : thumbsValue);
        } else {
          onChange(newValue === value ? 0 : newValue);
        }
      },
      [isInteractive, onChange, type, value]
    );

    const handleItemHover = useCallback(
      (newValue: number | null) => {
        if (!isInteractive) return;
        setHoverValue(newValue);
        onHover?.(newValue);
      },
      [isInteractive, onHover]
    );

    const getDisplayText = () => {
      if (type === 'thumbs') {
        if (value > 0) return 'Thumbs Up';
        if (value < 0) return 'Thumbs Down';
        return 'No Rating';
      }
      return `${value} out of ${maxValue}`;
    };

    const ratingId =
      id ?? `rating-${Math.random().toString(36).substring(2, 11)}`;
    const labelId = showLabel && label ? `${ratingId}-label` : undefined;
    const valueId = showValue ? `${ratingId}-value` : undefined;

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          ratingVariants({
            size,
            type,
            variant,
            interactive: isInteractive,
            disabled,
          }),
          className
        )}
        role="group"
        aria-label={ariaLabel ?? `Rating: ${getDisplayText()}`}
        aria-describedby={
          cn(ariaDescribedby, labelId, valueId).trim() ?? undefined
        }
        {...props}
      >
        {showLabel && label && (
          <span id={labelId} className="mr-2 text-sm font-medium">
            {label}
          </span>
        )}

        <div
          className={cn(
            'flex items-center',
            type === 'numeric' ? 'gap-2' : 'gap-1'
          )}
        >
          {items.map(({ index, filled, halfFilled, itemValue }) => (
            <RatingItem
              key={index}
              index={index}
              filled={filled}
              halfFilled={halfFilled}
              interactive={isInteractive}
              disabled={disabled}
              size={size ?? 'md'}
              type={type ?? 'star'}
              variant={variant ?? 'default'}
              onRate={handleItemRate}
              onHover={handleItemHover}
              aria-label={
                type === 'thumbs'
                  ? getThumbsLabel(index)
                  : `Rate ${itemValue} out of ${maxValue}`
              }
            />
          ))}
          {type === 'numeric' && showValue && (
            <>
              <div className="bg-border mx-3 h-4 w-px" />
              <span className="text-foreground text-sm font-medium">
                {value}
              </span>
            </>
          )}
        </div>

        {showValue && type !== 'numeric' && (
          <span
            id={valueId}
            className="text-muted-foreground ml-2 text-sm"
            aria-live="polite"
          >
            {getDisplayText()}
          </span>
        )}

        {name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export default Rating;
