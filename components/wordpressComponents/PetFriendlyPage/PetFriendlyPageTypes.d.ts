// types/visa-page.d.ts

declare module 'pet-friendly-page' {
  export interface PetFriendlyPageProps {
    seo?: SeoData;
    template?: PetFriendlyPage;
  }

  export interface PetFriendlyPage {
    banner?: Banner;
  }

  export interface Banner {
    visaLandingBanner?: string;
    visaLandingHeading?: string;
  }
}
