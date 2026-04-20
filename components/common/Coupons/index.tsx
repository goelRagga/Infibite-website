import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { useCouponContext } from '@/contexts/coupons/useCouponContext';
import { useFilters } from '@/hooks/filters';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useURLParams } from '@/hooks/useURLParams';
import { calculateNights } from '@/lib/dateUtils';
import { findCouponByCode, sortByExactMatchThenDescending } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Offer } from 'villa-types';
import { CouponCard } from './CouponCard';
import { CouponContent } from './CouponContent';
import { CouponsProps } from './CouponTypes';
import { ArrowLeft } from 'lucide-react';
import { trackEvent } from '@/lib/mixpanel';

const Coupons: React.FC<CouponsProps> = ({
  trigger,
  isOpen,
  onOpenChange,
  offers,
  quotes,
  propertyId,
  propertyName,
  pageName,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { getParam } = useURLParams();
  const checkinDate = getParam('checkinDate');
  const checkoutDate = getParam('checkoutDate');
  const nightCount =
    checkinDate && checkoutDate
      ? calculateNights(checkinDate, checkoutDate)
      : 0;

  const isCouponCode = getParam('couponCode');
  const handleClose = () => onOpenChange(false);
  const handleViewAll = () => onOpenChange(true);
  const handleAddCoupon = () => onOpenChange(true);

  const { setBankOffer, setCustomCoupon } = useCouponContext();
  const [sortedOffers, setSortedOffers] = useState(offers);
  const [couponApplied, setCouponApplied] = useState<Offer | null>(null);

  const { filters } = useFilters();
  const { bankOffer, customCoupon } = useCouponContext();

  const stayLength =
    filters.checkinDate && filters.checkoutDate
      ? differenceInDays(filters.checkoutDate, filters.checkinDate)
      : 0;

  const handleCouponApply = (code: string) => {
    setBankOffer(code);
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  const handleApply = (code: string) => {
    setCustomCoupon(code);
    setTimeout(() => {
      onOpenChange(false);
    }, 500);
  };

  const handleRemoveCustomCoupon = () => {
    setCustomCoupon(null);
  };

  useEffect(() => {
    // Sort Offers
    if (filters.checkinDate && filters.checkoutDate) {
      setSortedOffers(
        offers
          .map((offer, index) => ({ offer, index }))
          .toSorted((a, b) => {
            const result = sortByExactMatchThenDescending(stayLength)(
              a.offer.minimumNights,
              b.offer.minimumNights
            );

            // If they have the same value, maintain original order
            if (a.offer.minimumNights === b.offer.minimumNights) {
              return a.index - b.index;
            }

            return result;
          })
          .map(({ offer }) => offer)
      );
    }
  }, [offers, filters?.checkinDate, filters.checkoutDate]);

  useEffect(() => {
    // Set Default Coupon To Show
    if (quotes?.bankOfferCode) {
      const couponToBeApplied = findCouponByCode(sortedOffers, bankOffer) || {
        code: quotes?.bankOfferCode,
        // TODO:GET FIELD FROM QUOTES
        minimumNights: 0,
        discountMethod: 'BANK',
        discountAmount: quotes?.paymentDiscountAmount,
        discountPercentage: quotes?.paymentDiscountPercentage,
      };

      if (couponToBeApplied) {
        setCouponApplied(
          (prev) => ({ ...prev, ...couponToBeApplied }) as Offer
        );
      }
    } else {
      setCouponApplied(sortedOffers[0]);
    }
  }, [sortedOffers, quotes?.bankOfferCode]);

  return (
    <>
      <div>
        {trigger ||
          (!isTablet && (
            <div className='flex flex-col gap-4 p-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-serif font-medium'>
                  Discount Coupon
                </h3>
                <Button
                  variant='outline'
                  className='px-4 py-1 border-accent-red-900 text-accent-red-900 hover:bg-primary-50 dark:text-accent-yellow-950 dark:border-accent-yellow-950 dark:bg-[var(--grey7)] dark:hover:bg-[var(--black5)]'
                  onClick={() => {
                    trackEvent('view_all_offers_clicked', {
                      page_name: pageName,
                      property_id: propertyId,
                      property_name: propertyName,
                    });
                    handleViewAll();
                  }}
                >
                  View All
                </Button>
              </div>

              <CouponCard
                pageName={pageName}
                key={couponApplied ? couponApplied?.code : 'default'}
                offer={couponApplied ? couponApplied : sortedOffers[0]}
                nightCount={nightCount}
                onApply={handleCouponApply}
                isDiscountApplied={couponApplied != null}
                placement='embed'
                appliedCoupon={couponApplied}
                quotes={couponApplied ? quotes : null}
                onRemove={() => {
                  setBankOffer(null);
                }}
                onRemoveCustomCoupon={handleRemoveCustomCoupon}
              />

              {!isCouponCode && (
                <div className='flex justify-between items-center'>
                  <p className='text-sm'>Got a coupon code?</p>
                  <button
                    className='text-sm font-semibold text-accent-red-900 underline cursor-pointer dark:text-accent-yellow-950'
                    onClick={handleAddCoupon}
                  >
                    Add Coupon
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {isTablet ? (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            side='bottom'
            className='h-[100dvh] flex flex-col bg-[var(--white3)] [&>button]:hidden dark:bg-background'
          >
            {!isMobile && <DialogOverlay className={'backdrop-blur-[2px]!'} />}
            <SheetHeader className='p-0 flex-shrink-0'>
              <SheetTitle className='flex items-center justify-center font-serif typography-title-regular  border-secondary-400 py-3 text-primary-950 dark:text-white '>
                <ArrowLeft
                  className='absolute left-[20px]'
                  onClick={handleClose}
                />
                Discount Coupons
              </SheetTitle>
            </SheetHeader>
            <div className='flex-1 px-4 overflow-hidden'>
              <CouponContent
                offers={offers}
                nightCount={nightCount}
                onClose={handleClose}
                onApply={handleApply}
                onCouponApply={handleCouponApply}
                isDiscountApplied={couponApplied != null}
                discountAmount={
                  couponApplied ? quotes?.paymentDiscountAmount : null
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogOverlay className={'backdrop-blur-[2px]!'} />
          <DialogContent className='sm:max-w-3xl h-[80dvh] flex flex-col rounded-2xl bg-[var(--white3)]  dark:bg-background border-none'>
            <DialogHeader>
              <DialogTitle className='flex items-center justify-between font-serif typography-h3 dark:text-white'>
                Discount Coupons
              </DialogTitle>
            </DialogHeader>
            <div className='flex-1 overflow-hidden'>
              <CouponContent
                offers={offers}
                nightCount={nightCount}
                onClose={handleClose}
                onApply={handleApply}
                onCouponApply={handleCouponApply}
                isDiscountApplied={couponApplied != null}
                discountAmount={
                  couponApplied ? quotes?.paymentDiscountAmount : null
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
export default Coupons;
