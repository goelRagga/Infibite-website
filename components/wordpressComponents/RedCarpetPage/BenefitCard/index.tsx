import { Button } from '@/components/ui/button';
import React from 'react';
import Lock from '@/assets/lock.svg';
import { RedCardpetBenefitProps } from 'red-carpet';
import Ribbon from '@/assets/ribbon.svg';
import Image from 'next/image';
import { RED_CARPET_PAGE_CONTENT } from '@/lib/constants';

const RedCardpetBenefit: React.FC<RedCardpetBenefitProps> = ({
  content,
  onUnlockClick,
  isClaimed = false,
  isCenterSlide = false,
  hasAnyClaimed = false,
}) => {
  const handleClick = () => {
    if (onUnlockClick && content && !isClaimed) {
      onUnlockClick(content);
    }
  };

  const getDescriptionArray = (): string[] => {
    if (!content?.description) return [];

    if (Array.isArray(content.description) && content.description.length > 0) {
      const firstItem = content.description[0];

      if (
        typeof firstItem === 'string' &&
        firstItem.startsWith('[') &&
        firstItem.endsWith(']')
      ) {
        try {
          const parsed = JSON.parse(firstItem);
          return Array.isArray(parsed) ? parsed : [firstItem];
        } catch {
          return content.description;
        }
      }

      return content.description;
    }

    return [];
  };

  const descriptionPoints = getDescriptionArray();
  return (
    <div
      className={`rounded-[20px] ${
        isClaimed ? 'p-[1px] ' : 'border border-accent-red-900'
      } ${isCenterSlide && !isClaimed ? 'bg-accent-red-950' : ''}`}
      style={{
        ...(isClaimed
          ? {
              background: 'linear-gradient(180deg, #8C4500 0%, #D1A66E 100%)',
            }
          : {
              borderColor:
                !isClaimed && isCenterSlide
                  ? 'var(--accent-red-950)'
                  : !isClaimed
                    ? 'var(--black1)'
                    : 'var(--black1)!',
            }),
      }}
    >
      <div
        className={`rounded-[20px] pl-6 pr-6 pt-6 pb-6 ${isClaimed ? '' : ''}`}
        style={{
          background: isClaimed
            ? '#1B0107'
            : isCenterSlide
              ? 'var(--accent-red-950)'
              : 'var(--black1)',
        }}
      >
        <div>
          <Image
            src={
              content?.icon ||
              `${process.env.IMAGE_DOMAIN}/Coupons_463060f8ff.svg`
            }
            alt='benefit'
            width={50}
            height={30}
            className=''
          />
        </div>
        <div className='mt-8'>
          <h2 className='text-2xl font-serif text-white max-w-[230px]'>
            {content?.title}
          </h2>
          <hr className='my-4 border-[var(--white10)]' />
        </div>
        <div className='h-28'>
          <ul className='space-y-2'>
            {descriptionPoints.map((point: string, index: number) => (
              <li
                key={index}
                className='flex items-center gap-2 text-[10px] text-white'
              >
                <span className='w-3 h-3'>
                  <Image
                    src={`${process.env.IMAGE_DOMAIN}/plus_Sign_bc094e8ddf.svg`}
                    alt='plus sign'
                    width={10}
                    height={10}
                  />
                </span>
                <span className='leading-[1.4]'>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='mt-10 relative'>
          {isClaimed ? (
            <div className='absolute -bottom-10 left-1/2 -translate-x-1/2 flex justify-center'>
              <div className='w-[150px] md:w-[180px]'>
                <Image
                  src={`${process.env.IMAGE_DOMAIN}/ribbon_575a6133a0.svg`}
                  alt='ribbon'
                  width={400}
                  height={400}
                />
              </div>
            </div>
          ) : hasAnyClaimed ? null : (
            <Button
              variant='outline'
              className='border-1 border-white text-white rounded-full w-full font-semibold bg-transparent hover:bg-transparent hover:text-white'
              onClick={handleClick}
            >
              {RED_CARPET_PAGE_CONTENT?.benefitCard?.unlockThis}{' '}
              <span>
                <Image
                  src={`${process.env.IMAGE_DOMAIN}/lock_4b71bca0dd.svg`}
                  alt='lock'
                  width={10}
                  height={10}
                />
              </span>
            </Button>
          )}
          <span className=' text-white text-[8px] absolute -bottom-5 -right-2'>
            {RED_CARPET_PAGE_CONTENT?.benefitCard?.tAndCApply}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RedCardpetBenefit;
