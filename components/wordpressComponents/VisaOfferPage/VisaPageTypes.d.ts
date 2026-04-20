// types/visa-page.d.ts

declare module 'visa-page' {
  export interface VisaPageProps {
    seo?: SeoData;
    template?: VisaPage;
  }

  export interface VisaPage {
    visaLandingBanner?: string;
    visaLandingHeading?: string;
    offersRepeater?: offersRepeater[];
    howToRedeem?: string;
    visaTermsAndConditions?: string;
  }

  export interface Banner {
    visaLandingBanner?: string;
    visaLandingHeading?: string;
  }

  export interface offersRepeater {
    offerContent: string;
    offerCouponCode: string;
    offerCouponLable: string;
    offerTitle: string;
    offerTerms: OfferTerms[];
    offerTitleCta: AcfLink;
    offerPropertySlider: OfferPropertySlider[];
  }

  export interface OfferPropertySlider {
    visaPropertyImage?: string;
    visaPropertyLink?: string;
    visaPropertyName?: string;
  }

  export interface OfferTerms {
    offerTermDescription?: string;
    offerTermTitle?: string;
  }

  export interface VisaOfferCardSectionProps {
    offerContent: string;
    offerCouponCode: string;
    offerCouponLable: string;
    offerTitle: string;
    offerTerms: OfferTerms[];
    offerTitleCta: AcfLink;
    offerPropertySlider: OfferPropertySlider[];
  }
}
