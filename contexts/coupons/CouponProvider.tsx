'use client';

import { useURLParams } from '@/hooks/useURLParams';
import { createContext, useEffect, useRef, useState } from 'react';

interface CouponLoading {
  isLoading: boolean;
  action?: 'apply' | 'remove';
  code?: string | null;
}

interface TCouponContext {
  // Bank Offer states
  bankOffer: string | null;
  setBankOffer: (value: string | null) => void;
  prevBankOffer: string | null;
  appliedBankOffers: any[];
  setAppliedBankOffers: React.Dispatch<React.SetStateAction<any[]>>;
  isBankOfferLoading: CouponLoading;
  setIsBankOfferLoading: React.Dispatch<React.SetStateAction<CouponLoading>>;

  // Coupon states
  customCoupon: string | null;
  setCustomCoupon: (value: string | null) => void;
  prevCustomCoupon: string | null;
  appliedCoupons: any[];
  setAppliedCoupons: React.Dispatch<React.SetStateAction<any[]>>;
  isCustomCouponLoading: CouponLoading;
  setIsCustomCouponLoading: React.Dispatch<React.SetStateAction<CouponLoading>>;
  shownCouponsRef: React.RefObject<any | null>;
  shownBankOffersRef: React.RefObject<any | null>;
  shownErrorsRef: React.RefObject<any | null>;

  // Error states
  isCouponError: boolean;
  setIsCouponError: React.Dispatch<React.SetStateAction<boolean>>;
  isCouponErrorMessage: any;
  setIsCouponErrorMessage: React.Dispatch<React.SetStateAction<any>>;

  // Dialog states
  autoApplyCoupon: string | null;
  openCouponDialog: boolean;
  setOpenCouponDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openCustomCouponDialog: boolean;
  setOpenCustomCouponDialog: React.Dispatch<React.SetStateAction<boolean>>;
  updateAutoApplyBankOffer: (value: string | null) => void;
}

// Initial state
const initialState = {
  appliedBankOffers: [],
  appliedCoupons: [],
  isBankOfferLoading: { isLoading: true },
  isCustomCouponLoading: { isLoading: true },
  isCouponError: false,
  isCouponErrorMessage: null,
  openCouponDialog: false,
  openCustomCouponDialog: false,
  autoApplyCoupon: null,
};

export const CouponContext = createContext<TCouponContext | undefined>(
  undefined
);

const COUPON_URL_CONFIG = {
  bankOffer: {
    paramName: 'bankOffer',
    defaultValue: null,
    shouldInclude: (value: string | null) => value != null,
  },
  couponCode: {
    paramName: 'couponCode',
    defaultValue: null,
    shouldInclude: (value: string | null) => value != null,
  },
  applyAutoBankOffer: {
    paramName: 'applyAutoBankOffer',
    defaultValue: null,
    shouldInclude: (value: string | null) => value != null,
  },
};

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getParam, setParam, updateParams } = useURLParams({
    customConfig: COUPON_URL_CONFIG,
  });

  const bankOffer = getParam<string>('bankOffer');
  const customCoupon = getParam<string>('couponCode');
  const autoApplyCoupon = getParam<string>('applyAutoBankOffer');

  const updateCouponParams = (updates: Record<string, any>) => {
    updateParams(updates);
  };

  const prevBankOfferRef = useRef<string | null>(null);
  const prevCustomCouponRef = useRef<string | null>(null);
  const shownCouponsRef = useRef<Set<string>>(new Set());
  const shownBankOffersRef = useRef<Set<string>>(new Set());
  const shownErrorsRef = useRef<Set<string>>(new Set());

  const [appliedBankOffers, setAppliedBankOffers] = useState<any[]>(
    initialState.appliedBankOffers
  );
  const [appliedCoupons, setAppliedCoupons] = useState<any[]>(
    initialState.appliedCoupons
  );
  const [prevBankOffer, setPrevBankOffer] = useState<string | null>(null);
  const [prevCustomCoupon, setPrevCustomCoupon] = useState<string | null>(null);

  const [isCustomCouponLoading, setIsCustomCouponLoading] =
    useState<CouponLoading>(initialState.isCustomCouponLoading);
  const [isBankOfferLoading, setIsBankOfferLoading] = useState<CouponLoading>(
    initialState.isBankOfferLoading
  );

  const [isCouponError, setIsCouponError] = useState(
    initialState.isCouponError
  );
  const [isCouponErrorMessage, setIsCouponErrorMessage] = useState<any>(
    initialState.isCouponErrorMessage
  );

  const [openCouponDialog, setOpenCouponDialog] = useState(
    initialState.openCouponDialog
  );
  const [openCustomCouponDialog, setOpenCustomCouponDialog] = useState(
    initialState.openCustomCouponDialog
  );

  const removeFromShownSets = (
    couponCode?: string | null,
    bankOfferCode?: string | null
  ) => {
    if (couponCode) {
      const keysToRemove = Array.from(shownCouponsRef.current).filter((key) =>
        key.startsWith(`${couponCode}-`)
      );
      keysToRemove.forEach((key) => shownCouponsRef.current.delete(key));
    }

    if (bankOfferCode) {
      const keysToRemove = Array.from(shownBankOffersRef.current).filter(
        (key) => key.startsWith(`${bankOfferCode}-`)
      );
      keysToRemove.forEach((key) => shownBankOffersRef.current.delete(key));
    }
  };

  const setBankOffer = (value: string | null) => {
    if (value) {
      setIsBankOfferLoading({
        isLoading: true,
        action: 'apply',
        code: value,
      });
      setTimeout(() => {
        removeFromShownSets('', prevBankOffer);
        updateCouponParams({ bankOffer: value });
      }, 300);
    } else {
      setIsBankOfferLoading({
        isLoading: true,
        action: 'remove',
        code: prevBankOffer,
      });
      setTimeout(() => {
        removeFromShownSets('', prevBankOfferRef.current);
        setAppliedBankOffers([]);
        updateCouponParams({ bankOffer: value });
      }, 300);
    }
  };

  const setCustomCoupon = (value: string | null) => {
    if (value) {
      setIsCustomCouponLoading({
        isLoading: true,
        action: 'apply',
        code: value,
      });
      setTimeout(() => {
        removeFromShownSets(prevCustomCoupon, '');
        updateCouponParams({ couponCode: value });
      }, 300);
    } else {
      setIsCustomCouponLoading({
        isLoading: true,
        action: 'remove',
        code: prevCustomCoupon,
      });
      setTimeout(() => {
        removeFromShownSets(prevCustomCouponRef.current, '');
        setAppliedCoupons([]);
        updateCouponParams({ couponCode: value });
      }, 300);
    }
  };

  const updateAutoApplyBankOffer = (value: string | null) => {
    updateCouponParams({ applyAutoBankOffer: value });
  };

  useEffect(() => {
    if (bankOffer !== null) {
      setPrevBankOffer(prevBankOfferRef.current);
      prevBankOfferRef.current = bankOffer;
    }
  }, [bankOffer]);

  useEffect(() => {
    if (customCoupon !== null) {
      setPrevCustomCoupon(prevCustomCouponRef.current);
      prevCustomCouponRef.current = customCoupon;
    }
  }, [customCoupon]);

  const value: TCouponContext = {
    // Bank Offer
    bankOffer,
    setBankOffer,
    prevBankOffer: prevBankOfferRef.current,
    appliedBankOffers,
    setAppliedBankOffers,
    isBankOfferLoading,
    setIsBankOfferLoading,
    shownCouponsRef,
    shownBankOffersRef,
    shownErrorsRef,

    // Coupon
    customCoupon,
    setCustomCoupon,
    prevCustomCoupon: prevCustomCouponRef.current,
    appliedCoupons,
    setAppliedCoupons,
    isCustomCouponLoading,
    setIsCustomCouponLoading,

    // Error states
    isCouponError,
    setIsCouponError,
    isCouponErrorMessage,
    setIsCouponErrorMessage,

    // Dialog states
    autoApplyCoupon,
    openCouponDialog,
    setOpenCouponDialog,
    openCustomCouponDialog,
    setOpenCustomCouponDialog,
    updateAutoApplyBankOffer,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};

export default CouponProvider;
