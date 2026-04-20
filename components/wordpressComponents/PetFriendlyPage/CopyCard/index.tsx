'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/hooks/useIsMobile';
import CustomImage from '@/components/common/CustomImage';

const CopySection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const handleCopy = () => {
    navigator.clipboard.writeText('PAW10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const description =
    'Because your furry friend deserves belly rubs & cuddle-worthy views.';
  const validity = 'Valid till June 30, 2025';
  const code = 'PAW10';

  return (
    <div
      className='py-5 px-0 pl-0 md:pl-9 h-full relative mb-8 rounded-3xl'
      style={{ background: isMobile ? '' : 'var(--backgroundGradient1)' }}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 items-center h-full'>
        {/* Image Section */}
        <div className='flex justify-center'>
          <div>
            {isMobile ? (
              <CustomImage
                src={`${process.env.IMAGE_DOMAIN}/copy_Image_fb90feca70.webp`}
                alt='favorite'
                width={526}
                height={268}
                className='w-full h-[250px]'
              />
            ) : (
              <CustomImage
                src={`${process.env.IMAGE_DOMAIN}/left_Image_0ff6d42d4a.webp`}
                alt='favorite'
                width={526}
                height={268}
                className='h-auto w-[526px]  '
              />
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className='mx-auto h-full'>
          <div className='flex justify-center w-full max-w-[460px] py-3 px-4 mx-auto rounded-full mt-1 flex-col max-sm:w-full max-sm:p-0 max-sm:mt-2.5 max-sm:items-start'>
            <h2
              className='mb-1 leading-none text-3xl max-sm:text-xl max-sm:mt-1 max-sm:leading-relaxed'
              style={{ color: 'var(--black4)' }}
            >
              Get <span className='font-bold'>FLAT 10% OFF</span> on your next
              pawcation!
            </h2>
            <p className='text-foreground mb-2 mt-2.5 w-4/5 leading-tight text-xs md:text-sm'>
              {description}
            </p>
            <p
              className='text-sm max-sm:text-xs'
              style={{ color: 'var(--grey5)' }}
            >
              {validity}
            </p>
            <div className='mt-4 max-sm:flex max-sm:justify-center max-sm:w-full max-sm:mt-5'>
              <Button
                variant='outline'
                className='w-2/5 rounded-l-full md:h-[45px] rounded-r-none py-3 px-2.5 border-0.4 border-foreground bg-white text-foreground font-semibold text-sm'
              >
                {code}
              </Button>
              <Button
                onClick={handleCopy}
                className='w-2/5 rounded-r-full md:h-[45px] rounded-l-none py-3 px-2.5 border-0.4 border-foreground bg-foreground text-white'
              >
                {copied ? 'Copied!' : 'Copy code'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopySection;
