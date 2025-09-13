import { cn, formatDate, formatDuration, slugify } from '@/utils';

describe('utils', () => {
  describe('cn', () => {
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

  describe('formatDate', () => {
    test('should format date string correctly', () => {
      const date = '2023-12-25T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toBe('December 25, 2023');
    });

    test('should format Date object correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('December 25, 2023');
    });

    test('should handle different date formats', () => {
      // Use explicit UTC dates to avoid timezone issues
      const utcDate1 = new Date('2023-01-01T12:00:00Z');
      const utcDate2 = new Date('2023-06-15T12:00:00Z');

      expect(formatDate(utcDate1)).toBe('January 1, 2023');
      expect(formatDate(utcDate2)).toBe('June 15, 2023');
    });
  });

  describe('formatDuration', () => {
    test('should format minutes less than 60', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(45)).toBe('45 min');
      expect(formatDuration(1)).toBe('1 min');
    });

    test('should format exact hours', () => {
      expect(formatDuration(60)).toBe('1 hr');
      expect(formatDuration(120)).toBe('2 hr');
      expect(formatDuration(180)).toBe('3 hr');
    });

    test('should format hours with remaining minutes', () => {
      expect(formatDuration(90)).toBe('1 hr 30 min');
      expect(formatDuration(135)).toBe('2 hr 15 min');
      expect(formatDuration(195)).toBe('3 hr 15 min');
    });

    test('should handle edge cases', () => {
      expect(formatDuration(0)).toBe('0 min');
      expect(formatDuration(59)).toBe('59 min');
      expect(formatDuration(61)).toBe('1 hr 1 min');
    });
  });

  describe('slugify', () => {
    test('should convert basic text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Simple Text')).toBe('simple-text');
    });

    test('should handle special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Recipe #1: Pasta & Sauce')).toBe('recipe-1-pasta-sauce');
      expect(slugify('Test@Example.com')).toBe('testexamplecom');
    });

    test('should handle multiple spaces and underscores', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Test_With_Underscores')).toBe('test-with-underscores');
      expect(slugify('Mixed   _  Spacing')).toBe('mixed-spacing');
    });

    test('should remove leading and trailing dashes', () => {
      expect(slugify('-Leading Dash')).toBe('leading-dash');
      expect(slugify('Trailing Dash-')).toBe('trailing-dash');
      expect(slugify('-Both Sides-')).toBe('both-sides');
    });

    test('should handle empty and edge cases', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
      expect(slugify('---')).toBe('');
      expect(slugify('a')).toBe('a');
    });

    test('should handle Unicode and accented characters', () => {
      expect(slugify('Café')).toBe('caf');
      expect(slugify('naïve résumé')).toBe('nave-rsum');
    });
  });
});
