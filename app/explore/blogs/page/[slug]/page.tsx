import React from 'react';
import { Metadata } from 'next';
import { getAllPostSlugs, getDetailPost, getPosts } from '@/lib/wordpress/api';
import BlogList from '@/components/modules/Blog/BlogList';
import SingleLargeCard from '@/components/wordpressComponents/Blogs/SingleLargeCard';
import Link from 'next/link';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import MobileHeader from '@/components/common/MobileHeader';

interface StaticPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const fullSlug = `/explore/blogs`;

export const metadata: Metadata = {
  title: 'Luxury Villa Travel Ideas and Destination Guides | ELIVAAS',
  description:
    'Explore luxury villa travel ideas, destination guides, weekend getaways, and curated holiday inspiration across India by ELIVAAS.',
  alternates: {
    canonical: fullSlug,
  },
  openGraph: {
    title: 'Luxury Villa Travel Ideas and Destination Guides | ELIVAAS',
    description:
      'Explore luxury villa travel ideas, destination guides, weekend getaways, and curated holiday inspiration across India by ELIVAAS.',
    type: 'website',
  },
};

const FIRST_PAGE_POSTS = 13;
const POSTS_PER_PAGE = 12;

export const dynamic = 'force-static';
export const revalidate = 1800;

export async function generateStaticParams() {
  const paths = [];

  try {
    let after: string | undefined = undefined;
    let hasNextPage = true;
    let page = 1;

    while (hasNextPage && page <= 10) {
      const data = await getPosts(POSTS_PER_PAGE, after);

      paths.push({ slug: page.toString() });

      after = data?.pageInfo?.endCursor || undefined;
      hasNextPage = data?.pageInfo?.hasNextPage || false;
      page++;
    }

    return paths;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ slug: '1' }];
  }
}

async function fetchBlogData(pageNumber: number) {
  try {
    let after: string | undefined = undefined;
    let currentPage = 1;
    const postsToFetch = pageNumber === 1 ? FIRST_PAGE_POSTS : POSTS_PER_PAGE;

    if (pageNumber > 1) {
      const firstPageData = await getPosts(FIRST_PAGE_POSTS);
      after = firstPageData?.pageInfo?.endCursor || undefined;
      currentPage = 2;
      while (currentPage < pageNumber) {
        const response = await getPosts(POSTS_PER_PAGE, after);
        if (!response?.pageInfo?.hasNextPage) {
          return {
            blogData: null,
            error: 'Page not found',
            hasNextPage: false,
            hasPreviousPage: true,
          };
        }
        after = response.pageInfo.endCursor || undefined;
        currentPage++;
      }
    }

    const data = await getPosts(postsToFetch, after);

    return {
      blogData: data,
      error: null,
      hasNextPage: data?.pageInfo?.hasNextPage || false,
      hasPreviousPage: pageNumber > 1,
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      blogData: null,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
      hasNextPage: false,
      hasPreviousPage: false,
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

export default async function BlogListing(props: StaticPageProps) {
  const params = await props.params;
  const currentPage = Number(params?.slug) || 1;

  const moreToDiscover = 'More to Discover';

  try {
    const [blogResult, totalPosts] = await Promise.all([
      fetchBlogData(currentPage),
      getTotalPostsCount(),
    ]);

    const { blogData, error, hasNextPage, hasPreviousPage } = blogResult;
    const totalPages =
      totalPosts <= FIRST_PAGE_POSTS
        ? 1
        : 1 + Math.ceil((totalPosts - FIRST_PAGE_POSTS) / POSTS_PER_PAGE);

    if (error) {
      return (
        <div className='flex flex-col items-center justify-center min-h-[50vh]'>
          <h2>Error: {error}</h2>
          <Link href='/explore/blogs' className='text-primary hover:underline'>
            Go to first page
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className='lg:hidden'>
          {<MobileHeader title='The ELIVAAS Edit' />}
        </div>
        <div className='min-h-screen px-0 md:px-10 md:pt-5 pb-10'>
          {currentPage === 1 && <SingleLargeCard data={blogData?.nodes[0]} />}
          <div className='px-5 md:px-0'>
            {currentPage === 1 && (
              <h2 className='text-xl md:text-3xl font-serif mt-10'>
                {moreToDiscover}
              </h2>
            )}
            <BlogList
              initialPosts={
                currentPage === 1 ? blogData?.nodes?.slice(1) : blogData?.nodes
              }
              showPagination={true}
              postsPerPage={
                currentPage === 1 ? FIRST_PAGE_POSTS - 1 : POSTS_PER_PAGE
              }
              currentPage={currentPage}
              totalPages={totalPages}
              totalPosts={totalPosts}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading blog page:', error);
    return <div>Error Loading Blog</div>;
  }
}
