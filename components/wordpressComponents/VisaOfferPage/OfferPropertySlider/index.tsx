'use client';

import React from 'react';
import Link from 'next/link';
import { OfferPropertySlider } from 'visa-page';
import CustomImage from '@/components/common/CustomImage';

const OfferPropertySliderSection: React.FC<OfferPropertySlider> = ({
  visaPropertyImage,
  visaPropertyLink,
  visaPropertyName,
}) => {
  return (
    <div className=''>
      <div className='flex gap-4 px-2'>
        <Link
          href={visaPropertyLink || ''}
          target='_blank'
          className=' h-[180px] block'
        >
          <CustomImage
            src={visaPropertyImage || ''}
            alt={'property image'}
            width={280}
            height={180}
            className='rounded-lg w-full h-[180px] object-cover'
          />
          <h6 className='text-xs font-semibold md:font-normal md:text-sm mt-2 line-clamp-2'>
            {visaPropertyName}
          </h6>
        </Link>
      </div>
    </div>
  );
};

export default OfferPropertySliderSection;
