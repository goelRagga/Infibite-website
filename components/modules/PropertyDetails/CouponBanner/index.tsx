import { formatPrice } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion';

interface AmountDetails {
  promotionCode?: string | null;
  promotionDiscountAmount?: number | null;
  couponCode?: string | null;
  couponDiscountAmount?: number | null;
  paymentDiscountAmount?: number | null;
  bankOfferCode?: string | null;
}

const CouponBanner = memo(
  ({
    isMobile,
    amountDetails,
  }: {
    isMobile: boolean;
    amountDetails: AmountDetails;
  }) => {
    const totalDiscountAmount =
      (amountDetails?.promotionDiscountAmount || 0) +
      (amountDetails?.couponDiscountAmount || 0) +
      (amountDetails?.paymentDiscountAmount || 0);

    if (totalDiscountAmount <= 0) {
      return null;
    }

    let primaryDisplayCode: string = '';
    let appliedOffersCount: number = 0;
    const appliedCodes: Set<string> = new Set();

    const addCodeIfApplied = (
      code: string | null | undefined,
      amount: number | null | undefined
    ) => {
      if (code && amount && amount > 0) {
        appliedCodes.add(code);
      }
    };

    if (
      amountDetails?.paymentDiscountAmount &&
      amountDetails.paymentDiscountAmount > 0
    ) {
      addCodeIfApplied(
        amountDetails.bankOfferCode || 'Bank Offer',
        amountDetails.paymentDiscountAmount
      );
      if (!primaryDisplayCode) {
        primaryDisplayCode = amountDetails.bankOfferCode || 'Bank Offer';
      }
    }

    if (
      amountDetails?.couponDiscountAmount &&
      amountDetails.couponDiscountAmount > 0
    ) {
      addCodeIfApplied(
        amountDetails.couponCode || 'Coupon',
        amountDetails.couponDiscountAmount
      );
      if (!primaryDisplayCode) {
        primaryDisplayCode = amountDetails.couponCode || 'Coupon';
      }
    }

    if (
      amountDetails?.promotionDiscountAmount &&
      amountDetails.promotionDiscountAmount > 0
    ) {
      addCodeIfApplied(
        amountDetails.promotionCode || 'Promotion',
        amountDetails.promotionDiscountAmount
      );
      if (!primaryDisplayCode) {
        primaryDisplayCode = amountDetails.promotionCode || 'Promotion';
      }
    }

    appliedOffersCount = appliedCodes.size;

    if (!primaryDisplayCode && appliedOffersCount > 0) {
      primaryDisplayCode = 'Applied Offers';
    }

    const offerDescription = (
      <>
        <span className='text-green-700 font-semibold dark:text-white'>
          {primaryDisplayCode}
        </span>
        {appliedOffersCount > 1 && (
          <span className='ml-1'>and +{appliedOffersCount - 1} more</span>
        )}
      </>
    );

    if (isMobile) {
      return (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='flex items-center justify-between bg-green-50 px-4 py-3 text-xs font-medium text-neutral-800 border-b border-green-100 cursor-pointer active:bg-green-100 dark:bg-accent-green-700 dark:border-none dark:text-white gap-2'
        >
          <div>
            Saved{' '}
            <span className='font-semibold text-black dark:text-white'>
              {formatPrice(totalDiscountAmount)}
            </span>{' '}
            with {offerDescription}
          </div>
          <span className='flex items-center gap-1 text-green-700 dark:text-white font-semibold underline whitespace-nowrap'>
            Apply offers <ArrowRight width={16} height={16} />
          </span>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='bg-green-50 text-sm text-center py-2 px-4 font-medium text-neutral-800 rounded-t-2xl dark:bg-accent-green-700 dark:text-white'
      >
        Saved{' '}
        <span className='font-semibold text-black dark:text-white'>
          {formatPrice(totalDiscountAmount)}
        </span>{' '}
        with {offerDescription}
      </motion.div>
    );
  }
);

CouponBanner.displayName = 'CouponBanner';

export default CouponBanner;
