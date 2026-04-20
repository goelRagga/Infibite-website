'use client';

import React from 'react';
import { Banner } from 'visa-page';
import CustomImage from '@/components/common/CustomImage';

const BannerSection: React.FC<Banner> = ({
  visaLandingBanner,
  visaLandingHeading,
}) => {
  return (
    <div className='relative w-full h-[400px] md:h-[450px]'>
      <CustomImage
        src={visaLandingBanner || ''}
        alt={'banner'}
        width={'1920'}
        height={'450'}
        className='object-cover w-full h-full'
      />

      <div className='absolute inset-0 bg-black/50 z-0' />

      <div className='absolute inset-x-5 top-1/2 md:left-10 z-10 p-5 md:p-10 transform -translate-y-1/2'>
        {visaLandingHeading && (
          <h1
            className='text-center text-white text-2xl md:text-5xl md:leading-10 font-serif mb-4'
            dangerouslySetInnerHTML={{ __html: visaLandingHeading }}
          />
        )}
      </div>
    </div>
  );
};

export default BannerSection;
