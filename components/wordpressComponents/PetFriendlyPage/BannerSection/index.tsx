'use client';

import React from 'react';
import { Banner } from 'pet-friendly-page';
import Link from 'next/link';
import CustomImage from '@/components/common/CustomImage';
import RightArrowBlack from '@/assets/rightArrowBlack.svg';

const BannerSection: React.FC<Banner> = ({}) => {
  const yourPetsTitle = 'Your Pet’s New Favourite Place';
  const experienceTitle =
    'Experience the villas designed for comfort & cuddles';
  const ctaName = 'Explore Pet-friendly Villas';
  return (
    <div className='relative w-full'>
      <CustomImage
        src={`${process.env.IMAGE_DOMAIN}/banner_Web_5a27404e08.webp`}
        alt={'banner'}
        width={'1920'}
        height={'650'}
        className='object-cover w-full h-[80vh] md:h-[60vh] lg:h-[80vh] xl:h-[90vh]'
      />

      <div className='absolute inset-0 bg-black/50 z-0' />

      <div className='absolute inset-x-5 bottom-5 md:left-10 text-center z-10 p-5 md:p-10 transform -translate-y-0'>
        <h1
          className='font-serif text-white text-2xl md:text-5xl mb-2'
          style={{ color: 'var(--white1)' }}
        >
          {yourPetsTitle}
        </h1>
        <p className='text-xs md:text-sm' style={{ color: 'var(--white1)' }}>
          {experienceTitle}
        </p>
        <div className='mt-10 flex justify-center'>
          <Link
            href={'/villas?pet_friendly=true'}
            target='_blank'
            className='px-6 py-3 rounded-full text-xs md:text-base flex font-semibold max-w-[280px] items-center justify-center'
            style={{ background: 'var(--white6)' }}
          >
            <span className='mr-2'>{ctaName}</span>
            <span>
              <RightArrowBlack />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
