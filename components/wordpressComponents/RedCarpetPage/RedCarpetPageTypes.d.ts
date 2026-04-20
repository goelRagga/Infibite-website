declare module 'red-carpet' {
  interface RedCarpetPageProps {
    data?: RawData;
    winbackData?: WinbackData;
    winbackError?: { message: string; statusCode: number } | null;
  }

  interface WinbackData {
    booking?: Booking;
    offers?: BenefitData[];
    claim?: WinbackClaim;
  }

  interface WinbackClaim {
    id?: number;
    guestId?: string;
    offerId?: number;
    bookingId?: string;
    details?: BenefitData;
    claimedAt?: string;
  }

  interface BenefitData {
    createdAt?: string;
    description?: string[];
    icon?: string;
    id?: number;
    offerType?: string;
    title?: string;
    voucherAmount?: number;
  }
  interface RawData {
    RedCarpentPageContent?: RawData;
    banner?: {
      deskUrl?: string;
      mobUrl?: string;
      urlMobile?: string;
      urlDesktop?: string;
    };
    bannerContent?: {
      cta?: string;
      content?: string;
    };
    benefitsCardsRepeater?: { title?: string };
  }
  interface BannerSectionProps {
    mobUrl?: string;
    deskUrl?: string;
    title?: string;
    content?: string;
    cta?: string;
  }
  interface BenefitData {
    createdAt?: string;
    description?: string[];
    icon?: string;
    id?: number;
    offerType?: string;
    title?: string;
    voucherAmount?: number;
  }
  interface RedCardpetBenefitProps {
    content?: BenefitData;
    onUnlockClick?: (content: BenefitData) => void;
    isClaimed?: boolean;
    isCenterSlide?: boolean;
    hasAnyClaimed?: boolean;
  }

  interface ToastMessageProps {
    title?: string;
    description?: string;
  }
}
