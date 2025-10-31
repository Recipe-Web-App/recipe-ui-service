/* eslint-disable react-hooks/purity */
'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Pagination,
  SimplePagination,
  CompactPagination,
} from '@/components/ui/pagination';

export default function PaginationDemoPage() {
  // State for different pagination examples
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(5);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPage5, setCurrentPage5] = useState(1);
  const [currentPage6, setCurrentPage6] = useState(1);

  // Page size state
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 248;
  const totalPagesWithSize = Math.ceil(totalItems / pageSize);

  // Table data for demo - memoized to avoid impure Date.now() calls in render
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(5);

  const tableData = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive',
      date: new Date(now - i * 86400000).toLocaleDateString(),
    }));
  }, []);

  const paginatedData = tableData.slice(
    (tableCurrentPage - 1) * tablePageSize,
    tableCurrentPage * tablePageSize
  );

  return (
    <div className="container mx-auto space-y-12 p-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Pagination Component</h1>
        <p className="text-muted-foreground text-lg">
          Page navigation controls with various configurations and styles
        </p>
      </div>

      {/* Basic Pagination */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Pagination</h2>
        <div className="bg-card rounded-lg border p-6">
          <Pagination
            currentPage={currentPage1}
            totalPages={10}
            onPageChange={setCurrentPage1}
            maxPageButtons={7}
          />
        </div>
      </section>

      {/* Pagination with All Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Full-Featured Pagination</h2>
        <div className="bg-card rounded-lg border p-6">
          <Pagination
            currentPage={currentPage2}
            totalPages={totalPagesWithSize}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={page => {
              setCurrentPage2(page);
              // Reset to page 1 if page size changes result in fewer pages
              if (page > totalPagesWithSize) {
                setCurrentPage2(1);
              }
            }}
            onPageSizeChange={newSize => {
              setPageSize(newSize);
              const newTotalPages = Math.ceil(totalItems / newSize);
              if (currentPage2 > newTotalPages) {
                setCurrentPage2(1);
              }
            }}
            showPageInfo={true}
            showPageSizeSelector={true}
            showPageJump={true}
            maxPageButtons={7}
          />
        </div>
      </section>

      {/* Simple Pagination */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Simple Pagination</h2>
        <div className="bg-card rounded-lg border p-6">
          <SimplePagination
            currentPage={currentPage3}
            totalPages={20}
            onPageChange={setCurrentPage3}
          />
        </div>
      </section>

      {/* Compact Pagination (Mobile) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Compact Pagination</h2>
        <div className="bg-card rounded-lg border p-6">
          <CompactPagination
            currentPage={currentPage4}
            totalPages={15}
            onPageChange={setCurrentPage4}
          />
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Variants</h2>
        <div className="space-y-4">
          <div className="bg-card space-y-4 rounded-lg border p-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Small</h3>
              <Pagination
                currentPage={currentPage5}
                totalPages={10}
                onPageChange={setCurrentPage5}
                size="sm"
                maxPageButtons={7}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Default</h3>
              <Pagination
                currentPage={currentPage5}
                totalPages={10}
                onPageChange={setCurrentPage5}
                size="default"
                maxPageButtons={7}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Large</h3>
              <Pagination
                currentPage={currentPage5}
                totalPages={10}
                onPageChange={setCurrentPage5}
                size="lg"
                maxPageButtons={7}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Style Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Style Variants</h2>
        <div className="space-y-4">
          <div className="bg-card space-y-4 rounded-lg border p-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Default</h3>
              <Pagination
                currentPage={currentPage6}
                totalPages={10}
                onPageChange={setCurrentPage6}
                variant="default"
                maxPageButtons={7}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Outline</h3>
              <Pagination
                currentPage={currentPage6}
                totalPages={10}
                onPageChange={setCurrentPage6}
                variant="outline"
                maxPageButtons={7}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Ghost</h3>
              <Pagination
                currentPage={currentPage6}
                totalPages={10}
                onPageChange={setCurrentPage6}
                variant="ghost"
                maxPageButtons={7}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Table with Pagination Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Table with Pagination</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">
                      <span
                        className={cn(
                          'inline-block rounded-md px-2 py-1 text-xs font-medium',
                          item.status === 'Active' &&
                            'bg-success-light text-success',
                          item.status === 'Pending' &&
                            'bg-warning-light text-warning',
                          item.status === 'Inactive' &&
                            'bg-muted text-text-secondary'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={tableCurrentPage}
              totalPages={Math.ceil(tableData.length / tablePageSize)}
              totalItems={tableData.length}
              pageSize={tablePageSize}
              onPageChange={setTableCurrentPage}
              onPageSizeChange={newSize => {
                setTablePageSize(newSize);
                setTableCurrentPage(1);
              }}
              showPageInfo={true}
              showPageSizeSelector={true}
              pageSizeOptions={[5, 10, 20]}
              size="sm"
              justify="between"
            />
          </div>
        </div>
      </section>

      {/* Configuration Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Configuration Options</h2>
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">
              Without First/Last Buttons
            </h3>
            <Pagination
              currentPage={5}
              totalPages={10}
              onPageChange={() => {}}
              showFirstLast={false}
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">
              Without Previous/Next Buttons
            </h3>
            <Pagination
              currentPage={5}
              totalPages={10}
              onPageChange={() => {}}
              showPrevNext={false}
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Page Numbers Only</h3>
            <Pagination
              currentPage={5}
              totalPages={10}
              onPageChange={() => {}}
              showFirstLast={false}
              showPrevNext={false}
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">
              With Fewer Page Buttons
            </h3>
            <Pagination
              currentPage={5}
              totalPages={20}
              onPageChange={() => {}}
              maxPageButtons={5}
            />
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">Required Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>currentPage</code> - Current active page number
                </li>
                <li>
                  <code>totalPages</code> - Total number of pages
                </li>
                <li>
                  <code>onPageChange</code> - Callback when page changes
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Optional Props</h3>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  <code>totalItems</code> - Total number of items
                </li>
                <li>
                  <code>pageSize</code> - Number of items per page
                </li>
                <li>
                  <code>onPageSizeChange</code> - Callback when page size
                  changes
                </li>
                <li>
                  <code>showPageInfo</code> - Show &quot;Showing X-Y of Z&quot;
                  text
                </li>
                <li>
                  <code>showPageSizeSelector</code> - Show page size dropdown
                </li>
                <li>
                  <code>showPageJump</code> - Show page jump input
                </li>
                <li>
                  <code>maxPageButtons</code> - Maximum page number buttons to
                  show
                </li>
                <li>
                  <code>variant</code> - Style variant (default, outline, ghost)
                </li>
                <li>
                  <code>size</code> - Size variant (sm, default, lg)
                </li>
                <li>
                  <code>justify</code> - Alignment (start, center, end, between)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
