import { Offer } from 'villa-types';

export interface CouponOffer {
  code: string;
  description: string;
  minimumNights?: number;
  icon?: string;
}

export interface CouponsProps {
  trigger?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  offers: Offer[];
  quotes?: any;
  propertyId?: string;
  propertyName?: string;
  pageName?: string;
}
