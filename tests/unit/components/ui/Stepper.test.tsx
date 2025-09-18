import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  Stepper,
  StepperItem,
  StepIndicator,
  StepConnector,
  StepHeader,
  StepContent,
  StepControls,
  StepProgress,
  RecipeStepper,
  CookingStepper,
  CookingTimer,
} from '@/components/ui/stepper';
import type {
  StepperStep,
  RecipeWorkflowStep,
  RecipeInstruction,
} from '@/types/ui/stepper';

// Mock the Icon component
jest.mock('@/components/ui/icon', () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <div data-testid={`icon-${name}`} className={className}>
      {name}
    </div>
  ),
}));

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: React.forwardRef<HTMLButtonElement, any>(
    (
      { children, onClick, disabled, variant, size, className, ...props },
      ref
    ) => (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        className={className}
        {...props}
      >
        {children}
      </button>
    )
  ),
}));

// Mock the Progress component
jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: { value: number; className?: string }) => (
    <div data-testid="progress" data-value={value} className={className}>
      Progress: {value}%
    </div>
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Sample test data
const sampleSteps: StepperStep[] = [
  {
    id: 'step1',
    title: 'Step 1',
    description: 'First step description',
    icon: 'user',
    estimatedTime: '2 min',
    content: <div>Step 1 Content</div>,
  },
  {
    id: 'step2',
    title: 'Step 2',
    description: 'Second step description',
    icon: 'settings',
    estimatedTime: '3 min',
    isOptional: true,
    content: <div>Step 2 Content</div>,
  },
  {
    id: 'step3',
    title: 'Step 3',
    description: 'Third step description',
    icon: 'check',
    estimatedTime: '1 min',
    content: <div>Step 3 Content</div>,
  },
];

const recipeSteps: RecipeWorkflowStep[] = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Recipe details',
    category: 'basic',
    icon: 'file-text',
    content: <div>Basic Info Form</div>,
  },
  {
    id: 'ingredients',
    title: 'Ingredients',
    description: 'Add ingredients',
    category: 'ingredients',
    icon: 'shopping-cart',
    content: <div>Ingredients Form</div>,
  },
];

const cookingInstructions: RecipeInstruction[] = [
  {
    id: 'step1',
    stepNumber: 1,
    instruction: 'Heat oil in a pan',
    duration: 2,
    equipment: ['Pan', 'Stove'],
  },
  {
    id: 'step2',
    stepNumber: 2,
    instruction: 'Add ingredients and cook',
    duration: 5,
    equipment: ['Spatula'],
    tips: 'Stir frequently to prevent burning',
  },
];

describe('Stepper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic stepper correctly', () => {
    render(<Stepper steps={sampleSteps} currentStep="step1" />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
  });

  it('shows progress indicator when showProgress is true', () => {
    render(
      <Stepper steps={sampleSteps} currentStep="step1" showProgress={true} />
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('handles step navigation correctly', async () => {
    const user = userEvent.setup();
    const mockOnStepChange = jest.fn();

    render(
      <Stepper
        steps={sampleSteps}
        currentStep="step1"
        allowNonLinear={true}
        onStepChange={mockOnStepChange}
      />
    );

    // Click on step 2
    await user.click(screen.getByText('Step 2'));
    expect(mockOnStepChange).toHaveBeenCalledWith('step2', 'step1');
  });

  it('supports keyboard navigation for accessible steps', async () => {
    const user = userEvent.setup();
    const mockOnStepChange = jest.fn();

    render(
      <Stepper
        steps={sampleSteps}
        currentStep="step1"
        allowNonLinear={true}
        onStepChange={mockOnStepChange}
      />
    );

    // Find the step container that has the keyboard handler
    const step2Container = screen
      .getByText('Step 2')
      .closest('[role="button"]');
    expect(step2Container).toBeInTheDocument();

    if (step2Container) {
      (step2Container as HTMLElement).focus();
      await user.keyboard('{Enter}');
      expect(mockOnStepChange).toHaveBeenCalledWith('step2', 'step1');
    }
  });

  it('renders with different orientations', () => {
    const { rerender } = render(
      <Stepper steps={sampleSteps} orientation="horizontal" />
    );

    // Check for horizontal layout - there should be no previous button on first step
    expect(
      screen.queryByRole('button', { name: /previous/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    rerender(<Stepper steps={sampleSteps} orientation="vertical" />);

    // Component should re-render with vertical orientation
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('handles step validation', async () => {
    const user = userEvent.setup();
    const mockValidateStep = jest.fn().mockResolvedValue(false);

    render(
      <Stepper
        steps={sampleSteps}
        currentStep="step1"
        onValidateStep={mockValidateStep}
      />
    );

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(mockValidateStep).toHaveBeenCalledWith('step1');
    });
  });

  it('persists state in localStorage when enabled', () => {
    const storageKey = 'test-stepper';

    render(
      <Stepper
        steps={sampleSteps}
        currentStep="step2"
        persistState={true}
        storageKey={storageKey}
      />
    );

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      storageKey,
      expect.stringContaining('"currentStepId":"step2"')
    );
  });

  it('loads persisted state from localStorage', () => {
    const storageKey = 'test-stepper';
    const savedState = {
      currentStepId: 'step2',
      completedSteps: ['step1'],
      errorSteps: [],
      skippedSteps: [],
      stepData: {},
      isLoading: false,
      errors: {},
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    render(
      <Stepper
        steps={sampleSteps}
        persistState={true}
        storageKey={storageKey}
      />
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith(storageKey);
    expect(screen.getByText('Step 2 Content')).toBeInTheDocument();
  });
});

describe('StepperItem Component', () => {
  it('renders step item with all elements', () => {
    render(
      <StepperItem
        step={sampleSteps[0]}
        stepNumber={1}
        isActive={true}
        orientation="horizontal"
      />
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('First step description')).toBeInTheDocument();
    expect(screen.getByText('2 min')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows optional indicator for optional steps', () => {
    render(
      <StepperItem
        step={sampleSteps[1]}
        stepNumber={2}
        orientation="horizontal"
      />
    );

    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('handles click events when clickable', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    render(
      <StepperItem
        step={sampleSteps[0]}
        stepNumber={1}
        onStepClick={mockOnClick}
        orientation="horizontal"
      />
    );

    await user.click(screen.getByText('Step 1'));
    expect(mockOnClick).toHaveBeenCalledWith('step1');
  });
});

describe('StepIndicator Component', () => {
  it('renders different states correctly', () => {
    const { rerender } = render(
      <StepIndicator state="pending" stepNumber={1} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<StepIndicator state="completed" stepNumber={1} />);
    // Check that the check icon SVG is rendered for completed state
    const checkIcon = document.querySelector('svg.lucide-check');
    expect(checkIcon).toBeInTheDocument();

    rerender(<StepIndicator state="error" stepNumber={1} />);
    // Check that the error icon SVG is rendered for error state
    const errorIcon = document.querySelector('svg.lucide-x');
    expect(errorIcon).toBeInTheDocument();
  });

  it('renders icon variant correctly', () => {
    render(<StepIndicator variant="icon" icon="user" state="active" />);
    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
  });

  it('renders dotted variant correctly', () => {
    render(<StepIndicator variant="dotted" state="active" />);
    // Dotted variant should not show text content
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});

describe('StepConnector Component', () => {
  it('renders with different orientations', () => {
    const { rerender } = render(
      <StepConnector orientation="horizontal" state="completed" />
    );

    rerender(<StepConnector orientation="vertical" state="active" />);
    // Component should render without errors
  });

  it('renders with different variants', () => {
    render(<StepConnector variant="dashed" state="pending" />);
    // Component should render without errors
  });
});

describe('StepControls Component', () => {
  it('renders navigation buttons correctly', () => {
    render(
      <StepControls
        canGoPrevious={true}
        canGoNext={true}
        canSkip={true}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onSkip={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  });

  it('shows finish button on last step', () => {
    render(
      <StepControls
        canGoPrevious={true}
        canGoNext={true}
        showFinish={true}
        onPrevious={jest.fn()}
        onFinish={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /next/i })
    ).not.toBeInTheDocument();
  });

  it('calls correct handlers when buttons are clicked', async () => {
    const user = userEvent.setup();
    const mockOnPrevious = jest.fn();
    const mockOnNext = jest.fn();
    const mockOnSkip = jest.fn();

    render(
      <StepControls
        canGoPrevious={true}
        canGoNext={true}
        canSkip={true}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        onSkip={mockOnSkip}
      />
    );

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(mockOnPrevious).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(mockOnNext).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /skip/i }));
    expect(mockOnSkip).toHaveBeenCalled();
  });
});

describe('StepProgress Component', () => {
  it('renders progress with step numbers', () => {
    render(
      <StepProgress
        progress={66}
        currentStep={2}
        totalSteps={3}
        showStepNumbers={true}
      />
    );

    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(screen.getByText('66% Complete')).toBeInTheDocument();
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('hides step numbers when showStepNumbers is false', () => {
    render(
      <StepProgress
        progress={50}
        currentStep={1}
        totalSteps={2}
        showStepNumbers={false}
      />
    );

    expect(screen.queryByText('Step 1 of 2')).not.toBeInTheDocument();
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});

describe('RecipeStepper Component', () => {
  it('renders recipe stepper with workflow title', () => {
    render(
      <RecipeStepper
        workflow="creation"
        steps={recipeSteps}
        currentStep="basic"
      />
    );

    expect(screen.getByText('Create New Recipe')).toBeInTheDocument();
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('shows draft indicator and save button', () => {
    const mockOnSave = jest.fn();

    render(
      <RecipeStepper
        workflow="creation"
        steps={recipeSteps}
        currentStep="basic"
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save draft/i })
    ).toBeInTheDocument();
  });

  it('renders different workflow variants', () => {
    const { rerender } = render(
      <RecipeStepper workflow="creation" steps={recipeSteps} />
    );
    expect(screen.getByText('Create New Recipe')).toBeInTheDocument();

    rerender(<RecipeStepper workflow="cooking" steps={recipeSteps} />);
    expect(screen.getByText('Cooking Mode')).toBeInTheDocument();

    rerender(<RecipeStepper workflow="planning" steps={recipeSteps} />);
    expect(screen.getByText('Meal Planning')).toBeInTheDocument();
  });
});

describe('CookingStepper Component', () => {
  it('renders cooking instructions as steps', () => {
    render(
      <CookingStepper
        instructions={cookingInstructions}
        currentStep={0}
        showTimers={true}
      />
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getAllByText('Heat oil in a pan')).toHaveLength(2);
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Add ingredients and cook')).toBeInTheDocument();
  });

  it('shows ingredient checklist when enabled', () => {
    const ingredients = [
      { id: '1', name: 'Oil', amount: 2, unit: 'tbsp' },
      { id: '2', name: 'Onion', amount: 1, unit: 'medium' },
    ];

    render(
      <CookingStepper
        instructions={cookingInstructions}
        showIngredients={true}
        ingredients={ingredients}
      />
    );

    expect(screen.getByText('Ingredients Checklist')).toBeInTheDocument();
    expect(screen.getByText('2 tbsp Oil')).toBeInTheDocument();
    expect(screen.getByText('1 medium Onion')).toBeInTheDocument();
  });

  it('shows equipment and tips for instructions', () => {
    render(
      <CookingStepper instructions={cookingInstructions} currentStep={1} />
    );

    expect(screen.getByText('Equipment needed:')).toBeInTheDocument();
    expect(screen.getByText('Spatula')).toBeInTheDocument();
    expect(screen.getByText('Tip:')).toBeInTheDocument();
    expect(
      screen.getByText('Stir frequently to prevent burning')
    ).toBeInTheDocument();
  });
});

describe('CookingTimer Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders timer with formatted time', () => {
    render(<CookingTimer duration={125} label="Cook pasta" />);

    expect(screen.getByText('2:05')).toBeInTheDocument();
    expect(screen.getByText('Cook pasta')).toBeInTheDocument();
  });

  it('starts timer when play button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockOnStart = jest.fn();

    render(
      <CookingTimer duration={60} label="Test timer" onStart={mockOnStart} />
    );

    // Find the play button - it's the first button with play SVG
    const buttons = screen.getAllByRole('button');
    const playButton = buttons.find(button =>
      button.querySelector('svg.lucide-play')
    );
    expect(playButton).toBeInTheDocument();
    await user.click(playButton!);
    expect(mockOnStart).toHaveBeenCalled();
  });

  it('counts down when running', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<CookingTimer duration={60} label="Test timer" />);

    // Start timer
    // Find the play button - it's the first button with play SVG
    const buttons = screen.getAllByRole('button');
    const playButton = buttons.find(button =>
      button.querySelector('svg.lucide-play')
    );
    expect(playButton).toBeInTheDocument();
    await user.click(playButton!);

    // Advance time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('0:55')).toBeInTheDocument();
  });

  it('calls onComplete when timer reaches zero', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockOnComplete = jest.fn();

    render(
      <CookingTimer
        duration={2}
        label="Short timer"
        onComplete={mockOnComplete}
      />
    );

    // Start timer
    // Find the play button - it's the first button with play SVG
    const buttons = screen.getAllByRole('button');
    const playButton = buttons.find(button =>
      button.querySelector('svg.lucide-play')
    );
    expect(playButton).toBeInTheDocument();
    await user.click(playButton!);

    // Advance time to completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('pauses and resumes timer correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockOnPause = jest.fn();

    render(
      <CookingTimer duration={60} label="Test timer" onPause={mockOnPause} />
    );

    // Start timer
    // Find the play button - it's the first button with play SVG
    const buttons = screen.getAllByRole('button');
    const playButton = buttons.find(button =>
      button.querySelector('svg.lucide-play')
    );
    expect(playButton).toBeInTheDocument();
    await user.click(playButton!);

    // Advance time
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Pause timer - find the pause button that appeared after timer started
    const updatedButtons = screen.getAllByRole('button');
    const pauseButton = updatedButtons.find(button =>
      button.querySelector('svg.lucide-pause')
    );
    expect(pauseButton).toBeInTheDocument();
    await user.click(pauseButton!);
    expect(mockOnPause).toHaveBeenCalled();

    // Time should remain at 55 seconds after pause
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText('0:55')).toBeInTheDocument();
  });

  it('resets timer when reset button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockOnReset = jest.fn();

    render(
      <CookingTimer duration={60} label="Test timer" onReset={mockOnReset} />
    );

    // Start timer and advance time
    // Find the play button - it's the first button with play SVG
    const buttons = screen.getAllByRole('button');
    const playButton = buttons.find(button =>
      button.querySelector('svg.lucide-play')
    );
    expect(playButton).toBeInTheDocument();
    await user.click(playButton!);
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Reset timer
    const resetButton = buttons.find(button =>
      button.querySelector('svg.lucide-rotate-ccw')
    );
    expect(resetButton).toBeInTheDocument();
    await user.click(resetButton!);
    expect(mockOnReset).toHaveBeenCalled();
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('formats time correctly for hours', () => {
    render(<CookingTimer duration={3661} label="Long timer" />);
    expect(screen.getByText('1:01:01')).toBeInTheDocument();
  });
});
