import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DraftBanner } from '@/components/recipe/DraftBanner';

expect.extend(toHaveNoViolations);

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

// Mock the recipe store
const mockClearDraftRecipe = jest.fn();
const mockHasUnsavedDraft = jest.fn().mockReturnValue(true);

const mockStoreState = {
  hasUnsavedDraft: mockHasUnsavedDraft,
  draftRecipe: { title: 'My Draft Recipe' } as { title?: string } | null,
  draftLastModified: new Date('2024-01-15T10:30:00') as Date | null,
  clearDraftRecipe: mockClearDraftRecipe,
};

jest.mock('@/stores/recipe-store', () => ({
  useRecipeStore: () => mockStoreState,
}));

describe('DraftBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasUnsavedDraft.mockReturnValue(true);
    mockStoreState.draftRecipe = { title: 'My Draft Recipe' };
    mockStoreState.draftLastModified = new Date('2024-01-15T10:30:00');
  });

  describe('Rendering', () => {
    it('renders when draft exists', () => {
      render(<DraftBanner />);

      expect(screen.getByTestId('draft-banner')).toBeInTheDocument();
      expect(
        screen.getByText('You have an unsaved draft recipe')
      ).toBeInTheDocument();
    });

    it('does not render when no draft exists', () => {
      mockHasUnsavedDraft.mockReturnValue(false);

      const { container } = render(<DraftBanner />);

      expect(container).toBeEmptyDOMElement();
    });

    it('displays draft title when available', () => {
      render(<DraftBanner />);

      expect(screen.getByText(/My Draft Recipe/)).toBeInTheDocument();
    });

    it('displays last modified date when available', () => {
      render(<DraftBanner />);

      // The date format is locale-dependent, so check for parts of the date
      expect(screen.getByText(/Last edited/)).toBeInTheDocument();
    });

    it('renders without draft title when not provided', () => {
      mockStoreState.draftRecipe = {};

      render(<DraftBanner />);

      expect(
        screen.getByText('You have an unsaved draft recipe')
      ).toBeInTheDocument();
      expect(screen.queryByText(/"/)).not.toBeInTheDocument();
    });

    it('renders without last modified date when not provided', () => {
      mockStoreState.draftLastModified = null;

      render(<DraftBanner />);

      expect(screen.queryByText(/Last edited/)).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<DraftBanner className="custom-class" />);

      const banner = screen.getByTestId('draft-banner');
      expect(banner).toHaveClass('custom-class');
    });
  });

  describe('Actions', () => {
    it('renders Continue Editing button with correct link', () => {
      render(<DraftBanner />);

      const continueButton = screen.getByTestId('draft-banner-continue');
      expect(continueButton).toBeInTheDocument();
      expect(continueButton).toHaveAttribute('href', '/recipes/create');
      expect(continueButton).toHaveTextContent('Continue Editing');
    });

    it('renders Discard button', () => {
      render(<DraftBanner />);

      const discardButton = screen.getByTestId('draft-banner-discard');
      expect(discardButton).toBeInTheDocument();
      expect(discardButton).toHaveTextContent('Discard');
    });

    it('calls clearDraftRecipe and onDiscard when Discard button is clicked', async () => {
      const user = userEvent.setup();
      const onDiscard = jest.fn();

      render(<DraftBanner onDiscard={onDiscard} />);

      const discardButton = screen.getByTestId('draft-banner-discard');
      await user.click(discardButton);

      expect(mockClearDraftRecipe).toHaveBeenCalledTimes(1);
      expect(onDiscard).toHaveBeenCalledTimes(1);
    });

    it('calls onContinue when Continue Editing button is clicked', async () => {
      const user = userEvent.setup();
      const onContinue = jest.fn();

      render(<DraftBanner onContinue={onContinue} />);

      const continueButton = screen.getByTestId('draft-banner-continue');
      await user.click(continueButton);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it('works without onDiscard callback', async () => {
      const user = userEvent.setup();

      render(<DraftBanner />);

      const discardButton = screen.getByTestId('draft-banner-discard');
      await user.click(discardButton);

      expect(mockClearDraftRecipe).toHaveBeenCalledTimes(1);
    });

    it('works without onContinue callback', async () => {
      const user = userEvent.setup();

      render(<DraftBanner />);

      const continueButton = screen.getByTestId('draft-banner-continue');
      // Should not throw
      await user.click(continueButton);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<DraftBanner />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible icons with aria-hidden', () => {
      render(<DraftBanner />);

      // Icons should be decorative (aria-hidden)
      const icons = screen.getByTestId('draft-banner').querySelectorAll('svg');
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('has descriptive button text', () => {
      render(<DraftBanner />);

      expect(
        screen.getByRole('button', { name: /discard/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /continue editing/i })
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty draftRecipe object', () => {
      mockStoreState.draftRecipe = {};
      mockStoreState.draftLastModified = null;

      render(<DraftBanner />);

      expect(
        screen.getByText('You have an unsaved draft recipe')
      ).toBeInTheDocument();
    });

    it('handles null draftRecipe', () => {
      mockStoreState.draftRecipe = null;
      mockStoreState.draftLastModified = new Date();

      render(<DraftBanner />);

      expect(
        screen.getByText('You have an unsaved draft recipe')
      ).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<DraftBanner ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-testid', 'draft-banner');
    });
  });
});
