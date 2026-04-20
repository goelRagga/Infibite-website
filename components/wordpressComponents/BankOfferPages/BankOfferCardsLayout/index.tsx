'use client';

import React from 'react';
import { BankOfferCardsLayoutProps } from 'bank-offer-page';
import Svg from '@/components/common/Shared/Svg';

const BankOfferCardsLayout: React.FC<BankOfferCardsLayoutProps> = ({
  bankOfferCardsLayoutContent,
  bankOfferCardsLayoutLogoSmall,
}) => {
  return (
    <div
      className='p-3 md:p-6 flex w-full items-center'
      style={{ background: 'var(--white5)' }}
    >
      <div className='w-4/5 pr-2'>
        <p className='text-xs md:text-base text-foreground'>
          {bankOfferCardsLayoutContent}
        </p>
      </div>
      <div className='w-1/5'>
        <Svg
          src={bankOfferCardsLayoutLogoSmall || ''}
          width='45'
          height='47'
          className='h-[20px] md:h-[58px]'
        />
      </div>
    </div>
  );
};

export default BankOfferCardsLayout;
