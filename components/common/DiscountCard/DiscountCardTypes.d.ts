declare module 'discount-card' {
  interface DiscountCardProps {
    code: string;
    title: string;
    description: string;
    icon: string;
    discountPercentage: number;
    discountMethod: string;
    maximumDiscountAllowed: number;
    minimumNights: number;
    endDateTime: string;
    termsAndConditions: string;
    isPDP?: boolean;
    horizontalPosition?: number;
    shouldLoadImage?: boolean;
    showLogo?: boolean;
    logoTitleInline?: boolean;
  }
}
