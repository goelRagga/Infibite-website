'use client';

import CouponAppliedSvg from '@/assets/CouponApplied.svg';
import CouponFailedSvg from '@/assets/CouponFailed.svg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { getGraphQLErrorMessage } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

const CouponDiscountPopUp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showError, setShowError] = useState(true);
  const [latestDiscount, setLatestDiscount] = useState<{
    discountAmount: number;
  } | null>(null);

  const {
    appliedBankOffers,
    appliedCoupons,
    isCouponError,
    isCouponErrorMessage,
    prevBankOffer,
    bankOffer,
    customCoupon,
    prevCustomCoupon,
    shownCouponsRef,
    shownBankOffersRef,
    shownErrorsRef,
    setIsCouponError,
    setIsCouponErrorMessage,
  } = useCouponContext();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  const showPopup = (discount: any, isError = false, duration = 2000) => {
    setLatestDiscount(isError ? null : discount);
    setShowError(isError);
    setTimeout(() => {
      setOpen(true);
    }, 500);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Only auto-close for success cases, not for errors
    if (!isError) {
      timerRef.current = setTimeout(() => setOpen(false), duration);
    }
  };

  const generateCouponId = (coupon: any) => {
    return `${coupon?.code}-${coupon?.discountAmount || 0}`;
  };

  const generateBankOfferId = (offer: any) => {
    return `${offer?.code}-${offer?.discountAmount || 0}`;
  };

  useEffect(() => {
    if (!appliedCoupons?.length) {
      shownCouponsRef.current.clear();
    }
  }, [appliedCoupons]);

  useEffect(() => {
    if (!appliedBankOffers?.length) {
      shownBankOffersRef.current.clear();
    }
  }, [appliedBankOffers]);

  useEffect(() => {
    if (!isFirstRender.current && appliedBankOffers?.length) {
      const latestOffer = appliedBankOffers[appliedBankOffers.length - 1];
      const offerId = generateBankOfferId(latestOffer);
      if (
        latestOffer?.discountAmount > 0 &&
        !shownBankOffersRef.current.has(offerId)
      ) {
        shownBankOffersRef.current.add(offerId);
        showPopup(latestOffer);
      }
    }
  }, [appliedBankOffers, bankOffer]);

  useEffect(() => {
    if (!isFirstRender.current && appliedCoupons?.length) {
      const latestCoupon = appliedCoupons[appliedCoupons.length - 1];
      const couponId = generateCouponId(latestCoupon);

      if (
        latestCoupon?.discountAmount > 0 &&
        !shownCouponsRef.current.has(couponId)
      ) {
        shownCouponsRef.current.add(couponId);
        showPopup(latestCoupon);
      }
    }
  }, [appliedCoupons, customCoupon]);

  useEffect(() => {
    if (!isFirstRender.current && isCouponError && isCouponErrorMessage) {
      const errorId = String(isCouponErrorMessage);

      if (!shownErrorsRef.current.has(errorId)) {
        shownErrorsRef.current.add(errorId);
        showPopup(null, true, 4000);
      }
    }
  }, [isCouponError, isCouponErrorMessage]);

  useEffect(() => {
    if (!isCouponError) {
      shownErrorsRef.current.clear();
    }
  }, [isCouponError]);

  useEffect(() => {
    isFirstRender.current = false;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setShowError(false);
      setIsCouponError(false);
      setIsCouponErrorMessage(null);
    }, 500);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const discountText = `₹${(
    latestDiscount?.discountAmount || 0
  ).toLocaleString()}`;

  const PopupContent = () => (
    <div className='relative bg-white rounded-lg p-6 border-0 text-center overflow-hidden dark:bg-background '>
      <div className='flex justify-center mb-4'>
        {showError ? <CouponFailedSvg /> : <CouponAppliedSvg />}
      </div>
      <h2
        className={`text-sm mb-2 ${
          showError
            ? 'text-accent-red-600 text-lg font-semibold dark:text-[var(--accent-background)]'
            : 'text-gray-600 dark:text-white'
        }`}
      >
        {showError
          ? 'Oops! Coupon Application Failed'
          : 'You successfully saved'}
      </h2>
      {!showError && (
        <>
          <div className='text-2xl font-semibold text-accent-green-700 dark:text-accent-green-500 mb-2'>
            {discountText}
          </div>
          <p className='text-gray-500 text-sm mb-6 dark:text-white'>
            Enjoy your booking with the added savings!
          </p>
        </>
      )}
      {showError && (
        <p className='text-gray-600 text-sm mb-6 dark:text-white'>
          {getGraphQLErrorMessage(isCouponErrorMessage) ||
            'Something went wrong. Check the code and try again or explore other offers'}
        </p>
      )}
      <Button
        onClick={handleClose}
        className={`w-1/2 ${
          showError
            ? 'bg-gray-800 hover:bg-gray-900 dark:bg-[var(--accent-background)] dark:hover:bg-[var(--accent-background)]  dark:text-white'
            : 'bg-[#2C1F1E] hover:bg-[#2C1F1E] dark:bg-[var(--accent-background)]  dark:hover:bg-[var(--accent-background)]  dark:text-white'
        } text-white rounded-full py-2 px-6 cursor-pointer`}
      >
        {showError ? 'Retry' : 'Continue'}
      </Button>
    </div>
  );

  const MobileContent = () => (
    <div className='p-6 text-center'>
      <div className='flex justify-center mb-4'>
        {showError ? <CouponFailedSvg /> : <CouponAppliedSvg />}
      </div>
      <h2
        className={`text-sm mb-2 ${
          showError
            ? 'text-accent-red-600 text-lg font-semibold dark:text-[var(--accent-background)]'
            : 'text-gray-600  dark:text-white'
        }`}
      >
        {showError
          ? 'Oops! Coupon Application Failed'
          : 'You successfully saved'}
      </h2>
      {!showError && (
        <>
          <div className='text-2xl font-semibold text-green-600 mb-2'>
            {discountText}
          </div>
          <p className='text-gray-500 text-sm mb-6  dark:text-white'>
            Enjoy your booking with the added savings!
          </p>
        </>
      )}
      {showError && (
        <p className='text-gray-600 text-sm mb-6  dark:text-white'>
          {getGraphQLErrorMessage(isCouponErrorMessage) ||
            'Something went wrong. Check the code and try again or explore other offers'}
        </p>
      )}
      <Button
        onClick={handleClose}
        className='w-full bg-gray-800 hover:bg-gray-900 text-white rounded-full py-2 px-6 dark:bg-[var(--accent-background)]  dark:hover:bg-[var(--accent-background)]  dark:text-white'
      >
        {showError ? 'Retry' : 'Continue'}
      </Button>
    </div>
  );

  return isTablet ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='sr-only'>
            {showError ? 'Coupon Error' : 'Coupon Success'}
          </DrawerTitle>
        </DrawerHeader>
        <MobileContent />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className={'backdrop-blur-[2px]!'} />
      <DialogContent className='sm:max-w-[400px] p-0 border-0 bg-transparent shadow-none dark:bg-background'>
        <DialogHeader className='sr-only'>
          <h2>{showError ? 'Coupon Error' : 'Coupon Success'}</h2>
        </DialogHeader>
        <PopupContent />
      </DialogContent>
    </Dialog>
  );
};

export default CouponDiscountPopUp;
