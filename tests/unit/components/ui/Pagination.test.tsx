import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  Pagination,
  SimplePagination,
  CompactPagination,
} from '@/components/ui/pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders with required props', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    });

    it('displays current page as active', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByRole('button', {
        name: 'Go to page 5',
      });
      expect(currentPageButton).toBeDisabled();
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('calls onPageChange when page number is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const page3Button = screen.getByRole('button', { name: 'Go to page 3' });
      await user.click(page3Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('handles navigation buttons correctly', async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      await user.click(screen.getByLabelText('Previous'));
      expect(mockOnPageChange).toHaveBeenCalledWith(4);

      await user.click(screen.getByLabelText('Next'));
      expect(mockOnPageChange).toHaveBeenCalledWith(6);

      await user.click(screen.getByLabelText('First'));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);

      await user.click(screen.getByLabelText('Last'));
      expect(mockOnPageChange).toHaveBeenCalledWith(10);
    });

    it('disables first/prev buttons on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByLabelText('First')).toBeDisabled();
      expect(screen.getByLabelText('Previous')).toBeDisabled();
    });

    it('disables last/next buttons on last page', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByLabelText('Last')).toBeDisabled();
      expect(screen.getByLabelText('Next')).toBeDisabled();
    });
  });

  describe('Page Range Display', () => {
    it('shows all pages when total pages is less than max buttons', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
          maxPageButtons={7}
        />
      );

      for (let i = 1; i <= 5; i++) {
        expect(
          screen.getByRole('button', { name: `Go to page ${i}` })
        ).toBeInTheDocument();
      }
    });

    it('shows ellipsis when there are many pages', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={mockOnPageChange}
          maxPageButtons={7}
        />
      );

      // Ellipsis is rendered as MoreHorizontal icon, not text
      const ellipsis = document.querySelectorAll('.lucide-ellipsis');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('respects maxPageButtons setting', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={20}
          onPageChange={mockOnPageChange}
          maxPageButtons={5}
        />
      );

      // Count actual page number buttons, excluding nav buttons
      const pageButtons = screen
        .getAllByRole('button')
        .filter(button =>
          button.getAttribute('aria-label')?.startsWith('Go to page')
        );
      // With ellipsis, should show: 1, 2, 3, 4, ellipsis, 20 = 5 page buttons max
      expect(pageButtons.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Page Info', () => {
    it('displays page info when enabled', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          totalItems={100}
          pageSize={10}
          onPageChange={mockOnPageChange}
          showPageInfo={true}
        />
      );

      expect(screen.getByText('Showing 11-20 of 100')).toBeInTheDocument();
    });

    it('calculates page info correctly for first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          totalItems={95}
          pageSize={10}
          onPageChange={mockOnPageChange}
          showPageInfo={true}
        />
      );

      expect(screen.getByText('Showing 1-10 of 95')).toBeInTheDocument();
    });

    it('calculates page info correctly for last page', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          totalItems={95}
          pageSize={10}
          onPageChange={mockOnPageChange}
          showPageInfo={true}
        />
      );

      expect(screen.getByText('Showing 91-95 of 95')).toBeInTheDocument();
    });

    it('uses custom page info label', () => {
      const customLabel = (start: number, end: number, total: number) =>
        `Items ${start} to ${end} of ${total}`;

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          totalItems={100}
          pageSize={10}
          onPageChange={mockOnPageChange}
          showPageInfo={true}
          pageInfoLabel={customLabel}
        />
      );

      expect(screen.getByText('Items 1 to 10 of 100')).toBeInTheDocument();
    });
  });

  describe('Page Size Selector', () => {
    it('displays page size selector when enabled', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          pageSize={10}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          showPageSizeSelector={true}
        />
      );

      expect(screen.getByLabelText('Items per page:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    it('calls onPageSizeChange when page size is changed', async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          pageSize={10}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      );

      const select = screen.getByDisplayValue('10');
      await user.selectOptions(select, '20');

      expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
    });

    it('uses custom page size options', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          pageSize={25}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          showPageSizeSelector={true}
          pageSizeOptions={[25, 50, 75]}
        />
      );

      expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '75' })).toBeInTheDocument();
    });
  });

  describe('Page Jump', () => {
    it('displays page jump input when enabled', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageJump={true}
        />
      );

      expect(screen.getByLabelText('Go to page:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('5')).toBeInTheDocument();
    });

    it('jumps to page when form is submitted', async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageJump={true}
        />
      );

      const input = screen.getByLabelText('Go to page:');
      const form = input.closest('form');

      await user.type(input, '7');
      if (form) {
        fireEvent.submit(form);
      }

      expect(mockOnPageChange).toHaveBeenCalledWith(7);
    });

    it('clears input after successful jump', async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageJump={true}
        />
      );

      const input = screen.getByLabelText('Go to page:') as HTMLInputElement;
      const form = input.closest('form');

      await user.type(input, '7');
      if (form) {
        fireEvent.submit(form);
      }

      expect(input.value).toBe('');
    });

    it('ignores invalid page numbers', async () => {
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageJump={true}
        />
      );

      const input = screen.getByLabelText('Go to page:');
      const form = input.closest('form');

      // Test page number too high
      await user.type(input, '15');
      if (form) {
        fireEvent.submit(form);
      }
      expect(mockOnPageChange).not.toHaveBeenCalled();

      // Test page number too low
      await user.clear(input);
      await user.type(input, '0');
      if (form) {
        fireEvent.submit(form);
      }
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Visibility Options', () => {
    it('hides first/last buttons when disabled', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showFirstLast={false}
        />
      );

      expect(screen.queryByLabelText('First')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Last')).not.toBeInTheDocument();
    });

    it('hides prev/next buttons when disabled', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPrevNext={false}
        />
      );

      expect(screen.queryByLabelText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next')).not.toBeInTheDocument();
    });

    it('hides page numbers when disabled', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageNumbers={false}
        />
      );

      expect(
        screen.queryByRole('button', { name: 'Go to page 5' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies small size classes', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          size="sm"
        />
      );

      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveClass('text-sm');
    });

    it('applies large size classes', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          size="lg"
        />
      );

      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveClass('text-lg');
    });
  });

  describe('Style Variants', () => {
    it('applies outline variant', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          variant="outline"
        />
      );

      const pageButton = screen.getByRole('button', { name: 'Go to page 2' });
      expect(pageButton).toHaveClass('bg-transparent');
    });

    it('applies ghost variant', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          variant="ghost"
        />
      );

      const pageButton = screen.getByRole('button', { name: 'Go to page 2' });
      expect(pageButton).toHaveClass('hover:bg-accent');
    });
  });

  describe('Custom Labels', () => {
    it('uses custom button labels', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          previousLabel="Prev"
          nextLabel="Next Page"
          firstLabel="Start"
          lastLabel="End"
        />
      );

      expect(screen.getByLabelText('Prev')).toBeInTheDocument();
      expect(screen.getByLabelText('Next Page')).toBeInTheDocument();
      expect(screen.getByLabelText('Start')).toBeInTheDocument();
      expect(screen.getByLabelText('End')).toBeInTheDocument();
    });

    it('uses custom page size label', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          pageSize={10}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
          showPageSizeSelector={true}
          pageSizeLabel="Rows per page:"
        />
      );

      expect(screen.getByLabelText('Rows per page:')).toBeInTheDocument();
    });

    it('uses custom page jump label', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageJump={true}
          pageJumpLabel="Jump to:"
        />
      );

      expect(screen.getByLabelText('Jump to:')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          aria-label="Table pagination"
        />
      );

      expect(screen.getByLabelText('Table pagination')).toBeInTheDocument();
    });

    it('marks current page with aria-current', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPage = screen.getByRole('button', { name: 'Go to page 5' });
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('has proper input constraints for page jump', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          showPageJump={true}
        />
      );

      const input = screen.getByLabelText('Go to page:');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '10');
    });
  });
});

describe('SimplePagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as simplified pagination', () => {
    render(
      <SimplePagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryByLabelText('First')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last')).not.toBeInTheDocument();
  });

  it('shows limited page buttons', () => {
    render(
      <SimplePagination
        currentPage={1}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    const pageButtons = screen
      .getAllByRole('button')
      .filter(button =>
        button.getAttribute('aria-label')?.startsWith('Go to page')
      );
    // SimplePagination uses maxPageButtons={5} by default
    expect(pageButtons.length).toBeLessThanOrEqual(5);
  });

  it('handles page changes', async () => {
    const user = userEvent.setup();

    render(
      <SimplePagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    await user.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});

describe('CompactPagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in compact format', () => {
    render(
      <CompactPagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('handles navigation', async () => {
    const user = userEvent.setup();

    render(
      <CompactPagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    await user.click(screen.getByLabelText('Previous page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    await user.click(screen.getByLabelText('Next page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  it('disables buttons at boundaries', () => {
    render(
      <CompactPagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
  });

  it('shows correct page info', () => {
    render(
      <CompactPagination
        currentPage={7}
        totalPages={15}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Page 7 of 15')).toBeInTheDocument();
  });
});
