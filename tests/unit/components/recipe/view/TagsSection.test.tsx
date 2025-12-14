import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { TagsSection } from '@/components/recipe/view/TagsSection';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('TagsSection', () => {
  const mockTags = [
    { tagId: 1, name: 'dinner' },
    { tagId: 2, name: 'vegetarian' },
    { tagId: 3, name: 'quick-meals' },
  ];

  describe('Rendering', () => {
    it('should render section with tags', () => {
      render(<TagsSection tags={mockTags} />);

      expect(screen.getByTestId('tags-section')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('should render all tags', () => {
      render(<TagsSection tags={mockTags} />);

      expect(screen.getByTestId('tag-1')).toBeInTheDocument();
      expect(screen.getByTestId('tag-2')).toBeInTheDocument();
      expect(screen.getByTestId('tag-3')).toBeInTheDocument();
    });

    it('should display tag names', () => {
      render(<TagsSection tags={mockTags} />);

      expect(screen.getByText('dinner')).toBeInTheDocument();
      expect(screen.getByText('vegetarian')).toBeInTheDocument();
      expect(screen.getByText('quick-meals')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<TagsSection tags={mockTags} className="custom-class" />);

      expect(screen.getByTestId('tags-section')).toHaveClass('custom-class');
    });

    it('should forward ref to container', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<TagsSection tags={mockTags} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Empty State', () => {
    it('should render null when tags array is empty', () => {
      const { container } = render(<TagsSection tags={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('should not show heading when no tags', () => {
      render(<TagsSection tags={[]} />);

      expect(screen.queryByText('Tags')).not.toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('should have correct href for each tag', () => {
      render(<TagsSection tags={mockTags} />);

      expect(screen.getByTestId('tag-1')).toHaveAttribute(
        'href',
        '/recipes?tag=dinner'
      );
      expect(screen.getByTestId('tag-2')).toHaveAttribute(
        'href',
        '/recipes?tag=vegetarian'
      );
      expect(screen.getByTestId('tag-3')).toHaveAttribute(
        'href',
        '/recipes?tag=quick-meals'
      );
    });

    it('should encode special characters in tag name', () => {
      const tagsWithSpecialChars = [
        { tagId: 1, name: 'gluten free' },
        { tagId: 2, name: 'high-protein & healthy' },
      ];

      render(<TagsSection tags={tagsWithSpecialChars} />);

      expect(screen.getByTestId('tag-1')).toHaveAttribute(
        'href',
        '/recipes?tag=gluten%20free'
      );
      expect(screen.getByTestId('tag-2')).toHaveAttribute(
        'href',
        '/recipes?tag=high-protein%20%26%20healthy'
      );
    });
  });

  describe('Styling', () => {
    it('should have flex-wrap container for tags', () => {
      render(<TagsSection tags={mockTags} />);

      expect(screen.getByTestId('tags-container')).toHaveClass(
        'flex',
        'flex-wrap',
        'gap-2'
      );
    });

    it('should have pill/chip styling on tags', () => {
      render(<TagsSection tags={mockTags} />);

      const tag = screen.getByTestId('tag-1');
      expect(tag).toHaveClass(
        'bg-muted',
        'rounded-full',
        'px-3',
        'py-1',
        'text-sm'
      );
    });

    it('should have hover transition on tags', () => {
      render(<TagsSection tags={mockTags} />);

      const tag = screen.getByTestId('tag-1');
      expect(tag).toHaveClass('transition-colors');
    });

    it('should have heading styling', () => {
      render(<TagsSection tags={mockTags} />);

      const heading = screen.getByText('Tags');
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single tag', () => {
      render(<TagsSection tags={[{ tagId: 1, name: 'solo' }]} />);

      expect(screen.getByTestId('tag-1')).toBeInTheDocument();
      expect(screen.getByText('solo')).toBeInTheDocument();
    });

    it('should handle many tags', () => {
      const manyTags = Array.from({ length: 20 }, (_, i) => ({
        tagId: i + 1,
        name: `tag-${i + 1}`,
      }));

      render(<TagsSection tags={manyTags} />);

      expect(screen.getByTestId('tag-1')).toBeInTheDocument();
      expect(screen.getByTestId('tag-20')).toBeInTheDocument();
    });

    it('should handle long tag names', () => {
      const longTag = {
        tagId: 1,
        name: 'super-long-tag-name-that-might-wrap',
      };

      render(<TagsSection tags={[longTag]} />);

      expect(
        screen.getByText('super-long-tag-name-that-might-wrap')
      ).toBeInTheDocument();
    });
  });
});
