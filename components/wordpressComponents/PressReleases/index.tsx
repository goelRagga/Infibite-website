'use client';

import React, { useRef } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import MobileHeader from '@/components/common/MobileHeader';
import CustomImage from '@/components/common/CustomImage';
import { toast } from 'sonner';
import SharePrimaryIcon from '@/assets/sharePrimaryIcon.svg';
import { motion, useInView } from 'framer-motion';

interface PressReleasesProps {
  data?: any;
  className?: string;
}

const PressReleases: React.FC<PressReleasesProps> = ({
  className = '',
  data,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Press Releases', href: '/press-release' },
  ];

  const mainItem = data?.pressReleaseData?.[0];
  const remainingItems = data?.pressReleaseData?.slice(1);

  const pressReleasesHeading = 'Press Releases';
  const knowMore = 'Know More';

  const handleShare = (link: string) => {
    if (!link) return;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const mainRef = useRef(null);
  const isMainInView = useInView(mainRef, { once: true, margin: '-100px' });

  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, margin: '-100px' });

  return (
    <>
      {isTablet && <MobileHeader title='Press Releases' />}
      {!isTablet && (
        <>
          <div className='w-full pt-5'>
            <CustomBreadcrumb items={breadcrumb} />
          </div>
          <h1 className='text-3xl font-serif text-foreground mb-5 mt-4'>
            {pressReleasesHeading}
          </h1>
        </>
      )}

      {/* first item big */}
      {mainItem && (
        <div className='w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-4 mb-10 mt-5 xl:mt-0'>
          <div className='w-full lg:w-5/12 px-5 lg:px-0'>
            <div className='mb-2'>
              <CustomImage
                src={mainItem?.logos}
                alt='Press Releases'
                width={100}
                height={20}
                className='object-contain h-[20px]'
              />
            </div>
            <h2 className='text-xl md:text-2xl text-foreground font-serif mb-3 mt-5 leading-normal line-clamp-3'>
              {mainItem?.title}
            </h2>
            <p className='text-secondary-700 text-sm mb-4'>{mainItem?.date}</p>
            <div className='flex items-center gap-2'>
              <Link href={mainItem?.link || ''} target='_blank'>
                <Button
                  variant='default'
                  size='sm'
                  className='pl-6 pr-6 h-[42px] bg-accent-red-900 hover:bg-accent-red-950 cursor-pointer rounded-full text-sm text-card font-semibold'
                >
                  {knowMore}
                </Button>
              </Link>
              <div
                className='cursor-pointer border border-accent-red-900 rounded-full p-2'
                onClick={() => handleShare(mainItem?.link)}
              >
                <SharePrimaryIcon />
              </div>
            </div>
          </div>

          <div className='w-full lg:w-7/12 h-[300px] lg:h-[400px] relative overflow-hidden md:rounded-xl'>
            <div className=''>
              <Image
                src={mainItem?.imageLink}
                alt='Press Releases'
                width={700}
                height={400}
                className='w-full h-[300px] md:h-[400px] object-cover md:rounded-xl'
              />
            </div>

            <div className='bg-white absolute py-3 px-3 top-3 left-3 flex items-center justify-center rounded-lg w-[110px] h-[32px] cursor-pointer'>
              <Image
                src={mainItem?.logos}
                alt='Logo'
                width={65}
                height={20}
                className='object-contain h-[20px]'
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-5 md:px-0 ${className}`}
      >
        {remainingItems?.map((item: any, index: number) => (
          <div className='flex flex-col bg-card rounded-bl-2xl rounded-br-2xl '>
            <div
              className='w-full h-[230px] relative rounded-tl-2xl rounded-tr-2xl overflow-hidden'
              key={index}
            >
              <Image
                alt='Press Releases'
                src={item?.imageLink}
                fill
                className='object-cover'
              />
              <div className='px-3 flex items-center justify-between w-full absolute top-3'>
                <div className='bg-white px-3 flex items-center justify-center py-1 rounded-lg w-[110px] h-[32px] cursor-pointer'>
                  <Image
                    src={item?.logos}
                    alt='Logo'
                    width={65}
                    height={20}
                    className='object-contain h-[20px]'
                  />
                </div>
                <div
                  className='cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full backdrop-blur-md border border-accent-red-900'
                  style={{ background: 'var(--white4)' }}
                  onClick={() => handleShare(item?.link)}
                >
                  <SharePrimaryIcon />
                </div>
              </div>
            </div>
            <div className='p-4'>
              <p className='text-xs text-foreground'>{item?.auhor}</p>
              <h4 className='text-lg text-foreground md:h-[54px] font-serif mb-4 mt-2 leading-normal line-clamp-2'>
                {item?.title}
              </h4>

              {/* Footer */}
              <div className='flex items-center justify-between mt-auto'>
                <span className='text-secondary-700 text-sm'>{item?.date}</span>
                {!isTablet && (
                  <Link href={`${item?.link}`} target='_blank'>
                    <Button
                      variant='default'
                      size='sm'
                      className='pl-6 pr-6 h-[42px] bg-accent-red-900 hover:bg-accent-red-950 cursor-pointer rounded-full text-sm text-card font-semibold'
                    >
                      {knowMore}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PressReleases;
