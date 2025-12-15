import React, { Suspense } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import RecipePage from '@/app/(main)/recipes/[id]/page';

// Mock next/navigation
const mockNotFound = jest.fn();
const mockGet = jest.fn().mockReturnValue(null);
jest.mock('next/navigation', () => ({
  notFound: () => {
    mockNotFound();
    throw new Error('NEXT_NOT_FOUND');
  },
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock the RecipeViewPage component
jest.mock('@/components/recipe/view', () => ({
  RecipeViewPage: ({
    recipeId,
    sourcePage,
  }: {
    recipeId: number;
    sourcePage?: string;
  }) => (
    <div
      data-testid="recipe-view-page"
      data-recipe-id={recipeId}
      data-source-page={sourcePage ?? ''}
    >
      Recipe View Page for {recipeId}
    </div>
  ),
}));

// Create a pre-resolved promise that React's use() can handle synchronously
// This is a workaround for testing React 19's use() hook with promises
const createSyncParams = (id: string): Promise<{ id: string }> => {
  const value = { id };
  const promise = Promise.resolve(value) as Promise<{ id: string }> & {
    status: 'fulfilled';
    value: { id: string };
  };
  // Mark promise as already resolved for React's use() hook
  (promise as { status?: string }).status = 'fulfilled';
  (promise as { value?: { id: string } }).value = value;
  return promise;
};

// Wrapper component with Suspense for testing React.use() with Promises
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div data-testid="loading">Loading...</div>}>
    {children}
  </Suspense>
);

describe('RecipePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders RecipeViewPage with valid numeric ID', () => {
      const params = createSyncParams('123');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      const viewPage = screen.getByTestId('recipe-view-page');
      expect(viewPage).toBeInTheDocument();
      expect(viewPage).toHaveAttribute('data-recipe-id', '123');
    });

    it('renders with container classes', () => {
      const params = createSyncParams('42');

      const { container } = render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      const wrapper = container.querySelector('.container.py-8');
      expect(wrapper).toBeInTheDocument();
    });

    it('passes correct recipeId to RecipeViewPage', () => {
      const params = createSyncParams('999');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      const viewPage = screen.getByTestId('recipe-view-page');
      expect(viewPage).toHaveTextContent('Recipe View Page for 999');
    });
  });

  describe('ID Validation', () => {
    it('calls notFound for non-numeric ID', () => {
      const params = createSyncParams('abc');

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TestWrapper>
            <RecipePage params={params} />
          </TestWrapper>
        )
      ).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('calls notFound for ID of zero', () => {
      const params = createSyncParams('0');

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TestWrapper>
            <RecipePage params={params} />
          </TestWrapper>
        )
      ).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('calls notFound for negative ID', () => {
      const params = createSyncParams('-5');

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TestWrapper>
            <RecipePage params={params} />
          </TestWrapper>
        )
      ).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('calls notFound for empty string ID', () => {
      const params = createSyncParams('');

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TestWrapper>
            <RecipePage params={params} />
          </TestWrapper>
        )
      ).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('does not call notFound for float string ID (parseInt handles it)', () => {
      const params = createSyncParams('1.5');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      // parseInt('1.5', 10) returns 1, which is valid
      expect(screen.getByTestId('recipe-view-page')).toBeInTheDocument();
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it('calls notFound for ID with leading text', () => {
      const params = createSyncParams('abc123');

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TestWrapper>
            <RecipePage params={params} />
          </TestWrapper>
        )
      ).toThrow('NEXT_NOT_FOUND');

      expect(mockNotFound).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('handles ID with trailing text by parsing number prefix', () => {
      const params = createSyncParams('123abc');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      // parseInt('123abc', 10) returns 123, which is valid
      const viewPage = screen.getByTestId('recipe-view-page');
      expect(viewPage).toHaveAttribute('data-recipe-id', '123');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large ID', () => {
      const params = createSyncParams('9999999999');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      const viewPage = screen.getByTestId('recipe-view-page');
      expect(viewPage).toHaveAttribute('data-recipe-id', '9999999999');
    });

    it('handles ID = 1 (minimum valid)', () => {
      const params = createSyncParams('1');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      const viewPage = screen.getByTestId('recipe-view-page');
      expect(viewPage).toHaveAttribute('data-recipe-id', '1');
    });

    it('handles ID with whitespace (parseInt trims)', () => {
      const params = createSyncParams(' 123 ');

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      // parseInt(' 123 ', 10) returns 123, which is valid
      const viewPage = screen.getByTestId('recipe-view-page');
      expect(viewPage).toHaveAttribute('data-recipe-id', '123');
    });

    it('shows loading state for pending promise', () => {
      // Create an unresolved promise (without fulfilled status)
      const params = new Promise<{ id: string }>(() => {});

      render(
        <TestWrapper>
          <RecipePage params={params} />
        </TestWrapper>
      );

      // Should show loading (Suspense fallback) for unresolved promise
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('recipe-view-page')).not.toBeInTheDocument();
    });
  });
});
