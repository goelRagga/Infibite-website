import React from 'react';
import { Metadata } from 'next';
import { getPosts } from '@/lib/wordpress/api';
import BlogList from '@/components/modules/Blog/BlogList';
import SingleLargeCard from '@/components/wordpressComponents/Blogs/SingleLargeCard';
import Link from 'next/link';
import MobileHeader from '@/components/common/MobileHeader';
import BlogListingPage from '@/components/wordpressComponents/Blogs/BlogListingPage';

const fullSlug = `/explore/blogs`;

export const metadata: Metadata = {
  title:
    'Explore the Latest Blogs: Insights on Luxury Villas and Holiday Homes',
  description:
    'Check out our latest blogs for insights on luxury villas, short-term rentals, holiday homes, & homestay experiences. Stay updated on travel trends and tips for a perfect getaway.',
  alternates: {
    canonical: fullSlug,
  },
  openGraph: {
    title:
      'Explore the Latest Blogs: Insights on Luxury Villas and Holiday Homes',
    description:
      'Check out our latest blogs for insights on luxury villas, short-term rentals, holiday homes, & homestay experiences. Stay updated on travel trends and tips for a perfect getaway.',
    type: 'website',
  },
};

const FIRST_PAGE_POSTS = 13;
const POSTS_PER_PAGE = 12;

export const dynamic = 'force-static';
export const revalidate = 1800;

async function fetchBlogData() {
  try {
    const data = await getPosts(FIRST_PAGE_POSTS);

    return {
      blogData: data,
      error: null,
      hasNextPage: data?.pageInfo?.hasNextPage || false,
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      blogData: null,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
      hasNextPage: false,
    };
  }
}

async function getTotalPostsCount() {
  try {
    const data = await getPosts(1000);
    return data?.nodes?.length || 0;
  } catch (error) {
    console.error('Error getting total posts count:', error);
    return 0;
  }
}

export default async function BlogsHomePage() {
  const moreToDiscover = 'More to Discover';

  try {
    const [blogResult, totalPosts] = await Promise.all([
      fetchBlogData(),
      getTotalPostsCount(),
    ]);

    const { blogData, error, hasNextPage } = blogResult;
    const totalPages =
      totalPosts <= FIRST_PAGE_POSTS
        ? 1
        : 1 + Math.ceil((totalPosts - FIRST_PAGE_POSTS) / POSTS_PER_PAGE);

    if (error) {
      return (
        <div className='flex flex-col items-center justify-center min-h-[50vh]'>
          <h2>Error: {error}</h2>
          <Link href='/explore/blogs' className='text-primary hover:underline'>
            Refresh page
          </Link>
        </div>
      );
    }

    return (
      <>
        <BlogListingPage
          blogData={blogData}
          totalPosts={totalPosts}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
          FIRST_PAGE_POSTS={FIRST_PAGE_POSTS}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading blog page:', error);
    return <div>Error Loading Blog</div>;
  }
}
