import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import { Quote } from '@/contexts/property';
import { trackEvent } from '@/lib/mixpanel';
import { cn, formatPrice } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { Offer } from 'villa-types';

interface CouponCardProps {
  offer: Offer;
  nightCount: number;
  onApply?: (code: string) => void;
  appliedCoupon?: null | Offer;
  placement?: 'embed' | 'dialog';
  isDiscountApplied?: boolean;
  onRemove?: () => void;
  onRemoveCustomCoupon?: () => void;
  disabled?: boolean;
  discountAmount?: null | number;
  quotes?: Quote;
  hideApplyButton?: boolean;
  pageName?: string;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  offer,
  nightCount,
  onApply,
  onRemove = () => {},
  onRemoveCustomCoupon = () => {},
  isDiscountApplied = false,
  disabled = false,
  placement = 'dialog',
  appliedCoupon = null,
  discountAmount = null,
  quotes,
  hideApplyButton = false,
  pageName,
}) => {
  const isValidNight = nightCount >= (offer.minimumNights ?? 0);
  const muted = !isValidNight;
  const nightsNeeded = (offer.minimumNights ?? 0) - nightCount;

  const {
    isBankOfferLoading,
    isCustomCouponLoading,
    setCustomCoupon,
    customCoupon,
  } = useCouponContext();

  const handleApply = () => {
    if (!muted && onApply) {
      onApply(offer.code);
      trackEvent('apply_clicked', {
        coupon_code: offer.code,
        coupon_name: offer.title,
        coupon_type: 'apply',
        page_name: pageName,
      });
    }
  };

  const handleRemoveCustomCoupon = () => {
    setCustomCoupon(null);
    onRemoveCustomCoupon();
  };

  return placement == 'embed' ? (
    <>
      <div className='flex justify-between items-center rounded-2xl border border-secondary-200 px-4 py-3 dark:border-[var(--prive6)] dark:bg-[var(--grey7)] '>
        {isDiscountApplied && quotes?.paymentDiscountAmount ? (
          <>
            <div>
              <p className='text-sm mb-1'>
                Saved{' '}
                <span className='font-semibold'>
                  ₹ {formatPrice(quotes?.paymentDiscountAmount)}
                </span>{' '}
                with
              </p>
              <p className='text-xs font-bold text-primary-400 tracking-wide dark:text-accent-green-500'>
                {appliedCoupon?.code}
              </p>
            </div>
            {!hideApplyButton && (
              <button
                className='text-sm font-semibold text-accent-green-700 dark:text-accent-green-500 cursor-pointer'
                onClick={() => {
                  onRemove();
                }}
              >
                {isBankOfferLoading.isLoading &&
                isBankOfferLoading.code === quotes?.bankOfferCode &&
                isBankOfferLoading.action === 'remove'
                  ? 'Removing'
                  : 'Remove'}
              </button>
            )}
          </>
        ) : (
          <>
            <div>
              <p className='text-sm mb-1'>
                Save upto{' '}
                <span className='font-semibold'>
                  ₹ {formatPrice(offer?.maximumDiscountAllowed)}
                </span>{' '}
                with
              </p>
              <p className='text-xs font-bold text-primary-400 tracking-wide'>
                {offer?.code}
              </p>
            </div>
            {!hideApplyButton && (
              <button
                className={cn(
                  'text-sm font-semibold cursor-pointer ',
                  muted
                    ? 'text-secondary-700 '
                    : 'text-accent-red-900 dark:text-[var(--accent-yellow-950)]'
                )}
                disabled={muted}
                onClick={handleApply}
              >
                {isBankOfferLoading.isLoading &&
                isBankOfferLoading.code === offer.code &&
                isBankOfferLoading.action === 'apply'
                  ? 'Applying'
                  : 'Apply'}
              </button>
            )}
          </>
        )}
      </div>
      {quotes?.couponCode && customCoupon && (
        <div className='flex justify-between items-center rounded-2xl border border-secondary-200 px-4 py-3 dark:border-[var(--prive6)] dark:bg-[var(--grey7)]'>
          <div>
            <p className='text-sm mb-1'>
              Saved{' '}
              <span className='font-semibold'>
                ₹ {formatPrice(quotes?.couponDiscountAmount)}
              </span>{' '}
              with
            </p>
            <p className='text-xs font-bold text-primary-400 tracking-wide dark:text-accent-green-500'>
              {quotes?.couponCode}
            </p>
          </div>
          {!hideApplyButton && (
            <button
              className='text-sm font-semibold text-accent-green-700 cursor-pointer dark:text-accent-green-500'
              onClick={handleRemoveCustomCoupon}
            >
              {isCustomCouponLoading.isLoading &&
              isCustomCouponLoading.code ===
                quotes?.couponCode?.toLocaleLowerCase() &&
              isCustomCouponLoading.action === 'remove'
                ? 'Removing'
                : 'Remove'}
            </button>
          )}
        </div>
      )}
    </>
  ) : (
    <div
      className={cn(
        'flex flex-col justify-between rounded-2xl border px-4 py-3 min-h-[110px]',
        muted
          ? 'border-muted-200 text-muted-foreground bg-muted/30  dark:bg-[var(--grey6)] dark:border-secondary-950'
          : 'border-border bg-white dark:bg-background dark:border-secondary-950',
        isDiscountApplied && 'border-1 border-accent-red-900'
      )}
    >
      <div className='flex items-start justify-between gap-2 mb-2'>
        <div className='flex items-center gap-2 '>
          <span className='rounded border px-2 py-0.5 text-xs font-semibold uppercase dark:bg-white flex items-center justify-center'>
            {offer?.icon && (
              <Image
                src={offer.icon}
                alt='offer-logo'
                width={28}
                height={28}
                className='w-8'
              />
            )}
          </span>
          <span className='typography-label-semibold tracking-wide'>
            {offer.code}
          </span>
        </div>
        {!hideApplyButton && (
          <button
            className={cn(
              'text-sm font-semibold cursor-pointer focus:outline-none',
              muted
                ? 'text-secondary-700'
                : 'text-accent-red-900 dark:text-[var(--accent-background)] '
            )}
            disabled={muted}
            onClick={() => {
              if (disabled) return;

              if (isDiscountApplied && isBankOfferLoading.code === offer.code) {
                trackEvent('apply_clicked', {
                  coupon_code: offer.code,
                  coupon_name: offer.title,
                  cta_type: 'remove',
                  page_name: pageName,
                });
                onRemove();
              } else {
                handleApply();
              }
            }}
          >
            {isDiscountApplied && isBankOfferLoading.code === offer.code
              ? isBankOfferLoading.isLoading &&
                isBankOfferLoading.code === offer.code &&
                isBankOfferLoading.action === 'remove'
                ? 'Removing'
                : 'Remove'
              : isBankOfferLoading.isLoading &&
                  isBankOfferLoading.code === offer.code &&
                  isBankOfferLoading.action === 'apply'
                ? 'Applying'
                : 'Apply'}
          </button>
        )}
      </div>

      {!isValidNight && muted && (
        <p
          className={cn(
            'typography-small-semibold mb-2',
            'text-accent-yellow-500'
          )}
        >
          Add {nightsNeeded} more night to avail this offer
        </p>
      )}

      {isDiscountApplied ? (
        <p className='text-sm mb-1 font-semibold text-accent-green-700 dark:text-accent-green-500'>
          Saving ₹ {formatPrice(discountAmount)} on this booking
        </p>
      ) : (
        <p
          className={cn(
            'typography-small-semibold mb-2',
            muted
              ? 'text-secondary-700'
              : 'text-accent-green-700 dark:text-accent-green-500'
          )}
        >
          {offer.description}
        </p>
      )}

      <p className='typography-xs-regular border-t pt-2 dark:border-secondary-950'>
        Book {offer?.minimumNights} nights or more and save with code{' '}
        {offer?.code}
      </p>
    </div>
  );
};
