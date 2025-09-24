import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Rating } from '@/components/ui/rating';

expect.extend(toHaveNoViolations);

describe('Rating Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Rating data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
      expect(rating).toHaveAttribute('role', 'group');
    });

    it('renders correct number of star items', () => {
      render(<Rating maxValue={5} data-testid="rating" />);

      const stars = screen.getAllByRole('img');
      expect(stars).toHaveLength(5);
    });

    it('renders correct number of numeric items', () => {
      render(<Rating type="numeric" maxValue={10} data-testid="rating" />);

      const numbers = screen.getByText('1');
      expect(numbers).toBeInTheDocument();
      // Check for all numbers 1-10
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('renders thumbs with only 2 items', () => {
      render(<Rating type="thumbs" data-testid="rating" />);

      const thumbsUp = screen.getByLabelText('Thumbs up');
      const thumbsDown = screen.getByLabelText('Thumbs down');

      expect(thumbsUp).toBeInTheDocument();
      expect(thumbsDown).toBeInTheDocument();
    });

    it('renders with custom max value', () => {
      render(<Rating maxValue={3} data-testid="rating" />);

      const stars = screen.getAllByRole('img');
      expect(stars).toHaveLength(3);
    });
  });

  describe('Visual States', () => {
    it('displays filled stars based on value', () => {
      render(<Rating value={3} maxValue={5} showValue data-testid="rating" />);

      expect(screen.getByText('3 out of 5')).toBeInTheDocument();
    });

    it('displays correct thumbs state for positive value', () => {
      render(<Rating type="thumbs" value={1} showValue data-testid="rating" />);

      expect(screen.getByText('Thumbs Up')).toBeInTheDocument();
    });

    it('displays correct thumbs state for negative value', () => {
      render(
        <Rating type="thumbs" value={-1} showValue data-testid="rating" />
      );

      expect(screen.getByText('Thumbs Down')).toBeInTheDocument();
    });

    it('shows no rating for thumbs when value is 0', () => {
      render(<Rating type="thumbs" value={0} showValue data-testid="rating" />);

      expect(screen.getByText('No Rating')).toBeInTheDocument();
    });

    it('applies disabled styling when disabled', () => {
      render(<Rating disabled data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onChange when star is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating interactive onChange={handleChange} data-testid="rating" />
      );

      const stars = screen.getAllByRole('button');
      await user.click(stars[2]);

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange when thumbs up is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating
          type="thumbs"
          interactive
          onChange={handleChange}
          data-testid="rating"
        />
      );

      const thumbsUp = screen.getByLabelText('Thumbs up');
      await user.click(thumbsUp);

      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('calls onChange when thumbs down is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating
          type="thumbs"
          interactive
          onChange={handleChange}
          data-testid="rating"
        />
      );

      const thumbsDown = screen.getByLabelText('Thumbs down');
      await user.click(thumbsDown);

      expect(handleChange).toHaveBeenCalledWith(-1);
    });

    it('toggles rating when same value is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating
          value={3}
          interactive
          onChange={handleChange}
          data-testid="rating"
        />
      );

      const stars = screen.getAllByRole('button');
      await user.click(stars[2]);

      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('toggles thumbs rating when same value is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating
          type="thumbs"
          value={1}
          interactive
          onChange={handleChange}
          data-testid="rating"
        />
      );

      const thumbsUp = screen.getByLabelText('Thumbs up');
      await user.click(thumbsUp);

      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = jest.fn();

      render(
        <Rating
          interactive
          disabled
          onChange={handleChange}
          data-testid="rating"
        />
      );

      // Disabled rating should not have buttons
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when readOnly', async () => {
      const handleChange = jest.fn();

      render(
        <Rating
          interactive
          readOnly
          onChange={handleChange}
          data-testid="rating"
        />
      );

      // ReadOnly should not render buttons
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('calls onHover when mouse enters star', async () => {
      const handleHover = jest.fn();
      const user = userEvent.setup();

      render(<Rating interactive onHover={handleHover} data-testid="rating" />);

      const stars = screen.getAllByRole('button');
      await user.hover(stars[2]);

      expect(handleHover).toHaveBeenCalledWith(3);
    });

    it('calls onHover with null when mouse leaves', async () => {
      const handleHover = jest.fn();
      const user = userEvent.setup();

      render(<Rating interactive onHover={handleHover} data-testid="rating" />);

      const stars = screen.getAllByRole('button');
      await user.hover(stars[2]);
      await user.unhover(stars[2]);

      expect(handleHover).toHaveBeenLastCalledWith(null);
    });

    it('supports half-star selection on left click for stars', () => {
      const handleChange = jest.fn();

      render(
        <Rating
          type="star"
          interactive
          onChange={handleChange}
          data-testid="rating"
        />
      );

      const stars = screen.getAllByRole('button');
      const firstStar = stars[0];

      // Mock getBoundingClientRect and simulate left half click
      firstStar.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 20,
        top: 0,
        height: 20,
        right: 20,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      }));

      fireEvent.click(firstStar, { clientX: 5 }); // Click on left half

      expect(handleChange).toHaveBeenCalledWith(0.5);
    });

    it('supports full-star selection on right click for stars', () => {
      const handleChange = jest.fn();

      render(
        <Rating
          type="star"
          interactive
          onChange={handleChange}
          data-testid="rating"
        />
      );

      const stars = screen.getAllByRole('button');
      const firstStar = stars[0];

      // Mock getBoundingClientRect and simulate right half click
      firstStar.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 20,
        top: 0,
        height: 20,
        right: 20,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      }));

      fireEvent.click(firstStar, { clientX: 15 }); // Click on right half

      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('supports half-star hover on left side for stars', () => {
      const handleHover = jest.fn();

      render(
        <Rating
          type="star"
          interactive
          onHover={handleHover}
          data-testid="rating"
        />
      );

      const stars = screen.getAllByRole('button');
      const firstStar = stars[0];

      // Mock getBoundingClientRect and simulate left half hover
      firstStar.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 20,
        top: 0,
        height: 20,
        right: 20,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      }));

      fireEvent.mouseMove(firstStar, { clientX: 5 }); // Hover on left half

      expect(handleHover).toHaveBeenCalledWith(0.5);
    });

    it('supports full-star hover on right side for stars', () => {
      const handleHover = jest.fn();

      render(
        <Rating
          type="star"
          interactive
          onHover={handleHover}
          data-testid="rating"
        />
      );

      const stars = screen.getAllByRole('button');
      const firstStar = stars[0];

      // Mock getBoundingClientRect and simulate right half hover
      firstStar.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        width: 20,
        top: 0,
        height: 20,
        right: 20,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: jest.fn(),
      }));

      fireEvent.mouseMove(firstStar, { clientX: 15 }); // Hover on right half

      expect(handleHover).toHaveBeenCalledWith(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows Enter key to select rating', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating interactive onChange={handleChange} data-testid="rating" />
      );

      const stars = screen.getAllByRole('button');
      stars[2].focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('allows Space key to select rating', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating interactive onChange={handleChange} data-testid="rating" />
      );

      const stars = screen.getAllByRole('button');
      stars[2].focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('does not trigger on other keys', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Rating interactive onChange={handleChange} data-testid="rating" />
      );

      const stars = screen.getAllByRole('button');
      stars[2].focus();
      await user.keyboard('{Escape}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('focuses items with Tab navigation', async () => {
      const user = userEvent.setup();

      render(<Rating interactive data-testid="rating" />);

      const stars = screen.getAllByRole('button');

      await user.tab();
      expect(stars[0]).toHaveFocus();

      await user.tab();
      expect(stars[1]).toHaveFocus();
    });
  });

  describe('Display Options', () => {
    it('shows label when showLabel is true', () => {
      render(<Rating label="Recipe Rating" showLabel data-testid="rating" />);

      expect(screen.getByText('Recipe Rating')).toBeInTheDocument();
    });

    it('shows value when showValue is true', () => {
      render(<Rating value={3} maxValue={5} showValue data-testid="rating" />);

      expect(screen.getByText('3 out of 5')).toBeInTheDocument();
    });

    it('shows numeric value for numeric type', () => {
      render(
        <Rating type="numeric" value={7} showValue data-testid="rating" />
      );

      // Should show the selected value after the separator
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('renders hidden input when name is provided', () => {
      render(<Rating name="rating" value={3} data-testid="rating" />);

      const hiddenInput = screen.getByDisplayValue('3');
      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput).toHaveAttribute('name', 'rating');
    });
  });

  describe('Size Variants', () => {
    it('applies small size classes', () => {
      render(<Rating size="sm" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveClass('text-sm');
    });

    it('applies medium size classes', () => {
      render(<Rating size="md" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveClass('text-base');
    });

    it('applies large size classes', () => {
      render(<Rating size="lg" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveClass('text-lg');
    });
  });

  describe('Type Variants', () => {
    it('renders star icons for star type', () => {
      render(<Rating type="star" data-testid="rating" />);

      const stars = screen.getAllByRole('img');
      expect(stars[0]).toBeInTheDocument();
    });

    it('renders heart icons for heart type', () => {
      render(<Rating type="heart" data-testid="rating" />);

      const hearts = screen.getAllByRole('img');
      expect(hearts[0]).toBeInTheDocument();
    });

    it('renders thumbs icons for thumbs type', () => {
      render(<Rating type="thumbs" data-testid="rating" />);

      const thumbsUp = screen.getByLabelText('Thumbs up');
      const thumbsDown = screen.getByLabelText('Thumbs down');

      expect(thumbsUp).toBeInTheDocument();
      expect(thumbsDown).toBeInTheDocument();
    });

    it('renders numbers for numeric type', () => {
      render(<Rating type="numeric" maxValue={3} data-testid="rating" />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Color Variants', () => {
    it('applies default variant classes', () => {
      render(<Rating variant="default" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
    });

    it('applies accent variant classes', () => {
      render(<Rating variant="accent" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
    });

    it('applies warning variant classes', () => {
      render(<Rating variant="warning" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
    });

    it('applies success variant classes', () => {
      render(<Rating variant="success" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
    });
  });

  describe('Precision Handling', () => {
    it('supports half precision display', () => {
      render(
        <Rating value={3.5} precision="half" showValue data-testid="rating" />
      );

      expect(screen.getByText('3.5 out of 5')).toBeInTheDocument();
    });

    it('supports full precision display', () => {
      render(
        <Rating value={3.7} precision="full" showValue data-testid="rating" />
      );

      expect(screen.getByText('3.7 out of 5')).toBeInTheDocument();
    });

    it('supports half precision for star ratings', () => {
      render(
        <Rating
          type="star"
          value={2.5}
          precision="half"
          showValue
          data-testid="rating"
        />
      );

      expect(screen.getByText('2.5 out of 5')).toBeInTheDocument();
    });

    it('supports half precision for heart ratings', () => {
      render(
        <Rating
          type="heart"
          value={1.5}
          precision="half"
          showValue
          data-testid="rating"
        />
      );

      expect(screen.getByText('1.5 out of 5')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Rating aria-label="Custom rating" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveAttribute('role', 'group');
      expect(rating).toHaveAttribute('aria-label', 'Custom rating');
    });

    it('has proper default ARIA label', () => {
      render(<Rating value={3} data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveAttribute('aria-label', 'Rating: 3 out of 5');
    });

    it('has proper ARIA descriptions', () => {
      render(
        <Rating
          label="Recipe Rating"
          showLabel
          showValue
          value={4}
          aria-describedby="custom-desc"
          data-testid="rating"
        />
      );

      const rating = screen.getByTestId('rating');
      const ariaDescribedBy = rating.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('custom-desc');
    });

    it('has proper star ARIA labels', () => {
      render(<Rating interactive data-testid="rating" />);

      const firstStar = screen.getByLabelText('Rate 1 out of 5');
      const thirdStar = screen.getByLabelText('Rate 3 out of 5');

      expect(firstStar).toBeInTheDocument();
      expect(thirdStar).toBeInTheDocument();
    });

    it('has proper thumbs ARIA labels', () => {
      render(<Rating type="thumbs" interactive data-testid="rating" />);

      const thumbsUp = screen.getByLabelText('Thumbs up');
      const thumbsDown = screen.getByLabelText('Thumbs down');

      expect(thumbsUp).toBeInTheDocument();
      expect(thumbsDown).toBeInTheDocument();
    });

    it('has live region for value updates', () => {
      render(<Rating showValue data-testid="rating" />);

      const valueElement = screen.getByText('0 out of 5');
      expect(valueElement).toHaveAttribute('aria-live', 'polite');
    });

    it('passes accessibility audit', async () => {
      const { container } = render(
        <Rating
          interactive
          value={3}
          showValue
          showLabel
          label="Accessibility Test"
          data-testid="rating"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility audit for all types', async () => {
      const types: Array<'star' | 'heart' | 'thumbs' | 'numeric'> = [
        'star',
        'heart',
        'thumbs',
        'numeric',
      ];

      for (const type of types) {
        const { container } = render(
          <Rating
            type={type}
            interactive
            value={type === 'thumbs' ? 1 : 3}
            showValue
            showLabel
            label={`${type} rating test`}
            data-testid={`rating-${type}`}
          />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles value greater than maxValue', () => {
      render(<Rating value={10} maxValue={5} showValue data-testid="rating" />);

      expect(screen.getByText('10 out of 5')).toBeInTheDocument();
    });

    it('handles negative values for non-thumbs types', () => {
      render(<Rating value={-1} showValue data-testid="rating" />);

      expect(screen.getByText('-1 out of 5')).toBeInTheDocument();
    });

    it('handles zero maxValue gracefully', () => {
      render(<Rating maxValue={0} data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toBeInTheDocument();
    });

    it('handles missing onChange in interactive mode', async () => {
      const user = userEvent.setup();

      render(<Rating interactive data-testid="rating" />);

      const stars = screen.getAllByRole('button');

      // Should not throw error
      await user.click(stars[0]);
      expect(stars[0]).toBeInTheDocument();
    });

    it('handles missing onHover in interactive mode', async () => {
      const user = userEvent.setup();

      render(<Rating interactive data-testid="rating" />);

      const stars = screen.getAllByRole('button');

      // Should not throw error
      await user.hover(stars[0]);
      expect(stars[0]).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('forwards custom className', () => {
      render(<Rating className="custom-class" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveClass('custom-class');
    });

    it('forwards custom id', () => {
      render(<Rating id="custom-rating" data-testid="rating" />);

      const rating = screen.getByTestId('rating');
      expect(rating).toHaveAttribute('id', 'custom-rating');
    });

    it('forwards ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Rating ref={ref} data-testid="rating" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
