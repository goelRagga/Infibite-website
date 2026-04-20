'use client';

import React from 'react';
import { CorporateReviewsProps } from 'corporate-page';
import CustomImage from '@/components/common/CustomImage';

const ExcellentReviews: React.FC<CorporateReviewsProps> = ({
  corporateReviewLogo,
  corporateReviewRating,
}) => {
  return (
    <div className='text-center flex justify-center items-center flex-col'>
      <CustomImage
        src={corporateReviewLogo || ''}
        alt=''
        width='300'
        height='100'
        className='w-[80px] md:w-full'
      />
      <p className='text-xs w-full md:w-auto text-left md:text-center pl-2 md:pl-0 font-semibold md:font-normal md:text-sm text-foreground'>
        {corporateReviewRating}
      </p>
    </div>
  );
};

export default ExcellentReviews;
