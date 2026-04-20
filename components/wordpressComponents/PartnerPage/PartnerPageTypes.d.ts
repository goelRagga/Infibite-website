declare module 'partner-page' {
  interface PartnerPageProps {
    seo?: SeoData;
    template?: TemplateTeamPage;
  }

  interface partnerWithUsPage {
    partnerWithUsBanner?: string;
    partnerWithUsHeading?: string;
    partnerWithUsSubHeading?: string;
    partnerWithUsCardsRepeater?: partnerWithUsCardsRepeater[];
    partnerWithUsChannels?: partnerWithUsChannels[];
    excellenceAwardsRepeator?: ExcellenceAwardsRepeator[];
  }

  interface partnerWithUsCardsRepeater {
    cardIcon?: string;
    cardTitle?: string;
    cardTitleCopy?: string;
    width?: number;
    height?: number;
  }

  interface partnerWithUsChannels {
    partnerWithUsChannelLogo?: string;
  }

  interface ExcellenceAwardsRepeator {
    excellenceAwardsImage?: string;
  }
}
