'use client';

import ElicashIcon from '@/assets/ElicashDesk.svg';
import Link from 'next/link';
import ElicashIconSmall from '@/assets/elicash.svg';

interface CommonBalanceSectionProps {
  title?: string;
  balance: any;
  showBalance?: boolean;
  balanceClassName?: string;
  titleClassName?: string;
  currencySymbol?: string;
  expiringAmount?: number | any;
  expiringDate?: string;
  onRedeemClick?: () => void;
  showRedeemButton?: boolean;
  ButtonText?: string;
  ButtonClassName?: string;
  className?: string;
  description?: {
    text: React.ReactNode;
    className?: string;
    iconClassname?: string;
    Secondiconclassname?: string;
  };
}

export default function CommonBalanceSection({
  title,
  showBalance = false,
  titleClassName,
  balance,
  balanceClassName,
  currencySymbol = `${process.env.IMAGE_DOMAIN}/Elicash_Icon_d070aca13e.svg`,
  expiringAmount,
  expiringDate,
  onRedeemClick,
  ButtonText,
  ButtonClassName,
  showRedeemButton = true,
  description,
  className = '',
}: CommonBalanceSectionProps) {
  const hasBalance = balance > 0;
  const hasExpiringAmount =
    typeof expiringAmount === 'number' && expiringAmount > 0 && !!expiringDate;

  return (
    <div
      className={`text-center flex flex-col items-center justify-center sm:px-6 ${className}`}
    >
      {title && (
        <p
          className={`text-sm md:text-base font-medium text-primary-800 pt-8 ${titleClassName} mb-2`}
        >
          {title}
        </p>
      )}

      {/* Balance Section */}
      <div className='flex items-center justify-center mt-0 mb-4 gap-1 md:gap-0'>
        <span
          className={`${showBalance ? ' w-7 h-7' : ' w-12 h-12'} flex items-center justify-center`}
        >
          {showBalance ? (
            <ElicashIconSmall />
          ) : (
            <ElicashIcon className='w-12 h-12' />
          )}
        </span>

        {showBalance && (
          <span
            className={`text-[var(--grey9)] typography-h3 ${balanceClassName}`}
          >
            {balance.toLocaleString()}
          </span>
        )}
      </div>

      {/* Expiring Info */}
      {hasBalance && hasExpiringAmount && (
        <p className='text-[var(--red1)] text-xs md:text-sm mb-3.5'>
          <span className='font-semibold'>{expiringAmount}</span> Elicash about
          to expire on {expiringDate}
        </p>
      )}

      {description && (
        <div
          className={`flex items-center justify-center gap-2 ${showBalance ? 'mb-4' : 'mb-2'} `}
        >
          <span className={`text-sm ${description.className}`}>
            {description.text}
          </span>
        </div>
      )}

      <div className='flex flex-col items-center justify-center gap-3'>
        {/* Expiring Info */}
        {/* {hasBalance && hasExpiringAmount && (
          <p className='text-[var(--red1)] text-xs md:text-sm text-center'>
            <span className='font-semibold'>{expiringAmount}</span> Elicash
            about to expire on {expiringDate}
          </p>
        )} */}

        {/* Redeem Button */}
        {hasBalance && showRedeemButton && onRedeemClick && (
          <Link
            onClick={onRedeemClick}
            className={` ${ButtonClassName}`}
            href='/villas'
          >
            {ButtonText}
          </Link>
        )}
      </div>
    </div>
  );
}
