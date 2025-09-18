import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Icon,
  IconContainer,
  RecipeIcon,
  LoadingIcon,
  CloseIcon,
  SearchIcon,
  MenuIcon,
  ChevronIcon,
  StatusIcon,
} from '@/components/ui/icon';

expect.extend(toHaveNoViolations);

describe('Icon Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders an icon correctly', () => {
      render(<Icon name="search" aria-label="Search icon" />);
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('lucide');
    });

    it('applies correct size classes', () => {
      const { rerender } = render(
        <Icon name="search" size="xs" aria-label="Search" />
      );
      expect(screen.getByRole('img')).toHaveClass('h-3', 'w-3');

      rerender(<Icon name="search" size="sm" aria-label="Search" />);
      expect(screen.getByRole('img')).toHaveClass('h-4', 'w-4');

      rerender(<Icon name="search" size="default" aria-label="Search" />);
      expect(screen.getByRole('img')).toHaveClass('h-5', 'w-5');

      rerender(<Icon name="search" size="lg" aria-label="Search" />);
      expect(screen.getByRole('img')).toHaveClass('h-6', 'w-6');

      rerender(<Icon name="search" size="xl" aria-label="Search" />);
      expect(screen.getByRole('img')).toHaveClass('h-8', 'w-8');

      rerender(<Icon name="search" size="2xl" aria-label="Search" />);
      expect(screen.getByRole('img')).toHaveClass('h-10', 'w-10');
    });

    it('applies correct color classes', () => {
      const { rerender, container } = render(
        <Icon name="search" color="default" />
      );
      expect(container.querySelector('.lucide')).toHaveClass('text-foreground');

      rerender(<Icon name="search" color="muted" />);
      expect(container.querySelector('.lucide')).toHaveClass(
        'text-muted-foreground'
      );

      rerender(<Icon name="search" color="accent" />);
      expect(container.querySelector('.lucide')).toHaveClass(
        'text-accent-foreground'
      );

      rerender(<Icon name="search" color="primary" />);
      expect(container.querySelector('.lucide')).toHaveClass('text-primary');

      rerender(<Icon name="search" color="destructive" />);
      expect(container.querySelector('.lucide')).toHaveClass(
        'text-destructive'
      );

      rerender(<Icon name="search" color="success" />);
      expect(container.querySelector('.lucide')).toHaveClass('text-green-600');

      rerender(<Icon name="search" color="warning" />);
      expect(container.querySelector('.lucide')).toHaveClass('text-amber-600');

      rerender(<Icon name="search" color="info" />);
      expect(container.querySelector('.lucide')).toHaveClass('text-blue-600');
    });

    it('applies animation classes', () => {
      const { rerender, container } = render(
        <Icon name="loading" animation="spin" />
      );
      expect(container.querySelector('.lucide')).toHaveClass('animate-spin');

      rerender(<Icon name="heart" animation="pulse" />);
      expect(container.querySelector('.lucide')).toHaveClass('animate-pulse');

      rerender(<Icon name="bell" animation="bounce" />);
      expect(container.querySelector('.lucide')).toHaveClass('animate-bounce');

      rerender(<Icon name="wifi" animation="ping" />);
      expect(container.querySelector('.lucide')).toHaveClass('animate-ping');
    });

    it('applies state classes', () => {
      const { rerender, container } = render(
        <Icon name="search" state="hover" />
      );
      expect(container.querySelector('.lucide')).toHaveClass(
        'hover:opacity-80'
      );

      rerender(<Icon name="search" state="interactive" />);
      expect(container.querySelector('.lucide')).toHaveClass(
        'hover:opacity-80',
        'focus:opacity-60',
        'cursor-pointer'
      );

      rerender(<Icon name="search" state="disabled" />);
      expect(container.querySelector('.lucide')).toHaveClass(
        'opacity-50',
        'cursor-not-allowed'
      );
    });

    it('handles custom className', () => {
      const { container } = render(
        <Icon name="search" className="custom-class" />
      );
      expect(container.querySelector('.lucide')).toHaveClass('custom-class');
    });

    it('warns for invalid icon names', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { container } = render(<Icon name={'invalid-icon' as any} />);
      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Icon "invalid-icon" not found in registry'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes when labeled', () => {
      render(<Icon name="search" aria-label="Custom search label" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('aria-label', 'Custom search label');
      expect(icon).toHaveAttribute('role', 'img');
    });

    it('uses custom aria-label when provided', () => {
      render(<Icon name="search" aria-label="Custom search label" />);
      const icon = screen.getByLabelText('Custom search label');
      expect(icon).toBeInTheDocument();
    });

    it('hides decorative icons from screen readers', () => {
      render(<Icon name="search" aria-hidden={true} />);
      const icon = document.querySelector('.lucide');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).not.toHaveAttribute('aria-label');
    });

    it('makes interactive icons focusable', () => {
      render(<Icon name="close" onClick={mockOnClick} />);
      const icon = screen.getByRole('button');
      expect(icon).toHaveAttribute('tabindex', '0');
      expect(icon).toHaveAttribute('role', 'button');
    });

    it('handles keyboard interaction for clickable icons', async () => {
      render(<Icon name="close" onClick={mockOnClick} />);
      const icon = screen.getByRole('button');

      fireEvent.keyDown(icon, { key: 'Enter', code: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(icon, { key: ' ', code: 'Space' });
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });

    it('includes title element when title prop is provided', () => {
      render(<Icon name="search" title="Search functionality" />);
      const titleElement = screen.getByText('Search functionality');
      expect(titleElement.tagName.toLowerCase()).toBe('title');
    });

    it('passes accessibility tests', async () => {
      const { container } = render(
        <div>
          <Icon name="search" aria-label="Search" />
          <Icon name="close" onClick={mockOnClick} aria-label="Close" />
          <Icon name="heart" aria-hidden={true} />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Interaction', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(<Icon name="close" onClick={mockOnClick} />);
      const icon = screen.getByRole('button');

      await user.click(icon);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies cursor pointer for clickable icons', () => {
      render(<Icon name="close" onClick={mockOnClick} />);
      const icon = screen.getByRole('button');
      expect(icon).toHaveClass('cursor-pointer');
    });
  });
});

describe('IconContainer Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    const { container } = render(
      <IconContainer>
        <Icon name="search" aria-label="Search" />
        <Icon name="heart" aria-label="Heart" />
      </IconContainer>
    );

    expect(container.querySelectorAll('.lucide')).toHaveLength(2);
  });

  it('applies spacing variants', () => {
    const { rerender, container } = render(
      <IconContainer spacing="xs">
        <Icon name="search" />
      </IconContainer>
    );
    expect(container.firstChild).toHaveClass('gap-1');

    rerender(
      <IconContainer spacing="default">
        <Icon name="search" />
      </IconContainer>
    );
    expect(container.firstChild).toHaveClass('gap-2');

    rerender(
      <IconContainer spacing="xl">
        <Icon name="search" />
      </IconContainer>
    );
    expect(container.firstChild).toHaveClass('gap-3');
  });

  it('applies background variants', () => {
    const { rerender, container } = render(
      <IconContainer background="muted">
        <Icon name="search" />
      </IconContainer>
    );
    expect(container.firstChild).toHaveClass('bg-muted');

    rerender(
      <IconContainer background="accent">
        <Icon name="search" />
      </IconContainer>
    );
    expect(container.firstChild).toHaveClass('bg-accent');

    rerender(
      <IconContainer background="primary">
        <Icon name="search" />
      </IconContainer>
    );
    expect(container.firstChild).toHaveClass(
      'bg-primary',
      'text-primary-foreground'
    );
  });

  it('handles interactive state', async () => {
    const user = userEvent.setup();
    render(
      <IconContainer interactive onClick={mockOnClick}>
        <Icon name="search" />
      </IconContainer>
    );

    const container = screen.getByRole('button');
    expect(container).toHaveClass('hover:opacity-80', 'cursor-pointer');

    await user.click(container);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

describe('RecipeIcon Component', () => {
  it('renders with recipe-specific styling', () => {
    const { container } = render(
      <RecipeIcon
        name="cooking-pot"
        category="cooking"
        aria-label="Cooking pot"
      />
    );
    const icon = container.querySelector('.lucide');
    expect(icon).toHaveClass('text-orange-600');
  });

  it('applies category-specific colors', () => {
    const { rerender, container } = render(
      <RecipeIcon name="timer" category="time" aria-label="Timer" />
    );
    expect(container.querySelector('.lucide')).toHaveClass('text-blue-600');

    rerender(
      <RecipeIcon
        name="thermometer"
        category="temperature"
        aria-label="Thermometer"
      />
    );
    expect(container.querySelector('.lucide')).toHaveClass('text-red-600');

    rerender(<RecipeIcon name="star" category="rating" aria-label="Star" />);
    expect(container.querySelector('.lucide')).toHaveClass('text-yellow-600');
  });

  it('applies emphasis variants', () => {
    const { rerender, container } = render(
      <RecipeIcon
        name="cooking-pot"
        emphasis="subtle"
        aria-label="Cooking pot"
      />
    );
    expect(container.querySelector('.lucide')).toHaveClass('opacity-70');

    rerender(
      <RecipeIcon
        name="cooking-pot"
        emphasis="strong"
        aria-label="Cooking pot"
      />
    );
    expect(container.querySelector('.lucide')).toHaveClass(
      'opacity-100',
      'font-semibold'
    );
  });
});

describe('Convenience Components', () => {
  describe('LoadingIcon', () => {
    it('renders spinning loading icon', () => {
      render(<LoadingIcon />);
      const icon = screen.getByLabelText('Loading');
      expect(icon).toHaveClass('animate-spin');
    });

    it('accepts size prop', () => {
      render(<LoadingIcon size="lg" />);
      const icon = screen.getByLabelText('Loading');
      expect(icon).toHaveClass('h-6', 'w-6');
    });
  });

  describe('CloseIcon', () => {
    it('renders close icon with proper label', () => {
      render(<CloseIcon />);
      const icon = screen.getByLabelText('Close');
      expect(icon).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();
      render(<CloseIcon onClick={mockOnClick} />);

      const icon = screen.getByRole('button');
      await user.click(icon);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('SearchIcon', () => {
    it('renders search icon with proper label', () => {
      render(<SearchIcon />);
      const icon = screen.getByLabelText('Search');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('MenuIcon', () => {
    it('renders menu icon with proper label', () => {
      render(<MenuIcon />);
      const icon = screen.getByLabelText('Menu');
      expect(icon).toBeInTheDocument();
    });

    it('becomes interactive when onClick is provided', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();
      render(<MenuIcon onClick={mockOnClick} />);

      const icon = screen.getByRole('button');
      await user.click(icon);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('ChevronIcon', () => {
    it('renders correct direction icons', () => {
      const { rerender } = render(<ChevronIcon direction="left" />);
      expect(screen.getByLabelText('left arrow')).toBeInTheDocument();

      rerender(<ChevronIcon direction="right" />);
      expect(screen.getByLabelText('right arrow')).toBeInTheDocument();

      rerender(<ChevronIcon direction="up" />);
      expect(screen.getByLabelText('up arrow')).toBeInTheDocument();

      rerender(<ChevronIcon direction="down" />);
      expect(screen.getByLabelText('down arrow')).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();
      render(<ChevronIcon direction="left" onClick={mockOnClick} />);

      const icon = screen.getByRole('button');
      await user.click(icon);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('StatusIcon', () => {
    it('renders correct status icons', () => {
      const { rerender } = render(<StatusIcon status="success" />);
      expect(screen.getByLabelText('success status')).toHaveClass(
        'text-green-600'
      );

      rerender(<StatusIcon status="error" />);
      expect(screen.getByLabelText('error status')).toHaveClass(
        'text-destructive'
      );

      rerender(<StatusIcon status="warning" />);
      expect(screen.getByLabelText('warning status')).toHaveClass(
        'text-amber-600'
      );

      rerender(<StatusIcon status="info" />);
      expect(screen.getByLabelText('info status')).toHaveClass('text-blue-600');
    });
  });
});

describe('Performance', () => {
  it('does not re-render unnecessarily', () => {
    const renderSpy = jest.fn();
    const TestIcon = React.memo(() => {
      renderSpy();
      return <Icon name="search" />;
    });

    const { rerender } = render(<TestIcon />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Re-render with same props should not trigger re-render
    rerender(<TestIcon />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('handles rapid state changes gracefully', async () => {
    const user = userEvent.setup();
    let clickCount = 0;
    const handleClick = () => {
      clickCount++;
    };

    render(<Icon name="close" onClick={handleClick} />);
    const icon = screen.getByRole('button');

    // Simulate rapid clicking
    await user.click(icon);
    await user.click(icon);
    await user.click(icon);

    expect(clickCount).toBe(3);
  });
});

describe('Edge Cases', () => {
  it('handles undefined props gracefully', () => {
    const { container } = render(
      <Icon name="search" size={undefined} color={undefined} />
    );
    const icon = container.querySelector('.lucide');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-5', 'w-5'); // default size
    expect(icon).toHaveClass('text-foreground'); // default color
  });

  it('handles empty className prop', () => {
    const { container } = render(<Icon name="search" className="" />);
    const icon = container.querySelector('.lucide');
    expect(icon).toBeInTheDocument();
  });

  it('maintains accessibility with complex combinations', async () => {
    const { container } = render(
      <IconContainer background="primary" interactive onClick={() => {}}>
        <Icon name="search" size="lg" color="inherit" />
        <Icon name="heart" animation="pulse" aria-hidden />
        <StatusIcon status="success" />
      </IconContainer>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles focus management correctly', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Icon name="search" focusable onClick={() => {}} />
        <Icon name="heart" />
        <Icon name="close" onClick={() => {}} />
      </div>
    );

    const focusableIcons = screen.getAllByRole('button');
    expect(focusableIcons).toHaveLength(2);

    await user.tab();
    expect(focusableIcons[0]).toHaveFocus();

    await user.tab();
    expect(focusableIcons[1]).toHaveFocus();
  });
});
