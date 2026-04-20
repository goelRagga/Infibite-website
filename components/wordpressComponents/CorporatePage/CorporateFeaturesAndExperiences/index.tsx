'use client';

import React from 'react';
import { CorporateFeaturesAndExperiencesProps } from 'corporate-page';
import CustomImage from '@/components/common/CustomImage';

const CorporateFeaturesAndExperiences: React.FC<
  CorporateFeaturesAndExperiencesProps
> = ({ corporateFeatureImage, corporateFeatureTitle }) => {
  return (
    <div className='items-start flex justify-center flex-col'>
      <CustomImage
        src={corporateFeatureImage || ''}
        alt=''
        width='415'
        height='275'
        className='rounded-lg overflow-hidden'
      />
      <p className='text-sm md:text-base text-foreground pt-2'>
        {corporateFeatureTitle}
      </p>
    </div>
  );
};

export default CorporateFeaturesAndExperiences;
