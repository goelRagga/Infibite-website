'use client';

import React from 'react';
import Svg from '@/components/common/Shared/Svg';

interface OurValuesSectionProps {
  className?: string;
  ourValuesDetails?: any;
}

const OurValuesSection: React.FC<OurValuesSectionProps> = ({
  className,
  ourValuesDetails,
}) => {
  return (
    <>
      <div className='flex flex-col lg:flex-row gap-4 md:gap-6'>
        {ourValuesDetails?.map((item: any, index: number) => (
          <div className='w-full lg:w-1/3' key={index}>
            <div
              className={`rounded-2xl text-center p-6 ${className}`}
              style={{ background: 'var(--pink1)' }}
            >
              <div className='text-center flex justify-center mt-1 mb-5'>
                <div className='bg-accent-red-900 flex items-center justify-center rounded-full h-10 w-10 p-2.5'>
                  <Svg src={item?.ourValuesImageIcon} width='24' height='24' />
                </div>
              </div>

              <h5 className='text-xl font-serif text-foreground mb-1'>
                {item?.ourValuesIconTitle}
              </h5>
              <p className='text-xs md:text-sm text-foreground'>
                {item?.ourValuesIconContent}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OurValuesSection;
