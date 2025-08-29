import { formatDate } from '@/utils';

describe('formatDate utility function', () => {
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
    expect(formatDate('2023-01-01')).toBe('January 1, 2023');
    expect(formatDate('2023/06/15')).toBe('June 15, 2023');
  });
});
