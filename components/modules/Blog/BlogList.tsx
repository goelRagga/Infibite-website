'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WordPressPost } from '@/lib/wordpress/types';
import { formatDate } from '@/components/common/Shared/FormatDate';
import Pagination from '@/components/common/Pagination';

interface BlogListProps {
  initialPosts?: WordPressPost[];
  showPagination?: boolean;
  postsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  totalPosts?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  initialPosts = [],
  showPagination = true,
  postsPerPage = 6,
  currentPage = 1,
  totalPages = 1,
  totalPosts = 0,
  hasNextPage = false,
  hasPreviousPage = false,
}) => {
  return (
    <div className='mx-auto py-5 md:py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
        {initialPosts.length > 0
          ? initialPosts.map((post) => (
              <Link
                key={post.id}
                href={`/explore${post?.uri}`}
                className='block group rounded-2xl transition overflow-hidden'
              >
                <div className='relative w-full h-54 xl:h-60 2xl:h-65'>
                  <Image
                    src={
                      post.featuredImage?.node?.mediaItemUrl
                        ? post.featuredImage.node.mediaItemUrl.replace(
                            /https?:\/\/[^/]+(?:\/explore)?(\/wp-content\/uploads\/[\w-/]+\.\w+)/i,
                            `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}$1`
                          )
                        : '/images/placeholder.png'
                    }
                    alt={post.featuredImage?.node?.altText || post.title}
                    fill
                    className='object-cover transition-transform duration-300'
                  />
                </div>
                <div
                  className='p-4 space-y-2'
                  style={{ background: 'var(--white3)' }}
                >
                  <h3 className='text-xl font-serif text-foreground line-clamp-2'>
                    {post.title}
                  </h3>
                  <p
                    className='text-xs md:text-sm text-foreground line-clamp-3'
                    dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
                  />
                  <p className='text-sm text-accent-red-900 mb-4 mt-1 font-semibold'>
                    Read More
                  </p>

                  <p className='text-sm text-secondary-700 mt-3'>
                    {formatDate(post?.date)}
                  </p>
                </div>
              </Link>
            ))
          : [...Array(postsPerPage)].map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='bg-gray-200 h-48 rounded-lg mb-4'></div>
                <div className='bg-gray-200 h-4 rounded mb-2'></div>
                <div className='bg-gray-200 h-4 rounded mb-2 w-3/4'></div>
                <div className='bg-gray-200 h-3 rounded w-1/2'></div>
              </div>
            ))}
      </div>

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl='/explore/blogs'
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}
    </div>
  );
};

export default BlogList;
