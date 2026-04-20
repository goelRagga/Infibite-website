import React from 'react';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';
import CustomImage from '@/components/common/CustomImage';
import Link from 'next/link';

interface UnlockCardProps {
  title?: string;
  icon?: string;
  onCtaClick?: (value: boolean) => void;
}

const UnlockCard: React.FC<UnlockCardProps> = ({ title, icon, onCtaClick }) => {
  return (
    <div>
      <div className='mt-6'>
        <CustomImage
          src={
            icon ||
            `${process.env.IMAGE_DOMAIN}/icon_Carpet_Form_ac13e69783.svg`
          }
          alt='benefit icon'
          width={80}
          height={80}
          imageType='svg'
          className='w-12 h-12'
        />
        <div className='pt-6'>
          <h4 className='text-xl font-serif pb-2'>
            {RED_CARPET_PAGE_CONTENT?.benefitUnlockedSection?.title}
          </h4>
          <p className='text-sm text-[var(--black4)] mt-2'>
            {RED_CARPET_PAGE_CONTENT?.benefitUnlockedSection?.content}
          </p>
          <div className='font-serif font-sm mb-24 mt-4 text-white flex items-center gap-3'>
            <div>
              <CustomImage
                src={
                  icon || `${process.env.IMAGE_DOMAIN}/Coupons_f5a7844037.png`
                }
                alt='benefit icon'
                width={20}
                height={20}
                imageType='svg'
              />
            </div>{' '}
            <p>{title}</p>
          </div>
          <Link
            className='border-1 border-white px-4 py-2 mb-4 rounded-full flex items-center justify-center cursor-pointer'
            href='/villas'
          >
            <span>{RED_CARPET_PAGE_CONTENT?.benefitUnlockedSection?.cta}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnlockCard;
