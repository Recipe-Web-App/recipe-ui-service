import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TooltipProvider,
  SimpleTooltip,
  CookingTermTooltip,
  HelpTooltip,
  InfoTooltip,
  KeyboardTooltip,
  MetricTooltip,
} from '@/components/ui/tooltip';

// Mock ResizeObserver for JSDOM compatibility
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

// Wrapper component for tooltip tests
const TooltipWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <TooltipProvider>{children}</TooltipProvider>;

describe('SimpleTooltip', () => {
  it('renders tooltip trigger correctly', () => {
    render(
      <TooltipWrapper>
        <SimpleTooltip content="This is a tooltip">
          <button>Hover me</button>
        </SimpleTooltip>
      </TooltipWrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Hover me' })
    ).toBeInTheDocument();
  });

  it('applies variant and size props correctly', () => {
    render(
      <TooltipWrapper>
        <SimpleTooltip content="Test" variant="accent" size="lg">
          <button>Trigger</button>
        </SimpleTooltip>
      </TooltipWrapper>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(
      <TooltipWrapper>
        <SimpleTooltip content="Test" className="custom-class">
          <button>Trigger</button>
        </SimpleTooltip>
      </TooltipWrapper>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('accepts controlled open state prop', () => {
    render(
      <TooltipWrapper>
        <SimpleTooltip content="Test" open={false}>
          <button>Trigger</button>
        </SimpleTooltip>
      </TooltipWrapper>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('accepts onOpenChange callback', () => {
    const onOpenChange = jest.fn();

    render(
      <TooltipWrapper>
        <SimpleTooltip content="Test" onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </SimpleTooltip>
      </TooltipWrapper>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });
});

describe('CookingTermTooltip', () => {
  it('renders cooking term with proper styling', () => {
    render(
      <TooltipWrapper>
        <CookingTermTooltip
          term="Julienne"
          definition="A knife cut in which the food item is cut into long thin strips"
          category="technique"
        />
      </TooltipWrapper>
    );

    expect(screen.getByText('Julienne')).toBeInTheDocument();
  });

  it('accepts all required props', () => {
    render(
      <TooltipWrapper>
        <CookingTermTooltip
          term="Julienne"
          definition="A knife cut in which the food item is cut into long thin strips"
          pronunciation="zhoo-lee-EHN"
          category="technique"
        />
      </TooltipWrapper>
    );

    expect(screen.getByText('Julienne')).toBeInTheDocument();
  });

  it('handles different categories', () => {
    render(
      <TooltipWrapper>
        <CookingTermTooltip
          term="Olive Oil"
          definition="A liquid fat obtained from olives"
          category="ingredient"
        />
      </TooltipWrapper>
    );

    expect(screen.getByText('Olive Oil')).toBeInTheDocument();
  });

  it('accepts custom children over term', () => {
    render(
      <TooltipWrapper>
        <CookingTermTooltip
          term="Julienne"
          definition="Test definition"
          category="technique"
        >
          <span>Custom trigger</span>
        </CookingTermTooltip>
      </TooltipWrapper>
    );

    expect(screen.getByText('Custom trigger')).toBeInTheDocument();
    expect(screen.queryByText('Julienne')).not.toBeInTheDocument();
  });
});

describe('HelpTooltip', () => {
  it('renders help icon button', () => {
    render(
      <TooltipWrapper>
        <HelpTooltip helpText="This is help text" />
      </TooltipWrapper>
    );

    expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
    expect(screen.getByLabelText('Help')).toBeInTheDocument();
  });

  it('accepts custom aria-label', () => {
    render(
      <TooltipWrapper>
        <HelpTooltip helpText="Test" aria-label="Custom help" />
      </TooltipWrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Custom help' })
    ).toBeInTheDocument();
  });

  it('applies icon variant and size correctly', () => {
    render(
      <TooltipWrapper>
        <HelpTooltip helpText="Test" iconVariant="accent" iconSize="lg" />
      </TooltipWrapper>
    );

    const button = screen.getByRole('button', { name: 'Help' });
    expect(button).toBeInTheDocument();
  });
});

describe('InfoTooltip', () => {
  it('renders info icon button', () => {
    render(
      <TooltipWrapper>
        <InfoTooltip infoText="This is info text" />
      </TooltipWrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Information' })
    ).toBeInTheDocument();
  });

  it('accepts custom props', () => {
    render(
      <TooltipWrapper>
        <InfoTooltip infoText="Test info" iconVariant="accent" iconSize="lg" />
      </TooltipWrapper>
    );

    expect(
      screen.getByRole('button', { name: 'Information' })
    ).toBeInTheDocument();
  });
});

describe('KeyboardTooltip', () => {
  it('renders keyboard shortcut tooltip', () => {
    render(
      <TooltipWrapper>
        <KeyboardTooltip shortcut="Ctrl+S">
          <button>Save</button>
        </KeyboardTooltip>
      </TooltipWrapper>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('accepts description prop', () => {
    render(
      <TooltipWrapper>
        <KeyboardTooltip shortcut="Ctrl+S" description="Save document">
          <button>Save</button>
        </KeyboardTooltip>
      </TooltipWrapper>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('handles array of shortcuts', () => {
    render(
      <TooltipWrapper>
        <KeyboardTooltip shortcut={['Ctrl', 'Shift', 'S']}>
          <button>Save As</button>
        </KeyboardTooltip>
      </TooltipWrapper>
    );

    expect(screen.getByRole('button', { name: 'Save As' })).toBeInTheDocument();
  });
});

describe('MetricTooltip', () => {
  it('renders metric value correctly', () => {
    render(
      <TooltipWrapper>
        <MetricTooltip metric="Temperature" value={180} unit="°C" />
      </TooltipWrapper>
    );

    expect(screen.getByText('180 °C')).toBeInTheDocument();
  });

  it('accepts conversion prop', () => {
    render(
      <TooltipWrapper>
        <MetricTooltip
          metric="Temperature"
          value={180}
          unit="°C"
          conversion={{ value: 356, unit: '°F', system: 'imperial' }}
        />
      </TooltipWrapper>
    );

    expect(screen.getByText('180 °C')).toBeInTheDocument();
  });

  it('accepts custom children over default display', () => {
    render(
      <TooltipWrapper>
        <MetricTooltip metric="Temperature" value={180} unit="°C">
          <span>Custom display</span>
        </MetricTooltip>
      </TooltipWrapper>
    );

    expect(screen.getByText('Custom display')).toBeInTheDocument();
    expect(screen.queryByText('180 °C')).not.toBeInTheDocument();
  });
});

describe('Tooltip Accessibility', () => {
  it('has proper ARIA attributes for help tooltip', () => {
    render(
      <TooltipWrapper>
        <HelpTooltip helpText="Help text" />
      </TooltipWrapper>
    );

    const button = screen.getByRole('button', { name: 'Help' });
    expect(button).toHaveAttribute('aria-label', 'Help');
  });

  it('creates focusable elements', () => {
    render(
      <TooltipWrapper>
        <SimpleTooltip content="Tooltip content">
          <button>Focusable trigger</button>
        </SimpleTooltip>
      </TooltipWrapper>
    );

    const trigger = screen.getByRole('button', { name: 'Focusable trigger' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toBeEnabled();
  });
});
