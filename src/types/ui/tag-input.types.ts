/**
 * Tag Input Types
 *
 * Type definitions for the TagInput component used in recipe and collection forms.
 */

export interface TagInputProps {
  /**
   * Current array of tags
   */
  value: string[];

  /**
   * Callback when tags change
   */
  onChange: (tags: string[]) => void;

  /**
   * Placeholder text for the input field
   * @default "Add a tag..."
   */
  placeholder?: string;

  /**
   * Maximum number of tags allowed
   * @default 20
   */
  maxTags?: number;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show the tag count (e.g., "3/20")
   * @default true
   */
  showCount?: boolean;

  /**
   * Whether to show a confirmation prompt when user blurs with text in the input
   * @default true
   */
  showPendingConfirmation?: boolean;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Optional className for the container
   */
  className?: string;

  /**
   * Optional label for the tag input section
   */
  label?: string;
}
