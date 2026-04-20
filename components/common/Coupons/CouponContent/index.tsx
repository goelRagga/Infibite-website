import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import { formatPrice } from '@/lib/utils';
import { TicketCheck } from 'lucide-react';
import React from 'react';
import { Offer } from 'villa-types';
import { CouponCard } from '../CouponCard';
import { CouponInput } from '../CouponInput';

interface CouponContentProps {
  offers: Offer[];
  nightCount: number;
  onClose: () => void;
  onApply: (code: string) => void;
  onCouponApply: (code: string) => void;
  isDiscountApplied?: boolean;
  disabled?: boolean;
  discountAmount?: null | number;
}

export const CouponContent: React.FC<CouponContentProps> = ({
  offers,
  nightCount,
  onClose,
  onApply,
  onCouponApply,
  isDiscountApplied = false,
  disabled = false,
  discountAmount = null,
}) => {
  const {
    bankOffer,
    customCoupon,
    setBankOffer,
    setCustomCoupon,
    appliedBankOffers,
    appliedCoupons,
  } = useCouponContext();

  const isBankOfferApplied = appliedBankOffers.length > 0;
  const isCustomCouponApplied = appliedCoupons.length > 0;
  const hasAnyCouponApplied = isBankOfferApplied || isCustomCouponApplied;

  const appliedBankOffer = isBankOfferApplied
    ? offers.find((offer) => offer.code === bankOffer)
    : null;

  const remainingBankOffers = isBankOfferApplied
    ? offers.filter((offer) => offer.code !== bankOffer)
    : offers;

  const bestOffers = hasAnyCouponApplied ? [] : offers.slice(0, 2);
  const moreOffers = hasAnyCouponApplied
    ? remainingBankOffers
    : offers.slice(2);

  return (
    <div className='flex flex-col h-full p-1 gap-6'>
      <CouponInput onApply={onApply} />

      <div className='flex-grow overflow-auto pr-2'>
        {hasAnyCouponApplied && (
          <div className='mb-6'>
            <p className='typography-label-regular mb-3'>APPLIED OFFERS</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {appliedBankOffer && (
                <CouponCard
                  key={appliedBankOffer.code}
                  offer={appliedBankOffer}
                  nightCount={nightCount}
                  onApply={onCouponApply}
                  isDiscountApplied={true}
                  discountAmount={
                    appliedBankOffers[appliedBankOffers.length - 1]
                      ?.discountAmount
                  }
                  onRemove={() => setBankOffer(null)}
                />
              )}

              {isCustomCouponApplied && (
                <div className='px-4 py-3 min-h-[110px] rounded-2xl bg-wite border border-accent-red-900 dark:bg-background dark:border-secondary-950'>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <div className='flex items-center gap-2'>
                      <span className='rounded border px-2 py-0.5 text-xs font-semibold uppercase dark:border-[var(--accent-background)]'>
                        <TicketCheck className='stroke-accent-red-900 dark:stroke-[var(--accent-background)]' />
                      </span>
                      <span className='typography-label-semibold tracking-wide'>
                        {appliedCoupons[0].code.toUpperCase()}
                      </span>
                    </div>
                    <button
                      className='text-sm font-semibold cursor-pointer text-accent-red-900 dark:text-[var(--accent-background)]'
                      onClick={() => {
                        setCustomCoupon(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <p className='text-sm mb-1 font-semibold text-accent-green-700 dark:text-accent-green-500'>
                    Saving ₹{' '}
                    {formatPrice(
                      appliedCoupons[appliedCoupons.length - 1]?.discountAmount
                    )}{' '}
                    on this booking
                  </p>
                  <p className='typography-xs-regular border-t pt-2 dark:border-secondary-950'>
                    Available only for selected partners
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!hasAnyCouponApplied && bestOffers.length > 0 && (
          <div className='mb-6'>
            <p className='typography-label-regular mb-3'>BEST OFFERS</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {bestOffers.map((offer) => (
                <CouponCard
                  key={offer.code}
                  offer={offer}
                  nightCount={nightCount}
                  onApply={onCouponApply}
                  isDiscountApplied={false}
                  discountAmount={discountAmount}
                  onRemove={() => setBankOffer(null)}
                />
              ))}
            </div>
          </div>
        )}

        {moreOffers.length > 0 && (
          <div>
            <p className='typography-label-regular mb-3'>
              {hasAnyCouponApplied ? 'MORE OFFERS' : 'MORE OFFERS'}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {moreOffers.map((offer) => (
                <CouponCard
                  key={offer.code}
                  offer={offer}
                  nightCount={nightCount}
                  onApply={onCouponApply}
                  isDiscountApplied={false}
                  discountAmount={null}
                  onRemove={() => setBankOffer(null)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
