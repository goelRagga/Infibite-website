'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import MobileHeader from '@/components/common/MobileHeader';
import SingleLargeCard from './SingleLargeCard';
import BlogList from '@/components/modules/Blog/BlogList';

interface BlogListingPageProps {
  blogData: any;
  totalPosts: number;
  hasNextPage: boolean;
  totalPages: number;
  FIRST_PAGE_POSTS: number;
}

const BlogListingPage: React.FC<BlogListingPageProps> = ({
  blogData,
  totalPosts,
  hasNextPage,
  totalPages,
  FIRST_PAGE_POSTS,
}) => {
  const isMobile = useIsMobile();
  const moreToDiscover = 'More to Discover';

  return (
    <>
      {isMobile && <MobileHeader title='The ELIVAAS Edit' />}

      <div className='min-h-screen px-0 md:px-10 md:pt-5 pb-10'>
        <SingleLargeCard data={blogData?.nodes[0]} />
        <div className='px-5 md:px-0'>
          <h2 className='text-xl md:text-3xl font-serif mt-10'>
            {moreToDiscover}
          </h2>
          <BlogList
            initialPosts={blogData?.nodes?.slice(1)}
            showPagination={true}
            postsPerPage={FIRST_PAGE_POSTS - 1}
            currentPage={1}
            totalPages={totalPages}
            totalPosts={totalPosts}
            hasNextPage={hasNextPage}
            hasPreviousPage={false}
          />
        </div>
      </div>
    </>
  );
};

export default BlogListingPage;
