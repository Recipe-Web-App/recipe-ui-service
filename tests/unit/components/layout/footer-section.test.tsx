import { render, screen } from '@testing-library/react';
import { FooterSection } from '@/components/layout/footer-section';

describe('FooterSection', () => {
  it('renders children correctly', () => {
    render(
      <FooterSection>
        <span data-testid="child-1">Link 1</span>
        <span data-testid="child-2">Link 2</span>
      </FooterSection>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <FooterSection title="Resources">
        <span>Link</span>
      </FooterSection>
    );

    const heading = screen.getByRole('heading', { name: /resources/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-sm', 'font-semibold', 'uppercase');
  });

  it('does not render title when not provided', () => {
    render(
      <FooterSection>
        <span>Link</span>
      </FooterSection>
    );

    const heading = screen.queryByRole('heading');
    expect(heading).not.toBeInTheDocument();
  });

  it('applies correct accessibility attributes with title', () => {
    render(
      <FooterSection title="Legal">
        <span>Privacy Policy</span>
      </FooterSection>
    );

    const nav = screen.getByRole('navigation', { name: /legal links/i });
    expect(nav).toBeInTheDocument();
  });

  it('applies correct accessibility attributes without title', () => {
    render(
      <FooterSection>
        <span>Link</span>
      </FooterSection>
    );

    const nav = screen.getByRole('navigation', { name: /footer links/i });
    expect(nav).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FooterSection className="custom-class">
        <span>Link</span>
      </FooterSection>
    );

    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass('custom-class', 'space-y-3');
  });

  it('has correct spacing classes', () => {
    const { container } = render(
      <FooterSection title="Test">
        <span>Link</span>
      </FooterSection>
    );

    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass('space-y-3');

    // Check nav has spacing
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex', 'flex-col', 'space-y-2');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(
      <FooterSection ref={ref}>
        <span>Link</span>
      </FooterSection>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('renders multiple children in correct structure', () => {
    render(
      <FooterSection title="Products">
        <a href="/product1">Product 1</a>
        <a href="/product2">Product 2</a>
        <a href="/product3">Product 3</a>
      </FooterSection>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    // Verify they're wrapped in nav element
    const nav = screen.getByRole('navigation');
    expect(nav).toContainElement(links[0]);
    expect(nav).toContainElement(links[1]);
    expect(nav).toContainElement(links[2]);
  });

  it('has correct text styling for title', () => {
    render(
      <FooterSection title="Company">
        <span>About</span>
      </FooterSection>
    );

    const heading = screen.getByRole('heading', { name: /company/i });
    expect(heading).toHaveClass('tracking-wider');
  });
});
