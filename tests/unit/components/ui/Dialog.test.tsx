import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Save, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogButton,
  DialogIcon,
  ConfirmationDialog,
  RecipeConfirmationDialog,
  AlertDialog,
} from '@/components/ui/dialog';

expect.extend(toHaveNoViolations);

describe('Dialog', () => {
  it('renders correctly when open', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    render(
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on escape key press', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    render(
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.keyboard('{Escape}');
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent variant="destructive">
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('border-destructive/20', 'bg-destructive/10');

    rerender(
      <Dialog open={true}>
        <DialogContent variant="success">
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('border-success/20', 'bg-success/10');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent size="sm">
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-sm', 'p-4');

    rerender(
      <Dialog open={true}>
        <DialogContent size="lg">
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-2xl', 'p-8');
  });

  it('can hide close button', () => {
    render(
      <Dialog open={true}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.queryByRole('button', { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', async () => {
    const { container } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This dialog is accessible</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('DialogHeader', () => {
  it('applies variant classes correctly', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader variant="destructive">
            <DialogTitle>Test Header</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const header = screen.getByText('Test Header').closest('div');
    expect(header).toHaveClass('text-destructive');
  });
});

describe('DialogTitle', () => {
  it('applies variant and size classes correctly', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle variant="success" size="lg">
            Success Title
          </DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const title = screen.getByText('Success Title');
    expect(title).toHaveClass('text-success', 'text-xl');
  });
});

describe('DialogDescription', () => {
  it('applies variant classes correctly', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription variant="warning">
            Warning description
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const description = screen.getByText('Warning description');
    expect(description).toHaveClass('dark:text-warning/80');
  });
});

describe('DialogFooter', () => {
  it('applies layout classes correctly', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogFooter layout="center">
            <DialogButton>Test Button</DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const footer = screen.getByText('Test Button').closest('div');
    expect(footer).toHaveClass('sm:justify-center');
  });
});

describe('DialogIcon', () => {
  it('renders with correct variant and size classes', () => {
    render(
      <Dialog open={true}>
        <DialogContent showCloseButton={false}>
          <DialogIcon variant="destructive" size="lg" data-testid="dialog-icon">
            <Trash2 className="h-6 w-6" />
          </DialogIcon>
        </DialogContent>
      </Dialog>
    );

    const icon = screen.getByTestId('dialog-icon');
    expect(icon).toHaveClass(
      'bg-destructive/10',
      'text-destructive',
      'h-12',
      'w-12'
    );
  });
});

describe('DialogButton', () => {
  it('applies intent and size classes correctly', () => {
    render(
      <DialogButton intent="destructive" size="lg">
        Delete
      </DialogButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-destructive',
      'text-destructive-foreground',
      'h-10',
      'px-6'
    );
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<DialogButton onClick={handleClick}>Click me</DialogButton>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<DialogButton disabled>Disabled Button</DialogButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    );
  });
});

describe('ConfirmationDialog', () => {
  it('renders with correct content', () => {
    render(
      <ConfirmationDialog
        open={true}
        title="Confirm Action"
        description="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const handleConfirm = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <ConfirmationDialog
        open={true}
        onOpenChange={handleOpenChange}
        title="Confirm Action"
        onConfirm={handleConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <ConfirmationDialog
        open={true}
        onOpenChange={handleOpenChange}
        title="Confirm Action"
        onCancel={handleCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state correctly', () => {
    render(
      <ConfirmationDialog open={true} title="Confirm Action" isLoading={true} />
    );

    const confirmButton = screen.getByRole('button', { name: 'Loading...' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('renders with icon when provided', () => {
    render(
      <ConfirmationDialog
        open={true}
        title="Delete Item"
        icon={<Trash2 data-testid="delete-icon" />}
        type="delete"
      />
    );

    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('applies correct button intent based on type', () => {
    const { rerender } = render(
      <ConfirmationDialog open={true} title="Delete Item" type="delete" />
    );

    let confirmButton = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmButton).toHaveClass('bg-destructive');

    rerender(<ConfirmationDialog open={true} title="Save Item" type="save" />);

    confirmButton = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmButton).toHaveClass('bg-success');
  });

  it('renders custom children content', () => {
    render(
      <ConfirmationDialog open={true} title="Confirm Action">
        <div>Custom content here</div>
      </ConfirmationDialog>
    );

    expect(screen.getByText('Custom content here')).toBeInTheDocument();
  });
});

describe('RecipeConfirmationDialog', () => {
  it('generates correct content for delete-recipe action', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="delete-recipe"
        recipeName="Chocolate Cake"
      />
    );

    expect(
      screen.getByText('Delete Recipe "Chocolate Cake"')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete "Chocolate Cake"/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete Recipe' })
    ).toBeInTheDocument();
  });

  it('generates correct content for save-recipe action', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="save-recipe"
        recipeName="Chocolate Cake"
      />
    );

    expect(
      screen.getByText('Save Recipe "Chocolate Cake"')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Save your changes to "Chocolate Cake"/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save Recipe' })
    ).toBeInTheDocument();
  });

  it('generates correct content for publish-recipe action', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="publish-recipe"
        recipeName="Chocolate Cake"
      />
    );

    expect(
      screen.getByText('Publish Recipe "Chocolate Cake"')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Make "Chocolate Cake" public and searchable/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Publish Recipe' })
    ).toBeInTheDocument();
  });

  it('generates correct content for share-recipe action', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="share-recipe"
        recipeName="Chocolate Cake"
      />
    );

    expect(
      screen.getByText('Share Recipe "Chocolate Cake"')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Share Recipe' })
    ).toBeInTheDocument();
  });

  it('generates correct content for export-recipe action', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="export-recipe"
        recipeName="Chocolate Cake"
      />
    );

    expect(
      screen.getByText('Export Recipe "Chocolate Cake"')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Export Recipe' })
    ).toBeInTheDocument();
  });

  it('generates correct content for duplicate-recipe action', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="duplicate-recipe"
        recipeName="Chocolate Cake"
      />
    );

    expect(
      screen.getByText('Duplicate Recipe "Chocolate Cake"')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Duplicate Recipe' })
    ).toBeInTheDocument();
  });

  it('works without recipe name', () => {
    render(<RecipeConfirmationDialog open={true} action="delete-recipe" />);

    expect(screen.getByText('Delete Recipe this recipe')).toBeInTheDocument();
  });

  it('allows custom title and description override', () => {
    render(
      <RecipeConfirmationDialog
        open={true}
        action="delete-recipe"
        title="Custom Title"
        description="Custom description"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('calls onConfirm and onCancel correctly', async () => {
    const user = userEvent.setup();
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();

    render(
      <RecipeConfirmationDialog
        open={true}
        action="save-recipe"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Save Recipe' }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('renders custom children with recipe variant styling', () => {
    render(
      <RecipeConfirmationDialog open={true} action="delete-recipe">
        <div data-testid="recipe-content">Recipe-specific content</div>
      </RecipeConfirmationDialog>
    );

    expect(screen.getByText('Recipe-specific content')).toBeInTheDocument();
    const content = screen.getByTestId('recipe-content').parentElement;
    expect(content).toHaveClass('border-l-destructive', 'bg-destructive/10');
  });
});

describe('AlertDialog', () => {
  it('renders correctly with basic content', () => {
    render(
      <AlertDialog
        open={true}
        title="Alert Title"
        description="Alert description"
      />
    );

    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('does not show close button', () => {
    render(<AlertDialog open={true} title="Alert Title" />);

    expect(
      screen.queryByRole('button', { name: /close/i })
    ).not.toBeInTheDocument();
  });

  it('calls onAction when action button is clicked', async () => {
    const user = userEvent.setup();
    const handleAction = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <AlertDialog
        open={true}
        onOpenChange={handleOpenChange}
        title="Alert Title"
        onAction={handleAction}
        actionText="Acknowledge"
      />
    );

    await user.click(screen.getByRole('button', { name: 'Acknowledge' }));

    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows loading state correctly', () => {
    render(<AlertDialog open={true} title="Loading Alert" isLoading={true} />);

    const button = screen.getByRole('button', { name: 'Loading...' });
    expect(button).toBeDisabled();
  });

  it('applies variant styling', () => {
    render(
      <AlertDialog open={true} title="Error Alert" variant="destructive" />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('border-destructive/20', 'bg-destructive/10');
  });
});

describe('Dialog Accessibility', () => {
  it('manages focus correctly', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button>Outside Button</button>
        <Dialog open={true}>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Focus Test</DialogTitle>
            <DialogFooter>
              <DialogButton>First Button</DialogButton>
              <DialogButton>Second Button</DialogButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );

    // Focus should be trapped within dialog
    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');

    // Start with first focusable element
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    // Tab should move to second button
    await user.tab();
    expect(secondButton).toHaveFocus();
  });

  it('has proper ARIA labels and descriptions', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Title</DialogTitle>
            <DialogDescription>Accessible description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Accessible Title');
    const description = screen.getByText('Accessible description');

    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('passes accessibility audit', async () => {
    const { container } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>
              This dialog is fully accessible
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogButton intent="secondary">Cancel</DialogButton>
            <DialogButton intent="primary">Confirm</DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Dialog Integration', () => {
  it('works in complex scenarios', async () => {
    const user = userEvent.setup();
    const handleSave = jest.fn();
    const handleDelete = jest.fn();

    const ComplexDialog = () => {
      const [showSave, setShowSave] = React.useState(false);
      const [showDelete, setShowDelete] = React.useState(false);

      return (
        <div>
          <DialogButton onClick={() => setShowSave(true)}>
            Save Recipe
          </DialogButton>
          <DialogButton onClick={() => setShowDelete(true)}>
            Delete Recipe
          </DialogButton>

          <RecipeConfirmationDialog
            open={showSave}
            onOpenChange={setShowSave}
            action="save-recipe"
            recipeName="Test Recipe"
            onConfirm={() => {
              handleSave();
              setShowSave(false);
            }}
          />

          <RecipeConfirmationDialog
            open={showDelete}
            onOpenChange={setShowDelete}
            action="delete-recipe"
            recipeName="Test Recipe"
            onConfirm={() => {
              handleDelete();
              setShowDelete(false);
            }}
          />
        </div>
      );
    };

    render(<ComplexDialog />);

    // Test save flow
    await user.click(screen.getByRole('button', { name: 'Save Recipe' }));
    expect(screen.getByText('Save Recipe "Test Recipe"')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save Recipe' }));
    expect(handleSave).toHaveBeenCalledTimes(1);

    // Test delete flow
    await user.click(screen.getByRole('button', { name: 'Delete Recipe' }));
    expect(screen.getByText('Delete Recipe "Test Recipe"')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Recipe' }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation correctly', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent>
          <DialogTitle>Keyboard Test</DialogTitle>
          <div>
            <input type="text" placeholder="Test input" />
          </div>
          <DialogFooter>
            <DialogButton>Cancel</DialogButton>
            <DialogButton>Confirm</DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Test Escape key
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledWith(false);
  });
});
