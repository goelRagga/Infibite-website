'use client';
import CustomImage from '@/components/common/CustomImage';
import useIsMobile from '@/hooks/useIsMobile';
import React from 'react';
import { BannerSectionProps } from 'red-carpet';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';
import Image from 'next/image';

const BannerSection: React.FC<
  BannerSectionProps & { onCtaClick?: () => void }
> = ({ mobUrl, deskUrl, title, content, cta, onCtaClick }) => {
  const isMobile = useIsMobile();
  return (
    <div className='relative w-full h-[85vh] md:h-[100vh]'>
      <CustomImage
        src={
          isMobile
            ? mobUrl ||
              `${process.env.IMAGE_DOMAIN}/mobile_Banner_6062e840e0.webp`
            : deskUrl ||
              `${process.env.IMAGE_DOMAIN}/Banner_Red_Carpets_1b44947c01.webp`
        }
        alt='banner'
        width={isMobile ? 600 : 1920}
        height={isMobile ? 400 : 800}
        objectFit={isMobile ? 'cover' : 'fill'}
        className='object-contain w-full h-full object-bottom'
      />

      <div className='absolute inset-0 bg-black/50 z-0' />

      {/* Centered content */}
      <div className='absolute top-[55%] left-1/2 z-10 p-2 md:p-10 w-full md:max-w-7xl text-center transform -translate-x-1/2 -translate-y-1/2'>
        {title && (
          <h1 className='font-serif text-sm md:text-xl mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-center text-transparent'>
            {title}
          </h1>
        )}

        {content && (
          <h3 className='text-white text-center text-base md:text-xl max-w-2xl mx-auto italic md:leading-7 w-full mt-5'>
            “{content}”
          </h3>
        )}

        {cta && (
          <div
            className='flex items-center justify-center cursor-pointer gap-4 bg-[var(--grey15)] rounded-full px-5 py-2 max-w-fit mx-auto border border-[var(--grey15)] mt-8 h-11'
            onClick={onCtaClick}
          >
            <span>
              <Image
                src={`${process.env.IMAGE_DOMAIN}/arrow_Down_Two_e9e790a739.svg`}
                alt='arrow down'
                width={10}
                height={10}
              />
            </span>
            <span className='text-white text-sm font-semibold'>{cta}</span>
            <span>
              <Image
                src={`${process.env.IMAGE_DOMAIN}/arrow_Down_Two_e9e790a739.svg`}
                alt='arrow down'
                width={10}
                height={10}
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerSection;
