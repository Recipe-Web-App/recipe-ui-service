import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
import { NavDropdown } from '@/components/layout/nav-dropdown';
import type { NavItem } from '@/types/navigation';
import type { LucideIcon } from 'lucide-react';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock auth hook
jest.mock('@/hooks/auth/useAuth', () => ({
  useLogout: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
}));

// Mock UI components
jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-testid="popover" data-open={open}>
      {children}
    </div>
  ),
  PopoverTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="popover-trigger">{children}</div>,
  PopoverContent: ({
    children,
    align,
    sideOffset,
    className,
    role,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    align?: string;
    sideOffset?: number;
    className?: string;
    role?: string;
    'aria-label'?: string;
  }) => (
    <div
      data-testid="popover-content"
      data-align={align}
      data-offset={sideOffset}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  ),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('NavDropdown', () => {
  const mockNavItem: NavItem = {
    id: 'test-dropdown',
    label: 'Test Dropdown',
    href: '/test',
    children: [
      {
        id: 'child-1',
        label: 'Child 1',
        href: '/test/child-1',
      },
      {
        id: 'child-2',
        label: 'Child 2',
        href: '/test/child-2',
        metadata: {
          badge: 'New',
          badgeVariant: 'info',
        },
      },
      {
        id: 'child-3',
        label: 'Child Action',
        href: '#action',
        metadata: {
          isAction: true,
        },
      },
    ],
  };

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dropdown trigger with label', () => {
    render(<NavDropdown item={mockNavItem} />);

    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  it('renders chevron icon', () => {
    const { container } = render(<NavDropdown item={mockNavItem} />);

    // ChevronDown icon should be present
    const chevron = container.querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('renders all child items in the dropdown content', () => {
    render(<NavDropdown item={mockNavItem} />);

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child Action')).toBeInTheDocument();
  });

  it('renders child links with correct href', () => {
    render(<NavDropdown item={mockNavItem} />);

    const child1Link = screen.getByText('Child 1').closest('a');
    expect(child1Link).toHaveAttribute('href', '/test/child-1');

    const child2Link = screen.getByText('Child 2').closest('a');
    expect(child2Link).toHaveAttribute('href', '/test/child-2');
  });

  it('renders action items as buttons instead of links', () => {
    render(<NavDropdown item={mockNavItem} />);

    const actionItem = screen.getByText('Child Action');
    expect(actionItem.closest('button')).toBeInTheDocument();
    expect(actionItem.closest('a')).toBeNull();
  });

  it('shows badge for child items with badge metadata', () => {
    render(<NavDropdown item={mockNavItem} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('New');
    expect(badge).toHaveAttribute('data-variant', 'info');
  });

  it('applies active styling when isActive is true', () => {
    render(<NavDropdown item={mockNavItem} isActive />);

    // The container div has the active styling, not a button
    const container = screen.getByText('Test Dropdown').closest('div');
    expect(container).toHaveClass('bg-accent');
  });

  it('highlights active child items based on current pathname', () => {
    mockUsePathname.mockReturnValue('/test/child-1');

    render(<NavDropdown item={mockNavItem} />);

    const child1Link = screen.getByText('Child 1').closest('a');
    expect(child1Link).toHaveClass('bg-accent/50', 'font-medium');
    expect(child1Link).toHaveAttribute('aria-current', 'page');
  });

  it('applies disabled styling when item is disabled', () => {
    const disabledItem: NavItem = {
      ...mockNavItem,
      metadata: {
        disabled: true,
      },
    };

    render(<NavDropdown item={disabledItem} />);

    // The container div has the disabled styling
    const container = screen.getByText('Test Dropdown').closest('div');
    expect(container).toHaveClass('pointer-events-none', 'opacity-50');

    // The chevron button should be disabled
    const chevronButton = screen.getByRole('button');
    expect(chevronButton).toBeDisabled();
  });

  it('renders icons when showIcons is true', () => {
    // Create mock icons that match LucideIcon type
    const MockNavIcon = (() => (
      <svg data-testid="nav-icon" />
    )) as unknown as LucideIcon;
    const MockChildIcon = (() => (
      <svg data-testid="child-icon" />
    )) as unknown as LucideIcon;

    const itemWithIcon: NavItem = {
      ...mockNavItem,
      icon: MockNavIcon,
      children: [
        {
          id: 'child-with-icon',
          label: 'Child with Icon',
          href: '/test/child',
          icon: MockChildIcon,
        },
      ],
    };

    render(<NavDropdown item={itemWithIcon} showIcons />);

    expect(screen.getByTestId('nav-icon')).toBeInTheDocument();
    expect(screen.getByTestId('child-icon')).toBeInTheDocument();
  });

  it('does not render icons when showIcons is false', () => {
    // Create mock icons that match LucideIcon type
    const MockNavIcon = (() => (
      <svg data-testid="nav-icon" />
    )) as unknown as LucideIcon;
    const MockChildIcon = (() => (
      <svg data-testid="child-icon" />
    )) as unknown as LucideIcon;

    const itemWithIcon: NavItem = {
      ...mockNavItem,
      icon: MockNavIcon,
      children: [
        {
          id: 'child-with-icon',
          label: 'Child with Icon',
          href: '/test/child',
          icon: MockChildIcon,
        },
      ],
    };

    render(<NavDropdown item={itemWithIcon} showIcons={false} />);

    expect(screen.queryByTestId('nav-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('child-icon')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    render(<NavDropdown item={mockNavItem} className="custom-class" />);

    // The container div receives the custom className
    const container = screen.getByText('Test Dropdown').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('sets proper accessibility attributes on trigger button', () => {
    render(<NavDropdown item={mockNavItem} />);

    // The chevron button has the accessibility attributes
    const chevronButton = screen.getByRole('button');
    expect(chevronButton).toHaveAttribute('type', 'button');
    expect(chevronButton).toHaveAttribute('aria-haspopup', 'menu');
    expect(chevronButton).toHaveAttribute('aria-expanded');
  });

  it('renders the label as a navigable link', () => {
    render(<NavDropdown item={mockNavItem} />);

    const link = screen.getByText('Test Dropdown').closest('a');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('sets proper accessibility attributes on content', () => {
    render(<NavDropdown item={mockNavItem} />);

    const content = screen.getByTestId('popover-content');
    expect(content).toHaveAttribute('role', 'menu');
    expect(content).toHaveAttribute('aria-label', 'Test Dropdown navigation');
  });

  it('child links have menuitem role', () => {
    render(<NavDropdown item={mockNavItem} />);

    const links = screen.getAllByRole('menuitem');
    expect(links.length).toBeGreaterThan(0);
  });

  it('applies align prop to popover content', () => {
    render(<NavDropdown item={mockNavItem} align="end" />);

    const content = screen.getByTestId('popover-content');
    expect(content).toHaveAttribute('data-align', 'end');
  });

  it('applies sideOffset prop to popover content', () => {
    render(<NavDropdown item={mockNavItem} sideOffset={12} />);

    const content = screen.getByTestId('popover-content');
    expect(content).toHaveAttribute('data-offset', '12');
  });

  describe('with disabled child items', () => {
    it('applies disabled styling to disabled child items', () => {
      const itemWithDisabledChild: NavItem = {
        ...mockNavItem,
        children: [
          {
            id: 'disabled-child',
            label: 'Disabled Child',
            href: '/test/disabled',
            metadata: {
              disabled: true,
            },
          },
        ],
      };

      render(<NavDropdown item={itemWithDisabledChild} />);

      const disabledLink = screen.getByText('Disabled Child').closest('a');
      expect(disabledLink).toHaveClass('pointer-events-none', 'opacity-50');
    });
  });

  describe('empty children', () => {
    it('handles items with empty children array', () => {
      const emptyItem: NavItem = {
        id: 'empty',
        label: 'Empty Dropdown',
        href: '/empty',
        children: [],
      };

      render(<NavDropdown item={emptyItem} />);

      expect(screen.getByText('Empty Dropdown')).toBeInTheDocument();
    });

    it('handles items with undefined children', () => {
      const noChildrenItem: NavItem = {
        id: 'no-children',
        label: 'No Children',
        href: '/no-children',
      };

      render(<NavDropdown item={noChildrenItem} />);

      expect(screen.getByText('No Children')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies hover styles to container', () => {
      render(<NavDropdown item={mockNavItem} />);

      // The container div has the hover background
      const container = screen.getByText('Test Dropdown').closest('div');
      expect(container).toHaveClass('hover:bg-accent');
    });

    it('applies focus styles to link', () => {
      render(<NavDropdown item={mockNavItem} />);

      // The link has focus-visible styles
      const link = screen.getByText('Test Dropdown').closest('a');
      expect(link).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring'
      );
    });

    it('applies transition styles to container', () => {
      render(<NavDropdown item={mockNavItem} />);

      // The container div has transition styles
      const container = screen.getByText('Test Dropdown').closest('div');
      expect(container).toHaveClass('transition-all', 'duration-200');
    });

    it('applies hover styles to child links', () => {
      render(<NavDropdown item={mockNavItem} />);

      const childLink = screen.getByText('Child 1').closest('a');
      expect(childLink).toHaveClass(
        'hover:bg-accent',
        'hover:text-accent-foreground'
      );
    });
  });
});
