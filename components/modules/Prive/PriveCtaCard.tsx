import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import { PRIVE_PROPERTIES_LIST_ROUTE } from '@/lib/constants';
import { PriveEscapeCurationContent } from 'api-types';
import { trackEvent } from '@/lib/mixpanel';

export interface PriveCtaCardProps {
  data: PriveEscapeCurationContent;
  className?: string;
  verticalPosition?: number;
}

const PriveCtaCard: React.FC<PriveCtaCardProps> = ({
  data,
  className = '',
  verticalPosition,
}) => {
  const heading = data?.heading;
  const body1 = data?.body1;
  const body2 = data?.body2;
  const buttonText = data?.buttonText;

  const handlePlanYourStayPriveClick = () => {
    trackEvent('plan_your_stay', {
      page_name: 'prive',
    });
  };

  return (
    <Card
      className={`relative isolate border-[1px] border-[color:var(--primary-900)] bg-[color:var(--primary-950)] rounded-2xl flex flex-col items-start shadow-none w-full px-6 
        py-6 md:px-10 md:py-10 gap-4 md:gap-6 overflow-hidden ${verticalPosition && `vertical-position-${verticalPosition}`} ${className}`}
    >
      {/* Blur ellipse - top right (desktop only) */}
      <div
        className='absolute w-[753px] h-[204px] bg-[#EFBF8E] opacity-10 blur-[120px] -top-16 -right-32 z-0 hidden md:block'
        style={{ borderRadius: '50%' }}
      />

      {/* Blur ellipse - bottom left (desktop only) */}
      <div
        className='absolute w-[753px] h-[204px] bg-[#EFBF8E] opacity-10 blur-[120px] -bottom-16 -left-32 z-0 hidden md:block'
        style={{ borderRadius: '50%' }}
      />

      {/* Blur ellipse - bottom center (mobile only) */}
      <div
        className='absolute w-[753px] h-[204px] bg-[#EFBF8E] opacity-10 blur-[120px] -left-[153px] top-[159px] z-0 block md:hidden'
        style={{ borderRadius: '50%' }}
      />

      <h2 className='font-serif font-normal text-[20px] md:text-[32px] leading-[120%] md:leading-[100%] text-left text-[var(--prive2)] relative z-10'>
        {heading}
      </h2>
      <p className='font-sans font-normal text-[14px] md:text-[16px] leading-[140%] text-left text-[color:var(--primary-50)] relative z-10'>
        <span className='md:hidden'>
          {(body1 || '').split('. If')[0] + '.'}
        </span>
        <span className='hidden md:inline'>{body1}</span>
      </p>
      <p className='font-sans font-normal text-[14px] md:text-[16px] leading-[140%] text-left text-[color:var(--primary-50)] relative z-10'>
        {body2}
      </p>
      <Button
        asChild
        variant='prive-default'
        size='lg'
        className='mt-2 relative z-10'
        onClick={handlePlanYourStayPriveClick}
      >
        <Link href={PRIVE_PROPERTIES_LIST_ROUTE}>{buttonText}</Link>
      </Button>
    </Card>
  );
};

export default PriveCtaCard;
