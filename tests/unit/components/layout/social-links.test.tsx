import { render, screen } from '@testing-library/react';
import { SocialLinks, type SocialLink } from '@/components/layout/social-links';

describe('SocialLinks', () => {
  it('renders default links when no links provided', () => {
    render(<SocialLinks />);

    const github = screen.getByRole('link', { name: /visit us on github/i });
    const twitter = screen.getByRole('link', { name: /visit us on twitter/i });

    expect(github).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
  });

  it('renders custom links when provided', () => {
    const customLinks: SocialLink[] = [
      {
        platform: 'youtube',
        href: 'https://youtube.com/channel',
        label: 'YouTube',
      },
      {
        platform: 'linkedin',
        href: 'https://linkedin.com/company',
        label: 'LinkedIn',
      },
    ];

    render(<SocialLinks links={customLinks} />);

    const youtube = screen.getByRole('link', { name: /visit us on youtube/i });
    const linkedin = screen.getByRole('link', {
      name: /visit us on linkedin/i,
    });

    expect(youtube).toBeInTheDocument();
    expect(linkedin).toBeInTheDocument();

    // Should not render default links
    const github = screen.queryByRole('link', { name: /visit us on github/i });
    expect(github).not.toBeInTheDocument();
  });

  it('sets correct href and target attributes', () => {
    const links: SocialLink[] = [
      { platform: 'github', href: 'https://github.com/myorg' },
    ];

    render(<SocialLinks links={links} />);

    const link = screen.getByRole('link', { name: /visit us on github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/myorg');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders correct icon for each platform', () => {
    const links: SocialLink[] = [
      { platform: 'github', href: '#' },
      { platform: 'twitter', href: '#' },
      { platform: 'youtube', href: '#' },
      { platform: 'linkedin', href: '#' },
      { platform: 'facebook', href: '#' },
    ];

    const { container } = render(<SocialLinks links={links} />);

    // Check that 5 icons are rendered
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(5);
  });

  it('applies custom className', () => {
    render(<SocialLinks className="custom-class" />);

    const nav = screen.getByRole('navigation', { name: /social media links/i });
    expect(nav).toHaveClass('custom-class');
  });

  it('applies correct size classes based on iconSize prop', () => {
    const { rerender, container } = render(<SocialLinks iconSize="sm" />);

    let icons = container.querySelectorAll('svg');
    icons.forEach(icon => {
      expect(icon).toHaveClass('h-4', 'w-4');
    });

    rerender(<SocialLinks iconSize="md" />);
    icons = container.querySelectorAll('svg');
    icons.forEach(icon => {
      expect(icon).toHaveClass('h-5', 'w-5');
    });

    rerender(<SocialLinks iconSize="lg" />);
    icons = container.querySelectorAll('svg');
    icons.forEach(icon => {
      expect(icon).toHaveClass('h-6', 'w-6');
    });
  });

  it('uses custom label when provided', () => {
    const links: SocialLink[] = [
      { platform: 'github', href: '#', label: 'Our GitHub Repository' },
    ];

    render(<SocialLinks links={links} />);

    const link = screen.getByRole('link', {
      name: /visit us on our github repository/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('title', 'Our GitHub Repository');
  });

  it('uses platform name as default label', () => {
    const links: SocialLink[] = [{ platform: 'github', href: '#' }];

    render(<SocialLinks links={links} />);

    const link = screen.getByRole('link', { name: /visit us on github/i });
    expect(link).toHaveAttribute('title', 'github');
  });

  it('has correct accessibility attributes', () => {
    render(<SocialLinks />);

    const nav = screen.getByRole('navigation', { name: /social media links/i });
    expect(nav).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      // Should have aria-label
      expect(link).toHaveAttribute('aria-label');
      // Icons within should be hidden from screen readers
      const icon = link.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('applies hover styles', () => {
    render(<SocialLinks />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-foreground');
      expect(link).toHaveClass('transition-colors');
    });
  });

  it('applies focus styles for keyboard navigation', () => {
    render(<SocialLinks />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
      expect(link).toHaveClass('focus:ring-ring');
    });
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<SocialLinks ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('renders empty when links array is empty', () => {
    render(<SocialLinks links={[]} />);

    const nav = screen.getByRole('navigation', { name: /social media links/i });
    expect(nav).toBeInTheDocument();
    expect(nav.children).toHaveLength(0);
  });

  it('applies transition transform to icons', () => {
    const { container } = render(<SocialLinks />);

    const icons = container.querySelectorAll('svg');
    icons.forEach(icon => {
      expect(icon).toHaveClass('transition-transform');
      expect(icon).toHaveClass('hover:scale-110');
    });
  });
});
