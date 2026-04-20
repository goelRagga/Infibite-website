declare module 'loyalty-section' {
  export interface Loyalty {
    id: string;
    amountSpentIn12Months: number;
    amountNeededForNextTier: number;
    loyaltyTier: {
      id: string;
      tier: string;
      minAmount: number;
      redemptionCapability: boolean;
      metadata?: {
        membershipTiers: {
          icon: string;
          name: string;
          color: string;
          benefits: string[];
          mailIcon: string;
          subtitle: string;
        };
      };
    };
    nextLoyaltyTier?: {
      id: string;
      tier: string;
      minAmount: number;
      redemptionCapability: boolean;
      metadata?: {
        membershipTiers: {
          icon: string;
          name: string;
          color: string;
          benefits: string[];
          mailIcon: string;
          subtitle: string;
        };
      };
    } | null;
  }

  export interface LoyaltySectionHomeProps {
    onClick?: () => void;
    data?: Loyalty | null;
    title?: string;
    isHome?: boolean;
    className?: string;
    pageName?: string;
    verticalPosition?: number;
    loyaltyTiers?: any[];
  }
}
