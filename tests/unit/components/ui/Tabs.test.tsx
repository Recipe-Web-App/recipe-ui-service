import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

expect.extend(toHaveNoViolations);

const user = userEvent.setup();

describe('Tabs Components', () => {
  describe('Tabs Root', () => {
    it('renders tabs root with children', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Tabs className="custom-tabs" defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(container.firstChild).toHaveClass('custom-tabs');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Tabs ref={ref} defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('supports controlled value', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('tab1');
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('TabsList', () => {
    it('renders with default variant and size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-lg',
        'bg-gray-100',
        'p-1',
        'h-9',
        'text-sm'
      );
    });

    it('renders with line variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList variant="line">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'bg-transparent',
        'border-b',
        'border-gray-200',
        'rounded-none',
        'p-0'
      );
    });

    it('renders with pills variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList variant="pills">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('bg-gray-50', 'border', 'border-gray-200');
    });

    it('renders with small size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList size="sm">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('h-8', 'text-xs');
    });

    it('renders with large size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList size="lg">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('h-10', 'text-base');
    });

    it('supports custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toHaveClass('custom-list');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Tabs defaultValue="tab1">
          <TabsList ref={ref}>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('TabsTrigger', () => {
    it('renders trigger with default styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab', { name: 'Tab 1' });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'whitespace-nowrap',
        'rounded-md',
        'px-3',
        'py-1',
        'font-medium',
        'transition-all',
        'hover:bg-gray-50',
        'hover:text-gray-900',
        'h-7',
        'text-sm'
      );
    });

    it('renders with line variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList variant="line">
            <TabsTrigger variant="line" value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab', { name: 'Tab 1' });
      expect(trigger).toHaveClass(
        'rounded-none',
        'border-b-2',
        'border-transparent',
        'bg-transparent',
        'pb-2',
        'shadow-none'
      );
    });

    it('renders with pills variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab', { name: 'Tab 1' });
      expect(trigger).toHaveClass(
        'rounded-full',
        'hover:bg-blue-50',
        'hover:text-blue-700'
      );
    });

    it('shows active state styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Active Tab</TabsTrigger>
            <TabsTrigger value="tab2">Inactive Tab</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const activeTab = screen.getByRole('tab', { name: 'Active Tab' });
      const inactiveTab = screen.getByRole('tab', { name: 'Inactive Tab' });

      expect(activeTab).toHaveAttribute('aria-selected', 'true');
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });

    it('handles click events', async () => {
      const handleValueChange = jest.fn();
      render(
        <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleValueChange).toHaveBeenCalledWith('tab2');
    });

    it('supports disabled state', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Disabled Tab
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const disabledTab = screen.getByRole('tab', { name: 'Disabled Tab' });
      expect(disabledTab).toHaveAttribute('data-disabled');
    });

    it('renders with small size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger size="sm" value="tab1">
              Small Tab
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab', { name: 'Small Tab' });
      expect(trigger).toHaveClass('h-6', 'px-2', 'text-xs');
    });

    it('renders with large size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger size="lg" value="tab1">
              Large Tab
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab', { name: 'Large Tab' });
      expect(trigger).toHaveClass('h-8', 'px-4', 'text-base');
    });

    it('supports custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger className="custom-trigger" value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass(
        'custom-trigger'
      );
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger ref={ref} value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('TabsContent', () => {
    it('renders content with default styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Test Content</TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Test Content');
      expect(content).toHaveClass(
        'mt-2',
        'rounded-md',
        'border',
        'border-gray-200',
        'p-4',
        'text-base'
      );
    });

    it('renders with line variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList variant="line">
            <TabsTrigger variant="line" value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="line" value="tab1">
            Line Content
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('pt-4');
      expect(content).not.toHaveClass('border', 'p-4');
    });

    it('renders with pills variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="pills" value="tab1">
            Pills Content
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('rounded-lg', 'bg-gray-50', 'p-4');
    });

    it('renders with card variant', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent variant="card" value="tab1">
            Card Content
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass(
        'rounded-lg',
        'border',
        'border-gray-200',
        'bg-white',
        'p-6',
        'shadow-sm'
      );
    });

    it('renders with small size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent size="sm" value="tab1">
            Small Content
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('text-sm');
    });

    it('renders with large size', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent size="lg" value="tab1">
            Large Content
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('text-lg');
    });

    it('shows only content for active tab', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      });
    });

    it('supports custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent className="custom-content" value="tab1">
            Content
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tabpanel')).toHaveClass('custom-content');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent ref={ref} value="tab1">
            Content
          </TabsContent>
        </Tabs>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      await act(async () => {
        tab1.focus();
      });
      expect(tab1).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();
    });

    it('supports Home and End keys', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

      await act(async () => {
        tab2.focus();
      });

      await user.keyboard('{Home}');
      expect(tab1).toHaveFocus();

      await user.keyboard('{End}');
      expect(tab3).toHaveFocus();
    });

    it('activates tab on Space and Enter', async () => {
      const handleValueChange = jest.fn();
      render(
        <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await act(async () => {
        tab2.focus();
      });

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(handleValueChange).toHaveBeenCalledWith('tab2');
      });

      // Reset
      handleValueChange.mockClear();

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      await act(async () => {
        tab3.focus();
      });

      await user.keyboard(' ');
      await waitFor(() => {
        expect(handleValueChange).toHaveBeenCalledWith('tab3');
      });
    });
  });

  describe('Recipe App Use Cases', () => {
    it('renders recipe detail tabs correctly', async () => {
      render(
        <Tabs defaultValue="ingredients">
          <TabsList variant="line">
            <TabsTrigger variant="line" value="ingredients">
              Ingredients
            </TabsTrigger>
            <TabsTrigger variant="line" value="instructions">
              Instructions
            </TabsTrigger>
            <TabsTrigger variant="line" value="nutrition">
              Nutrition
            </TabsTrigger>
            <TabsTrigger variant="line" value="reviews">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="line" value="ingredients">
            <div>Recipe ingredients list</div>
          </TabsContent>
          <TabsContent variant="line" value="instructions">
            <div>Cooking instructions</div>
          </TabsContent>
          <TabsContent variant="line" value="nutrition">
            <div>Nutrition information</div>
          </TabsContent>
          <TabsContent variant="line" value="reviews">
            <div>User reviews</div>
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Recipe ingredients list')).toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Instructions' }));

      await waitFor(() => {
        expect(screen.getByText('Cooking instructions')).toBeInTheDocument();
        expect(
          screen.queryByText('Recipe ingredients list')
        ).not.toBeInTheDocument();
      });
    });

    it('renders user profile tabs correctly', async () => {
      render(
        <Tabs defaultValue="recipes">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="recipes">
              My Recipes
            </TabsTrigger>
            <TabsTrigger variant="pills" value="collections">
              Collections
            </TabsTrigger>
            <TabsTrigger variant="pills" value="activity">
              Activity
            </TabsTrigger>
            <TabsTrigger variant="pills" value="settings">
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="pills" value="recipes">
            <div>User recipes content</div>
          </TabsContent>
          <TabsContent variant="pills" value="collections">
            <div>Recipe collections</div>
          </TabsContent>
          <TabsContent variant="pills" value="activity">
            <div>Recent activity</div>
          </TabsContent>
          <TabsContent variant="pills" value="settings">
            <div>Profile settings</div>
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByText('User recipes content')).toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Collections' }));

      await waitFor(() => {
        expect(screen.getByText('Recipe collections')).toBeInTheDocument();
        expect(
          screen.queryByText('User recipes content')
        ).not.toBeInTheDocument();
      });
    });

    it('renders meal category tabs correctly', async () => {
      render(
        <Tabs defaultValue="breakfast">
          <TabsList>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="dessert">Dessert</TabsTrigger>
          </TabsList>
          <TabsContent value="breakfast">Breakfast recipes</TabsContent>
          <TabsContent value="lunch">Lunch recipes</TabsContent>
          <TabsContent value="dinner">Dinner recipes</TabsContent>
          <TabsContent value="dessert">Dessert recipes</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Breakfast recipes')).toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Dinner' }));

      await waitFor(() => {
        expect(screen.getByText('Dinner recipes')).toBeInTheDocument();
        expect(screen.queryByText('Breakfast recipes')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - basic tabs', async () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - line variant', async () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList variant="line">
            <TabsTrigger variant="line" value="tab1">
              Tab 1
            </TabsTrigger>
            <TabsTrigger variant="line" value="tab2">
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="line" value="tab1">
            Content 1
          </TabsContent>
          <TabsContent variant="line" value="tab2">
            Content 2
          </TabsContent>
        </Tabs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - pills variant', async () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList variant="pills">
            <TabsTrigger variant="pills" value="tab1">
              Tab 1
            </TabsTrigger>
            <TabsTrigger variant="pills" value="tab2">
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent variant="pills" value="tab1">
            Content 1
          </TabsContent>
          <TabsContent variant="pills" value="tab2">
            Content 2
          </TabsContent>
        </Tabs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toHaveAttribute('role', 'tablist');
      expect(tab1).toHaveAttribute('role', 'tab');
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tabpanel).toHaveAttribute('role', 'tabpanel');
      expect(tabpanel).toHaveAttribute('aria-labelledby', tab1.id);
    });

    it('supports screen reader navigation', () => {
      render(
        <Tabs defaultValue="ingredients">
          <TabsList>
            <TabsTrigger value="ingredients">Recipe Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Cooking Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients">
            <h3>Ingredients List</h3>
            <p>List of recipe ingredients</p>
          </TabsContent>
          <TabsContent value="instructions">
            <h3>Instructions</h3>
            <p>Step by step cooking instructions</p>
          </TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Recipe Ingredients' });
      const tab2 = screen.getByRole('tab', { name: 'Cooking Instructions' });
      const content = screen.getByRole('tabpanel');

      expect(tab1).toHaveAccessibleName('Recipe Ingredients');
      expect(tab2).toHaveAccessibleName('Cooking Instructions');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tabs gracefully', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList />
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('handles missing TabsContent gracefully', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    });

    it('handles rapid tab switching', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

      // Rapidly switch tabs
      await user.click(tab2);
      await user.click(tab3);
      await user.click(tab2);

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
      });
    });

    it('maintains focus when content changes', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      await user.click(tab2);

      await waitFor(() => {
        expect(tab2).toHaveFocus();
      });
    });
  });
});
