'use client';

import React from 'react';
import { corporatePage } from 'corporate-page';
import CustomImage from '@/components/common/CustomImage';

const BannerSection: React.FC<corporatePage> = ({
  corporateHeading,
  corporateBannerSubHeading,
  corporateBanner,
}) => {
  return (
    <div className='relative w-full h-[400px] md:h-[450px]'>
      <CustomImage
        src={corporateBanner || ''}
        alt={corporateHeading || ''}
        fill
        className='object-cover w-full h-full'
        priority
      />

      <div className='absolute inset-0 bg-black/50 z-0' />

      <div className='absolute inset-x-5 top-1/2 md:left-10 z-10 p-5 md:p-10 transform -translate-y-1/2'>
        <h1 className='text-center text-white text-2xl md:text-5xl md:leading-10 font-serif mb-4'>
          {corporateHeading}
        </h1>
        <p className='text-xs md:text-sm text-center text-white'>
          {corporateBannerSubHeading}
        </p>
      </div>
    </div>
  );
};

export default BannerSection;
