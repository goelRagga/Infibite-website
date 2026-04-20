'use client';

import React from 'react';
import Image from 'next/image';

interface PropertyCardVisaBannerProps {
  offerIcon: string;
  shortDescription?: string;
}

function PropertyCardVisaBanner({
  offerIcon,
  shortDescription,
}: PropertyCardVisaBannerProps) {
  return (
    <div className='mt-1 mx-[-8px] mb-[-8px] flex justify-center items-center gap-2 rounded-b-xl bg-blue-50 px-2 sm:py-2.5 py-2 dark:bg-primary-800'>
      <span className=''>
        {/* <Svg src={offerIcon} className="w-6 h-6" /> */}
        <Image
          src={offerIcon}
          alt='offer icon'
          width={24}
          height={24}
          className='w-6 dark:bg-white dark:p-1 dark:rounded-xs dark:scale-[1.2]'
        />
      </span>
      <span className='text-xs text-foreground'>
        <span className='font-semibold text-[11px] sm:text-xs sm:truncate max-w-[300px] sm:max-w-[310px] block'>
          {shortDescription}
        </span>
      </span>
    </div>
  );
}

export default React.memo(PropertyCardVisaBanner);
