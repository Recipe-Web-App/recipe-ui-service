import { arrayMove } from '@dnd-kit/sortable';

/**
 * Utility function to reorder an array
 * Useful when you need to reorder outside the component
 */
export function reorderArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  return arrayMove(array, fromIndex, toIndex);
}
