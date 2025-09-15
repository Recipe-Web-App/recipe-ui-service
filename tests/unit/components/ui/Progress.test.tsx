import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Progress,
  CookingStep,
  CookingProgress,
  UploadProgress,
  TimerProgress,
} from '@/components/ui/progress';

// Mock ResizeObserver for JSDOM compatibility
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Progress', () => {
  it('renders correctly with default props', () => {
    render(<Progress value={50} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('displays percentage when showPercentage is true', () => {
    render(<Progress value={75} showPercentage />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays custom label when showLabel is true', () => {
    render(<Progress value={60} label="Uploading files" showLabel />);

    expect(screen.getByText('Uploading files')).toBeInTheDocument();
  });

  it('displays both label and percentage', () => {
    render(<Progress value={40} label="Processing" showLabel showPercentage />);

    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
    const { container } = render(<Progress value={50} size="lg" />);

    const progressContainer = container.querySelector(
      '[role="progressbar"]'
    )?.parentElement;
    expect(progressContainer).toHaveClass('h-4');
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Progress value={50} variant="outlined" />);

    const progressContainer = container.querySelector(
      '[role="progressbar"]'
    )?.parentElement;
    expect(progressContainer).toHaveClass('border', 'border-gray-300');
  });

  it('applies bar variant classes correctly', () => {
    const { container } = render(<Progress value={50} barVariant="success" />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveClass('bg-green-600');
  });

  it('applies animation classes correctly', () => {
    const { container } = render(
      <Progress value={50} barAnimation="shimmer" />
    );

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveClass('bg-gradient-to-r');
  });

  it('handles custom max value', () => {
    render(<Progress value={150} max={200} showPercentage />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuemax', '200');
    expect(screen.getByText('75%')).toBeInTheDocument(); // 150/200 = 75%
  });

  it('clamps progress value between 0 and 100 percent', () => {
    const { rerender } = render(<Progress value={-10} showPercentage />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<Progress value={150} max={100} showPercentage />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(
      <Progress value={50} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CookingStep', () => {
  it('renders step information correctly', () => {
    render(
      <CookingStep
        stepNumber={1}
        title="Prep ingredients"
        description="Wash and chop vegetables"
        duration="10 min"
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Prep ingredients')).toBeInTheDocument();
    expect(screen.getByText('Wash and chop vegetables')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
  });

  it('shows completed state with checkmark', () => {
    const { container } = render(
      <CookingStep stepNumber={1} title="Completed step" isCompleted={true} />
    );

    const checkmark = container.querySelector('svg[viewBox="0 0 20 20"]');
    expect(checkmark).toBeInTheDocument();
  });

  it('shows active state styling', () => {
    const { container } = render(
      <CookingStep stepNumber={2} title="Active step" isActive={true} />
    );

    expect(container.firstChild).toHaveClass('bg-orange-50', 'text-orange-900');
  });

  it('shows skipped state with dash icon', () => {
    const { container } = render(
      <CookingStep stepNumber={3} title="Skipped step" isSkipped={true} />
    );

    const dashIcon = container.querySelector('svg[viewBox="0 0 20 20"]');
    expect(dashIcon).toBeInTheDocument();
  });

  it('handles click events when onStepClick is provided', async () => {
    const onStepClick = jest.fn();
    const user = userEvent.setup();

    render(
      <CookingStep
        stepNumber={1}
        title="Clickable step"
        onStepClick={onStepClick}
      />
    );

    await user.click(screen.getByText('Clickable step'));
    expect(onStepClick).toHaveBeenCalled();
  });

  it('applies size variants correctly', () => {
    const { container } = render(
      <CookingStep stepNumber={1} title="Small step" size="sm" />
    );

    expect(container.firstChild).toHaveClass('p-2', 'gap-2');
  });

  it('displays custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">🔥</span>;

    render(
      <CookingStep stepNumber={1} title="Step with icon" icon={customIcon} />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

describe('CookingProgress', () => {
  const sampleSteps = [
    {
      id: '1',
      title: 'Step 1',
      description: 'First step',
      duration: '5 min',
      isCompleted: true,
    },
    {
      id: '2',
      title: 'Step 2',
      description: 'Second step',
      duration: '10 min',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Step 3',
      description: 'Third step',
      duration: '15 min',
      isCompleted: false,
    },
  ];

  it('renders cooking progress with steps', () => {
    render(<CookingProgress steps={sampleSteps} currentStep={1} />);

    expect(screen.getByText('Cooking Progress')).toBeInTheDocument();
    expect(screen.getByText('1 of 3 steps')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('calculates progress percentage correctly', () => {
    const { container } = render(
      <CookingProgress steps={sampleSteps} currentStep={1} />
    );

    // 1 completed step out of 3 total = 33.33%
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle('width: 33.33333333333333%');
  });

  it('handles step click events', async () => {
    const onStepClick = jest.fn();
    const user = userEvent.setup();

    render(
      <CookingProgress
        steps={sampleSteps}
        currentStep={1}
        onStepClick={onStepClick}
      />
    );

    await user.click(screen.getByText('Step 2'));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it('applies size variants to steps', () => {
    const { container } = render(
      <CookingProgress steps={sampleSteps} currentStep={1} size="lg" />
    );

    const steps = container.querySelectorAll('[class*="p-4"]');
    expect(steps.length).toBeGreaterThan(0);
  });
});

describe('UploadProgress', () => {
  it('renders upload information correctly', () => {
    render(
      <UploadProgress
        fileName="test-file.jpg"
        fileSize="2.5 MB"
        progress={65}
        state="uploading"
        speed="1.2 MB/s"
        timeRemaining="3s"
      />
    );

    expect(screen.getByText('test-file.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('Speed: 1.2 MB/s')).toBeInTheDocument();
    expect(screen.getByText('Time remaining: 3s')).toBeInTheDocument();
  });

  it('shows completed state with checkmark', () => {
    const { container } = render(
      <UploadProgress
        fileName="completed-file.jpg"
        progress={100}
        state="completed"
      />
    );

    const checkmark = container.querySelector('svg[viewBox="0 0 20 20"]');
    expect(checkmark).toBeInTheDocument();
  });

  it('shows error state with X icon', () => {
    const { container } = render(
      <UploadProgress fileName="error-file.jpg" progress={25} state="error" />
    );

    const errorIcon = container.querySelector('svg[viewBox="0 0 20 20"]');
    expect(errorIcon).toBeInTheDocument();
  });

  it('shows paused state with pause icon', () => {
    const { container } = render(
      <UploadProgress fileName="paused-file.jpg" progress={50} state="paused" />
    );

    const pauseIcon = container.querySelector('svg[viewBox="0 0 20 20"]');
    expect(pauseIcon).toBeInTheDocument();
  });

  it('handles pause action', async () => {
    const onPause = jest.fn();
    const user = userEvent.setup();

    render(
      <UploadProgress
        fileName="test-file.jpg"
        progress={50}
        state="uploading"
        onPause={onPause}
      />
    );

    await user.click(screen.getByText('Pause'));
    expect(onPause).toHaveBeenCalled();
  });

  it('handles resume action', async () => {
    const onResume = jest.fn();
    const user = userEvent.setup();

    render(
      <UploadProgress
        fileName="test-file.jpg"
        progress={50}
        state="paused"
        onResume={onResume}
      />
    );

    await user.click(screen.getByText('Resume'));
    expect(onResume).toHaveBeenCalled();
  });

  it('handles retry action', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();

    render(
      <UploadProgress
        fileName="test-file.jpg"
        progress={25}
        state="error"
        onRetry={onRetry}
      />
    );

    await user.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('handles cancel action', async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <UploadProgress
        fileName="test-file.jpg"
        progress={50}
        state="uploading"
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('hides details when showDetails is false', () => {
    render(
      <UploadProgress
        fileName="test-file.jpg"
        progress={50}
        state="uploading"
        speed="1.2 MB/s"
        showDetails={false}
      />
    );

    expect(screen.queryByText('Speed: 1.2 MB/s')).not.toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(
      <UploadProgress
        fileName="test-file.jpg"
        progress={50}
        state="uploading"
        variant="compact"
      />
    );

    expect(container.firstChild).toHaveClass('p-2');
  });
});

describe('TimerProgress', () => {
  it('renders timer information correctly', () => {
    render(
      <TimerProgress
        totalTime={300}
        remainingTime={180}
        label="Cooking Timer"
        isRunning={true}
      />
    );

    expect(screen.getByText('Cooking Timer')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument(); // 180 seconds = 3:00
    expect(screen.getByText('remaining')).toBeInTheDocument();
  });

  it('formats time without minutes when showMinutes is false', () => {
    render(
      <TimerProgress totalTime={300} remainingTime={185} showMinutes={false} />
    );

    expect(screen.getByText('185')).toBeInTheDocument();
  });

  it('shows paused state', () => {
    render(
      <TimerProgress totalTime={300} remainingTime={180} isPaused={true} />
    );

    expect(screen.getByText('paused')).toBeInTheDocument();
  });

  it('shows completed state', () => {
    render(<TimerProgress totalTime={300} remainingTime={0} />);

    expect(screen.getByText('Done!')).toBeInTheDocument();
  });

  it('applies warning state for low time', () => {
    const { container } = render(
      <TimerProgress totalTime={300} remainingTime={25} isRunning={true} />
    );

    expect(container.querySelector('.border-red-500')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
    const { container } = render(
      <TimerProgress totalTime={300} remainingTime={180} size="lg" />
    );

    expect(container.querySelector('.h-32')).toBeInTheDocument();
  });

  it('calls onComplete when timer reaches zero', () => {
    const onComplete = jest.fn();

    render(
      <TimerProgress
        totalTime={300}
        remainingTime={0}
        onComplete={onComplete}
      />
    );

    expect(onComplete).toHaveBeenCalled();
  });

  it('calculates progress percentage correctly', () => {
    const { container } = render(
      <TimerProgress totalTime={300} remainingTime={150} />
    );

    // (300 - 150) / 300 = 50% progress
    const progressCircle = container.querySelector('circle[stroke-dasharray]');
    expect(progressCircle).toHaveAttribute('stroke-dasharray', '144.5 289');
  });
});

describe('Progress Accessibility', () => {
  it('has proper ARIA attributes for progress bar', () => {
    render(<Progress value={75} label="File upload progress" showLabel />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'File upload progress');
  });

  it('supports keyboard interaction for cooking steps', async () => {
    const onStepClick = jest.fn();
    const user = userEvent.setup();

    render(
      <CookingStep
        stepNumber={1}
        title="Interactive step"
        onStepClick={onStepClick}
      />
    );

    const step = screen.getByRole('button');
    await user.tab();
    expect(step).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onStepClick).toHaveBeenCalled();
  });

  it('provides meaningful text for screen readers', () => {
    render(
      <UploadProgress
        fileName="important-document.pdf"
        progress={45}
        state="uploading"
        speed="2.1 MB/s"
        timeRemaining="5s"
      />
    );

    expect(screen.getByText('important-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('Speed: 2.1 MB/s')).toBeInTheDocument();
  });
});
