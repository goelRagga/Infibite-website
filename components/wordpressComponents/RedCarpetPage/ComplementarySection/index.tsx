'use client';
import CustomImage from '@/components/common/CustomImage';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';
import React from 'react';
import { RedCarpetPageProps } from 'red-carpet';

const ComplementarySection: React.FC<RedCarpetPageProps> = ({
  data,
  winbackData,
}) => {
  const claimedOfferId = winbackData?.claim?.offerId;
  // Normalize data access - handle nested structure
  const normalizedData = data?.RedCarpentPageContent || data;
  return (
    <div className='pt-8 md:pt-20 pb-5'>
      <h2 className='text-white text-xl md:text-3xl font-serif text-center'>
        {normalizedData?.benefitsCardsRepeater?.title ||
          RED_CARPET_PAGE_CONTENT?.complementarySection?.title}
      </h2>
      <div className='flex items-center justify-center gap-3 pt-4 md:pt-10'>
        {claimedOfferId || winbackData?.claim ? (
          <p className='text-xs font-semibold text-accent-yellow-500 text-center px-4 max-w-md'>
            {RED_CARPET_PAGE_CONTENT?.complementarySection?.successMessage}
          </p>
        ) : (
          <>
            <div className='h-px w-20 md:w-65 bg-gradient-to-r from-[rgba(218,159,24,0.1)] to-[rgba(255,255,255,0.1)]' />
            <div className='flex items-center justify-center gap-2 text-sm text-accent-yellow-500'>
              <span>
                <CustomImage
                  src={`${process.env.IMAGE_DOMAIN}/Star_0b6b31ab90.svg`}
                  alt='star'
                  width={12}
                  height={12}
                />
              </span>
              <span>
                {RED_CARPET_PAGE_CONTENT?.complementarySection?.selectAnyOne}
              </span>
              <span>
                <CustomImage
                  src={`${process.env.IMAGE_DOMAIN}/Star_0b6b31ab90.svg`}
                  alt='star'
                  width={12}
                  height={12}
                />
              </span>
            </div>
            <div className='h-px w-20 md:w-65 bg-gradient-to-l from-[rgba(218,159,24,0.1)] to-[rgba(255,255,255,0.1)]' />
          </>
        )}
      </div>
    </div>
  );
};

export default ComplementarySection;
