declare module 'team-page' {
  interface TeamPageProps {
    seo?: SeoData;
    template?: TemplateTeamPage;
  }

  interface TemplateTeamPage {
    teamPageBanner?: string;
    teamPageHeading?: string;
    teamPageSubHeading?: string;
    founderTeamMembers?: FounderTeamMembers[];
    leadershipTeamMembers?: LeadershipTeamMembers[];
    managementTeamMembers?: ManagementTeamMembers[];
    advisorsAndInvestors?: AdvisorsAndInvestors[];
  }

  interface SeoData {
    title?: string;
    slug?: string;
    template?: TemplateTeamPage;
  }

  interface FoundingMember {
    teamMembers?: {
      founderTeamMembers?: FounderTeamMembers[];
    };
  }

  interface FounderTeamMembers {
    memberDescription?: string;
    memberDesignation?: string;
    memberImage?: string;
    memberLinkedinUrl?: string;
    memberName?: string;
  }

  interface LeadershipMemeber {
    leadershipTeamMembers?: LeadershipTeamMembers[];
  }

  interface LeadershipTeamMembers {
    memberDesignation?: string;
    memberImage?: string;
    memberLinkedinUrl?: string;
    memberName?: string;
  }

  interface ManagementMember {
    managementTeamMembers?: ManagementTeamMembers[];
  }

  interface ManagementTeamMembers {
    memberDesignation?: string;
    memberImage?: string;
    memberLinkedinUrl?: string;
    memberName?: string;
  }

  interface AdvisorsAndInvestors {
    advisorsAndInvestors?: AdvisorsAndInvestors[];
  }

  interface AdvisorsAndInvestors {
    investorImage?: string;
    investorLinkedinUrl?: string;
    investorTitle?: string;
  }
}
