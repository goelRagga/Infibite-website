import CustomImage from '@/components/common/CustomImage';
import Svg from '@/components/common/Shared/Svg';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { phoneNumber, whatsAppNumber } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { Info, Loader2, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
interface PriceActionsProps {
  isLongStay?: boolean;
  showPartialPayment?: boolean;
  onPartialToggle?: (value: boolean) => void;
  propertyID?: string;
  isPartialPaymentEnabled?: boolean;
  amountDetails?: any;
  handleClick?: () => void;
  checkin?: string;
  checkout?: string;
  propertyName?: string;
  shouldTrackBookNow?: boolean; // Control whether to track book_now_clicked event
}

const PriceActions = ({
  isLongStay = false,
  showPartialPayment = true,
  onPartialToggle,
  propertyID,
  isPartialPaymentEnabled = false,
  amountDetails,
  handleClick,
  checkin,
  checkout,
  propertyName,
  shouldTrackBookNow = true, // Default to true for backward compatibility
}: PriceActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    // Only track book_now_clicked on property details page, not on Review Booking page
    if (shouldTrackBookNow) {
      trackEvent('book_now_clicked', {
        page_name: 'property_details',
        property_id: propertyID,
        property_name: propertyName,
        is_checkin_out_entered: checkin && checkout ? true : false,
      });
    }
    if (handleClick) {
      setIsLoading(true);
      try {
        await handleClick();
      } finally {
        // Reset loading state after a short delay to ensure navigation has started
        setTimeout(() => setIsLoading(false), 1000);
      }
    }
  };
  if (isLongStay) {
    return (
      <div className='flex flex-col gap-4 sm:gap-2 w-full'>
        <div className='bg-accent-yellow-50 p-3 sm:p-4 rounded-xl flex items-start gap-2 text-sm sm:text-base dark:bg-[var(--grey8)]'>
          <Info className='h-6 w-6 sm:h-8 sm:w-8 fill-accent-yellow-500 stroke-white mt-1 sm:mt-0' />
          <span>
            Contact us via WhatsApp or Call to book stays of{' '}
            <strong className='font-semibold'>30+ nights</strong>
          </span>
        </div>

        <div className='flex flex-row gap-2 w-full px-2 sm:px-0'>
          <Button
            asChild
            size='lg'
            className='w-1/2 rounded-full bg-accent-red-900 hover:bg-accent-red-950 font-bold'
          >
            <Link
              href={`tel:${phoneNumber}`}
              className='flex items-center justify-center gap-2'
            >
              <PhoneCall className='w-5 h-5 sm:w-6 sm:h-6' />
              Call
            </Link>
          </Button>

          <Button
            asChild
            size='lg'
            variant='outline'
            className='w-1/2 rounded-full border-[#39BC26] text-[#39BC26] hover:bg-white hover:text-[#39BC26] font-bold'
          >
            <Link
              href={`https://api.whatsapp.com/send/?phone=${whatsAppNumber}&text=Book+Villa+for+me.&type=phone_number&app_absent=0`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2'
            >
              <Image
                src={`${process.env.IMAGE_DOMAIN}/Whatsapp_a6dd5942ca.svg`}
                alt='logo'
                width={3}
                height={3}
                className='w-4 h-4 sm:w-4.5 sm:h-4.5'
              />
              WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getProceedToPayLabel = () => {
    if (amountDetails?.isWalletUsed && amountDetails?.WalletAmountUsed > 0) {
      if (
        isPartialPaymentEnabled &&
        amountDetails?.splitAmountAfterWalletApply
      ) {
        return `Proceed to Pay ₹${amountDetails.splitAmountAfterWalletApply.toLocaleString()}`;
      }
      if (amountDetails?.amountAfterWalletApply) {
        return `Proceed to Pay ₹${amountDetails.amountAfterWalletApply.toLocaleString()}`;
      }
      return 'Proceed to Pay';
    } else {
      if (isPartialPaymentEnabled && amountDetails?.splitPaymentAmount) {
        return `Proceed to Pay ₹${amountDetails.splitPaymentAmount.toLocaleString()}`;
      }
      if (amountDetails?.netAmountAfterTax) {
        return `Proceed to Pay ₹${amountDetails.netAmountAfterTax.toLocaleString()}`;
      }
      return 'Proceed to Pay';
    }
  };
  return (
    <div className='space-y-4'>
      {showPartialPayment && (
        <div className='flex items-center justify-between px-4 py-3 border rounded-lg dark:bg-[var(--gray6)] dark:border-secondary-950'>
          <span className='text-sm font-medium'>Pay 50% Now, Rest Later</span>
          <Switch
            className='cursor-pointer'
            checked={isPartialPaymentEnabled}
            onCheckedChange={onPartialToggle}
          />
        </div>
      )}
      <Button
        size='lg'
        className='w-full cursor-pointer bg-[var(--red2)] hover:bg-[var(--red2)]/90 text-white rounded-full dark:bg-[var(--prive5)]'
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin' />
            Processing...
          </>
        ) : (
          <>{getProceedToPayLabel()}</>
        )}
      </Button>

      <p className='text-xs text-center text-muted-foreground '>
        By proceeding you agree to our{' '}
        <Link
          href='/explore/privacy-policy'
          className='text-accent-red-900 underline dark:text-[var(--accent-background)]'
          prefetch={false}
          target='_blank'
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href='/explore/terms-and-conditions'
          className='text-accent-red-900 underline dark:text-[var(--accent-background)]'
          prefetch={false}
          target='_blank'
        >
          T&C
        </Link>
        .
      </p>
    </div>
  );
};

export default PriceActions;
