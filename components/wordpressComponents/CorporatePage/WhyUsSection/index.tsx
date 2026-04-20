'use client';

import React from 'react';
import { WhyUsSectionProps } from 'corporate-page';

const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  corporateWhyUsContent,
  corporateWhyUsContentTitle,
}) => {
  return (
    <div className='py-10'>
      <h2 className='text-center font-serif text-2xl md:text-3xl pb-5'>
        {corporateWhyUsContentTitle}
      </h2>
      <div
        className='text-center px-5 text-sm md:text-base leading-10'
        dangerouslySetInnerHTML={{ __html: corporateWhyUsContent || '' }}
      />
    </div>
  );
};

export default WhyUsSection;
