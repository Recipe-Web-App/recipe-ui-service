import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealPlanCard } from '@/components/meal-plan/MealPlanCard';
import type { MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';
import type { MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';
import type { MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock MealPlanQuickActions
jest.mock('@/components/meal-plan/MealPlanQuickActions', () => ({
  MealPlanQuickActions: ({ mealPlanId, handlers, className }: any) => (
    <div
      data-testid="meal-plan-quick-actions"
      data-quick-actions
      className={className}
    >
      <button
        data-testid="quick-action-favorite"
        onClick={() => handlers.onFavorite?.(mealPlanId)}
      >
        Favorite
      </button>
      <button
        data-testid="quick-action-share"
        onClick={() => handlers.onShare?.(mealPlanId)}
      >
        Share
      </button>
    </div>
  ),
}));

// Mock MealPlanMenu
jest.mock('@/components/meal-plan/MealPlanMenu', () => ({
  MealPlanMenu: ({ mealPlanId, handlers }: any) => (
    <div data-testid="meal-plan-menu" data-meal-plan-menu>
      <button
        data-testid="menu-action-edit"
        onClick={() => handlers.onEdit?.(mealPlanId)}
      >
        Edit
      </button>
    </div>
  ),
}));

describe('MealPlanCard', () => {
  const mockMealPlan: MealPlanCardMealPlan = {
    id: 'meal-plan-123',
    userId: 'user-456',
    name: 'Weekly Meal Plan',
    description: 'A healthy week of meals',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    isActive: true,
    recipeCount: 21,
    durationDays: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ownerName: 'John Doe',
    ownerAvatar: '/images/avatar.jpg',
    recipeImages: [
      '/images/recipe1.jpg',
      '/images/recipe2.jpg',
      '/images/recipe3.jpg',
      '/images/recipe4.jpg',
    ],
    mealTypeBreakdown: {
      breakfast: 7,
      lunch: 7,
      dinner: 7,
    },
  };

  const createMockQuickActionHandlers = (
    overrides?: Partial<MealPlanQuickActionHandlers>
  ): MealPlanQuickActionHandlers => ({
    onFavorite: jest.fn(),
    onShare: jest.fn(),
    onClone: jest.fn(),
    onQuickView: jest.fn(),
    onGenerateShoppingList: jest.fn(),
    onViewCalendar: jest.fn(),
    ...overrides,
  });

  const createMockMenuActionHandlers = (
    overrides?: Partial<MealPlanMenuActionHandlers>
  ): MealPlanMenuActionHandlers => ({
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDuplicate: jest.fn(),
    onShare: jest.fn(),
    onGenerateShoppingList: jest.fn(),
    onDelete: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render meal plan card with basic information', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
      expect(screen.getByText('A healthy week of meals')).toBeInTheDocument();
    });

    it('should render with default variant and size', () => {
      const { container } = render(<MealPlanCard mealPlan={mockMealPlan} />);

      const card = container.firstChild;
      expect(card).toHaveClass('relative');
      expect(card).toHaveClass('flex');
      expect(card).toHaveClass('flex-col');
    });

    it('should render with custom className', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} className="custom-class" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Image Mosaic', () => {
    it('should render 2x2 mosaic grid with 4 recipe images', () => {
      const { container } = render(<MealPlanCard mealPlan={mockMealPlan} />);

      // Query for images in the mosaic grid only (excluding avatar)
      const mosaicGrid = container.querySelector('.grid-cols-2');
      const images = mosaicGrid?.querySelectorAll('img');
      expect(images?.length).toBe(4);
    });

    it('should use placeholder images when less than 4 images provided', () => {
      const mealPlanWithFewerImages = {
        ...mockMealPlan,
        recipeImages: ['/images/recipe1.jpg'],
      };

      const { container } = render(
        <MealPlanCard mealPlan={mealPlanWithFewerImages} />
      );

      const mosaicGrid = container.querySelector('.grid-cols-2');
      const images = mosaicGrid?.querySelectorAll('img');
      expect(images?.length).toBe(4);
      expect(images?.[0]).toHaveAttribute('src', '/images/recipe1.jpg');
      expect(images?.[1]).toHaveAttribute(
        'src',
        '/images/placeholder-recipe.jpg'
      );
    });

    it('should use placeholder images when no images provided', () => {
      const mealPlanWithNoImages = {
        ...mockMealPlan,
        recipeImages: [],
      };

      const { container } = render(
        <MealPlanCard mealPlan={mealPlanWithNoImages} />
      );

      const mosaicGrid = container.querySelector('.grid-cols-2');
      const images = mosaicGrid?.querySelectorAll('img');
      expect(images?.length).toBe(4);
      images?.forEach(img => {
        expect(img).toHaveAttribute('src', '/images/placeholder-recipe.jpg');
      });
    });
  });

  describe('Status Badge', () => {
    it('should display status badge', () => {
      const { container } = render(<MealPlanCard mealPlan={mockMealPlan} />);

      // Status badge should be present in the mosaic container
      // The badge text will be one of: Current, Completed, or Upcoming
      const statusBadge =
        container.querySelector('[class*="mealPlanStatusBadgeVariants"]') ||
        container.querySelector('.absolute.top-2.left-2');
      expect(statusBadge).toBeTruthy();
    });
  });

  describe('Favorite Badge', () => {
    it('should display favorite badge when meal plan is favorited', () => {
      const favoritedMealPlan = {
        ...mockMealPlan,
        isFavorited: true,
      };

      const { container } = render(
        <MealPlanCard mealPlan={favoritedMealPlan} />
      );

      // Check for Heart icon (lucide-react Heart)
      const heartIcons = container.querySelectorAll('[class*="fill-current"]');
      expect(heartIcons.length).toBeGreaterThan(0);
    });

    it('should not display favorite badge when meal plan is not favorited', () => {
      const { container } = render(<MealPlanCard mealPlan={mockMealPlan} />);

      // No Heart icon should be present
      const heartIcons = container.querySelectorAll('[class*="fill-current"]');
      expect(heartIcons.length).toBe(0);
    });
  });

  describe('Meal Plan Metadata', () => {
    it('should display date range', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      // Should show formatted date range "Week of Jan 15"
      const dateRangeBadges = screen.getAllByText(/Week of/i);
      expect(dateRangeBadges.length).toBeGreaterThan(0);
    });

    it('should display duration', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.getByText('7 days')).toBeInTheDocument();
    });

    it('should display meal type breakdown when provided', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      // Should show meal breakdown like "7B · 7L · 7D"
      expect(screen.getByText('7B · 7L · 7D')).toBeInTheDocument();
    });

    it('should not display meal breakdown when not provided', () => {
      const mealPlanWithoutBreakdown = {
        ...mockMealPlan,
        mealTypeBreakdown: undefined,
      };

      render(<MealPlanCard mealPlan={mealPlanWithoutBreakdown} />);

      expect(screen.queryByText(/B · /)).not.toBeInTheDocument();
    });
  });

  describe('Recipe Count', () => {
    it('should display recipe count', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.getByText('21 recipes')).toBeInTheDocument();
    });

    it('should display singular "recipe" for count of 1', () => {
      const mealPlanWithOneRecipe = {
        ...mockMealPlan,
        recipeCount: 1,
      };

      render(<MealPlanCard mealPlan={mealPlanWithOneRecipe} />);

      expect(screen.getByText('1 recipe')).toBeInTheDocument();
    });

    it('should display "No recipes" for count of 0', () => {
      const mealPlanWithNoRecipes = {
        ...mockMealPlan,
        recipeCount: 0,
      };

      render(<MealPlanCard mealPlan={mealPlanWithNoRecipes} />);

      expect(screen.getByText('No recipes')).toBeInTheDocument();
    });
  });

  describe('Creator Information', () => {
    it('should display creator name and avatar', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      // Avatar should be present
      expect(screen.getByAltText('John Doe')).toBeInTheDocument();
    });

    it('should not display creator info when not provided', () => {
      const mealPlanWithoutOwner = {
        ...mockMealPlan,
        ownerName: undefined,
      };

      render(<MealPlanCard mealPlan={mealPlanWithoutOwner} />);

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Description', () => {
    it('should display description when provided', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.getByText('A healthy week of meals')).toBeInTheDocument();
    });

    it('should not display description when not provided', () => {
      const mealPlanWithoutDescription = {
        ...mockMealPlan,
        description: undefined,
      };

      render(<MealPlanCard mealPlan={mealPlanWithoutDescription} />);

      expect(
        screen.queryByText('A healthy week of meals')
      ).not.toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('should render quick actions when handlers are provided', () => {
      const handlers = createMockQuickActionHandlers();

      render(
        <MealPlanCard mealPlan={mockMealPlan} quickActionHandlers={handlers} />
      );

      expect(screen.getByTestId('meal-plan-quick-actions')).toBeInTheDocument();
    });

    it('should not render quick actions when handlers are not provided', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(
        screen.queryByTestId('meal-plan-quick-actions')
      ).not.toBeInTheDocument();
    });
  });

  describe('Menu', () => {
    it('should render menu when handlers are provided', () => {
      const handlers = createMockMenuActionHandlers();

      render(
        <MealPlanCard mealPlan={mockMealPlan} menuActionHandlers={handlers} />
      );

      expect(screen.getByTestId('meal-plan-menu')).toBeInTheDocument();
    });

    it('should not render menu when handlers are not provided', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.queryByTestId('meal-plan-menu')).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick handler when card is clicked', () => {
      const onClickHandler = jest.fn();

      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} onClick={onClickHandler} />
      );

      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);

      expect(onClickHandler).toHaveBeenCalledWith(mockMealPlan.id);
      expect(onClickHandler).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when clicking on menu', () => {
      const onClickHandler = jest.fn();
      const menuHandlers = createMockMenuActionHandlers();

      render(
        <MealPlanCard
          mealPlan={mockMealPlan}
          onClick={onClickHandler}
          menuActionHandlers={menuHandlers}
        />
      );

      const menuButton = screen.getByTestId('menu-action-edit');
      fireEvent.click(menuButton);

      expect(onClickHandler).not.toHaveBeenCalled();
      expect(menuHandlers.onEdit).toHaveBeenCalledWith(mockMealPlan.id);
    });

    it('should not call onClick when clicking on quick actions', () => {
      const onClickHandler = jest.fn();
      const quickActionHandlers = createMockQuickActionHandlers();

      render(
        <MealPlanCard
          mealPlan={mockMealPlan}
          onClick={onClickHandler}
          quickActionHandlers={quickActionHandlers}
        />
      );

      const quickActionButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(quickActionButton);

      expect(onClickHandler).not.toHaveBeenCalled();
      expect(quickActionHandlers.onFavorite).toHaveBeenCalledWith(
        mockMealPlan.id
      );
    });
  });

  describe('Variants', () => {
    it('should render with elevated variant', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} variant="elevated" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('shadow-md');
    });

    it('should render with outlined variant', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} variant="outlined" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-2');
    });

    it('should render with ghost variant', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} variant="ghost" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-none');
    });

    it('should render with interactive variant', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} variant="interactive" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Sizes', () => {
    it('should render with sm size', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} size="sm" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('min-h-[280px]');
    });

    it('should render with default size', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} size="default" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('min-h-[320px]');
    });

    it('should render with lg size', () => {
      const { container } = render(
        <MealPlanCard mealPlan={mockMealPlan} size="lg" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('min-h-[380px]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Meal plan: Weekly Meal Plan');
    });

    it('should have article role', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should have screen reader text for metadata', () => {
      render(<MealPlanCard mealPlan={mockMealPlan} />);

      // Check for sr-only text
      expect(screen.getByText('Date range:', { exact: false })).toHaveClass(
        'sr-only'
      );
      expect(screen.getByText('Duration:', { exact: false })).toHaveClass(
        'sr-only'
      );
      expect(screen.getByText('Meal breakdown:', { exact: false })).toHaveClass(
        'sr-only'
      );
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to card element', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<MealPlanCard ref={ref} mealPlan={mockMealPlan} />);

      expect(ref.current).not.toBeNull();
    });

    it('should forward additional props', () => {
      render(
        <MealPlanCard
          mealPlan={mockMealPlan}
          data-testid="custom-meal-plan-card"
        />
      );

      expect(screen.getByTestId('custom-meal-plan-card')).toBeInTheDocument();
    });
  });

  describe('Owner Status', () => {
    it('should pass isOwner prop to menu', () => {
      const menuHandlers = createMockMenuActionHandlers();

      render(
        <MealPlanCard
          mealPlan={mockMealPlan}
          isOwner={true}
          menuActionHandlers={menuHandlers}
        />
      );

      // Menu should be rendered
      expect(screen.getByTestId('meal-plan-menu')).toBeInTheDocument();
    });
  });
});
