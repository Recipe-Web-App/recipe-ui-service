import { reorderArray } from '@/lib/ui/sortable-utils';

describe('reorderArray', () => {
  describe('basic reordering', () => {
    it('should move item from lower to higher index', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = reorderArray(array, 1, 3);

      expect(result).toEqual(['a', 'c', 'd', 'b', 'e']);
    });

    it('should move item from higher to lower index', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = reorderArray(array, 3, 1);

      expect(result).toEqual(['a', 'd', 'b', 'c', 'e']);
    });

    it('should not modify array when indices are same', () => {
      const array = ['a', 'b', 'c'];
      const result = reorderArray(array, 1, 1);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should move first item to last position', () => {
      const array = ['a', 'b', 'c'];
      const result = reorderArray(array, 0, 2);

      expect(result).toEqual(['b', 'c', 'a']);
    });

    it('should move last item to first position', () => {
      const array = ['a', 'b', 'c'];
      const result = reorderArray(array, 2, 0);

      expect(result).toEqual(['c', 'a', 'b']);
    });
  });

  describe('edge cases', () => {
    it('should handle single item array', () => {
      const array = ['a'];
      const result = reorderArray(array, 0, 0);

      expect(result).toEqual(['a']);
    });

    it('should handle two item array', () => {
      const array = ['a', 'b'];
      const result = reorderArray(array, 0, 1);

      expect(result).toEqual(['b', 'a']);
    });

    it('should not mutate original array', () => {
      const array = ['a', 'b', 'c'];
      const originalCopy = [...array];
      reorderArray(array, 0, 2);

      expect(array).toEqual(originalCopy);
    });
  });

  describe('with objects', () => {
    it('should reorder array of objects', () => {
      const array = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' },
        { id: 3, name: 'Third' },
      ];
      const result = reorderArray(array, 0, 2);

      expect(result).toEqual([
        { id: 2, name: 'Second' },
        { id: 3, name: 'Third' },
        { id: 1, name: 'First' },
      ]);
    });

    it('should maintain object references', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const array = [obj1, obj2, obj3];
      const result = reorderArray(array, 0, 2);

      expect(result[2]).toBe(obj1);
      expect(result[0]).toBe(obj2);
      expect(result[1]).toBe(obj3);
    });
  });
});
