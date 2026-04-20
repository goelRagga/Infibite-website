declare module 'partner-section' {
  import { PartnerSectionData } from '@/lib/api/types';

  export type PartnerSectionProps = {
    partnerSectionData: PartnerSectionData;
    isPetFriendlyPage?: boolean;
    isForm?: boolean;
    formComponent?: React.ReactNode;
    formTitle?: string;
    formDescription?: string;
    contentClassName?: string;
    cta?: string;
    ctaLink?: string;
    verticalPosition?: number;
  };
}
