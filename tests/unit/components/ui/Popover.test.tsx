import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  SimplePopover,
  MenuPopover,
  FormPopover,
  ConfirmPopover,
} from '@/components/ui/popover';

expect.extend(toHaveNoViolations);

// Mock ResizeObserver for JSDOM compatibility
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock DOMRect for Radix UI
const DOMRectMock = jest.fn().mockImplementation(() => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

(DOMRectMock as any).fromRect = jest.fn().mockImplementation(() => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

global.DOMRect = DOMRectMock as any;

// Mock pointer capture methods for JSDOM compatibility
Object.defineProperty(Element.prototype, 'hasPointerCapture', {
  value: jest.fn().mockReturnValue(false),
  writable: true,
});

Object.defineProperty(Element.prototype, 'setPointerCapture', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(Element.prototype, 'releasePointerCapture', {
  value: jest.fn(),
  writable: true,
});

describe('Popover Component', () => {
  describe('Basic Popover', () => {
    it('renders trigger correctly', () => {
      render(
        <Popover>
          <PopoverTrigger>
            <button>Open Popover</button>
          </PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      );

      expect(
        screen.getByRole('button', { name: 'Open Popover' })
      ).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
      const user = userEvent.setup();

      render(
        <Popover>
          <PopoverTrigger>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>Test content</PopoverContent>
        </Popover>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });
    });

    it('closes on escape key', async () => {
      const user = userEvent.setup();

      render(
        <Popover>
          <PopoverTrigger>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>Test content</PopoverContent>
        </Popover>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      });
    });

    it('accepts controlled open state', () => {
      render(
        <Popover open={false}>
          <PopoverTrigger>
            <button>Trigger</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('calls onOpenChange callback', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Popover onOpenChange={onOpenChange}>
          <PopoverTrigger>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('SimplePopover', () => {
    it('renders with content prop', () => {
      render(
        <SimplePopover content="Simple popover content">
          <button>Trigger</button>
        </SimplePopover>
      );

      expect(
        screen.getByRole('button', { name: 'Trigger' })
      ).toBeInTheDocument();
    });

    it('applies variant and size props', async () => {
      const user = userEvent.setup();

      render(
        <SimplePopover content="Test content" variant="accent" size="lg">
          <button>Trigger</button>
        </SimplePopover>
      );

      const trigger = screen.getByRole('button', { name: 'Trigger' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });
    });

    it('respects showArrow prop', async () => {
      const user = userEvent.setup();

      render(
        <SimplePopover content="Test" showArrow={false}>
          <button>Trigger</button>
        </SimplePopover>
      );

      const trigger = screen.getByRole('button', { name: 'Trigger' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
      });
    });

    it('respects side and align props', () => {
      render(
        <SimplePopover content="Test" side="top" align="start">
          <button>Trigger</button>
        </SimplePopover>
      );

      expect(
        screen.getByRole('button', { name: 'Trigger' })
      ).toBeInTheDocument();
    });
  });

  describe('MenuPopover', () => {
    const menuItems = [
      { label: 'Edit', onClick: jest.fn() },
      { label: 'Delete', onClick: jest.fn(), shortcut: 'Del' },
      { divider: true as const },
      { label: 'Cancel', disabled: true },
    ];

    it('renders menu items correctly', async () => {
      const user = userEvent.setup();

      render(
        <MenuPopover items={menuItems}>
          <button>Menu</button>
        </MenuPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Menu' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Del')).toBeInTheDocument();
      });
    });

    it('handles item click', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const items = [{ label: 'Click me', onClick }];

      render(
        <MenuPopover items={items}>
          <button>Menu</button>
        </MenuPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Menu' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Click me')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Click me'));
      expect(onClick).toHaveBeenCalled();
    });

    it('respects disabled items', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const items = [{ label: 'Disabled', onClick, disabled: true }];

      render(
        <MenuPopover items={items}>
          <button>Menu</button>
        </MenuPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Menu' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Disabled')).toBeInTheDocument();
      });

      const disabledButton = screen.getByText('Disabled').closest('button');
      expect(disabledButton).toBeDisabled();
    });
  });

  describe('FormPopover', () => {
    it('renders form content correctly', async () => {
      const user = userEvent.setup();

      render(
        <FormPopover
          title="Edit Name"
          description="Enter a new name"
          form={<input type="text" placeholder="Name" />}
        >
          <button>Edit</button>
        </FormPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Edit' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Edit Name')).toBeInTheDocument();
        expect(screen.getByText('Enter a new name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    it('handles form submission', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn(e => e.preventDefault());

      render(
        <FormPopover
          title="Test Form"
          form={<input type="text" />}
          onSubmit={onSubmit}
        >
          <button>Open Form</button>
        </FormPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Open Form' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Save')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Save'));
      expect(onSubmit).toHaveBeenCalled();
    });

    it('closes on cancel', async () => {
      const user = userEvent.setup();

      render(
        <FormPopover title="Test" form={<input />}>
          <button>Open</button>
        </FormPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
      });
    });

    it('accepts custom button labels', async () => {
      const user = userEvent.setup();

      render(
        <FormPopover form={<input />} submitLabel="Apply" cancelLabel="Discard">
          <button>Open</button>
        </FormPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Apply')).toBeInTheDocument();
        expect(screen.getByText('Discard')).toBeInTheDocument();
      });
    });
  });

  describe('ConfirmPopover', () => {
    it('renders confirmation content', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmPopover
          title="Confirm Delete"
          description="Are you sure you want to delete this item?"
        >
          <button>Delete</button>
        </ConfirmPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Delete' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        expect(
          screen.getByText('Are you sure you want to delete this item?')
        ).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    it('calls onConfirm callback', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();

      render(
        <ConfirmPopover description="Confirm action?" onConfirm={onConfirm}>
          <button>Action</button>
        </ConfirmPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Action' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Confirm')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalled();
    });

    it('calls onCancel callback', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();

      render(
        <ConfirmPopover description="Confirm action?" onCancel={onCancel}>
          <button>Action</button>
        </ConfirmPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Action' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Cancel'));
      expect(onCancel).toHaveBeenCalled();
    });

    it('applies confirm variant styles', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmPopover
          description="Delete?"
          confirmVariant="danger"
          confirmLabel="Delete Item"
        >
          <button>Delete</button>
        </ConfirmPopover>
      );

      const trigger = screen.getByRole('button', { name: 'Delete' });
      await user.click(trigger);

      await waitFor(() => {
        const confirmButton = screen.getByText('Delete Item');
        expect(confirmButton).toBeInTheDocument();
        expect(confirmButton).toHaveClass('bg-red-600');
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Popover>
          <PopoverTrigger>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('manages focus correctly', async () => {
      const user = userEvent.setup();

      render(
        <Popover>
          <PopoverTrigger>
            <button>Open</button>
          </PopoverTrigger>
          <PopoverContent>
            <button>Inside button</button>
          </PopoverContent>
        </Popover>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Inside button')).toBeInTheDocument();
      });
    });

    it('has proper ARIA attributes', () => {
      render(
        <Popover>
          <PopoverTrigger>
            <button>Trigger</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );

      const trigger = screen.getByRole('button', { name: 'Trigger' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <SimplePopover content="Test content">
          <button>Trigger</button>
        </SimplePopover>
      );

      const trigger = screen.getByRole('button', { name: 'Trigger' });
      trigger.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Popover Variants', () => {
    const variants = [
      'default',
      'light',
      'accent',
      'success',
      'warning',
      'error',
      'info',
    ] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, async () => {
        const user = userEvent.setup();

        render(
          <SimplePopover content={`${variant} content`} variant={variant}>
            <button>{variant}</button>
          </SimplePopover>
        );

        const trigger = screen.getByRole('button', { name: variant });
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByText(`${variant} content`)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Popover Sizes', () => {
    const sizes = ['sm', 'default', 'lg', 'xl', 'full'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, async () => {
        const user = userEvent.setup();

        render(
          <SimplePopover content={`${size} size`} size={size}>
            <button>{size}</button>
          </SimplePopover>
        );

        const trigger = screen.getByRole('button', { name: size });
        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByText(`${size} size`)).toBeInTheDocument();
        });
      });
    });
  });
});
