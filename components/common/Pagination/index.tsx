'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  hasNextPage,
  hasPreviousPage,
}) => {
  const generatePageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}/page/${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='flex items-center justify-center space-x-2 mt-8'>
      {/* Previous button */}
      {hasPreviousPage && currentPage > 1 && (
        <Link
          href={generatePageUrl(currentPage - 1)}
          className='flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Previous
        </Link>
      )}

      {/* Page numbers */}
      <div className='flex items-center space-x-1'>
        {renderPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className='px-3 py-2 text-sm text-gray-500'>...</span>
            ) : (
              <Link
                href={generatePageUrl(page as number)}
                className={`px-4.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {page}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
      {hasNextPage && currentPage < totalPages && (
        <Link
          href={generatePageUrl(currentPage + 1)}
          className='flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors'
        >
          Next
          <ChevronRight className='w-4 h-4 ml-1' />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
