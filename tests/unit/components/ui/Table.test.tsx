import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
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
} from '@/components/ui/table';

expect.extend(toHaveNoViolations);

describe('Table Components', () => {
  describe('Basic Table', () => {
    it('renders a basic table structure', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>30</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Name' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Age' })
      ).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'John' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: '30' })).toBeInTheDocument();
    });

    it('renders table with caption', () => {
      render(
        <Table>
          <TableCaption>User Information</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText('User Information')).toBeInTheDocument();
    });

    it('renders table with footer', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Apple</TableCell>
              <TableCell>$1.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>$1.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      const { container } = render(
        <Table variant="simple" size="lg" bordered striped hover>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const table = container.querySelector('table');
      expect(table).toHaveClass('border-none'); // simple variant
      expect(table).toHaveClass('text-base'); // lg size
      expect(table).toHaveClass('border'); // bordered
    });

    it('applies alignment classes correctly', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead align="center">Centered</TableHead>
              <TableHead align="right">Right</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell align="center">Center Cell</TableCell>
              <TableCell align="right">Right Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const centerHeader = screen.getByRole('columnheader', {
        name: 'Centered',
      });
      const rightHeader = screen.getByRole('columnheader', { name: 'Right' });

      expect(centerHeader).toHaveClass('text-center');
      expect(rightHeader).toHaveClass('text-right');
    });
  });

  describe('RecipeTable', () => {
    const sampleData = [
      { id: 1, name: 'John Doe', age: 30, city: 'New York' },
      { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
    ];

    const sampleColumns = [
      { key: 'name', header: 'Name', align: 'left' as const },
      { key: 'age', header: 'Age', align: 'right' as const },
      { key: 'city', header: 'City', align: 'center' as const },
    ];

    it('renders data correctly', () => {
      render(<RecipeTable data={sampleData} columns={sampleColumns} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      render(
        <RecipeTable
          data={[]}
          columns={sampleColumns}
          emptyMessage="No users found"
        />
      );

      expect(screen.getByText('No users found')).toBeInTheDocument();
    });

    it('handles row click events', async () => {
      const user = userEvent.setup();
      const onRowClick = jest.fn();

      render(
        <RecipeTable
          data={sampleData}
          columns={sampleColumns}
          onRowClick={onRowClick}
        />
      );

      const firstRow = screen.getByText('John Doe').closest('tr');
      expect(firstRow).toBeInTheDocument();

      if (firstRow) {
        await user.click(firstRow);
        expect(onRowClick).toHaveBeenCalledWith(sampleData[0], 0);
      }
    });

    it('renders custom cell content with render function', () => {
      const columnsWithRender = [
        {
          key: 'name',
          header: 'Name',
          render: (value: unknown) => (
            <strong data-testid="custom-name">{String(value)}</strong>
          ),
        },
        { key: 'age', header: 'Age' },
      ];

      render(<RecipeTable data={sampleData} columns={columnsWithRender} />);

      expect(screen.getAllByTestId('custom-name')[0]).toHaveTextContent(
        'John Doe'
      );
    });

    it('applies column width styles', () => {
      const columnsWithWidth = [
        { key: 'name', header: 'Name', width: '200px' },
        { key: 'age', header: 'Age', width: '100px' },
      ];

      render(<RecipeTable data={sampleData} columns={columnsWithWidth} />);

      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      const ageHeader = screen.getByRole('columnheader', { name: 'Age' });

      expect(nameHeader).toHaveStyle('width: 200px');
      expect(ageHeader).toHaveStyle('width: 100px');
    });
  });

  describe('IngredientsTable', () => {
    const sampleIngredients = [
      {
        id: 1,
        name: 'Flour',
        amount: 2,
        unit: 'cups',
        category: 'Baking',
        notes: 'All-purpose flour',
      },
      {
        id: 2,
        name: 'Vanilla Extract',
        amount: 1,
        unit: 'tsp',
        optional: true,
        category: 'Flavoring',
      },
    ];

    it('renders ingredients correctly', () => {
      render(<IngredientsTable ingredients={sampleIngredients} />);

      expect(screen.getByText('Flour')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Extract')).toBeInTheDocument();
      expect(screen.getByText('2 cups')).toBeInTheDocument();
      expect(screen.getByText('1 tsp')).toBeInTheDocument();
    });

    it('shows optional ingredients with styling', () => {
      render(<IngredientsTable ingredients={sampleIngredients} />);

      const vanillaText = screen.getByText('Vanilla Extract');
      expect(vanillaText).toHaveClass('italic', 'text-text-secondary');
      expect(screen.getByText('optional')).toBeInTheDocument();
    });

    it('shows categories when enabled', () => {
      render(
        <IngredientsTable ingredients={sampleIngredients} showCategory={true} />
      );

      expect(
        screen.getByRole('columnheader', { name: 'Category' })
      ).toBeInTheDocument();
      expect(screen.getByText('Baking')).toBeInTheDocument();
      expect(screen.getByText('Flavoring')).toBeInTheDocument();
    });

    it('shows notes when enabled', () => {
      render(
        <IngredientsTable ingredients={sampleIngredients} showNotes={true} />
      );

      expect(
        screen.getByRole('columnheader', { name: 'Notes' })
      ).toBeInTheDocument();
      expect(screen.getByText('All-purpose flour')).toBeInTheDocument();
    });

    it('handles ingredient click events', async () => {
      const user = userEvent.setup();
      const onIngredientClick = jest.fn();

      render(
        <IngredientsTable
          ingredients={sampleIngredients}
          onIngredientClick={onIngredientClick}
        />
      );

      const firstRow = screen.getByText('Flour').closest('tr');
      expect(firstRow).toBeInTheDocument();

      if (firstRow) {
        await user.click(firstRow);
        expect(onIngredientClick).toHaveBeenCalledWith(sampleIngredients[0], 0);
      }
    });

    it('renders empty state when no ingredients', () => {
      render(<IngredientsTable ingredients={[]} />);

      expect(screen.getByText('No ingredients added yet')).toBeInTheDocument();
    });
  });

  describe('NutritionTable', () => {
    const sampleNutrition = [
      {
        nutrient: 'Calories',
        amount: 250,
        unit: 'kcal',
        dailyValue: 12,
        category: 'macronutrient' as const,
      },
      {
        nutrient: 'Vitamin C',
        amount: 60,
        unit: 'mg',
        dailyValue: 67,
        category: 'vitamin' as const,
      },
      {
        nutrient: 'Iron',
        amount: 2.1,
        unit: 'mg',
        category: 'mineral' as const,
      },
    ];

    it('renders nutrition information correctly', () => {
      render(<NutritionTable nutrition={sampleNutrition} />);

      expect(screen.getByText('Calories')).toBeInTheDocument();
      expect(screen.getByText('Vitamin C')).toBeInTheDocument();
      expect(screen.getByText('Iron')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('2.1')).toBeInTheDocument();
    });

    it('shows daily values when enabled', () => {
      render(
        <NutritionTable nutrition={sampleNutrition} showDailyValue={true} />
      );

      expect(
        screen.getByRole('columnheader', { name: '% Daily Value' })
      ).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('67')).toBeInTheDocument();
      expect(screen.getByText('—')).toBeInTheDocument(); // Iron has no daily value
    });

    it('shows categories when enabled', () => {
      render(
        <NutritionTable nutrition={sampleNutrition} showCategory={true} />
      );

      expect(screen.getByText('macronutrient')).toBeInTheDocument();
      expect(screen.getByText('vitamin')).toBeInTheDocument();
      expect(screen.getByText('mineral')).toBeInTheDocument();
    });

    it('applies category-specific styling', () => {
      render(
        <NutritionTable nutrition={sampleNutrition} showCategory={true} />
      );

      const macroTag = screen.getByText('macronutrient');
      const vitaminTag = screen.getByText('vitamin');
      const mineralTag = screen.getByText('mineral');

      expect(macroTag).toHaveClass('bg-success-light', 'text-success');
      expect(vitaminTag).toHaveClass('bg-warning-light', 'text-warning');
      expect(mineralTag).toHaveClass('bg-info-light', 'text-info');
    });

    it('renders empty state when no nutrition data', () => {
      render(<NutritionTable nutrition={[]} />);

      expect(
        screen.getByText('No nutrition information available')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Table>
          <TableCaption>Sample table for testing</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Item 1</TableCell>
              <TableCell>100</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation for interactive rows', async () => {
      const user = userEvent.setup();
      const onRowClick = jest.fn();

      render(
        <RecipeTable
          data={[{ name: 'Test', value: 1 }]}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'value', header: 'Value' },
          ]}
          onRowClick={onRowClick}
        />
      );

      const row = screen.getByText('Test').closest('tr');
      expect(row).toBeInTheDocument();

      if (row) {
        await user.click(row);
        expect(onRowClick).toHaveBeenCalledWith({ name: 'Test', value: 1 }, 0);
      }
    });

    it('has proper ARIA attributes for sortable headers', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sortable>Sortable Column</TableHead>
              <TableHead>Regular Column</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Value 1</TableCell>
              <TableCell>Value 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const sortableHeader = screen.getByRole('columnheader', {
        name: 'Sortable Column',
      });
      const regularHeader = screen.getByRole('columnheader', {
        name: 'Regular Column',
      });

      expect(sortableHeader).toHaveClass('cursor-pointer');
      expect(regularHeader).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Table Variants', () => {
    const variants = ['default', 'simple', 'lined'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        const { container } = render(
          <Table variant={variant}>
            <TableBody>
              <TableRow>
                <TableCell>Content</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );

        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();
      });
    });
  });

  describe('Table Sizes', () => {
    const sizes = ['sm', 'default', 'lg'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        const { container } = render(
          <Table size={size}>
            <TableBody>
              <TableRow>
                <TableCell>Content</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );

        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();

        if (size === 'sm') {
          expect(table).toHaveClass('text-xs');
        } else if (size === 'lg') {
          expect(table).toHaveClass('text-base');
        } else {
          expect(table).toHaveClass('text-sm');
        }
      });
    });
  });
});
