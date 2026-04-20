import { trackEvent } from '@/lib/mixpanel';
import React, { useEffect, useState } from 'react';

interface CouponInputProps {
  onApply: (code: string) => void;
  placeholder?: string;
  pageName?: string;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  onApply,
  placeholder = 'Enter Coupon Code',
  pageName,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [disableFocus, setDisableFocus] = useState(true);

  const handleApply = () => {
    if (couponCode.trim()) {
      onApply(couponCode.trim());
      setCouponCode('');
      trackEvent('apply_clicked', {
        page_name: pageName,
        coupon_code: couponCode.trim(),
        coupon_type: 'apply',
        cta_type: 'apply',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisableFocus(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='relative w-full rounded-xl border border-[var(--black7)] p-[2px] dark:border-primary-800 '>
      <div className='flex items-center w-full h-11 sm:h-12 rounded-full sm:rounded-lg bg-white dark:bg-background px-4'>
        <input
          type='text'
          inputMode='text'
          placeholder={placeholder}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyPress={handleKeyPress}
          tabIndex={disableFocus ? -1 : 0}
          className='flex-grow font-semibold placeholder:font-normal border-none sm:h-12 h-10 bg-transparent text-[var(--brown4)] placeholder:text-[var(--brown4)]  text-sm focus:outline-none focus:ring-0 dark:text-[var(--accent-background)]'
        />
        <button
          className='text-sm font-semibold text-accent-red-900 ml-2 cursor-pointer disabled:cursor-not-allowed disabled:text-secondary-700 dark:text-[var(--accent-background)]'
          onClick={handleApply}
          disabled={!couponCode.trim()}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
