'use client';

import React, { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import BannerSection from './BannerSection';
import { BankOfferCardsLayoutProps, BankOfferPageProps } from 'bank-offer-page';
import BankOfferCardsLayout from './BankOfferCardsLayout';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import Svg from '@/components/common/Shared/Svg';
import SecureBookingBanner from '@/components/common/SecureBookingBanner';
import MobileHeader from '@/components/common/MobileHeader';

const BankPageDetail: React.FC<BankOfferPageProps> = ({
  template,
  modalContentHeight,
  modalContentWidth,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [open, setOpen] = useState(false);

  const showMore = 'Show more';

  return (
    <>
      {isTablet && <MobileHeader title={template?.bankOfferBannerHeading} />}
      <BannerSection
        bankOfferBanner={template?.bankOfferBanner}
        bankOfferBannerHeading={template?.bankOfferBannerHeading}
        bankOfferBannerLogo={template?.bankOfferBannerLogo}
      />

      <div className='px-5 md:px-10 py-10'>
        <h2 className='text-2xl md:text-3xl text-center text-foreground font-serif pb-8'>
          {template?.bankOfferCardLayoutTitle}
        </h2>

        <div className='flex gap-4 overflow-x-auto xl:overflow-x-visible xl:pr-10 no-scrollbar'>
          {template?.bankOfferCardsLayout?.map(
            (layout: BankOfferCardsLayoutProps, index: number) => (
              <div key={index} className='min-w-[60%] lg:min-w-1/4'>
                <BankOfferCardsLayout
                  bankOfferCardsLayoutContent={
                    layout?.bankOfferCardsLayoutContent
                  }
                  bankOfferCardsLayoutLogoSmall={
                    layout?.bankOfferCardsLayoutLogoSmall
                  }
                />
              </div>
            )
          )}
        </div>
        <p className='text-center mt-8'>
          <span
            className='font-semibold text-lg underline cursor-pointer'
            style={{ color: 'var(--blue3)' }}
            onClick={() => setOpen(true)}
          >
            {showMore}
          </span>
        </p>
      </div>

      <div className=' w-full'>
        <SecureBookingBanner className='justify-center' />
      </div>

      <ResponsiveDialogDrawer
        title='Applicable Axis Bank credit cards'
        open={open}
        setOpen={setOpen}
        contentClassName='sm:max-w-[792px]!'
      >
        <div className='relative h-[500px] overflow-y-auto px-4'>
          <Svg
            src={template?.bankOfferModalImageData || ''}
            width={modalContentWidth || '766'}
            height={modalContentHeight || '1197'}
            className='w-full h-auto'
          />
        </div>
      </ResponsiveDialogDrawer>
    </>
  );
};

export default BankPageDetail;
