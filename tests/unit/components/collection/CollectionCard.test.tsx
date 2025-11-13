import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CollectionCard,
  CollectionCardSkeleton,
} from '@/components/collection/CollectionCard';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import type { CollectionCardCollection } from '@/types/ui/collection-card';
import type { CollectionQuickActionHandlers } from '@/types/collection/quick-actions';
import type { CollectionMenuActionHandlers } from '@/types/collection/menu';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock CollectionQuickActions
jest.mock('@/components/collection/CollectionQuickActions', () => ({
  CollectionQuickActions: ({ collectionId, handlers, className }: any) => (
    <div
      data-testid="collection-quick-actions"
      data-quick-actions
      className={className}
    >
      <button
        data-testid="quick-action-favorite"
        onClick={() => handlers.onFavorite?.(collectionId)}
      >
        Favorite
      </button>
      <button
        data-testid="quick-action-share"
        onClick={() => handlers.onShare?.(collectionId)}
      >
        Share
      </button>
    </div>
  ),
}));

// Mock CollectionMenu
jest.mock('@/components/collection/CollectionMenu', () => ({
  CollectionMenu: ({ collectionId, handlers }: any) => (
    <div data-testid="collection-menu" data-collection-menu>
      <button
        data-testid="menu-action-edit"
        onClick={() => handlers.onEdit?.(collectionId)}
      >
        Edit
      </button>
    </div>
  ),
}));

describe('CollectionCard', () => {
  const mockCollection: CollectionCardCollection = {
    collectionId: 123,
    userId: 'user-456',
    name: 'My Collection',
    description: 'A great collection of recipes',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 5,
    collaboratorCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    recipeImages: [
      '/images/recipe1.jpg',
      '/images/recipe2.jpg',
      '/images/recipe3.jpg',
      '/images/recipe4.jpg',
    ],
  };

  const createMockQuickActionHandlers = (
    overrides?: Partial<CollectionQuickActionHandlers>
  ): CollectionQuickActionHandlers => ({
    onFavorite: jest.fn(),
    onShare: jest.fn(),
    onAddRecipes: jest.fn(),
    onQuickView: jest.fn(),
    ...overrides,
  });

  const createMockMenuActionHandlers = (
    overrides?: Partial<CollectionMenuActionHandlers>
  ): CollectionMenuActionHandlers => ({
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onManageRecipes: jest.fn(),
    onManageCollaborators: jest.fn(),
    onShare: jest.fn(),
    onDuplicate: jest.fn(),
    onReport: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render collection card with basic information', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(screen.getByText('My Collection')).toBeInTheDocument();
      expect(
        screen.getByText('A great collection of recipes')
      ).toBeInTheDocument();
      expect(screen.getByText('5 recipes')).toBeInTheDocument();
      expect(screen.getByText('Public')).toBeInTheDocument();
    });

    it('should render with custom variant', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} variant="elevated" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with custom size', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} size="lg" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <CollectionCard collection={mockCollection} className="custom-class" />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveClass('custom-class');
    });

    it('should render without description', () => {
      const collectionWithoutDesc = {
        ...mockCollection,
        description: undefined,
      };
      render(<CollectionCard collection={collectionWithoutDesc} />);

      expect(screen.getByText('My Collection')).toBeInTheDocument();
      expect(
        screen.queryByText('A great collection of recipes')
      ).not.toBeInTheDocument();
    });
  });

  describe('Mosaic Image Grid', () => {
    it('should render 4 images when collection has 4 images', () => {
      render(<CollectionCard collection={mockCollection} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
      expect(images[0]).toHaveAttribute('src', '/images/recipe1.jpg');
      expect(images[1]).toHaveAttribute('src', '/images/recipe2.jpg');
      expect(images[2]).toHaveAttribute('src', '/images/recipe3.jpg');
      expect(images[3]).toHaveAttribute('src', '/images/recipe4.jpg');
    });

    it('should render placeholders when collection has fewer than 4 images', () => {
      const collectionWithFewImages = {
        ...mockCollection,
        recipeImages: ['/images/recipe1.jpg', '/images/recipe2.jpg'],
      };
      render(<CollectionCard collection={collectionWithFewImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
      expect(images[0]).toHaveAttribute('src', '/images/recipe1.jpg');
      expect(images[1]).toHaveAttribute('src', '/images/recipe2.jpg');
      expect(images[2]).toHaveAttribute(
        'src',
        '/images/placeholder-recipe.jpg'
      );
      expect(images[3]).toHaveAttribute(
        'src',
        '/images/placeholder-recipe.jpg'
      );
    });

    it('should render all placeholders when collection has no images', () => {
      const collectionWithNoImages = {
        ...mockCollection,
        recipeImages: undefined,
      };
      render(<CollectionCard collection={collectionWithNoImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
      images.forEach(img => {
        expect(img).toHaveAttribute('src', '/images/placeholder-recipe.jpg');
      });
    });

    it('should only use first 4 images when collection has more than 4 images', () => {
      const collectionWithManyImages = {
        ...mockCollection,
        recipeImages: [
          '/images/recipe1.jpg',
          '/images/recipe2.jpg',
          '/images/recipe3.jpg',
          '/images/recipe4.jpg',
          '/images/recipe5.jpg',
          '/images/recipe6.jpg',
        ],
      };
      render(<CollectionCard collection={collectionWithManyImages} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
      expect(images[0]).toHaveAttribute('src', '/images/recipe1.jpg');
      expect(images[1]).toHaveAttribute('src', '/images/recipe2.jpg');
      expect(images[2]).toHaveAttribute('src', '/images/recipe3.jpg');
      expect(images[3]).toHaveAttribute('src', '/images/recipe4.jpg');
    });
  });

  describe('Visibility Display', () => {
    it('should display PUBLIC visibility correctly', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(screen.getByText('Public')).toBeInTheDocument();
    });

    it('should display PRIVATE visibility correctly', () => {
      const privateCollection = {
        ...mockCollection,
        visibility: CollectionVisibility.PRIVATE,
      };
      render(<CollectionCard collection={privateCollection} />);

      expect(screen.getByText('Private')).toBeInTheDocument();
    });

    it('should display FRIENDS_ONLY visibility correctly', () => {
      const friendsCollection = {
        ...mockCollection,
        visibility: CollectionVisibility.FRIENDS_ONLY,
      };
      render(<CollectionCard collection={friendsCollection} />);

      expect(screen.getByText('Friends Only')).toBeInTheDocument();
    });
  });

  describe('Stats Display', () => {
    it('should display recipe count', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(screen.getByText('5 recipes')).toBeInTheDocument();
    });

    it('should display collaborator count when greater than 0', () => {
      const collectionWithCollaborators = {
        ...mockCollection,
        collaboratorCount: 3,
      };
      render(<CollectionCard collection={collectionWithCollaborators} />);

      expect(screen.getByText('3 collaborators')).toBeInTheDocument();
    });

    it('should not display collaborator count when 0', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(screen.queryByText(/collaborators/)).not.toBeInTheDocument();
    });

    it('should handle singular recipe count', () => {
      const collectionWithOneRecipe = {
        ...mockCollection,
        recipeCount: 1,
      };
      render(<CollectionCard collection={collectionWithOneRecipe} />);

      expect(screen.getByText('1 recipes')).toBeInTheDocument();
    });

    it('should handle zero recipe count', () => {
      const emptyCollection = {
        ...mockCollection,
        recipeCount: 0,
      };
      render(<CollectionCard collection={emptyCollection} />);

      expect(screen.getByText('0 recipes')).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('should render quick actions when handlers are provided', () => {
      const handlers = createMockQuickActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          quickActionHandlers={handlers}
        />
      );

      expect(
        screen.getByTestId('collection-quick-actions')
      ).toBeInTheDocument();
    });

    it('should not render quick actions when handlers are not provided', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(
        screen.queryByTestId('collection-quick-actions')
      ).not.toBeInTheDocument();
    });

    it('should pass correct props to QuickActions component', () => {
      const handlers = createMockQuickActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          quickActionHandlers={handlers}
          isOwner={true}
        />
      );

      const quickActions = screen.getByTestId('collection-quick-actions');
      expect(quickActions).toBeInTheDocument();
    });
  });

  describe('Menu', () => {
    it('should render menu when handlers are provided', () => {
      const handlers = createMockMenuActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          menuActionHandlers={handlers}
        />
      );

      expect(screen.getByTestId('collection-menu')).toBeInTheDocument();
    });

    it('should not render menu when handlers are not provided', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(screen.queryByTestId('collection-menu')).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick handler when card is clicked', () => {
      const onClick = jest.fn();
      render(<CollectionCard collection={mockCollection} onClick={onClick} />);

      const card = screen.getByRole('article');
      fireEvent.click(card);

      expect(onClick).toHaveBeenCalledWith(123);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not propagate click when clicking on menu', () => {
      const onClick = jest.fn();
      const menuHandlers = createMockMenuActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          onClick={onClick}
          menuActionHandlers={menuHandlers}
        />
      );

      const menuButton = screen.getByTestId('menu-action-edit');
      fireEvent.click(menuButton);

      expect(onClick).not.toHaveBeenCalled();
      expect(menuHandlers.onEdit).toHaveBeenCalledWith(123);
    });

    it('should not propagate click when clicking on quick actions', () => {
      const onClick = jest.fn();
      const quickHandlers = createMockQuickActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          onClick={onClick}
          quickActionHandlers={quickHandlers}
        />
      );

      const favoriteButton = screen.getByTestId('quick-action-favorite');
      fireEvent.click(favoriteButton);

      expect(onClick).not.toHaveBeenCalled();
      expect(quickHandlers.onFavorite).toHaveBeenCalledWith(123);
    });

    it('should not call onClick when not provided', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} />
      );

      const card = container.querySelector('[role="article"]');
      expect(() => fireEvent.click(card!)).not.toThrow();
    });
  });

  describe('Ownership & Collaboration', () => {
    it('should pass isOwner prop to child components', () => {
      const quickHandlers = createMockQuickActionHandlers();
      const menuHandlers = createMockMenuActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          quickActionHandlers={quickHandlers}
          menuActionHandlers={menuHandlers}
          isOwner={true}
        />
      );

      expect(
        screen.getByTestId('collection-quick-actions')
      ).toBeInTheDocument();
      expect(screen.getByTestId('collection-menu')).toBeInTheDocument();
    });

    it('should pass isCollaborator prop to child components', () => {
      const quickHandlers = createMockQuickActionHandlers();
      const menuHandlers = createMockMenuActionHandlers();
      render(
        <CollectionCard
          collection={mockCollection}
          quickActionHandlers={quickHandlers}
          menuActionHandlers={menuHandlers}
          isCollaborator={true}
        />
      );

      expect(
        screen.getByTestId('collection-quick-actions')
      ).toBeInTheDocument();
      expect(screen.getByTestId('collection-menu')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      render(<CollectionCard collection={mockCollection} />);

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Collection: My Collection');
    });

    it('should have proper role', () => {
      render(<CollectionCard collection={mockCollection} />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should have sr-only text for visibility label', () => {
      render(<CollectionCard collection={mockCollection} />);

      const srOnly = screen.getByText('Visibility:', { selector: '.sr-only' });
      expect(srOnly).toBeInTheDocument();
    });

    it('should have proper alt text for images', () => {
      render(<CollectionCard collection={mockCollection} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'Recipe 1 from My Collection');
      expect(images[1]).toHaveAttribute('alt', 'Recipe 2 from My Collection');
      expect(images[2]).toHaveAttribute('alt', 'Recipe 3 from My Collection');
      expect(images[3]).toHaveAttribute('alt', 'Recipe 4 from My Collection');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward ref to card element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CollectionCard ref={ref} collection={mockCollection} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('DIV');
    });

    it('should forward additional props to card', () => {
      render(
        <CollectionCard collection={mockCollection} data-testid="custom-card" />
      );

      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle collection with very long name', () => {
      const longNameCollection = {
        ...mockCollection,
        name: 'A'.repeat(200),
      };
      render(<CollectionCard collection={longNameCollection} />);

      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });

    it('should handle collection with very long description', () => {
      const longDescCollection = {
        ...mockCollection,
        description: 'B'.repeat(500),
      };
      render(<CollectionCard collection={longDescCollection} />);

      expect(screen.getByText('B'.repeat(500))).toBeInTheDocument();
    });

    it('should handle collection with large recipe count', () => {
      const largeCountCollection = {
        ...mockCollection,
        recipeCount: 9999,
      };
      render(<CollectionCard collection={largeCountCollection} />);

      expect(screen.getByText('9999 recipes')).toBeInTheDocument();
    });

    it('should handle collection with large collaborator count', () => {
      const largeCollabCollection = {
        ...mockCollection,
        collaboratorCount: 100,
      };
      render(<CollectionCard collection={largeCollabCollection} />);

      expect(screen.getByText('100 collaborators')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render with default variant', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with elevated variant', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} variant="elevated" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with outlined variant', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} variant="outlined" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with ghost variant', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} variant="ghost" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with interactive variant', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} variant="interactive" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render with sm size', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} size="sm" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with default size', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} size="default" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('should render with lg size', () => {
      const { container } = render(
        <CollectionCard collection={mockCollection} size="lg" />
      );

      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });
  });
});

describe('CollectionCardSkeleton', () => {
  it('should render skeleton with default size', () => {
    render(<CollectionCardSkeleton />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-label', 'Loading collection card');
  });

  it('should render skeleton with sm size', () => {
    render(<CollectionCardSkeleton size="sm" />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render skeleton with lg size', () => {
    render(<CollectionCardSkeleton size="lg" />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render skeleton with custom className', () => {
    render(<CollectionCardSkeleton className="custom-skeleton" />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('should forward ref to skeleton element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CollectionCardSkeleton ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('should have proper accessibility attributes', () => {
    render(<CollectionCardSkeleton />);

    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading collection card');
  });
});
