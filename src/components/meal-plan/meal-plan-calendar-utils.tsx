/**
 * MealPlanCalendar Utility Functions
 *
 * Helper functions for date manipulation, meal slot operations,
 * and calendar data management.
 *
 * @module components/meal-plan/meal-plan-calendar-utils
 */

'use client';

import type { MealType } from '@/types/ui/meal-plan-calendar';

/**
 * Get the start of the week for a given date
 *
 * @param date - Reference date
 * @param startDay - First day of week (0 = Sunday, 1 = Monday)
 * @returns Start of the week
 */
export function getStartOfWeek(date: Date, startDay: number = 1): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < startDay ? 7 : 0) + day - startDay;

  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);

  return result;
}

/**
 * Get the end of the week for a given date
 *
 * @param date - Reference date
 * @param startDay - First day of week (0 = Sunday, 1 = Monday)
 * @returns End of the week
 */
export function getEndOfWeek(date: Date, startDay: number = 1): Date {
  const result = getStartOfWeek(date, startDay);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);

  return result;
}

/**
 * Get all dates for a week
 *
 * @param startDate - Start of the week
 * @param includeWeekends - Include Saturday and Sunday
 * @returns Array of dates
 */
export function getWeekDates(
  startDate: Date,
  includeWeekends: boolean = true
): Date[] {
  const dates: Date[] = [];
  const dayCount = includeWeekends ? 7 : 5;

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
}

/**
 * Get the start of the month for a given date
 *
 * @param date - Reference date
 * @returns Start of the month
 */
export function getStartOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of the month for a given date
 *
 * @param date - Reference date
 * @returns End of the month
 */
export function getEndOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get all dates for a month view (including overflow from prev/next months)
 *
 * @param month - Any date in the month
 * @param startDay - First day of week (0 = Sunday, 1 = Monday)
 * @returns 2D array of dates (weeks x days)
 */
export function getMonthDates(month: Date, startDay: number = 1): Date[][] {
  const start = getStartOfMonth(month);
  const end = getEndOfMonth(month);

  // Find the start of the first week
  const calendarStart = getStartOfWeek(start, startDay);

  // Find the end of the last week
  const calendarEnd = new Date(end);
  calendarEnd.setDate(
    calendarEnd.getDate() + ((6 - calendarEnd.getDay() + startDay) % 7)
  );

  const weeks: Date[][] = [];
  let currentDate = new Date(calendarStart);

  while (currentDate <= calendarEnd) {
    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    weeks.push(week);
  }

  return weeks;
}

/**
 * Add days to a date
 *
 * @param date - Reference date
 * @param days - Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add weeks to a date
 *
 * @param date - Reference date
 * @param weeks - Number of weeks to add (can be negative)
 * @returns New date
 */
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/**
 * Add months to a date
 *
 * @param date - Reference date
 * @param months - Number of months to add (can be negative)
 * @returns New date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 *
 * @param date - Date to check
 * @returns True if date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Check if two dates are the same day
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Check if a date is in a specific month
 *
 * @param date - Date to check
 * @param month - Reference month (any date in that month)
 * @returns True if date is in the month
 */
export function isSameMonth(date: Date, month: Date): boolean {
  return (
    date.getFullYear() === month.getFullYear() &&
    date.getMonth() === month.getMonth()
  );
}

/**
 * Format a date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startStr = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const endStr = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (startDate.getMonth() === endDate.getMonth()) {
    // Same month
    const dayOnly = startDate.toLocaleDateString('en-US', { day: 'numeric' });
    return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${dayOnly}-${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  return `${startStr} - ${endStr}`;
}

/**
 * Format a date for display in day headers
 *
 * @param date - Date to format
 * @param format - Format type
 * @returns Formatted date string
 */
export function formatDayHeader(
  date: Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'medium':
    default:
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
  }
}

/**
 * Format a month for display
 *
 * @param date - Date in the month
 * @returns Formatted month string (e.g., "January 2024")
 */
export function formatMonthHeader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a full date for display
 *
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Monday, January 15, 2024")
 */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get default meal types
 *
 * @returns Array of default meal types
 */
export function getDefaultMealTypes(): MealType[] {
  return ['breakfast', 'lunch', 'dinner', 'snack'];
}

/**
 * Get meal type icon name
 *
 * @param mealType - Meal type
 * @returns Icon name (from Lucide)
 */
export function getMealTypeIcon(mealType: MealType): string {
  const icons: Record<MealType, string> = {
    breakfast: 'Coffee',
    lunch: 'Salad',
    dinner: 'UtensilsCrossed',
    snack: 'Cookie',
  };
  // eslint-disable-next-line security/detect-object-injection
  return icons[mealType];
}

/**
 * Get meal type color class
 *
 * @param mealType - Meal type
 * @returns Tailwind color class
 */
export function getMealTypeColor(mealType: MealType): string {
  const colors: Record<MealType, string> = {
    breakfast: 'text-amber-600',
    lunch: 'text-green-600',
    dinner: 'text-blue-600',
    snack: 'text-purple-600',
  };
  // eslint-disable-next-line security/detect-object-injection
  return colors[mealType];
}

/**
 * Calculate total cooking time for recipes
 *
 * @param recipes - Array of recipes with time data
 * @returns Total time in minutes
 */
export function calculateTotalTime(
  recipes: Array<{ prepTime?: number; cookTime?: number }>
): number {
  return recipes.reduce((total, recipe) => {
    return total + (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
  }, 0);
}

/**
 * Format time in minutes to readable string
 *
 * @param minutes - Time in minutes
 * @returns Formatted time string (e.g., "1h 30m" or "45m")
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}
