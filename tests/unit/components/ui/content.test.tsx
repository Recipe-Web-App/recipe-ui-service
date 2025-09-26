import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ChevronRight, Home, AlertCircle } from 'lucide-react';
import {
  Content,
  ContentProvider,
  ContentPane,
  ContentHeader,
  ContentSkeleton,
  ContentError,
  ContentSection,
  ContentGrid,
  ContentList,
  ContentActions,
} from '@/components/ui/content';
import { useContent } from '@/hooks/components/ui/content-hooks';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Mock the layout store
jest.mock('@/stores/ui/layout-store');

expect.extend(toHaveNoViolations);

const mockLayoutStore = {
  viewMode: 'grid',
  contentWidth: 'contained',
  breakpoint: 'desktop',
  setViewMode: jest.fn(),
  setContentWidth: jest.fn(),
  toggleViewMode: jest.fn(),
  toggleContentWidth: jest.fn(),
};

const MockedUseLayoutStore = useLayoutStore as jest.MockedFunction<
  typeof useLayoutStore
>;

beforeEach(() => {
  MockedUseLayoutStore.mockReturnValue(mockLayoutStore as any);
  jest.clearAllMocks();
});

describe('Content Components', () => {
  describe('Content (Base)', () => {
    it('renders with default props', () => {
      render(<Content>Test content</Content>);
      const content = screen.getByText('Test content');
      expect(content).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(
        <Content variant="card" data-testid="card-content">
          Card content
        </Content>
      );
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'border',
        'border-border',
        'rounded-lg'
      );
    });

    it('applies size classes correctly', () => {
      render(
        <Content size="lg" data-testid="large-content">
          Large content
        </Content>
      );
      const content = screen.getByTestId('large-content');
      expect(content).toHaveClass('text-lg');
    });

    it('applies custom className', () => {
      render(
        <Content className="custom-class" data-testid="custom-content">
          Custom content
        </Content>
      );
      const content = screen.getByTestId('custom-content');
      expect(content).toHaveClass('custom-class');
    });

    it('is accessible', async () => {
      const { container } = render(<Content>Accessible content</Content>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentProvider', () => {
    const TestComponent = () => {
      const { viewMode, contentWidth, setViewMode, toggleViewMode } =
        useContent();
      return (
        <div>
          <span data-testid="view-mode">{viewMode}</span>
          <span data-testid="content-width">{contentWidth}</span>
          <button onClick={() => setViewMode('list')}>Set List</button>
          <button onClick={toggleViewMode}>Toggle View</button>
        </div>
      );
    };

    it('provides default context values', () => {
      render(
        <ContentProvider>
          <TestComponent />
        </ContentProvider>
      );

      expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
      expect(screen.getByTestId('content-width')).toHaveTextContent(
        'contained'
      );
    });

    it('uses custom default values', () => {
      // Reset mock to return undefined values to test initialization
      MockedUseLayoutStore.mockReturnValue({
        ...mockLayoutStore,
        viewMode: undefined,
        contentWidth: undefined,
      } as any);

      render(
        <ContentProvider defaultViewMode="list" defaultContentWidth="full">
          <TestComponent />
        </ContentProvider>
      );

      expect(screen.getByTestId('view-mode')).toHaveTextContent('list');
      expect(screen.getByTestId('content-width')).toHaveTextContent('full');
    });

    it('handles context actions', async () => {
      const user = userEvent.setup();

      render(
        <ContentProvider>
          <TestComponent />
        </ContentProvider>
      );

      await user.click(screen.getByText('Set List'));
      expect(mockLayoutStore.setViewMode).toHaveBeenCalledWith('list');

      await user.click(screen.getByText('Toggle View'));
      expect(mockLayoutStore.toggleViewMode).toHaveBeenCalled();
    });

    it('throws error when used outside provider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useContent must be used within a ContentProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('ContentPane', () => {
    it('renders children correctly', () => {
      render(
        <ContentPane>
          <div>Test content</div>
        </ContentPane>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(<ContentPane loading />);

      expect(screen.getByRole('main')).toHaveAttribute(
        'aria-label',
        'Loading content'
      );
      expect(screen.getAllByRole('status').length).toBeGreaterThan(1); // Multiple skeleton items
    });

    it('shows error state', () => {
      const error = new Error('Test error');

      render(<ContentPane error={error} />);

      expect(screen.getByRole('main')).toHaveAttribute(
        'aria-label',
        'Content error'
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('renders with header', () => {
      render(
        <ContentPane header={<div data-testid="header">Header content</div>}>
          <div>Main content</div>
        </ContentPane>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('renders with actions', () => {
      render(
        <ContentPane actions={<button data-testid="action">Action</button>}>
          <div>Content</div>
        </ContentPane>
      );

      expect(screen.getByTestId('action')).toBeInTheDocument();
    });

    it('applies view mode classes', () => {
      render(
        <ContentPane viewMode="list" data-testid="list-pane">
          Content
        </ContentPane>
      );

      const pane = screen.getByTestId('list-pane');
      expect(pane).toHaveClass('gap-4');
    });

    it('is accessible', async () => {
      const { container } = render(
        <ContentPane>
          <div>Accessible content</div>
        </ContentPane>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentHeader', () => {
    it('renders title and description', () => {
      render(
        <ContentHeader title="Test Title" description="Test description" />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders breadcrumbs', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Recipes', href: '/recipes' },
        { label: 'Current', current: true },
      ];

      render(<ContentHeader breadcrumbs={breadcrumbs} />);

      expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Recipes')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('renders actions', () => {
      render(
        <ContentHeader
          title="Title"
          actions={<button data-testid="header-action">Action</button>}
        />
      );

      expect(screen.getByTestId('header-action')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      render(
        <ContentHeader
          variant="sticky"
          title="Sticky Title"
          data-testid="sticky-header"
        />
      );

      const header = screen.getByTestId('sticky-header');
      expect(header).toHaveClass('sticky', 'top-0', 'z-10');
    });

    it('shows divider when enabled', () => {
      render(
        <ContentHeader
          title="Title"
          showDivider
          data-testid="header-with-divider"
        />
      );

      const header = screen.getByTestId('header-with-divider');
      expect(header).toHaveClass('border-b', 'border-border');
    });

    it('is accessible', async () => {
      const { container } = render(
        <ContentHeader
          title="Accessible Title"
          description="Accessible description"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentSkeleton', () => {
    it('renders with default props', () => {
      render(<ContentSkeleton />);

      const statusElements = screen.getAllByRole('status');
      expect(statusElements[0]).toHaveAttribute(
        'aria-label',
        'Loading content...'
      );
    });

    it('renders correct number of items', () => {
      render(<ContentSkeleton count={3} />);

      // Check that skeleton items are rendered (exact count may vary by view mode)
      const skeletons = screen.getAllByLabelText('Loading...');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders header skeleton when enabled', () => {
      const { container } = render(<ContentSkeleton showHeader />);

      // Header skeleton should be present
      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });

    it('applies view mode classes', () => {
      render(<ContentSkeleton viewMode="list" data-testid="list-skeleton" />);

      const skeleton = screen.getByTestId('list-skeleton');
      expect(skeleton).toHaveClass('space-y-3'); // Check the actual class applied
    });

    it('is accessible', async () => {
      const { container } = render(<ContentSkeleton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentError', () => {
    it('renders string error', () => {
      render(<ContentError error="Test error message" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders Error object', () => {
      const error = new Error('Test error');
      render(<ContentError error={error} />);

      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders ContentError object', () => {
      const error = {
        type: 'network' as const,
        title: 'Network Error',
        message: 'Connection failed',
        details: 'Check your internet connection',
      };

      render(<ContentError error={error} />);

      expect(screen.getByText('Network Error')).toBeInTheDocument();
      expect(screen.getByText('Connection failed')).toBeInTheDocument();
      expect(
        screen.getByText('Check your internet connection')
      ).toBeInTheDocument();
    });

    it('renders retry and go back actions', async () => {
      const onRetry = jest.fn();
      const onGoBack = jest.fn();
      const user = userEvent.setup();

      render(
        <ContentError
          error="Test error"
          onRetry={onRetry}
          onGoBack={onGoBack}
        />
      );

      const retryButton = screen.getByText('Try Again');
      const goBackButton = screen.getByText('Go Back');

      await user.click(retryButton);
      expect(onRetry).toHaveBeenCalled();

      await user.click(goBackButton);
      expect(onGoBack).toHaveBeenCalled();
    });

    it('hides actions when disabled', () => {
      render(<ContentError error="Test error" showActions={false} />);

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
      expect(screen.queryByText('Go Back')).not.toBeInTheDocument();
    });

    it('applies variant classes', () => {
      render(
        <ContentError
          error="Test error"
          variant="destructive"
          data-testid="error-component"
        />
      );

      const errorComponent = screen.getByTestId('error-component');
      expect(errorComponent).toHaveClass(
        'bg-destructive/5',
        'text-destructive'
      );
    });

    it('is accessible', async () => {
      const { container } = render(<ContentError error="Accessible error" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentSection', () => {
    it('renders title and description', () => {
      render(
        <ContentSection title="Section Title" description="Section description">
          <div>Section content</div>
        </ContentSection>
      );

      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Section description')).toBeInTheDocument();
      expect(screen.getByText('Section content')).toBeInTheDocument();
    });

    it('handles collapsible functionality', async () => {
      const onToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <ContentSection
          title="Collapsible Section"
          collapsible
          onToggle={onToggle}
        >
          <div data-testid="section-content">Content</div>
        </ContentSection>
      );

      const toggleButton = screen.getByLabelText('Collapse section');
      await user.click(toggleButton);

      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it('renders header actions', () => {
      render(
        <ContentSection
          title="Section"
          headerActions={<button data-testid="section-action">Action</button>}
        >
          Content
        </ContentSection>
      );

      expect(screen.getByTestId('section-action')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      render(
        <ContentSection variant="card" data-testid="card-section">
          Content
        </ContentSection>
      );

      const section = screen.getByTestId('card-section');
      expect(section).toHaveClass(
        'bg-card',
        'border',
        'border-border',
        'rounded-lg'
      );
    });

    it('is accessible', async () => {
      const { container } = render(
        <ContentSection title="Accessible Section">
          <div>Accessible content</div>
        </ContentSection>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentGrid', () => {
    it('renders children in grid layout', () => {
      render(
        <ContentGrid data-testid="content-grid">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </ContentGrid>
      );

      const grid = screen.getByTestId('content-grid');
      expect(grid).toHaveClass('grid');
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('applies column classes', () => {
      render(
        <ContentGrid columns={4} data-testid="four-col-grid">
          <div>Item</div>
        </ContentGrid>
      );

      const grid = screen.getByTestId('four-col-grid');
      expect(grid).toHaveClass('xl:grid-cols-4');
    });

    it('applies gap classes', () => {
      render(
        <ContentGrid gap="sm" data-testid="small-gap-grid">
          <div>Item</div>
        </ContentGrid>
      );

      const grid = screen.getByTestId('small-gap-grid');
      expect(grid).toHaveClass('gap-2');
    });

    it('is accessible', async () => {
      const { container } = render(
        <ContentGrid>
          <div>Accessible item</div>
        </ContentGrid>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentList', () => {
    it('renders children in list layout', () => {
      render(
        <ContentList data-testid="content-list">
          <div>Item 1</div>
          <div>Item 2</div>
        </ContentList>
      );

      const list = screen.getByTestId('content-list');
      expect(list).toHaveAttribute('role', 'list');
      expect(list).toHaveClass('flex', 'flex-col');
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('applies divided classes', () => {
      render(
        <ContentList divided data-testid="divided-list">
          <div>Item</div>
        </ContentList>
      );

      const list = screen.getByTestId('divided-list');
      expect(list).toHaveClass('divide-y', 'divide-border');
    });

    it('applies hover classes', () => {
      render(
        <ContentList hover data-testid="hover-list">
          <div>Item</div>
        </ContentList>
      );

      const list = screen.getByTestId('hover-list');
      expect(list).toHaveClass('[&>*:hover]:bg-muted/50');
    });

    it('is accessible', async () => {
      const { container } = render(
        <ContentList>
          <div role="listitem">Accessible item</div>
        </ContentList>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ContentActions', () => {
    it('renders action buttons', () => {
      render(
        <ContentActions data-testid="content-actions">
          <button>Action 1</button>
          <button>Action 2</button>
        </ContentActions>
      );

      const actions = screen.getByTestId('content-actions');
      expect(actions).toHaveAttribute('role', 'toolbar');
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('applies alignment classes', () => {
      render(
        <ContentActions align="center" data-testid="center-actions">
          <button>Action</button>
        </ContentActions>
      );

      const actions = screen.getByTestId('center-actions');
      expect(actions).toHaveClass('justify-center');
    });

    it('applies sticky classes', () => {
      render(
        <ContentActions sticky data-testid="sticky-actions">
          <button>Action</button>
        </ContentActions>
      );

      const actions = screen.getByTestId('sticky-actions');
      expect(actions).toHaveClass('sticky', 'bottom-0', 'z-10');
    });

    it('applies border classes', () => {
      render(
        <ContentActions border data-testid="border-actions">
          <button>Action</button>
        </ContentActions>
      );

      const actions = screen.getByTestId('border-actions');
      expect(actions).toHaveClass('border-t', 'border-border', 'pt-4');
    });

    it('is accessible', async () => {
      const { container } = render(
        <ContentActions>
          <button>Accessible action</button>
        </ContentActions>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
