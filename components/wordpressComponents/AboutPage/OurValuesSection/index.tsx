'use client';

import React, { useRef } from 'react';
import { OurValuesSectionProps } from 'our-values-section';
import Svg from '@/components/common/Shared/Svg';
import { motion, useInView } from 'framer-motion';

const OurValuesSection: React.FC<OurValuesSectionProps> = ({
  className,
  data,
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <>
      <div className='mt-15 md:mt-20'>
        <h2 className='text-xl md:text-2xl text-foreground font-serif text-center'>
          {data?.ourValuesTitle}
        </h2>
        <p className='text-xs md:text-sm text-foreground text-center mt-1.5 mb-6'>
          {data?.ourValuesContent}
        </p>
      </div>
      <div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 '
        ref={sectionRef}
      >
        {data?.ourValuesDetails?.map((item: any, index: number) => (
          <div className='' key={index}>
            <div
              className={`rounded-2xl text-center p-6 lg:h-[186px] xl:h-auto ${className}`}
              style={{ background: 'var(--pink1)' }}
            >
              <motion.div
                className='text-center flex justify-center mt-1 mb-5'
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className='bg-accent-red-900 flex items-center justify-center rounded-full h-10 w-10 p-2.5'>
                  <Svg src={item?.ourValuesImageIcon} width='24' height='24' />
                </div>
              </motion.div>

              <h4 className='text-xl font-serif text-foreground mb-1'>
                {item?.ourValuesIconTitle}
              </h4>
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
