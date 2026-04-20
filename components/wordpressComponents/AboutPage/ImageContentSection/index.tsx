'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { ImageContentSectionProps } from 'image-content-section';
import CustomImage from '@/components/common/CustomImage';
import { motion } from 'framer-motion';

const ImageContentSection: React.FC<ImageContentSectionProps> = ({
  className,
  aboutPageTitle,
  aboutPageHeading,
  aboutPageSubHeading,
  bigImage,
  smallImage,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className=''>
        <div className='flex flex-col-reverse md:flex-row gap-8'>
          <div className='w-full md:w-1/2'>
            {!isMobile && (
              <h1 className='mt-10 mb-3 text-lg md:text-4xl font-serif text-foreground'>
                {aboutPageHeading}
              </h1>
            )}

            <p className='text-xs md:text-sm mt-13 md:mt-0 text-center md:text-left text-primary-900 md:text-foreground'>
              {aboutPageSubHeading}
            </p>
          </div>
          <div className='w-full md:w-1/2 relative'>
            <div className='h-[200px] md:h-[350px] w-full rounded-3xl overflow-hidden '>
              <CustomImage
                alt={aboutPageTitle || ''}
                src={bigImage || ''}
                width={1000}
                height={331}
                className='h-full w-full object-cover'
              />
            </div>
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className='absolute -bottom-15 left-1/2 -translate-x-1/2 md:translate-x-0 w-[240px]  md:w-[336px]  md:-bottom-15 md:-left-50 rounded-3xl border-4 border-white overflow-hidden'
            >
              <CustomImage
                src={smallImage || ''}
                alt={aboutPageTitle || ''}
                width={672}
                height={380}
                className='h-[125px] md:h-[190px] w-[240px] md:w-[336px]'
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageContentSection;
