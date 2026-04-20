'use client';

import PriceActions from '@/components/modules/PropertyDetails/PriceActions';
import { includesTaxLine } from '@/lib/constants';

type Discount = {
  label: string;
  value: number;
  subLabels?: string[];
  highlight?: boolean;
};

type PriceBreakupCardProps = {
  basePrice: number;
  nights: number;
  discounts: Discount[];
  meals?: {
    label: string;
    value: number;
  };
  valueAddedServices?: [] | any;
  netVasAmountBeforeTax?: string;
  gstAmount: number;
  totalAmount: number;
  onProceed: () => void;
  isProceedButton?: boolean;
  amountPaid?: number;
  isBookingConfirm?: boolean;
  actualPaidAmount?: number;
  outstandingAmount: number;
  platformFeePercentage?: number;
};

export default function PriceBreakupCard({
  basePrice,
  nights,
  discounts,
  meals,
  valueAddedServices,
  netVasAmountBeforeTax,
  gstAmount,
  totalAmount,
  onProceed,
  isProceedButton = true,
  amountPaid,
  isBookingConfirm,
  actualPaidAmount,
  outstandingAmount,
  platformFeePercentage,
}: PriceBreakupCardProps) {
  return (
    <>
      {isBookingConfirm ? (
        <div className='rounded-2xl border p-5 space-y-4 bg-white'>
          <div className='space-y-4'>
            <h3 className='text-xl font-serif'>Payment Details</h3>

            <div className='text-sm mb-2 font-semibold'>
              <div className='flex justify-between'>
                <p>Amount Paid</p>
                <p>₹ {amountPaid?.toLocaleString()}</p>
              </div>
            </div>
            {/* <div className='text-xs mt-0'>
              <div className='flex justify-between'>
                <p>Payment Mode</p>
                <p>Credit Card: VISA</p>
              </div>
            </div> */}
          </div>
        </div>
      ) : (
        <div className='rounded-2xl border p-5 space-y-4 bg-white'>
          {/* Price Details */}
          <div className='space-y-4'>
            <h3 className='text-xl font-serif'>Price Details</h3>

            <div className='space-y-4 text-sm'>
              <div className='flex justify-between'>
                <p>
                  Base Price <br />
                  <span className='text-primary text-xs font-semibold'>
                    For {nights} Night{nights > 1 ? 's' : ''}
                  </span>
                </p>
                <p className='font-medium'>₹ {basePrice?.toLocaleString()}</p>
              </div>

              {discounts
                .filter((item) => item.value)
                .map((item, i) => (
                  <div key={i} className='flex justify-between'>
                    <div>
                      <p className='text-muted-foreground'>{item.label}</p>
                      {item.subLabels?.map((sub, j) => (
                        <p
                          key={j}
                          className='text-[var(--color-accent-green-700)] text-xs font-semibold'
                        >
                          {sub}
                        </p>
                      ))}
                    </div>
                    <p className='text-[var(--color-accent-green-700)]'>
                      - ₹ {item.value?.toLocaleString()}
                    </p>
                  </div>
                ))}

              {Array.isArray(valueAddedServices) &&
                valueAddedServices.length > 0 && (
                  <div className='flex flex-col'>
                    <div className='flex justify-between'>
                      <p className='text-muted-foreground'>
                        Value Added Services
                      </p>
                      <p className='font-medium'>
                        ₹ {netVasAmountBeforeTax?.toLocaleString()}
                      </p>
                    </div>

                    <div className=''>
                      {valueAddedServices.map((service: any, index: number) => (
                        <div key={index + 1}>
                          <span className='text-primary text-xs font-semibold'>
                            {service.name} x {service.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className='flex justify-between'>
                <p>GST</p>
                <p className='font-medium'>₹ {gstAmount?.toLocaleString()}</p>
              </div>
              <hr />
              <div className='flex justify-between font-semibold text-base mb-0'>
                <p>Total Amount</p>
                <p>₹ {totalAmount?.toLocaleString()}</p>
              </div>
              <div className='relative inline-block'>
                <p className='text-[10px] mt-0 text-muted-foreground dark:text-primary-100 flex items-center gap-0.5'>
                  <span>
                    {includesTaxLine}{' '}
                    {/* {platformFeePercentage ? platformFeeLine : ''} */}
                  </span>
                  {/* <TooltipCommon
                    icon={<InfoIcon />}
                    tooltipText={`${toolTipInfoText} ${platformFeePercentage ? `and ${platformFeePercentage}% platform fee` : ''}`}
                  /> */}
                </p>
              </div>
              {actualPaidAmount && (
                <>
                  <hr />
                  <div className='flex justify-between'>
                    <p>Paid Amount</p>
                    <p className='font-medium'>
                      ₹ {actualPaidAmount?.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
              {outstandingAmount > 0 && (
                <div className='flex justify-between text-[var(--red1)]'>
                  <p>Outstanding Amount</p>
                  <p className='font-medium'>
                    ₹ {outstandingAmount?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          {isProceedButton && (
            <PriceActions
              showPartialPayment={true}
              shouldTrackBookNow={false}
            />
          )}
          {/* {!isProceedButton && (
            <Button
              variant='outline'
              className='cursor-pointer h-[52px] md:h-[36px] w-full mt-1 text-sm border border-accent-red-900 text-accent-red-900 font-semibold rounded-lg px-4 py-4'
            >
              <Svg
                src={`${process.env.IMAGE_DOMAIN}/cloud_download_d6dfcca186.svg`}

                width='19'
                height='14'
              />
              Download Invoice
            </Button>
          )} */}
        </div>
      )}
    </>
  );
}
