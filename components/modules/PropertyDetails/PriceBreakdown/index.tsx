import { cn, formatPrice } from '@/lib/utils';

import ElicashIcon from '@/assets/elicash.svg';
import { includesTaxLine } from '@/lib/constants';

interface VasItem {
  id: string;
  basePrice: number;
  code: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image: string;
  name: string;
  gstAmount: number;
  __typename: string;
}

interface PriceBreakdownProps {
  priceData: any;
  mealCost?: number;
  primaryClass?: string;
}

const PriceBreakdown = ({
  priceData,
  mealCost,
  primaryClass,
}: PriceBreakdownProps) => {
  const renderPaidAmount = (amount: number | undefined | null | string) => {
    return (
      <div className='flex justify-between py-2 mt-2 border-t'>
        <span className='text-foreground text-sm font-medium dark:text-primary-100'>
          Amount Paid
        </span>
        <span className='text-foreground text-sm font-medium dark:text-primary-100'>
          ₹ {formatPrice(amount)}
        </span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'space-y-4 text-sm bg-card px-4 sm:px-5 py-4 rounded-xl dark:bg-[var(--black5)]',
        primaryClass
      )}
    >
      <h3 className='text-xl space-y-1 font-serif text-foreground'>
        Price Details
      </h3>

      <div className='space-y-1'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground dark:text-primary-100'>
            Base Price
            {priceData?.mealCost > 0 && (
              <span className='ml-1 text-xs'>(includes meal services)</span>
            )}
          </span>
          <span className='text-muted-foreground dark:text-primary-100'>
            ₹ {formatPrice(priceData?.originalNetAmountBeforeTax)}
          </span>
        </div>

        <p className='text-primary-400 text-xs font-semibold'>
          For {priceData?.numberOfNights}{' '}
          {priceData?.numberOfNights > 1 ? 'Nights' : 'Night'}
        </p>
      </div>

      {priceData?.villaDiscount && (
        <div className='flex justify-between text--accent-green-700'>
          <span>Villa Discount</span>
          <span className='dark:text-accent-green-500'>
            - ₹ {priceData?.villaDiscount}
          </span>
        </div>
      )}

      {priceData?.cancellationPlanInstantDiscountAmount > 0 && (
        <div className='space-y-1'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground dark:text-primary-100'>
              Cancellation Discount
            </span>
            <span className='text-accent-green-700 font-semibold dark:text-accent-green-500'>
              - ₹{' '}
              {formatPrice(priceData?.cancellationPlanInstantDiscountAmount)}
            </span>
          </div>
        </div>
      )}

      {(priceData?.promotionCode ||
        priceData?.bankOfferCode ||
        priceData?.couponCode) && (
        <div className='space-y-1'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground dark:text-primary-100'>
              Coupon Discounts
            </span>
            <span className='text-accent-green-700 font-semibold dark:text-accent-green-500'>
              - ₹{' '}
              {formatPrice(
                (priceData?.promotionDiscountAmount || 0) +
                  (priceData?.paymentDiscountAmount || 0) +
                  (priceData?.couponDiscountAmount || 0)
              )}
            </span>
          </div>

          {/* Discount codes list */}
          <div className='flex flex-col text-accent-green-700 font-semibold text-xs dark:text-accent-green-500'>
            {priceData?.promotionCode && (
              <span>{`Discount '${priceData.promotionCode}'`}</span>
            )}
            {priceData?.bankOfferCode && (
              <span>{`Discount '${priceData.bankOfferCode}'`}</span>
            )}
            {priceData?.couponCode && (
              <span>{`Discount '${priceData.couponCode}'`}</span>
            )}
          </div>
        </div>
      )}

      {(priceData?.vas?.length > 0 ||
        priceData?.valueAddedServices?.length > 0) &&
        priceData?.numberOfNights && (
          <div className='flex justify-between'>
            <div className='flex flex-col gap-0'>
              <span className='text-muted-foreground dark:text-primary-100'>
                Value Added Services
              </span>
              <span className='text-primary text-xs font-semibold flex flex-col gap-1'>
                {(priceData.vas?.length > 0
                  ? priceData.vas
                  : priceData.valueAddedServices
                ).map((vas: VasItem, index: number, arr: VasItem[]) => (
                  <span className='block' key={vas.id}>
                    {(vas.code || vas.name) + ' × ' + vas.quantity}
                    {index < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </span>
            </div>
            <span className='text-muted-foreground dark:text-primary-100'>
              ₹ {formatPrice(priceData?.netVasAmountBeforeTax)}
            </span>
          </div>
        )}

      {priceData?.addOns?.map((a: any, i: any) => (
        <div key={i} className='flex justify-between'>
          <div>
            <span>{a.label}</span>
            {a.description && (
              <p className='text-xs text-muted-foreground dark:text-primary-100'>
                {a.description}
              </p>
            )}
          </div>
          <span>₹ {formatPrice(a.amount)}</span>
        </div>
      ))}

      <div className='flex justify-between'>
        <span className='text-muted-foreground dark:text-primary-100'>GST</span>
        <span className='text-muted-foreground dark:text-primary-100'>
          ₹ {formatPrice(priceData?.gstAmount)}
        </span>
      </div>

      {priceData?.WalletAmountUsed > 0 && (
        <div className='space-y-1'>
          <div className='flex justify-between'>
            <span className='flex items-center gap-x-2 whitespace-nowrap text-muted-foreground dark:text-primary-100'>
              {/* <CustomImage
                src={`${process.env.IMAGE_DOMAIN}/Elicash_Icon_d070aca13e.svg`}
                alt='coin'
                className='w-5 h-5'
                width={20}
                height={20}
              /> */}
              <ElicashIcon />
              Elicash Used
            </span>
            <span className='text-accent-green-700 font-semibold dark:text-accent-green-500'>
              - ₹ {formatPrice(priceData?.WalletAmountUsed)}
            </span>
          </div>
        </div>
      )}

      <div
        className={`flex justify-between text-base font-semibold border-t dark:border-primary-800 pt-4 mb-0 leading-5 md:leading-4 ${priceData?.outstandingAmount > 0 ? 'mb-0' : ''} `}
      >
        <span>Total Amount</span>
        <span>
          ₹
          {priceData?.isWalletUsed && priceData?.WalletAmountUsed > 0
            ? formatPrice(priceData?.amountAfterWalletApply)
            : formatPrice(priceData?.netAmountAfterTax)}
        </span>
      </div>

      <div className='relative inline-block mb-0'>
        <p className='text-[10px] mt-0 text-[var(--grey1)] dark:text-primary-100 flex items-center gap-0.5'>
          <span>
            {includesTaxLine}{' '}
            {/* {priceData?.platformFeePercentage ? platformFeeLine : ''} */}
          </span>
          {/* <TooltipCommon
            icon={
              <InfoIcon className='stroke-[var(--grey1)] dark:stroke-primary' />
            }
            tooltipText={`${toolTipInfoText} ${priceData?.platformFeePercentage ? `and ${priceData?.platformFeePercentage}% platform fee` : ''}`}
          /> */}
        </p>
      </div>
      {priceData?.outstandingAmount > 0 && (
        <div className='mt-0'>
          {renderPaidAmount(priceData?.actualPaidAmount)}
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
