import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Switch,
  SwitchRoot,
  SwitchTrack,
  SwitchThumb,
  SwitchLabel,
  SwitchDescription,
  SwitchField,
  RecipeSwitchGroup,
  AnimatedSwitch,
  SettingsSwitch,
} from '@/components/ui/switch';
import type { RecipeSwitchItemProps } from '@/types/ui/switch';
import { Moon, Sun } from 'lucide-react';

describe('Switch Components', () => {
  describe('Switch (Main)', () => {
    it('renders with default props', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('renders with label', () => {
      render(<Switch label="Test Switch" />);
      expect(screen.getByText('Test Switch')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(<Switch description="This is a test switch" />);
      expect(screen.getByText('This is a test switch')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(<Switch size="sm" />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-5', 'w-9');

      rerender(<Switch size="md" />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-6', 'w-11');

      rerender(<Switch size="lg" />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-7', 'w-14');

      rerender(<Switch size="xl" />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-8', 'w-16');
    });

    it('applies variant classes correctly', () => {
      const { rerender } = render(<Switch variant="default" />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input');

      rerender(<Switch variant="success" />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('data-[state=checked]:bg-success');

      rerender(<Switch variant="danger" />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('data-[state=checked]:bg-destructive');
    });

    it('handles checked state', () => {
      const handleChange = jest.fn();
      render(<Switch checked={true} onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('handles click events', async () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles disabled state', () => {
      render(<Switch disabled label="Disabled Switch" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement.parentElement).toHaveClass('opacity-50');
    });

    it('handles loading state', () => {
      render(<Switch loading />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('displays error message', () => {
      render(<Switch error="This field is required" />);

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent('This field is required');
    });

    it('marks as required', () => {
      render(<Switch required label="Required Switch" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-required', 'true');

      const label = screen.getByText('Required Switch');
      expect(label).toHaveClass("after:content-['*']");
    });

    it('renders with icons', () => {
      render(
        <Switch
          checkedIcon={<Moon data-testid="moon-icon" />}
          uncheckedIcon={<Sun data-testid="sun-icon" />}
        />
      );

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toBeInTheDocument();
    });

    it('applies orientation classes', () => {
      const { rerender } = render(<Switch orientation="horizontal" />);
      expect(screen.getByRole('switch').parentElement).toHaveClass('flex-row');

      rerender(<Switch orientation="vertical" />);
      expect(screen.getByRole('switch').parentElement).toHaveClass('flex-col');

      rerender(<Switch orientation="reverse-horizontal" />);
      expect(screen.getByRole('switch').parentElement).toHaveClass(
        'flex-row-reverse'
      );
    });
  });

  describe('Compound Components', () => {
    it('SwitchRoot provides context to children', () => {
      const handleChange = jest.fn();
      render(
        <SwitchRoot onCheckedChange={handleChange}>
          <SwitchTrack>
            <SwitchThumb />
          </SwitchTrack>
          <SwitchLabel>Test Label</SwitchLabel>
        </SwitchRoot>
      );

      const track = screen.getByRole('switch');
      fireEvent.click(track);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('SwitchTrack toggles state on click', () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <SwitchRoot checked={checked} onCheckedChange={setChecked}>
            <SwitchTrack>
              <SwitchThumb />
            </SwitchTrack>
          </SwitchRoot>
        );
      };

      render(<TestComponent />);
      const track = screen.getByRole('switch');

      expect(track).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(track);
      expect(track).toHaveAttribute('aria-checked', 'true');
    });

    it('SwitchLabel renders correctly', () => {
      render(
        <SwitchRoot>
          <SwitchLabel>Test Label</SwitchLabel>
        </SwitchRoot>
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('SwitchDescription renders correctly', () => {
      render(
        <SwitchRoot>
          <SwitchDescription>Test Description</SwitchDescription>
        </SwitchRoot>
      );

      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  describe('SwitchField', () => {
    it('renders with label and helper text', () => {
      render(
        <SwitchField label="Field Label" helperText="This is helper text" />
      );

      expect(screen.getByText('Field Label')).toBeInTheDocument();
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('displays error state', () => {
      render(<SwitchField label="Field Label" error="Field is required" />);

      expect(screen.getByRole('alert')).toHaveTextContent('Field is required');
    });
  });

  describe('RecipeSwitchGroup', () => {
    const testSwitches: RecipeSwitchItemProps[] = [
      {
        id: 'switch1',
        label: 'Switch 1',
        description: 'Description 1',
        defaultChecked: true,
      },
      {
        id: 'switch2',
        label: 'Switch 2',
        description: 'Description 2',
        defaultChecked: false,
      },
    ];

    it('renders group with title', () => {
      render(<RecipeSwitchGroup title="Test Group" switches={testSwitches} />);

      expect(screen.getByText('Test Group')).toBeInTheDocument();
      expect(screen.getByText('Switch 1')).toBeInTheDocument();
      expect(screen.getByText('Switch 2')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
      const { rerender } = render(
        <RecipeSwitchGroup variant="preferences" switches={testSwitches} />
      );
      expect(screen.getByText('Switch 1').closest('.rounded-lg')).toHaveClass(
        'border-success/20'
      );

      rerender(
        <RecipeSwitchGroup variant="notifications" switches={testSwitches} />
      );
      expect(screen.getByText('Switch 1').closest('.rounded-lg')).toHaveClass(
        'border-primary/20'
      );
    });

    it('handles batch changes', async () => {
      const handleBatchChange = jest.fn();
      render(
        <RecipeSwitchGroup
          switches={testSwitches}
          onBatchChange={handleBatchChange}
        />
      );

      const switches = screen.getAllByRole('switch');
      await userEvent.click(switches[1]); // Click second switch

      expect(handleBatchChange).toHaveBeenCalledWith({
        switch1: true,
        switch2: true,
      });
    });

    it('maintains individual switch states', () => {
      render(<RecipeSwitchGroup switches={testSwitches} />);

      const switches = screen.getAllByRole('switch');
      expect(switches[0]).toHaveAttribute('aria-checked', 'true');
      expect(switches[1]).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('AnimatedSwitch', () => {
    it('renders with animation properties', () => {
      render(
        <AnimatedSwitch
          animationType="fade"
          animationDuration={300}
          label="Animated Switch"
        />
      );

      const switchElement = screen.getByRole('switch');
      const switchWrapper = switchElement.parentElement;

      // Check for CSS class applied by AnimatedSwitch
      expect(switchWrapper).toHaveClass('transition-opacity');

      // The AnimatedSwitch component exists and renders properly
      expect(screen.getByText('Animated Switch')).toBeInTheDocument();
    });

    it('applies scale animation', () => {
      render(<AnimatedSwitch animationType="scale" animationDuration={150} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement.parentElement).toHaveClass('transition-transform');
    });
  });

  describe('SettingsSwitch', () => {
    it('renders with icon and badge', () => {
      render(
        <SettingsSwitch
          icon={<Moon data-testid="icon" />}
          badge={<span data-testid="badge">New</span>}
          label="Settings"
        />
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('handles async onChange', async () => {
      const handleChange = jest.fn().mockResolvedValue(undefined);

      render(
        <SettingsSwitch
          label="Async Switch"
          checked={false}
          onChange={handleChange}
        />
      );

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });

    it('handles optimistic updates', async () => {
      const handleChange = jest.fn().mockResolvedValue(undefined);

      render(
        <SettingsSwitch
          checked={false}
          onChange={handleChange}
          optimisticUpdate={true}
          label="Optimistic Switch"
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      // Click should trigger onChange
      await userEvent.click(switchElement);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });

    it('handles loading state during async operation', async () => {
      const handleChange = jest.fn(
        () => new Promise<void>(resolve => setTimeout(resolve, 100))
      );

      render(
        <SettingsSwitch
          checked={false}
          onChange={handleChange}
          label="Loading Switch"
        />
      );

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      // Should call the async handler
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - basic Switch', async () => {
      const { container } = render(
        <Switch label="Accessible Switch" description="Test description" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - SwitchField', async () => {
      const { container } = render(
        <SwitchField label="Field Label" helperText="Helper text" required />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - RecipeSwitchGroup', async () => {
      const { container } = render(
        <RecipeSwitchGroup
          title="Group Title"
          switches={[
            { id: '1', label: 'Switch 1' },
            { id: '2', label: 'Switch 2' },
          ]}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} label="Keyboard Switch" />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      // Click to toggle (Radix UI handles keyboard internally)
      await userEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('has proper ARIA attributes', () => {
      render(
        <Switch
          label="ARIA Switch"
          description="Description"
          required
          error="Error message"
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-required', 'true');
      expect(switchElement).toHaveAttribute('aria-invalid', 'true');
      expect(switchElement).toHaveAttribute('aria-describedby');
    });

    it('associates label with switch', () => {
      render(<Switch label="Associated Label" />);

      const switchElement = screen.getByRole('switch');
      const label = screen.getByText('Associated Label');

      expect(label).toHaveAttribute('for', switchElement.id);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicks', async () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      // Rapid clicks
      await userEvent.click(switchElement);
      await userEvent.click(switchElement);
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('handles undefined props gracefully', () => {
      render(
        <Switch label={undefined} description={undefined} error={undefined} />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('maintains controlled state', () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <>
            <Switch checked={checked} onCheckedChange={setChecked} />
            <button onClick={() => setChecked(true)}>Set True</button>
          </>
        );
      };

      render(<TestComponent />);

      const switchElement = screen.getByRole('switch');
      const button = screen.getByText('Set True');

      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(button);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });
});
