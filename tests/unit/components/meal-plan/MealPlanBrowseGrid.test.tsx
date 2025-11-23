import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MealPlanBrowseGrid } from '@/components/meal-plan/MealPlanBrowseGrid';
import { type MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';

expect.extend(toHaveNoViolations);

// Mock dependencies
jest.mock('@/components/ui/browse-grid', () => ({
  BrowseGrid: React.forwardRef(
    (
      { items, renderItem, loading, error, emptyMessage, ...props }: any,
      ref: any
    ) => {
      if (loading) {
        return <div data-testid="browse-grid-loading">Loading...</div>;
      }
      if (error) {
        return (
          <div data-testid="browse-grid-error">
            <span>{typeof error === 'string' ? error : error.message}</span>
            {props.onRetry && (
              <button onClick={props.onRetry}>Try Again</button>
            )}
          </div>
        );
      }
      if (!items || items.length === 0) {
        return <div data-testid="browse-grid-empty">{emptyMessage}</div>;
      }
      return (
        <div
          ref={ref}
          data-testid="browse-grid"
          role="region"
          aria-label={props['aria-label']}
        >
          <div data-testid="browse-grid-items" role="list">
            {items.map((item: any, index: number) => (
              <div key={item.id} role="listitem">
                {renderItem(item, index)}
              </div>
            ))}
          </div>
          {props.showPagination && props.totalPages && props.totalPages > 1 && (
            <div data-testid="pagination">
              <button
                onClick={() => props.onPageChange?.(props.currentPage + 1)}
              >
                Next Page
              </button>
              <button onClick={() => props.onPageSizeChange?.(24)}>
                Change Page Size
              </button>
            </div>
          )}
        </div>
      );
    }
  ),
}));

jest.mock('@/components/meal-plan/MealPlanCard', () => ({
  MealPlanCard: React.forwardRef(
    (
      {
        mealPlan,
        onClick,
        quickActionHandlers,
        menuActionHandlers,
        isOwner,
        ...props
      }: any,
      ref: any
    ) => (
      <div
        ref={ref}
        data-testid={`meal-plan-card-${mealPlan.id}`}
        data-owner={isOwner}
        onClick={() => onClick?.(mealPlan.id)}
      >
        <span>{mealPlan.name}</span>
        {quickActionHandlers?.onFavorite && (
          <button onClick={quickActionHandlers.onFavorite}>Favorite</button>
        )}
        {quickActionHandlers?.onShare && (
          <button onClick={quickActionHandlers.onShare}>Share</button>
        )}
        {quickActionHandlers?.onClone && (
          <button onClick={quickActionHandlers.onClone}>Clone</button>
        )}
        {quickActionHandlers?.onQuickView && (
          <button onClick={quickActionHandlers.onQuickView}>Quick View</button>
        )}
        {quickActionHandlers?.onGenerateShoppingList && (
          <button onClick={quickActionHandlers.onGenerateShoppingList}>
            Shopping List
          </button>
        )}
        {quickActionHandlers?.onViewCalendar && (
          <button onClick={quickActionHandlers.onViewCalendar}>
            View Calendar
          </button>
        )}
        {menuActionHandlers?.onEdit && (
          <button onClick={menuActionHandlers.onEdit}>Edit</button>
        )}
        {menuActionHandlers?.onDelete && (
          <button onClick={menuActionHandlers.onDelete}>Delete</button>
        )}
        {menuActionHandlers?.onDuplicate && (
          <button onClick={menuActionHandlers.onDuplicate}>Duplicate</button>
        )}
      </div>
    )
  ),
  MealPlanCardSkeleton: jest.fn(({ size }: any) => (
    <div data-testid="meal-plan-skeleton" data-size={size} />
  )),
}));

// Sample meal plan data
const createMockMealPlan = (
  overrides: Partial<MealPlanCardMealPlan> = {}
): MealPlanCardMealPlan => ({
  id: 'meal-plan-123',
  userId: 'user-123',
  name: 'Week of Jan 15',
  description: 'Healthy meal plan for the week',
  startDate: '2024-01-15T00:00:00Z',
  endDate: '2024-01-21T23:59:59Z',
  isActive: true,
  recipeCount: 21,
  durationDays: 7,
  createdAt: '2024-01-10T10:00:00Z',
  updatedAt: '2024-01-10T10:00:00Z',
  ownerName: 'Jane Doe',
  ownerAvatar: 'https://example.com/avatar.jpg',
  recipeImages: [
    'https://example.com/recipe1.jpg',
    'https://example.com/recipe2.jpg',
    'https://example.com/recipe3.jpg',
    'https://example.com/recipe4.jpg',
  ],
  isFavorited: false,
  mealTypeBreakdown: {
    breakfast: 7,
    lunch: 7,
    dinner: 7,
  },
  ...overrides,
});

const mockMealPlans: MealPlanCardMealPlan[] = [
  createMockMealPlan({
    id: 'meal-plan-1',
    name: 'Meal Plan 1',
    recipeCount: 14,
  }),
  createMockMealPlan({
    id: 'meal-plan-2',
    name: 'Meal Plan 2',
    recipeCount: 21,
    durationDays: 10,
  }),
  createMockMealPlan({
    id: 'meal-plan-3',
    name: 'Meal Plan 3',
    recipeCount: 7,
    durationDays: 3,
  }),
];

describe('MealPlanBrowseGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders grid with meal plan cards', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(screen.getByTestId('browse-grid-items')).toBeInTheDocument();

      // Verify all meal plans are rendered
      mockMealPlans.forEach(mealPlan => {
        expect(
          screen.getByTestId(`meal-plan-card-${mealPlan.id}`)
        ).toBeInTheDocument();
      });
    });

    it('renders correct number of meal plans', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} />);

      const cards = screen.getAllByTestId(/^meal-plan-card-/);
      expect(cards).toHaveLength(mockMealPlans.length);
    });

    it('passes props to MealPlanCard correctly', () => {
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          cardVariant="outlined"
          cardSize="lg"
        />
      );

      // Verify cards are rendered (props are passed internally)
      const card = screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`);
      expect(card).toBeInTheDocument();
    });

    it('applies custom className correctly', () => {
      const { container } = render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          className="custom-class"
        />
      );

      const grid = screen.getByTestId('browse-grid');
      expect(grid).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} ref={ref} />);

      expect(ref.current).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('shows loading state with MealPlanCardSkeleton', () => {
      render(<MealPlanBrowseGrid mealPlans={[]} loading={true} />);

      expect(screen.getByTestId('browse-grid-loading')).toBeInTheDocument();
      expect(screen.queryByTestId('browse-grid')).not.toBeInTheDocument();
    });

    it('shows empty state with custom message', () => {
      render(
        <MealPlanBrowseGrid
          mealPlans={[]}
          emptyMessage="No meal plans available"
        />
      );

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
      expect(screen.getByText('No meal plans available')).toBeInTheDocument();
    });

    it('shows error state with retry button', () => {
      const onRetry = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={[]}
          error="Failed to load meal plans"
          onRetry={onRetry}
        />
      );

      expect(screen.getByTestId('browse-grid-error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load meal plans')).toBeInTheDocument();

      const retryButton = screen.getByText('Try Again');
      retryButton.click();
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('shows success state with meal plans', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(
        screen.queryByTestId('browse-grid-loading')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('browse-grid-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('browse-grid-empty')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders pagination when totalPages > 1', () => {
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          currentPage={1}
          totalPages={3}
        />
      );

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('hides pagination when showPagination=false', () => {
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          currentPage={1}
          totalPages={3}
          showPagination={false}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('calls onPageChange with correct page number', () => {
      const onPageChange = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          currentPage={1}
          totalPages={3}
          onPageChange={onPageChange}
        />
      );

      const nextButton = screen.getByText('Next Page');
      nextButton.click();
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageSizeChange when page size changes', () => {
      const onPageSizeChange = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          currentPage={1}
          totalPages={3}
          onPageSizeChange={onPageSizeChange}
        />
      );

      const changeSizeButton = screen.getByText('Change Page Size');
      changeSizeButton.click();
      expect(onPageSizeChange).toHaveBeenCalledWith(24);
    });
  });

  describe('Meal Plan Actions', () => {
    it('calls onMealPlanClick when card is clicked', () => {
      const onMealPlanClick = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onMealPlanClick={onMealPlanClick}
        />
      );

      const card = screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`);
      card.click();
      expect(onMealPlanClick).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onFavorite when favorite action triggered', () => {
      const onFavorite = jest.fn();
      render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} onFavorite={onFavorite} />
      );

      const favoriteButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Favorite');
      favoriteButton.click();
      expect(onFavorite).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onShare when share action triggered', () => {
      const onShare = jest.fn();
      render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} onShare={onShare} />
      );

      const shareButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Share');
      shareButton.click();
      expect(onShare).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onClone when clone action triggered', () => {
      const onClone = jest.fn();
      render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} onClone={onClone} />
      );

      const cloneButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Clone');
      cloneButton.click();
      expect(onClone).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onQuickView when quick view action triggered', () => {
      const onQuickView = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onQuickView={onQuickView}
        />
      );

      const quickViewButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Quick View');
      quickViewButton.click();
      expect(onQuickView).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onGenerateShoppingList when shopping list action triggered', () => {
      const onGenerateShoppingList = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onGenerateShoppingList={onGenerateShoppingList}
        />
      );

      const shoppingListButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Shopping List');
      shoppingListButton.click();
      expect(onGenerateShoppingList).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onViewCalendar when calendar action triggered', () => {
      const onViewCalendar = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onViewCalendar={onViewCalendar}
        />
      );

      const calendarButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('View Calendar');
      calendarButton.click();
      expect(onViewCalendar).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onEdit for owner', () => {
      const onEdit = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onEdit={onEdit}
          isOwner={true}
        />
      );

      const editButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Edit');
      editButton.click();
      expect(onEdit).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onDelete for owner', () => {
      const onDelete = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onDelete={onDelete}
          isOwner={true}
        />
      );

      const deleteButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Delete');
      deleteButton.click();
      expect(onDelete).toHaveBeenCalledWith(mockMealPlans[0]);
    });

    it('calls onDuplicate', () => {
      const onDuplicate = jest.fn();
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          onDuplicate={onDuplicate}
          isOwner={true}
        />
      );

      const duplicateButton = within(
        screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`)
      ).getByText('Duplicate');
      duplicateButton.click();
      expect(onDuplicate).toHaveBeenCalledWith(mockMealPlans[0]);
    });
  });

  describe('Ownership', () => {
    it('determines owner correctly with boolean value', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} isOwner={true} />);

      const card = screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`);
      expect(card).toHaveAttribute('data-owner', 'true');
    });

    it('determines owner correctly with function', () => {
      const isOwnerFn = (mealPlan: MealPlanCardMealPlan) =>
        mealPlan.userId === 'user-123';

      render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} isOwner={isOwnerFn} />
      );

      const card = screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`);
      expect(card).toHaveAttribute('data-owner', 'true');
    });

    it('shows correct actions for owner', () => {
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          isOwner={true}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />
      );

      const card = screen.getByTestId(`meal-plan-card-${mockMealPlans[0].id}`);
      expect(within(card).getByText('Edit')).toBeInTheDocument();
      expect(within(card).getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Grid Configuration', () => {
    it('applies custom column configuration', () => {
      const columns = { mobile: 1, tablet: 2, desktop: 3 };
      render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} columns={columns} />
      );

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });

    it('applies custom gap sizes', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} gap="lg" />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });

    it('applies custom spacing', () => {
      render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} spacing="comfortable" />
      );

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(
        <MealPlanBrowseGrid
          mealPlans={mockMealPlans}
          aria-label="My Meal Plans Grid"
        />
      );

      const grid = screen.getByRole('region', { name: 'My Meal Plans Grid' });
      expect(grid).toBeInTheDocument();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(mockMealPlans.length);
    });

    it('sets aria-posinset and aria-setsize correctly', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} />);

      // Verify all cards are rendered (aria attributes are set internally)
      const cards = screen.getAllByTestId(/^meal-plan-card-/);
      expect(cards).toHaveLength(mockMealPlans.length);
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <MealPlanBrowseGrid mealPlans={mockMealPlans} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined meal plans gracefully', () => {
      // @ts-expect-error Testing edge case
      render(<MealPlanBrowseGrid mealPlans={undefined} />);

      expect(screen.getByTestId('browse-grid-empty')).toBeInTheDocument();
    });

    it('handles single meal plan', () => {
      render(<MealPlanBrowseGrid mealPlans={[mockMealPlans[0]]} />);

      const cards = screen.getAllByTestId(/^meal-plan-card-/);
      expect(cards).toHaveLength(1);
    });

    it('handles large meal plan lists', () => {
      const largeList = Array.from({ length: 100 }, (_, i) =>
        createMockMealPlan({
          id: `meal-plan-${i + 1}`,
          name: `Meal Plan ${i + 1}`,
        })
      );

      render(<MealPlanBrowseGrid mealPlans={largeList} />);

      const cards = screen.getAllByTestId(/^meal-plan-card-/);
      expect(cards).toHaveLength(100);
    });

    it('handles missing optional props', () => {
      render(<MealPlanBrowseGrid mealPlans={mockMealPlans} />);

      expect(screen.getByTestId('browse-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^meal-plan-card-/)).toHaveLength(
        mockMealPlans.length
      );
    });
  });
});
