import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  AutoBreadcrumb,
  BreadcrumbHeader,
  InlineBreadcrumb,
  MinimalBreadcrumb,
  StickyBreadcrumb,
} from '@/components/layout/auto-breadcrumb';
import {
  useBreadcrumbs,
  useShouldShowBreadcrumbs,
} from '@/hooks/use-breadcrumbs';
import type { BreadcrumbItem } from '@/types/ui/breadcrumb';

// Mock the breadcrumb hooks
jest.mock('@/hooks/use-breadcrumbs');

// Mock the Breadcrumb component
jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: React.forwardRef(({ items, className }: any, ref: any) => (
    <nav data-testid="breadcrumb" className={className} ref={ref}>
      {items && items.length > 0 && (
        <ol data-testid="breadcrumb-list">
          {items.map((item: any, index: number) => (
            <li key={item.id || index} data-testid="breadcrumb-item">
              {item.href ? (
                <a data-testid="breadcrumb-link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span data-testid="breadcrumb-page">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span data-testid="breadcrumb-separator">/</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </nav>
  )),
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol data-testid="breadcrumb-list">{children}</ol>
  ),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="breadcrumb-item">{children}</li>
  ),
  BreadcrumbLink: ({
    href,
    children,
  }: {
    href?: string;
    children: React.ReactNode;
  }) => (
    <a data-testid="breadcrumb-link" href={href}>
      {children}
    </a>
  ),
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="breadcrumb-page">{children}</span>
  ),
  BreadcrumbSeparator: () => <span data-testid="breadcrumb-separator">/</span>,
  BreadcrumbEllipsis: () => <span data-testid="breadcrumb-ellipsis">...</span>,
}));

const mockedUseBreadcrumbs = useBreadcrumbs as jest.MockedFunction<
  typeof useBreadcrumbs
>;
const mockedUseShouldShowBreadcrumbs =
  useShouldShowBreadcrumbs as jest.MockedFunction<
    typeof useShouldShowBreadcrumbs
  >;

describe('AutoBreadcrumb', () => {
  const mockBreadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'recipes', label: 'Recipes', href: '/recipes' },
    { id: 'detail', label: 'Recipe Detail' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock setup
    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: mockBreadcrumbs,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    mockedUseShouldShowBreadcrumbs.mockReturnValue(true);
  });

  describe('Basic rendering', () => {
    it('should render breadcrumbs when shouldShow is true', () => {
      render(<AutoBreadcrumb />);

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('should not render when shouldShow is false', () => {
      mockedUseShouldShowBreadcrumbs.mockReturnValue(false);

      render(<AutoBreadcrumb />);

      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
    });

    it('should render breadcrumb items', () => {
      render(<AutoBreadcrumb />);

      const items = screen.getAllByTestId('breadcrumb-item');
      expect(items.length).toBeGreaterThan(0);
    });

    it('should render breadcrumb links for non-current items', () => {
      render(<AutoBreadcrumb />);

      const links = screen.getAllByTestId('breadcrumb-link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('should render current page without link', () => {
      render(<AutoBreadcrumb />);

      expect(screen.getByTestId('breadcrumb-page')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show loading skeleton when isLoading is true', () => {
      mockedUseBreadcrumbs.mockReturnValue({
        breadcrumbs: [],
        isLoading: true,
        error: null,
        refresh: jest.fn(),
        setCustom: jest.fn(),
        clearCustom: jest.fn(),
        config: {
          pattern: 'category-browse',
          maxItems: 5,
          showHome: true,
        },
      });

      render(<AutoBreadcrumb />);

      expect(screen.getByLabelText('Loading breadcrumbs')).toBeInTheDocument();
    });

    it('should not show loading skeleton when showLoadingSkeleton is false', () => {
      mockedUseBreadcrumbs.mockReturnValue({
        breadcrumbs: [],
        isLoading: true,
        error: null,
        refresh: jest.fn(),
        setCustom: jest.fn(),
        clearCustom: jest.fn(),
        config: {
          pattern: 'category-browse',
          maxItems: 5,
          showHome: true,
        },
      });

      render(<AutoBreadcrumb showLoadingSkeleton={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('should show breadcrumbs after loading completes', async () => {
      const { rerender } = render(<AutoBreadcrumb />);

      mockedUseBreadcrumbs.mockReturnValue({
        breadcrumbs: mockBreadcrumbs,
        isLoading: false,
        error: null,
        refresh: jest.fn(),
        setCustom: jest.fn(),
        clearCustom: jest.fn(),
        config: {
          pattern: 'category-browse',
          maxItems: 5,
          showHome: true,
        },
      });

      rerender(<AutoBreadcrumb />);

      await waitFor(() => {
        expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      });
    });
  });

  describe('Error state', () => {
    it('should show error message when error occurs', () => {
      mockedUseBreadcrumbs.mockReturnValue({
        breadcrumbs: [],
        isLoading: false,
        error: new Error('Failed to load breadcrumbs'),
        refresh: jest.fn(),
        setCustom: jest.fn(),
        clearCustom: jest.fn(),
        config: {
          pattern: 'category-browse',
          maxItems: 5,
          showHome: true,
        },
      });

      render(<AutoBreadcrumb />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText(/Unable to load navigation/i)
      ).toBeInTheDocument();
    });

    it('should not show error when showError is false', () => {
      mockedUseBreadcrumbs.mockReturnValue({
        breadcrumbs: [],
        isLoading: false,
        error: new Error('Failed to load breadcrumbs'),
        refresh: jest.fn(),
        setCustom: jest.fn(),
        clearCustom: jest.fn(),
        config: {
          pattern: 'category-browse',
          maxItems: 5,
          showHome: true,
        },
      });

      render(<AutoBreadcrumb showError={false} />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should not render when breadcrumbs are empty', () => {
      mockedUseBreadcrumbs.mockReturnValue({
        breadcrumbs: [],
        isLoading: false,
        error: null,
        refresh: jest.fn(),
        setCustom: jest.fn(),
        clearCustom: jest.fn(),
        config: {
          pattern: 'category-browse',
          maxItems: 5,
          showHome: true,
        },
      });

      render(<AutoBreadcrumb />);

      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<AutoBreadcrumb className="custom-class" />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('custom-class');
    });
  });

  describe('Configuration options', () => {
    it('should pass config to useBreadcrumbs', () => {
      const config = { maxItems: 3, showHome: false };

      render(<AutoBreadcrumb config={config} />);

      expect(mockedUseBreadcrumbs).toHaveBeenCalledWith(
        expect.objectContaining({ config })
      );
    });

    it('should pass options to useBreadcrumbs', () => {
      render(<AutoBreadcrumb options={{ autoRefresh: false }} />);

      expect(mockedUseBreadcrumbs).toHaveBeenCalledWith(
        expect.objectContaining({ autoRefresh: false })
      );
    });
  });
});

describe('BreadcrumbHeader', () => {
  const mockBreadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'recipes', label: 'Recipes' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: mockBreadcrumbs,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    mockedUseShouldShowBreadcrumbs.mockReturnValue(true);
  });

  it('should render breadcrumbs', () => {
    render(<BreadcrumbHeader />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should render with default border', () => {
    const { container } = render(<BreadcrumbHeader />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('border-b');
  });

  it('should render without border when showBorder is false', () => {
    const { container } = render(<BreadcrumbHeader showBorder={false} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveClass('border-b');
  });
});

describe('InlineBreadcrumb', () => {
  const mockBreadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'recipes', label: 'Recipes' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: mockBreadcrumbs,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    mockedUseShouldShowBreadcrumbs.mockReturnValue(true);
  });

  it('should render without header wrapper', () => {
    const { container } = render(<InlineBreadcrumb />);

    expect(container.querySelector('header')).not.toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });
});

describe('MinimalBreadcrumb', () => {
  const mockBreadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'recipes', label: 'Recipes', href: '/recipes' },
    { id: 'detail', label: 'Detail' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: mockBreadcrumbs,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    mockedUseShouldShowBreadcrumbs.mockReturnValue(true);
  });

  it('should render breadcrumbs', () => {
    render(<MinimalBreadcrumb />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should not show loading skeleton', () => {
    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: [],
      isLoading: true,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    render(<MinimalBreadcrumb />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should not show errors', () => {
    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: [],
      isLoading: false,
      error: new Error('Test error'),
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    render(<MinimalBreadcrumb />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('StickyBreadcrumb', () => {
  const mockBreadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'recipes', label: 'Recipes' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: mockBreadcrumbs,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    mockedUseShouldShowBreadcrumbs.mockReturnValue(true);
  });

  it('should render with sticky positioning', () => {
    const { container } = render(<StickyBreadcrumb />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('sticky');
  });

  it('should apply custom z-index via style prop', () => {
    const { container } = render(<StickyBreadcrumb zIndex={50} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.zIndex).toBe('50');
  });

  it('should apply custom top offset via style prop', () => {
    const { container } = render(<StickyBreadcrumb topOffset={10} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.top).toBe('10px');
  });
});

describe('Breadcrumb variants integration', () => {
  const mockBreadcrumbs: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'recipes', label: 'Recipes' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseBreadcrumbs.mockReturnValue({
      breadcrumbs: mockBreadcrumbs,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      setCustom: jest.fn(),
      clearCustom: jest.fn(),
      config: {
        pattern: 'category-browse',
        maxItems: 5,
        showHome: true,
      },
    });

    mockedUseShouldShowBreadcrumbs.mockReturnValue(true);
  });

  it('should all use the same breadcrumb hook', () => {
    render(
      <>
        <AutoBreadcrumb />
        <BreadcrumbHeader />
        <InlineBreadcrumb />
        <MinimalBreadcrumb />
        <StickyBreadcrumb />
      </>
    );

    expect(mockedUseBreadcrumbs).toHaveBeenCalledTimes(5);
  });

  it('should all respect shouldShow flag', () => {
    mockedUseShouldShowBreadcrumbs.mockReturnValue(false);

    render(
      <>
        <AutoBreadcrumb />
        <BreadcrumbHeader />
        <InlineBreadcrumb />
        <MinimalBreadcrumb />
        <StickyBreadcrumb />
      </>
    );

    expect(screen.queryAllByTestId('breadcrumb')).toHaveLength(0);
  });
});
