import React from 'react';
import { Metadata } from 'next';
import { GET_ALL_PAGE_SLUGS, GET_PAGE_BY_SLUG } from '@/lib/wordpress/queries';
import Link from 'next/link';
import { serverClient } from '@/lib/client/unified-client-manager';

// Define types
interface PageNode {
  slug: string;
}

interface AllPagesQueryData {
  pages?: {
    nodes?: PageNode[];
  };
}

interface PageQueryData {
  page?: {
    title: string;
    content: string;
    seo?: {
      title?: string;
      metaDesc?: string;
    };
  };
}

interface PageParams {
  slug: string;
}

interface AllPageProps {
  params: Promise<PageParams>;
}

// Revalidate every half hour
export const dynamic = 'force-static';
export const revalidate = 1800;

// Generate static paths
export async function generateStaticParams() {
  try {
    const data = await serverClient.request<AllPagesQueryData>(
      GET_ALL_PAGE_SLUGS,
      { first: 100 }
    );

    const slugs =
      data?.pages?.nodes?.map((page) => ({
        slug: page.slug,
      })) || [];

    return slugs;
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}

// Dynamic Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await serverClient.request<PageQueryData>(GET_PAGE_BY_SLUG, {
      slug,
    });

    const page = data?.page;
    if (!page) return {};

    return {
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc,
      openGraph: {
        title: page.seo?.title || page.title,
        description: page.seo?.metaDesc,
        type: 'article',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {};
  }
}

// Main Page Component
export default async function AllPages({ params }: AllPageProps) {
  const { slug } = await params;

  try {
    const data = await serverClient.request<PageQueryData>(GET_PAGE_BY_SLUG, {
      slug,
    });

    const page = data?.page;

    if (!page) {
      return (
        <div className='flex flex-col items-center justify-center min-h-[50vh]'>
          <h2 className='text-xl text-red-600'>Page Not Found</h2>
          <Link href='/' className='text-primary hover:underline mt-4'>
            Go to Homepage
          </Link>
        </div>
      );
    }

    return (
      <div className='max-w-4xl mx-auto p-5 md:p-10'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>{page.title}</h1>
        <div
          className='prose max-w-none'
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh]'>
        <h2 className='text-xl text-red-600'>Error Loading Page</h2>
        <Link href='/' className='text-primary hover:underline mt-4'>
          Return to Homepage
        </Link>
      </div>
    );
  }
}
