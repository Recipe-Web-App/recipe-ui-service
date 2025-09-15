import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown';

expect.extend(toHaveNoViolations);

const user = userEvent.setup();

describe('Dropdown Components', () => {
  describe('DropdownMenuTrigger', () => {
    it('renders with default variant and size', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass('bg-gray-900', 'text-white', 'h-9', 'px-4');
    });

    it('renders with secondary variant', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger variant="secondary">
            Secondary
          </DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('renders with outline variant', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger variant="outline">Outline</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('border', 'border-input', 'bg-background');
    });

    it('renders with ghost variant', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger variant="ghost">Ghost</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('hover:bg-accent');
    });

    it('renders with small size', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger size="sm">Small</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('h-8', 'px-3', 'text-xs');
    });

    it('renders with large size', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger size="lg">Large</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('h-10', 'px-8', 'text-base');
    });

    it('supports custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-class">
            Custom
          </DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('custom-class');
    });

    it('supports asChild prop', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div data-testid="custom-trigger">Custom Trigger</div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      );

      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });

    it('forwards refs correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger ref={ref}>Test</DropdownMenuTrigger>
        </DropdownMenu>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('DropdownMenuContent', () => {
    it('renders with default variant and size', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const content = screen.getByRole('menu');
        expect(content).toBeInTheDocument();
        expect(content).toHaveClass('min-w-[8rem]', 'text-sm');
      });
    });

    it('renders with secondary variant', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent variant="secondary">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const content = screen.getByRole('menu');
        expect(content).toHaveClass('bg-gray-50', 'text-gray-700');
      });
    });

    it('renders with small size', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent size="sm">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const content = screen.getByRole('menu');
        expect(content).toHaveClass('min-w-[6rem]', 'text-xs');
      });
    });

    it('renders with large size', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent size="lg">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const content = screen.getByRole('menu');
        expect(content).toHaveClass('min-w-[12rem]', 'text-base');
      });
    });

    it('supports custom sideOffset', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });
  });

  describe('DropdownMenuItem', () => {
    it('renders with default variant', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Test Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const item = screen.getByRole('menuitem', { name: 'Test Item' });
        expect(item).toBeInTheDocument();
        expect(item).toHaveClass('hover:bg-blue-50', 'hover:text-blue-900');
      });
    });

    it('renders with destructive variant', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const item = screen.getByRole('menuitem', { name: 'Delete' });
        expect(item).toHaveClass('text-red-600', 'hover:bg-red-50');
      });
    });

    it('renders with inset styling', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const item = screen.getByRole('menuitem', { name: 'Inset Item' });
        expect(item).toHaveClass('pl-8');
      });
    });

    it('handles click events', async () => {
      const handleClick = jest.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>Clickable</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: 'Clickable' }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports disabled state', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const item = screen.getByRole('menuitem', { name: 'Disabled Item' });
        expect(item).toHaveAttribute('data-disabled');
      });
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('renders checkbox item with initial state', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={false}>
              Unchecked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const item = screen.getByRole('menuitemcheckbox');
        expect(item).toBeInTheDocument();
        expect(item).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('renders checked checkbox item', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={true}>
              Checked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const item = screen.getByRole('menuitemcheckbox');
        expect(item).toHaveAttribute('aria-checked', 'true');
      });
    });

    it('handles checked state changes', async () => {
      const handleCheckedChange = jest.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={handleCheckedChange}
            >
              Toggle Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitemcheckbox'));

      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('DropdownMenuRadioItem', () => {
    it('renders radio item', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const items = screen.getAllByRole('menuitemradio');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveAttribute('aria-checked', 'true');
        expect(items[1]).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('handles value changes in radio group', async () => {
      const handleValueChange = jest.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value="option1"
              onValueChange={handleValueChange}
            >
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitemradio', { name: 'Option 2' }));

      expect(handleValueChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('DropdownMenuLabel', () => {
    it('renders label with default styling', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const label = screen.getByText('Section Label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveClass('font-semibold', 'text-muted-foreground');
      });
    });

    it('renders label with inset styling', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const label = screen.getByText('Inset Label');
        expect(label).toHaveClass('pl-8');
      });
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('renders separator', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const separator = screen.getByRole('separator');
        expect(separator).toBeInTheDocument();
        expect(separator).toHaveClass('bg-border');
      });
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('renders shortcut text', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Action
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const shortcut = screen.getByText('⌘K');
        expect(shortcut).toBeInTheDocument();
        expect(shortcut).toHaveClass(
          'ml-auto',
          'text-xs',
          'text-muted-foreground'
        );
      });
    });
  });

  describe('DropdownMenuSub', () => {
    it('renders sub-menu trigger and content', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
                <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const subTrigger = screen.getByText('Sub Menu');
        expect(subTrigger).toBeInTheDocument();
        expect(subTrigger).toHaveAttribute('role', 'menuitem');
        expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
      });
    });

    it('renders sub-trigger with inset styling', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>
                Inset Sub Menu
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const subTrigger = screen.getByText('Inset Sub Menu');
        expect(subTrigger).toHaveClass('pl-8');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      // Navigate with arrow keys
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Item 2' })).toHaveFocus();
      });
    });

    it('supports Enter key activation', async () => {
      const handleClick = jest.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>
              Activate Me
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports Escape key to close', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - basic menu', async () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('has no accessibility violations - complex menu', async () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Complex Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked={true}>
              Show Details
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('has proper ARIA attributes', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Menu Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Menu Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-haspopup');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveAttribute('role', 'menu');
      });
    });

    it('supports screen reader navigation', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Screen Reader Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Group Label</DropdownMenuLabel>
            <DropdownMenuItem>First Item</DropdownMenuItem>
            <DropdownMenuItem>Second Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        // Check that menu items are properly labeled
        const items = screen.getAllByRole('menuitem');
        expect(items[0]).toHaveAccessibleName('First Item');
        expect(items[1]).toHaveAccessibleName('Second Item');

        // Check that label is present
        expect(screen.getByText('Group Label')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty menu content', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Empty Menu</DropdownMenuTrigger>
          <DropdownMenuContent />
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('handles rapidly opening and closing', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Rapid Toggle</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button');

      // Rapidly click multiple times
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Should handle this gracefully without errors
      expect(trigger).toBeInTheDocument();
    });

    it('maintains focus management with disabled items', async () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Focus Test</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Enabled Item</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
            <DropdownMenuItem>Another Enabled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button'));

      // Navigate past disabled item
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(
          screen.getByRole('menuitem', { name: 'Another Enabled' })
        ).toHaveFocus();
      });
    });
  });
});
