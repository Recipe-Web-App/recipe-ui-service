import React from 'react';
import { render, screen } from '@testing-library/react';
import { CollectionPreview } from '@/components/collection/create/CollectionPreview';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import type { CollectionRecipeFormData } from '@/types/collection/create-collection-form';

describe('CollectionPreview', () => {
  const createRecipe = (
    id: number,
    title: string,
    imageUrl?: string
  ): CollectionRecipeFormData => ({
    id: `recipe-${id}`,
    recipeId: id,
    recipeTitle: title,
    recipeDescription: `Description for ${title}`,
    recipeImageUrl: imageUrl,
    displayOrder: id - 1,
  });

  const defaultProps = {
    name: 'Test Collection',
    description: 'A test collection description',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipes: [] as CollectionRecipeFormData[],
  };

  describe('Rendering', () => {
    it('should render with required props', () => {
      render(<CollectionPreview {...defaultProps} />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
      expect(screen.getByText('Test Collection')).toBeInTheDocument();
      expect(
        screen.getByText('A test collection description')
      ).toBeInTheDocument();
    });

    it('should render "Untitled Collection" when name is empty', () => {
      render(<CollectionPreview {...defaultProps} name="" />);

      expect(screen.getByText('Untitled Collection')).toBeInTheDocument();
    });

    it('should render recipe count', () => {
      const recipes = [
        createRecipe(1, 'Recipe 1'),
        createRecipe(2, 'Recipe 2'),
      ];

      render(<CollectionPreview {...defaultProps} recipes={recipes} />);

      expect(screen.getByText('2 recipes')).toBeInTheDocument();
    });

    it('should render collaborator count when provided', () => {
      render(<CollectionPreview {...defaultProps} collaboratorCount={3} />);

      expect(screen.getByText('3 collaborators')).toBeInTheDocument();
    });

    it('should not render collaborator count when zero', () => {
      render(<CollectionPreview {...defaultProps} collaboratorCount={0} />);

      expect(screen.queryByText(/collaborators/)).not.toBeInTheDocument();
    });
  });

  describe('Visibility Badge', () => {
    it('should render Private badge for PRIVATE visibility', () => {
      render(
        <CollectionPreview
          {...defaultProps}
          visibility={CollectionVisibility.PRIVATE}
        />
      );

      expect(screen.getByText('Private')).toBeInTheDocument();
    });

    it('should render Public badge for PUBLIC visibility', () => {
      render(
        <CollectionPreview
          {...defaultProps}
          visibility={CollectionVisibility.PUBLIC}
        />
      );

      expect(screen.getByText('Public')).toBeInTheDocument();
    });

    it('should render Friends Only badge for FRIENDS_ONLY visibility', () => {
      render(
        <CollectionPreview
          {...defaultProps}
          visibility={CollectionVisibility.FRIENDS_ONLY}
        />
      );

      expect(screen.getByText('Friends Only')).toBeInTheDocument();
    });
  });

  describe('Collaboration Mode Badge', () => {
    it('should render "Owner only" for OWNER_ONLY mode', () => {
      render(
        <CollectionPreview
          {...defaultProps}
          collaborationMode={CollaborationMode.OWNER_ONLY}
        />
      );

      expect(screen.getByText('Owner only')).toBeInTheDocument();
    });

    it('should render "Specific users" for SPECIFIC_USERS mode', () => {
      render(
        <CollectionPreview
          {...defaultProps}
          collaborationMode={CollaborationMode.SPECIFIC_USERS}
        />
      );

      expect(screen.getByText('Specific users')).toBeInTheDocument();
    });

    it('should render "All users can edit" for ALL_USERS mode', () => {
      render(
        <CollectionPreview
          {...defaultProps}
          collaborationMode={CollaborationMode.ALL_USERS}
        />
      );

      expect(screen.getByText('All users can edit')).toBeInTheDocument();
    });
  });

  describe('Recipe Images', () => {
    it('should show "No recipes added yet" when recipes array is empty', () => {
      render(<CollectionPreview {...defaultProps} recipes={[]} />);

      expect(screen.getByText('No recipes added yet')).toBeInTheDocument();
    });

    it('should render recipe images when recipes have image URLs', () => {
      const recipes = [
        createRecipe(1, 'Recipe 1', '/images/recipe1.jpg'),
        createRecipe(2, 'Recipe 2', '/images/recipe2.jpg'),
      ];

      render(<CollectionPreview {...defaultProps} recipes={recipes} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('alt', 'Recipe 1');
      expect(images[1]).toHaveAttribute('alt', 'Recipe 2');
    });

    it('should display up to 4 recipe images', () => {
      const recipes = [
        createRecipe(1, 'Recipe 1', '/images/recipe1.jpg'),
        createRecipe(2, 'Recipe 2', '/images/recipe2.jpg'),
        createRecipe(3, 'Recipe 3', '/images/recipe3.jpg'),
        createRecipe(4, 'Recipe 4', '/images/recipe4.jpg'),
        createRecipe(5, 'Recipe 5', '/images/recipe5.jpg'),
      ];

      render(<CollectionPreview {...defaultProps} recipes={recipes} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
    });

    it('should handle recipes without image URLs', () => {
      const recipes = [
        createRecipe(1, 'Recipe 1'), // no image
        createRecipe(2, 'Recipe 2', '/images/recipe2.jpg'),
      ];

      render(<CollectionPreview {...defaultProps} recipes={recipes} />);

      // Should still render the one with an image
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <CollectionPreview {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined description', () => {
      render(<CollectionPreview {...defaultProps} description={undefined} />);

      expect(screen.getByText('Test Collection')).toBeInTheDocument();
      expect(
        screen.queryByText('A test collection description')
      ).not.toBeInTheDocument();
    });

    it('should handle empty description', () => {
      render(<CollectionPreview {...defaultProps} description="" />);

      expect(screen.getByText('Test Collection')).toBeInTheDocument();
    });

    it('should truncate long collection names', () => {
      const longName =
        'This is a very long collection name that should be truncated';
      render(<CollectionPreview {...defaultProps} name={longName} />);

      // The name should be in the document (truncation is CSS-based)
      expect(screen.getByText(longName)).toBeInTheDocument();
    });
  });
});
