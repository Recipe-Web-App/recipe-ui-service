import { render, screen } from '@testing-library/react';
import { BuildInfo } from '@/components/layout/build-info';

describe('BuildInfo', () => {
  it('shows version by default', () => {
    render(<BuildInfo />);

    const version = screen.getByText(/v0\.1\.0/);
    expect(version).toBeInTheDocument();
  });

  it('shows environment by default', () => {
    render(<BuildInfo />);

    // In test environment, it should show 'test'
    const env = screen.getByText(/test/);
    expect(env).toBeInTheDocument();
  });

  it('does not show branch by default', () => {
    render(<BuildInfo />);

    const branch = screen.queryByText(/main/);
    expect(branch).not.toBeInTheDocument();
  });

  it('hides version when showVersion is false', () => {
    render(<BuildInfo showVersion={false} />);

    const version = screen.queryByText(/v0\.1\.0/);
    expect(version).not.toBeInTheDocument();
  });

  it('hides environment when showEnvironment is false', () => {
    render(<BuildInfo showEnvironment={false} />);

    const env = screen.queryByText(/test/);
    expect(env).not.toBeInTheDocument();
  });

  it('renders nothing when all items are hidden', () => {
    const { container } = render(
      <BuildInfo showVersion={false} showEnvironment={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    render(<BuildInfo className="custom-class" />);

    const buildInfo = screen.getByLabelText(/build information/i);
    expect(buildInfo).toHaveClass('custom-class');
  });

  it('renders compact layout when compact prop is true', () => {
    const { container } = render(<BuildInfo compact />);

    // In compact mode, items are separated by dots
    const separator = container.querySelector('span[aria-hidden="true"]');
    expect(separator).toHaveTextContent('·');

    // Should not have icons in compact mode
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(0);
  });

  it('renders full layout with icons by default', () => {
    const { container } = render(<BuildInfo />);

    // Should have icons in full mode
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('has correct accessibility attributes', () => {
    render(<BuildInfo />);

    const buildInfo = screen.getByLabelText(/build information/i);
    expect(buildInfo).toBeInTheDocument();

    // Icons should be hidden from screen readers
    const icons = buildInfo.querySelectorAll('svg[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('includes screen reader text for labels', () => {
    render(<BuildInfo />);

    // Should have sr-only labels
    const versionLabel = screen.getByText(/Version:/);
    expect(versionLabel).toHaveClass('sr-only');

    const envLabel = screen.getByText(/Environment:/);
    expect(envLabel).toHaveClass('sr-only');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<BuildInfo ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('has correct title attributes for tooltips', () => {
    render(<BuildInfo />);

    const buildInfo = screen.getByLabelText(/build information/i);
    const items = buildInfo.querySelectorAll('[title]');

    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveAttribute(
      'title',
      expect.stringContaining('Version:')
    );
  });

  it('shows version and environment in correct order', () => {
    render(<BuildInfo />);

    const buildInfo = screen.getByLabelText(/build information/i);
    const items = buildInfo.querySelectorAll('.flex.items-center.gap-1');

    // Should have at least version and environment
    expect(items.length).toBeGreaterThanOrEqual(2);

    // First item should be version
    expect(items[0]).toHaveAttribute(
      'title',
      expect.stringContaining('Version:')
    );

    // Second item should be environment
    expect(items[1]).toHaveAttribute(
      'title',
      expect.stringContaining('Environment:')
    );
  });

  it('applies correct styling classes', () => {
    render(<BuildInfo />);

    const buildInfo = screen.getByLabelText(/build information/i);
    expect(buildInfo).toHaveClass('text-xs');
    expect(buildInfo).toHaveClass('text-muted-foreground');
    expect(buildInfo).toHaveClass('flex');
    expect(buildInfo).toHaveClass('items-center');
  });
});
