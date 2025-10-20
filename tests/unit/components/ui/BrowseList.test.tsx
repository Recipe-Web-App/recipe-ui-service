import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowseList, SimpleBrowseList } from '@/components/ui/browse-list';
import { ListItem, ListItemContent, ListItemTitle } from '@/components/ui/list';
import type { BrowseListProps } from '@/types/ui/browse-list';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test data
interface TestItem {
  id: number;
  title: string;
  description: string;
}

const mockItems: TestItem[] = [
  { id: 1, title: 'Item 1', description: 'Description 1' },
  { id: 2, title: 'Item 2', description: 'Description 2' },
  { id: 3, title: 'Item 3', description: 'Description 3' },
];

/**
 * Helper function to render BrowseList with default props
 */
const renderBrowseList = (props: Partial<BrowseListProps<TestItem>> = {}) => {
  const defaultProps: BrowseListProps<TestItem> = {
    items: mockItems,
    renderItem: (item: TestItem) => (
      <ListItem key={item.id}>
        <ListItemContent>
          <ListItemTitle>{item.title}</ListItemTitle>
        </ListItemContent>
      </ListItem>
    ),
    ...props,
  };

  return render(<BrowseList {...defaultProps} />);
};

describe('BrowseList Component', () => {
  describe('Basic Rendering', () => {
    test('renders list items correctly', () => {
      renderBrowseList();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      renderBrowseList();
      const region = screen.getByRole('region');
      expect(region).toHaveClass('flex', 'flex-col');
    });

    test('renders with custom className', () => {
      renderBrowseList({ className: 'custom-class' });
      const region = screen.getByRole('region');
      expect(region).toHaveClass('custom-class');
    });

    test('applies aria-label correctly', () => {
      renderBrowseList({ 'aria-label': 'Recipe list' });
      expect(
        screen.getByRole('region', { name: 'Recipe list' })
      ).toBeInTheDocument();
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <BrowseList
          ref={ref}
          items={mockItems}
          renderItem={(item: TestItem) => (
            <ListItem key={item.id}>{item.title}</ListItem>
          )}
        />
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Loading State', () => {
    test('shows skeleton items when loading', () => {
      renderBrowseList({ loading: true, skeletonCount: 5 });
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      // Skeletons should be present (check for listitem role)
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-busy', 'true');
    });

    test('renders custom number of skeletons', () => {
      renderBrowseList({ loading: true, skeletonCount: 3 });
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-busy', 'true');
    });

    test('uses custom skeleton renderer when provided', () => {
      const customSkeleton = jest.fn(() => (
        <ListItem>Custom Skeleton</ListItem>
      ));
      renderBrowseList({
        loading: true,
        skeletonCount: 2,
        renderSkeleton: customSkeleton,
      });
      expect(customSkeleton).toHaveBeenCalledTimes(2);
    });

    test('applies loading state classes', () => {
      renderBrowseList({ loading: true });
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Empty State', () => {
    test('shows empty state when items array is empty', () => {
      renderBrowseList({ items: [] });
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    test('shows custom empty message', () => {
      renderBrowseList({
        items: [],
        emptyMessage: 'No recipes available',
        emptyDescription: 'Try creating a new recipe',
      });
      expect(screen.getByText('No recipes available')).toBeInTheDocument();
      expect(screen.getByText('Try creating a new recipe')).toBeInTheDocument();
    });

    test('renders empty actions when provided', () => {
      renderBrowseList({
        items: [],
        emptyActions: <button>Create Recipe</button>,
      });
      expect(screen.getByText('Create Recipe')).toBeInTheDocument();
    });

    test('renders empty icon when provided', () => {
      renderBrowseList({
        items: [],
        emptyIcon: <div data-testid="empty-icon">Icon</div>,
      });
      expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('shows error message when error prop is set', () => {
      renderBrowseList({ error: 'Failed to load data' });
      expect(screen.getByText('Error Loading Content')).toBeInTheDocument();
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    test('shows error from Error object', () => {
      const error = new Error('Network error');
      renderBrowseList({ error });
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    test('shows retry button when onRetry is provided', () => {
      const handleRetry = jest.fn();
      renderBrowseList({ error: 'Error', onRetry: handleRetry });
      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();
      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    test('does not show retry button when onRetry is not provided', () => {
      renderBrowseList({ error: 'Error' });
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    test('uses custom error renderer when provided', () => {
      const customErrorRenderer = jest.fn((err: Error | string) => (
        <div>Custom Error: {String(err)}</div>
      ));
      renderBrowseList({
        error: 'Test error',
        renderError: customErrorRenderer,
      });
      expect(customErrorRenderer).toHaveBeenCalledWith('Test error');
      expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    test('shows pagination when totalPages > 1', () => {
      const handlePageChange = jest.fn();
      renderBrowseList({
        currentPage: 1,
        totalPages: 5,
        onPageChange: handlePageChange,
      });
      expect(
        screen.getByRole('navigation', { name: /pagination/i })
      ).toBeInTheDocument();
    });

    test('hides pagination when totalPages <= 1', () => {
      renderBrowseList({
        currentPage: 1,
        totalPages: 1,
      });
      expect(
        screen.queryByRole('navigation', { name: /pagination/i })
      ).not.toBeInTheDocument();
    });

    test('hides pagination when showPagination is false', () => {
      renderBrowseList({
        currentPage: 1,
        totalPages: 5,
        showPagination: false,
      });
      expect(
        screen.queryByRole('navigation', { name: /pagination/i })
      ).not.toBeInTheDocument();
    });

    test('calls onPageChange when page is changed', () => {
      const handlePageChange = jest.fn();
      renderBrowseList({
        currentPage: 1,
        totalPages: 3,
        onPageChange: handlePageChange,
      });
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    test('passes pagination props to Pagination component', () => {
      const handlePageChange = jest.fn();
      renderBrowseList({
        currentPage: 2,
        totalPages: 10,
        totalItems: 100,
        pageSize: 20,
        onPageChange: handlePageChange,
        paginationProps: {
          showPageInfo: true,
        },
      });
      // Verify pagination is rendered with props
      expect(
        screen.getByRole('navigation', { name: /pagination/i })
      ).toBeInTheDocument();
    });
  });

  describe('Spacing Variants', () => {
    test('applies compact spacing', () => {
      renderBrowseList({ spacing: 'compact' });
      const region = screen.getByRole('region');
      expect(region).toHaveClass('space-y-3');
    });

    test('applies default spacing', () => {
      renderBrowseList({ spacing: 'default' });
      const region = screen.getByRole('region');
      expect(region).toHaveClass('space-y-6');
    });

    test('applies comfortable spacing', () => {
      renderBrowseList({ spacing: 'comfortable' });
      const region = screen.getByRole('region');
      expect(region).toHaveClass('space-y-8');
    });
  });

  describe('Dividers', () => {
    test('shows dividers when showDividers is true', () => {
      renderBrowseList({ showDividers: true });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('divide-y');
    });

    test('hides dividers when showDividers is false', () => {
      renderBrowseList({ showDividers: false });
      const list = screen.getByRole('list');
      expect(list).not.toHaveClass('divide-y');
    });
  });

  describe('Custom Rendering', () => {
    test('uses renderItem function for each item', () => {
      const renderItem = jest.fn((item: TestItem) => (
        <ListItem key={item.id}>{item.title}</ListItem>
      ));
      renderBrowseList({ renderItem });
      expect(renderItem).toHaveBeenCalledTimes(mockItems.length);
      mockItems.forEach((item, index) => {
        expect(renderItem).toHaveBeenNthCalledWith(index + 1, item, index);
      });
    });

    test('applies custom listClassName', () => {
      renderBrowseList({ listClassName: 'custom-list-class' });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('custom-list-class');
    });

    test('applies custom paginationClassName', () => {
      const handlePageChange = jest.fn();
      renderBrowseList({
        currentPage: 1,
        totalPages: 3,
        onPageChange: handlePageChange,
        paginationClassName: 'custom-pagination-class',
      });
      const nav = screen.getByRole('navigation', { name: /pagination/i });
      expect(nav.parentElement).toHaveClass('custom-pagination-class');
    });
  });

  describe('SimpleBrowseList', () => {
    test('renders without pagination', () => {
      render(
        <SimpleBrowseList
          items={mockItems}
          renderItem={(item: TestItem) => (
            <ListItem key={item.id}>{item.title}</ListItem>
          )}
        />
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(
        screen.queryByRole('navigation', { name: /pagination/i })
      ).not.toBeInTheDocument();
    });

    test('forwards all BrowseList props except pagination', () => {
      render(
        <SimpleBrowseList
          items={mockItems}
          renderItem={(item: TestItem) => (
            <ListItem key={item.id}>{item.title}</ListItem>
          )}
          spacing="compact"
          showDividers={true}
        />
      );
      const region = screen.getByRole('region');
      expect(region).toHaveClass('space-y-3');
      const list = screen.getByRole('list');
      expect(list).toHaveClass('divide-y');
    });
  });

  describe('Accessibility', () => {
    test('has no accessibility violations in default state', async () => {
      const { container } = renderBrowseList();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations in loading state', async () => {
      const { container } = renderBrowseList({ loading: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations in empty state', async () => {
      const { container } = renderBrowseList({ items: [] });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations in error state', async () => {
      const { container } = renderBrowseList({ error: 'Test error' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('has no accessibility violations with pagination', async () => {
      const handlePageChange = jest.fn();
      const { container } = renderBrowseList({
        currentPage: 1,
        totalPages: 3,
        onPageChange: handlePageChange,
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TypeScript Generics', () => {
    test('infers generic type correctly', () => {
      interface CustomItem {
        id: string;
        name: string;
      }
      const items: CustomItem[] = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];

      render(
        <BrowseList<CustomItem>
          items={items}
          renderItem={item => <ListItem key={item.id}>{item.name}</ListItem>}
        />
      );

      expect(screen.getByText('Test 1')).toBeInTheDocument();
      expect(screen.getByText('Test 2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles null items gracefully', () => {
      renderBrowseList({ items: null as unknown as TestItem[] });
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    test('handles undefined items gracefully', () => {
      renderBrowseList({ items: undefined as unknown as TestItem[] });
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    test('handles items with zero length', () => {
      renderBrowseList({ items: [] });
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    test('prioritizes error over loading', () => {
      renderBrowseList({ loading: true, error: 'Error occurred' });
      expect(screen.getByText('Error Loading Content')).toBeInTheDocument();
      expect(
        screen.queryByRole('region', { busy: true })
      ).not.toBeInTheDocument();
    });

    test('prioritizes loading over empty', () => {
      renderBrowseList({ loading: true, items: [] });
      expect(screen.queryByText('No items found')).not.toBeInTheDocument();
    });

    test('handles very large item arrays efficiently', () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Item ${i}`,
        description: `Description ${i}`,
      }));
      renderBrowseList({ items: largeItems });
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 999')).toBeInTheDocument();
    });
  });
});
