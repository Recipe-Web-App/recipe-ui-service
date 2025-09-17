import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
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
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

/**
 * Table Header component props interface
 */
export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {}

/**
 * Table Body component props interface
 */
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableBodyVariants> {}

/**
 * Table Footer component props interface
 */
export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableFooterVariants> {}

/**
 * Table Row component props interface
 */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

/**
 * Table Head component props interface
 */
export interface TableHeadProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableHeadVariants> {
  align?: 'left' | 'center' | 'right';
}

/**
 * Table Cell component props interface
 */
export interface TableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'>,
    VariantProps<typeof tableCellVariants> {
  align?: 'left' | 'center' | 'right';
}

/**
 * Table Caption component props interface
 */
export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement>,
    VariantProps<typeof tableCaptionVariants> {}

/**
 * Main table component
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, size, striped, hover, bordered, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          tableVariants({ variant, size, striped, hover, bordered }),
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

/**
 * Table header component
 */
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, variant, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(tableHeaderVariants({ variant }), className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

/**
 * Table body component
 */
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(tableBodyVariants(), className)}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

/**
 * Table footer component
 */
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, variant, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(tableFooterVariants({ variant }), className)}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

/**
 * Table row component
 */
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

/**
 * Table head cell component
 */
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, variant, align, size, sortable, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        tableHeadVariants({ variant, align, size, sortable }),
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

/**
 * Table data cell component
 */
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align, size, variant, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ align, size, variant }), className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

/**
 * Table caption component
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, side, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(tableCaptionVariants({ side }), className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

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
 * Recipe-specific table component for displaying structured data
 */
function RecipeTableComponent(
  props: RecipeTableProps,
  ref: React.Ref<HTMLTableElement>
) {
  const {
    data,
    columns,
    caption,
    emptyMessage = 'No data available',
    onRowClick,
    className,
    ...restProps
  } = props;
  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table ref={ref} className={className} {...restProps}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead
              key={String(column.key)}
              align={column.align}
              sortable={column.sortable}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            variant={onRowClick ? 'interactive' : 'default'}
            onClick={() => onRowClick?.(row, index)}
            className={onRowClick ? 'cursor-pointer' : undefined}
          >
            {columns.map(column => (
              <TableCell key={String(column.key)} align={column.align}>
                {column.render
                  ? column.render(row[column.key], row, index)
                  : (row[column.key] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const RecipeTable = React.forwardRef(RecipeTableComponent);

RecipeTable.displayName = 'RecipeTable';

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
export interface IngredientsTableProps
  extends Omit<RecipeTableProps, 'columns' | 'data'> {
  ingredients: Ingredient[];
  showCategory?: boolean;
  showNotes?: boolean;
  onIngredientClick?: (ingredient: Ingredient, index: number) => void;
}

/**
 * Specialized table for recipe ingredients
 */
const IngredientsTable = React.forwardRef<
  HTMLTableElement,
  IngredientsTableProps
>(
  (
    {
      ingredients,
      showCategory = false,
      showNotes = false,
      onIngredientClick,
      caption = 'Recipe Ingredients',
      ...props
    },
    ref
  ) => {
    const columns: Array<{
      key: string;
      header: string;
      align?: 'left' | 'center' | 'right';
      width?: string;
      render?: (value: unknown, row: Ingredient) => React.ReactNode;
    }> = [
      {
        key: 'ingredient',
        header: 'Ingredient',
        align: 'left' as const,
        render: (value: unknown, row: Ingredient) => (
          <div className="flex items-center gap-2">
            <span className={row.optional ? 'text-gray-600 italic' : ''}>
              {row.name}
            </span>
            {row.optional && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                optional
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        align: 'right' as const,
        width: '100px',
        render: (value: unknown, row: Ingredient) => (
          <span className="font-mono">
            {row.amount} {row.unit}
          </span>
        ),
      },
    ];

    if (showCategory) {
      columns.push({
        key: 'category',
        header: 'Category',
        align: 'center' as const,
        width: '120px',
        render: (value: unknown) =>
          value ? (
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
              {String(value)}
            </span>
          ) : (
            <span />
          ),
      });
    }

    if (showNotes) {
      columns.push({
        key: 'notes',
        header: 'Notes',
        align: 'left' as const,
        render: (value: unknown) =>
          value ? (
            <span className="text-sm text-gray-600">{String(value)}</span>
          ) : (
            <span />
          ),
      });
    }

    return (
      <RecipeTable
        ref={ref}
        data={ingredients}
        columns={
          columns as Array<{
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
          }>
        }
        caption={caption}
        emptyMessage="No ingredients added yet"
        onRowClick={
          onIngredientClick as (
            row: Record<string, unknown>,
            index: number
          ) => void
        }
        {...props}
      />
    );
  }
);
IngredientsTable.displayName = 'IngredientsTable';

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
export interface NutritionTableProps
  extends Omit<RecipeTableProps, 'columns' | 'data'> {
  nutrition: NutritionItem[];
  showDailyValue?: boolean;
  showCategory?: boolean;
}

/**
 * Specialized table for nutrition information
 */
const NutritionTable = React.forwardRef<HTMLTableElement, NutritionTableProps>(
  (
    {
      nutrition,
      showDailyValue = true,
      showCategory = false,
      caption = 'Nutrition Information',
      ...props
    },
    ref
  ) => {
    const columns: Array<{
      key: string;
      header: string;
      align?: 'left' | 'center' | 'right';
      width?: string;
      render?: (value: unknown, row: NutritionItem) => React.ReactNode;
    }> = [
      {
        key: 'nutrient',
        header: 'Nutrient',
        align: 'left' as const,
        render: (value: unknown, row: NutritionItem) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.nutrient}</span>
            {showCategory && row.category && (
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-xs',
                  row.category === 'macronutrient'
                    ? 'bg-green-100 text-green-800'
                    : row.category === 'vitamin'
                      ? 'bg-yellow-100 text-yellow-800'
                      : row.category === 'mineral'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                )}
              >
                {row.category}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        align: 'right' as const,
        width: '120px',
        render: (value: unknown, row: NutritionItem) => (
          <span className="font-mono">
            {row.amount}
            <span className="ml-1 text-sm text-gray-600">{row.unit}</span>
          </span>
        ),
      },
    ];

    if (showDailyValue) {
      columns.push({
        key: 'dailyValue',
        header: '% Daily Value',
        align: 'right' as const,
        width: '120px',
        render: (value: unknown) =>
          value ? (
            <span className="font-mono">
              {String(value)}
              <span className="ml-1 text-sm text-gray-600">%</span>
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      });
    }

    return (
      <RecipeTable
        ref={ref}
        data={nutrition}
        columns={
          columns as Array<{
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
          }>
        }
        caption={caption}
        emptyMessage="No nutrition information available"
        {...props}
      />
    );
  }
);
NutritionTable.displayName = 'NutritionTable';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  RecipeTable,
  IngredientsTable,
  NutritionTable,
};
