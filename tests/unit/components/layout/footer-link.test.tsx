import { render, screen } from '@testing-library/react';
import { FooterLink } from '@/components/layout/footer-link';

describe('FooterLink', () => {
  it('renders internal link correctly', () => {
    render(<FooterLink href="/about">About Us</FooterLink>);

    const link = screen.getByRole('link', { name: /about us/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');

    // Should not have external icon
    const svg = link.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('renders external link with icon', () => {
    render(
      <FooterLink href="https://github.com/example" external>
        GitHub
      </FooterLink>
    );

    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/example');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    // Should have external icon
    const svg = link.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-3', 'w-3');
  });

  it('auto-detects external links by URL', () => {
    render(<FooterLink href="https://example.com">External Site</FooterLink>);

    const link = screen.getByRole('link', { name: /external site/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    // Should have external icon
    const svg = link.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <FooterLink href="/test" className="custom-class">
        Test Link
      </FooterLink>
    );

    const link = screen.getByRole('link', { name: /test link/i });
    expect(link).toHaveClass('custom-class');
  });

  it('applies aria-label for accessibility', () => {
    render(
      <FooterLink href="/privacy" aria-label="Read our privacy policy">
        Privacy
      </FooterLink>
    );

    const link = screen.getByRole('link', {
      name: /read our privacy policy/i,
    });
    expect(link).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<FooterLink href="/test">Test</FooterLink>);

    const link = screen.getByRole('link', { name: /test/i });
    expect(link).toHaveClass('text-sm');
    expect(link).toHaveClass('text-muted-foreground');
    expect(link).toHaveClass('transition-colors');
    expect(link).toHaveClass('hover:text-foreground');
    expect(link).toHaveClass('focus:text-foreground');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(
      <FooterLink href="/test" ref={ref}>
        Test
      </FooterLink>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('renders children correctly', () => {
    render(
      <FooterLink href="/test">
        <span data-testid="custom-content">Custom Content</span>
      </FooterLink>
    );

    const customContent = screen.getByTestId('custom-content');
    expect(customContent).toBeInTheDocument();
    expect(customContent).toHaveTextContent('Custom Content');
  });

  it('applies focus styles for keyboard navigation', () => {
    render(<FooterLink href="/test">Test Link</FooterLink>);

    const link = screen.getByRole('link', { name: /test link/i });
    expect(link).toHaveClass('focus:outline-none');
    expect(link).toHaveClass('focus:ring-2');
    expect(link).toHaveClass('focus:ring-ring');
    expect(link).toHaveClass('focus:ring-offset-2');
  });

  it('handles http links as external', () => {
    render(<FooterLink href="http://example.com">HTTP Link</FooterLink>);

    const link = screen.getByRole('link', { name: /http link/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
