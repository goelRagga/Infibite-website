declare module 'corporate-page' {
  interface CorporatePageProps {
    seo?: SeoData;
    template?: TemplateTeamPage;
  }

  interface corporatePage {
    corporateBanner?: string;
    corporateHeading?: string;
    corporateBannerSubHeading?: string;
    WhyUsSectionProps?: WhyUsSectionProps;
    corporateServices?: corporateServicesProps[];
    CorporateHappyClientsProps?: CorporateHappyClientsProps[];
    CorporateFeaturesAndExperiencesProps?: CorporateFeaturesAndExperiencesProps[];
    corporateTestimonials?: CorporateTestimonialsProps[];
    corporateReviews?: CorporateReviewsProps[];
  }

  interface WhyUsSectionProps {
    corporateWhyUsContent?: string;
    corporateWhyUsContentTitle?: string;
  }

  interface corporateServicesProps {
    corporateServiceLogo?: string;
    corporateServiceName?: string;
  }

  interface CorporateHappyClientsProps {
    corporateCliientLogo?: string;
  }

  interface CorporateFeaturesAndExperiencesProps {
    corporateFeatureImage?: string;
    corporateFeatureTitle?: string;
  }

  interface CorporateTestimonialsProps {
    corporateTestimonialContent?: string;
    corporateTestimonialLogo?: string;
    corporateTestimonialName?: string;
  }

  interface CorporateReviewsProps {
    corporateReviewLogo?: string;
    corporateReviewRating?: string;
  }
}
