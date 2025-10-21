import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowseGrid, SimpleBrowseGrid } from '@/components/ui/browse-grid';

// Mock data
interface MockItem {
  id: number;
  title: string;
  category: string;
}

const mockItems: MockItem[] = [
  { id: 1, title: 'Item 1', category: 'Category A' },
  { id: 2, title: 'Item 2', category: 'Category B' },
  { id: 3, title: 'Item 3', category: 'Category A' },
  { id: 4, title: 'Item 4', category: 'Category C' },
  { id: 5, title: 'Item 5', category: 'Category B' },
  { id: 6, title: 'Item 6', category: 'Category A' },
];

const MockItemCard = ({ item }: { item: MockItem }) => (
  <div data-testid={`item-${item.id}`}>
    <h3>{item.title}</h3>
    <p>{item.category}</p>
  </div>
);

describe('BrowseGrid', () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with items', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders all items using renderItem', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      mockItems.forEach(item => {
        expect(screen.getByTestId(`item-${item.id}`)).toBeInTheDocument();
        expect(screen.getByText(item.title)).toBeInTheDocument();
      });
    });

    it('applies custom className', () => {
      const { container } = render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies custom gridClassName to grid element', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          gridClassName="custom-grid-class"
        />
      );

      const listElement = screen.getByRole('list');
      expect(listElement).toHaveClass('custom-grid-class');
    });

    it('uses custom aria-label', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          aria-label="Custom recipe grid"
        />
      );

      expect(screen.getByLabelText('Custom recipe grid')).toBeInTheDocument();
    });

    it('applies gap variants correctly', () => {
      const { rerender } = render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          gap="sm"
        />
      );

      let gridElement = screen.getByRole('list');
      expect(gridElement).toHaveClass('gap-3');

      rerender(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          gap="lg"
        />
      );

      gridElement = screen.getByRole('list');
      expect(gridElement).toHaveClass('gap-6');
    });
  });

  describe('Pagination', () => {
    it('shows pagination when enabled and totalPages > 1', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          showPagination={true}
        />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('hides pagination when disabled', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          showPagination={false}
        />
      );

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('hides pagination when totalPages is 1', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
          showPagination={true}
        />
      );

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('calls onPageChange when page changes', async () => {
      const user = userEvent.setup();

      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
      await user.click(page2Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('passes paginationProps to Pagination component', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          paginationProps={{
            showPageInfo: true,
            totalItems: 50,
            pageSize: 10,
          }}
        />
      );

      expect(screen.getByText(/Showing/)).toBeInTheDocument();
    });

    it('applies custom paginationClassName', () => {
      const { container } = render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          paginationClassName="custom-pagination-class"
        />
      );

      const paginationWrapper = container.querySelector(
        '.custom-pagination-class'
      );
      expect(paginationWrapper).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows skeletons when loading', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          loading={true}
          skeletonCount={6}
        />
      );

      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('sets aria-busy when loading', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          loading={true}
        />
      );

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-busy', 'true');
    });

    it('shows correct number of skeletons', () => {
      const { container } = render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          loading={true}
          skeletonCount={8}
        />
      );

      // Verify skeletons are rendered (grid element exists with children during loading)
      const gridElement = container.querySelector('.grid');
      expect(gridElement).toBeInTheDocument();
      expect(gridElement?.children.length).toBe(8);
    });

    it('uses custom skeleton renderer', () => {
      const CustomSkeleton = () => (
        <div data-testid="custom-skeleton">Loading...</div>
      );

      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          loading={true}
          skeletonCount={3}
          renderSkeleton={() => <CustomSkeleton />}
        />
      );

      const customSkeletons = screen.getAllByTestId('custom-skeleton');
      expect(customSkeletons).toHaveLength(3);
    });

    it('does not show items or pagination when loading', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          loading={true}
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no items', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          emptyMessage="No items found"
        />
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('shows empty state with custom description', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          emptyMessage="No recipes"
          emptyDescription="Try adjusting your filters"
        />
      );

      expect(screen.getByText('No recipes')).toBeInTheDocument();
      expect(
        screen.getByText('Try adjusting your filters')
      ).toBeInTheDocument();
    });

    it('shows empty state with custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">🔍</div>;

      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          emptyMessage="No items"
          emptyIcon={<CustomIcon />}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('shows empty state with custom actions', () => {
      const mockAction = jest.fn();

      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          emptyMessage="No items"
          emptyActions={<button onClick={mockAction}>Add Item</button>}
        />
      );

      const button = screen.getByText('Add Item');
      fireEvent.click(button);
      expect(mockAction).toHaveBeenCalled();
    });

    it('handles undefined items array as empty', () => {
      render(
        <BrowseGrid<MockItem>
          // @ts-expect-error Testing undefined items
          items={undefined}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          emptyMessage="No items"
        />
      );

      expect(screen.getByText('No items')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('shows error message when error is provided', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error="Failed to load items"
        />
      );

      expect(screen.getByText('Error Loading Content')).toBeInTheDocument();
      expect(screen.getByText('Failed to load items')).toBeInTheDocument();
    });

    it('shows error message from Error object', () => {
      const error = new Error('Network error');

      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error={error}
        />
      );

      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('shows retry button when onRetry is provided', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error="Failed to load"
          onRetry={mockOnRetry}
        />
      );

      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error="Failed to load"
          onRetry={mockOnRetry}
        />
      );

      const retryButton = screen.getByText('Try Again');
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('uses custom error renderer when provided', () => {
      const CustomError = ({ error }: { error: string }) => (
        <div data-testid="custom-error">Custom: {error}</div>
      );

      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error="Test error"
          renderError={error => <CustomError error={error as string} />}
        />
      );

      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
      expect(screen.getByText('Custom: Test error')).toBeInTheDocument();
    });

    it('does not show retry button when onRetry is not provided', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error="Failed to load"
        />
      );

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Grid', () => {
    it('applies default responsive column classes', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      const gridElement = screen.getByRole('list');
      expect(gridElement).toHaveClass('grid-cols-2');
      expect(gridElement).toHaveClass('md:grid-cols-3');
      expect(gridElement).toHaveClass('lg:grid-cols-4');
    });

    it('applies custom column configuration', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        />
      );

      const gridElement = screen.getByRole('list');
      expect(gridElement).toHaveClass('grid-cols-1');
      expect(gridElement).toHaveClass('md:grid-cols-2');
      expect(gridElement).toHaveClass('lg:grid-cols-3');
    });

    it('applies partial custom columns with defaults', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          columns={{ desktop: 5 }}
        />
      );

      const gridElement = screen.getByRole('list');
      expect(gridElement).toHaveClass('lg:grid-cols-5');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          aria-label="Recipe grid"
        />
      );

      expect(screen.getByLabelText('Recipe grid')).toBeInTheDocument();
    });

    it('uses default aria-label when not provided', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      expect(screen.getByLabelText('Browse grid')).toBeInTheDocument();
    });

    it('supports aria-describedby attribute', () => {
      render(
        <div>
          <p id="grid-description">This grid shows recipes</p>
          <BrowseGrid<MockItem>
            items={mockItems}
            renderItem={item => <MockItemCard key={item.id} item={item} />}
            aria-describedby="grid-description"
          />
        </div>
      );

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-describedby', 'grid-description');
    });

    it('sets proper role attributes', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(mockItems.length);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero items gracefully', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          emptyMessage="No items"
        />
      );

      expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('handles single item', () => {
      const singleItem = [mockItems[0]!];

      render(
        <BrowseGrid<MockItem>
          items={singleItem}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      expect(screen.getByTestId('item-1')).toBeInTheDocument();
    });

    it('prioritizes error state over empty state', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          error="Error occurred"
          emptyMessage="No items"
        />
      );

      expect(screen.getByText('Error Loading Content')).toBeInTheDocument();
      expect(screen.queryByText('No items')).not.toBeInTheDocument();
    });

    it('prioritizes loading state over error and empty', () => {
      render(
        <BrowseGrid<MockItem>
          items={[]}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          loading={true}
          error="Error occurred"
          emptyMessage="No items"
        />
      );

      expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
      expect(
        screen.queryByText('Error Loading Content')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('No items')).not.toBeInTheDocument();
    });

    it('handles missing onPageChange gracefully', () => {
      render(
        <BrowseGrid<MockItem>
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
          currentPage={1}
          totalPages={5}
        />
      );

      // Pagination should not show without onPageChange
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to container element', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <BrowseGrid<MockItem>
          ref={ref}
          items={mockItems}
          renderItem={item => <MockItemCard key={item.id} item={item} />}
        />
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('flex', 'flex-col');
    });
  });
});

describe('SimpleBrowseGrid', () => {
  it('renders without pagination', () => {
    render(
      <SimpleBrowseGrid<MockItem>
        items={mockItems}
        renderItem={item => <MockItemCard key={item.id} item={item} />}
      />
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders all items', () => {
    render(
      <SimpleBrowseGrid<MockItem>
        items={mockItems}
        renderItem={item => <MockItemCard key={item.id} item={item} />}
      />
    );

    mockItems.forEach(item => {
      expect(screen.getByTestId(`item-${item.id}`)).toBeInTheDocument();
    });
  });

  it('supports loading state', () => {
    render(
      <SimpleBrowseGrid<MockItem>
        items={[]}
        renderItem={item => <MockItemCard key={item.id} item={item} />}
        loading={true}
      />
    );

    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('supports empty state', () => {
    render(
      <SimpleBrowseGrid<MockItem>
        items={[]}
        renderItem={item => <MockItemCard key={item.id} item={item} />}
        emptyMessage="No items to display"
      />
    );

    expect(screen.getByText('No items to display')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <SimpleBrowseGrid<MockItem>
        ref={ref}
        items={mockItems}
        renderItem={item => <MockItemCard key={item.id} item={item} />}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
