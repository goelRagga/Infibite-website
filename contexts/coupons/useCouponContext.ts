import { useContext } from 'react';
import { CouponContext } from './CouponProvider';

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};

export const useGlobalCoupon = useCouponContext;
