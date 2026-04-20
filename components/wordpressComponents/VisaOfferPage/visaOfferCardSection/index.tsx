'use client';

import React from 'react';
import { offersRepeater } from 'visa-page';
import Link from 'next/link';
import { Button } from '@/components/ui';

const visaOfferCardSection: React.FC<offersRepeater> = ({
  offerTitle,
  offerTitleCta,
}) => {
  const ViewAllProperty = 'View All Property';
  return (
    <div className='px-5 md:px-10'>
      <div className='flex justify-between items-center'>
        <span className='text-sm md:text-base font-semibold md:font-normal'>
          {offerTitle}
        </span>
        <Link href={offerTitleCta || ''} className=''>
          <Button
            type='submit'
            className={`text-white bg-accent-red-900 border border-accent-red-900 cursor-pointer w-[140px] md:w-[180px] outline-0 text-xs md:text-sm font-semibold h-[40px] md:h-[40px] lg:h-[50px] px-5 md:px-10 rounded-full py-2 md:py-4`}
          >
            {ViewAllProperty}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default visaOfferCardSection;
