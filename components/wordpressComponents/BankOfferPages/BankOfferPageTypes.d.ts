declare module 'bank-offer-page' {
  interface BankOfferPageProps {
    seo?: SeoData;
    template?: template;
    modalContentHeight?: string;
    modalContentWidth?: string;
  }

  interface bankPage {
    banner?: Banner;
    bankOfferCardsLayout?: BankOfferCardsLayoutProps[];
    bankOfferCardLayoutTitle?: string;
    bankOfferModalImageData?: string;
  }

  interface Banner {
    bankOfferBanner?: string;
    bankOfferBannerHeading?: string;
    bankOfferBannerLogo?: string;
  }

  interface BankOfferCardsLayoutProps {
    bankOfferCardsLayoutContent?: string;
    bankOfferCardsLayoutLogoSmall?: string;
  }
}
