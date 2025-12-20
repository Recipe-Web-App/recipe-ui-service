import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CollectionDraftBanner } from '@/components/collection/CollectionDraftBanner';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

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

// Mock the collection store
const mockClearDraftCollection = jest.fn();
const mockHasUnsavedDraft = jest.fn().mockReturnValue(true);

const mockStoreState = {
  hasUnsavedDraft: mockHasUnsavedDraft,
  draftCollection: {
    name: 'My Draft Collection',
    description: '',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    tags: [],
    recipes: [],
    collaborators: [],
  } as {
    name?: string;
    description: string;
    visibility: CollectionVisibility;
    collaborationMode: CollaborationMode;
    tags: string[];
    recipes: unknown[];
    collaborators: unknown[];
  } | null,
  draftLastModified: new Date('2024-01-15T10:30:00') as Date | null,
  clearDraftCollection: mockClearDraftCollection,
};

jest.mock('@/stores/collection-store', () => ({
  useCollectionStore: () => mockStoreState,
}));

describe('CollectionDraftBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasUnsavedDraft.mockReturnValue(true);
    mockStoreState.draftCollection = {
      name: 'My Draft Collection',
      description: '',
      visibility: CollectionVisibility.PRIVATE,
      collaborationMode: CollaborationMode.OWNER_ONLY,
      tags: [],
      recipes: [],
      collaborators: [],
    };
    mockStoreState.draftLastModified = new Date('2024-01-15T10:30:00');
  });

  describe('Rendering', () => {
    it('renders when draft exists', () => {
      render(<CollectionDraftBanner />);

      expect(screen.getByTestId('collection-draft-banner')).toBeInTheDocument();
      expect(
        screen.getByText('You have an unsaved draft collection')
      ).toBeInTheDocument();
    });

    it('does not render when no draft exists', () => {
      mockHasUnsavedDraft.mockReturnValue(false);

      const { container } = render(<CollectionDraftBanner />);

      expect(container).toBeEmptyDOMElement();
    });

    it('displays draft name when available', () => {
      render(<CollectionDraftBanner />);

      expect(screen.getByText(/My Draft Collection/)).toBeInTheDocument();
    });

    it('displays last modified date when available', () => {
      render(<CollectionDraftBanner />);

      // The date format is locale-dependent, so check for parts of the date
      expect(screen.getByText(/Last edited/)).toBeInTheDocument();
    });

    it('renders without draft name when not provided', () => {
      mockStoreState.draftCollection = {
        name: '',
        description: '',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
        recipes: [],
        collaborators: [],
      };

      render(<CollectionDraftBanner />);

      expect(
        screen.getByText('You have an unsaved draft collection')
      ).toBeInTheDocument();
      expect(screen.queryByText(/"/)).not.toBeInTheDocument();
    });

    it('renders without last modified date when not provided', () => {
      mockStoreState.draftLastModified = null;

      render(<CollectionDraftBanner />);

      expect(screen.queryByText(/Last edited/)).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CollectionDraftBanner className="custom-class" />);

      const banner = screen.getByTestId('collection-draft-banner');
      expect(banner).toHaveClass('custom-class');
    });
  });

  describe('Actions', () => {
    it('renders Continue Editing button with correct link', () => {
      render(<CollectionDraftBanner />);

      const continueButton = screen.getByTestId(
        'collection-draft-banner-continue'
      );
      expect(continueButton).toBeInTheDocument();
      expect(continueButton).toHaveAttribute('href', '/collections/create');
      expect(continueButton).toHaveTextContent('Continue Editing');
    });

    it('renders Discard button', () => {
      render(<CollectionDraftBanner />);

      const discardButton = screen.getByTestId(
        'collection-draft-banner-discard'
      );
      expect(discardButton).toBeInTheDocument();
      expect(discardButton).toHaveTextContent('Discard');
    });

    it('calls clearDraftCollection and onDiscard when Discard button is clicked', async () => {
      const user = userEvent.setup();
      const onDiscard = jest.fn();

      render(<CollectionDraftBanner onDiscard={onDiscard} />);

      const discardButton = screen.getByTestId(
        'collection-draft-banner-discard'
      );
      await user.click(discardButton);

      expect(mockClearDraftCollection).toHaveBeenCalledTimes(1);
      expect(onDiscard).toHaveBeenCalledTimes(1);
    });

    it('calls onContinue when Continue Editing button is clicked', async () => {
      const user = userEvent.setup();
      const onContinue = jest.fn();

      render(<CollectionDraftBanner onContinue={onContinue} />);

      const continueButton = screen.getByTestId(
        'collection-draft-banner-continue'
      );
      await user.click(continueButton);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it('works without onDiscard callback', async () => {
      const user = userEvent.setup();

      render(<CollectionDraftBanner />);

      const discardButton = screen.getByTestId(
        'collection-draft-banner-discard'
      );
      await user.click(discardButton);

      expect(mockClearDraftCollection).toHaveBeenCalledTimes(1);
    });

    it('works without onContinue callback', async () => {
      const user = userEvent.setup();

      render(<CollectionDraftBanner />);

      const continueButton = screen.getByTestId(
        'collection-draft-banner-continue'
      );
      // Should not throw
      await user.click(continueButton);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<CollectionDraftBanner />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible icons with aria-hidden', () => {
      render(<CollectionDraftBanner />);

      // Icons should be decorative (aria-hidden)
      const icons = screen
        .getByTestId('collection-draft-banner')
        .querySelectorAll('svg');
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('has descriptive button text', () => {
      render(<CollectionDraftBanner />);

      expect(
        screen.getByRole('button', { name: /discard/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /continue editing/i })
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty draftCollection object', () => {
      mockStoreState.draftCollection = {
        name: '',
        description: '',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
        recipes: [],
        collaborators: [],
      };
      mockStoreState.draftLastModified = null;

      render(<CollectionDraftBanner />);

      expect(
        screen.getByText('You have an unsaved draft collection')
      ).toBeInTheDocument();
    });

    it('handles null draftCollection', () => {
      mockStoreState.draftCollection = null;
      mockStoreState.draftLastModified = new Date();

      render(<CollectionDraftBanner />);

      expect(
        screen.getByText('You have an unsaved draft collection')
      ).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<CollectionDraftBanner ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute(
        'data-testid',
        'collection-draft-banner'
      );
    });
  });
});
