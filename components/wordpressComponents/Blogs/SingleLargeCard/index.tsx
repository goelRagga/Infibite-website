'use client';

import React from 'react';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { SingleLargeCardProps } from 'large-card';
import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import { formatDateWithFullYear } from '@/components/common/Shared/FormatDate';
import Image from 'next/image';

const SingleLargeCard: React.FC<SingleLargeCardProps> = ({
  className = '',
  data,
  isBlogDetail = false,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const { featuredImage, tags, title, excerpt, uri, date } = data || {};
  const mediaItemUrl = featuredImage?.node?.mediaItemUrl || '';
  const formattedDate = formatDateWithFullYear(date);
  const blogLink = uri?.startsWith('/explore/') ? uri : `/explore${uri}`;

  const BreadcrumbItems = isBlogDetail
    ? [
        { label: 'Home', href: '/' },
        { label: 'Blogs', href: '/explore/blogs' },
        { label: title || '', href: `/blog/${uri}` },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Blogs', href: '/explore/blogs' },
      ];

  const published = 'Published';
  const blogsTitle = 'The ELIVAAS Edit';
  const readMore = 'Read More';

  const rawBanner = featuredImage?.node?.mediaItemUrl || '';
  const relativePathMatch = rawBanner.match(
    /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"]+\.\w+/
  );

  const banner = relativePathMatch
    ? `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}${relativePathMatch[0]}?width=1920&height=550&func=boundmin&force_format=webp&q=98`
    : '';

  return (
    <div className={className}>
      {isBlogDetail ? (
        <div className='bg-white'>
          <div className='mx-auto px-0 lg:px-10 lg:py-5'>
            {!isTablet && <CustomBreadcrumb items={BreadcrumbItems} />}

            <div className='mt-10 text-center'>
              {/* <span className='bg-accent-green-700 px-2 py-1 rounded-lg text-white text-sm'>
                Featured
              </span> */}
              {isMobile ? (
                <h2 className='px-5 md:px-0 text-xl md:text-4xl font-serif text-gray-800 mt-5 mb-1 leading-tight'>
                  {title}
                </h2>
              ) : (
                <h1 className='px-5 md:px-0 text-xl md:text-4xl font-serif text-gray-800 mt-5 mb-1 leading-tight'>
                  {title}
                </h1>
              )}

              <p className='text-gray-500 text-sm mb-8'>
                {published} {formattedDate}
              </p>
            </div>

            {banner && (
              <div className='relative h-75 md:h-97 mb-4 mt-6 lg:rounded-lg overflow-hidden'>
                <Image
                  src={banner}
                  alt={title || 'Blog Image'}
                  fill
                  className='object-cover'
                  priority
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {!isTablet && (
            <>
              <CustomBreadcrumb items={BreadcrumbItems} />
              <h1 className='text-3xl font-serif mt-5'>{blogsTitle}</h1>
            </>
          )}

          <div className='relative h-125 md:h-100 mb-4 md:mt-6 md:rounded-2xl overflow-hidden'>
            <Image
              src={banner}
              alt={title || 'Blog Hero'}
              fill
              className='object-cover'
              priority
            />
            <div
              className='absolute top-0 left-0 w-full h-full'
              style={{
                background: isTablet
                  ? 'var(--backgroundGradient12)'
                  : 'var(--backgroundGradient11)',
              }}
            >
              <div className='px-5 md:px-10 max-w-lg py-8 absolute bottom-0 md:bottom-auto md:top-1/2 md:left-0 md:transform md:-translate-y-1/2'>
                {/* <span className='bg-accent-green-700 px-2 py-1 rounded-lg text-white text-sm'>
                  Featured
                </span> */}
                <h2 className='mt-5 text-xl md:text-2xl font-serif text-white'>
                  {title}
                </h2>
                {excerpt && (
                  <p
                    className='text-xs md:text-sm text-primary-50 line-clamp-3 mt-4 mb-2'
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                  />
                )}
                <Link
                  href={blogLink}
                  scroll={false}
                  replace
                  className='text-sm font-semibold'
                  style={{ color: 'var(--orange6)' }}
                >
                  {readMore}
                </Link>
                <p className='text-secondary-200 md:text-secondary-400 text-sm mt-4'>
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleLargeCard;
