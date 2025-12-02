import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import {
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableFooterVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
  tableCaptionVariants,
} from '@/lib/ui/table-variants';

/**
 * Table component props interface
 */
export interface TableProps
  extends
    React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

/**
 * Table Header component props interface
 */
export interface TableHeaderProps
  extends
    React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {}

/**
 * Table Body component props interface
 */
export interface TableBodyProps
  extends
    React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableBodyVariants> {}

/**
 * Table Footer component props interface
 */
export interface TableFooterProps
  extends
    React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableFooterVariants> {}

/**
 * Table Row component props interface
 */
export interface TableRowProps
  extends
    React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

/**
 * Table Head component props interface
 */
export interface TableHeadProps
  extends
    Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableHeadVariants> {
  align?: 'left' | 'center' | 'right';
}

/**
 * Table Cell component props interface
 */
export interface TableCellProps
  extends
    Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableCellVariants> {
  align?: 'left' | 'center' | 'right';
}

/**
 * Table Caption component props interface
 */
export interface TableCaptionProps
  extends
    React.HTMLAttributes<HTMLTableCaptionElement>,
    VariantProps<typeof tableCaptionVariants> {}

/**
 * Recipe Table component props interface
 */
export interface RecipeTableProps extends Omit<TableProps, 'children'> {
  data: Array<Record<string, unknown>>;
  columns: Array<{
    key: string;
    header: React.ReactNode;
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (
      value: unknown,
      row: Record<string, unknown>,
      index: number
    ) => React.ReactNode;
  }>;
  caption?: React.ReactNode;
  emptyMessage?: string;
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
}

/**
 * Ingredient interface
 */
export interface Ingredient {
  id?: string | number;
  name: string;
  amount?: number | string;
  unit?: string;
  notes?: string;
  category?: string;
  optional?: boolean;
  [key: string]: unknown;
}

/**
 * Ingredients Table component props interface
 */
export interface IngredientsTableProps extends Omit<
  RecipeTableProps,
  'columns' | 'data'
> {
  ingredients: Ingredient[];
  showCategory?: boolean;
  showNotes?: boolean;
  onIngredientClick?: (ingredient: Ingredient, index: number) => void;
}

/**
 * Nutrition item interface
 */
export interface NutritionItem {
  nutrient: string;
  amount: number | string;
  unit: string;
  dailyValue?: number | string;
  category?: 'macronutrient' | 'vitamin' | 'mineral' | 'other';
  [key: string]: unknown;
}

/**
 * Nutrition Table component props interface
 */
export interface NutritionTableProps extends Omit<
  RecipeTableProps,
  'columns' | 'data'
> {
  nutrition: NutritionItem[];
  showDailyValue?: boolean;
  showCategory?: boolean;
}
