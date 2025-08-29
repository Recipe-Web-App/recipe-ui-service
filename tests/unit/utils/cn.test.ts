import { cn } from '@/utils';

describe('cn utility function', () => {
  test('should combine classes correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  test('should handle conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
  });

  test('should merge Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3');
  });

  test('should handle undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  test('should handle empty strings', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });
});
