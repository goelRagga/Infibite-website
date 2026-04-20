import gql from 'graphql-tag';

export const GET_ALL_PAGE_SLUGS = gql`
  query GetAllPageSlugs {
    pages(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content
      slug
    }
  }
`;

export const GET_PAGE_DETAILS = gql`
  query GetPageDetails($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content
      template {
        templateName
      }
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      enqueuedScripts {
        nodes {
          src
        }
      }
      enqueuedStylesheets {
        nodes {
          src
        }
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        id
        date
        excerpt
        title
        uri
        status
       
        featuredImage {
          node {
            altText
            mediaItemUrl
          }
        }
        seo {
          canonical
          metaDesc
          title
          opengraphTitle
          opengraphUrl
          twitterDescription
          metaRobotsNofollow
          metaRobotsNoindex
          twitterTitle
          schema {
            raw
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export const GET_LATEST_POSTS = gql`
  query GetLatestPosts {
    posts(first: 4) {
      nodes {
        id
        date
        excerpt
        title
        uri
        status
        seo {
          canonical
          metaDesc
          title
          opengraphTitle
          opengraphUrl
          twitterDescription
          metaRobotsNofollow
          metaRobotsNoindex
          twitterTitle
          schema {
            raw
          }
        }
        featuredImage {
          node {
            altText
            mediaItemUrl
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 50) {
      nodes {
      id
      name
      slug
      blogCategory {
        categoryTitle
        categoryBlogsHeading
        categoryBanner
      }
      uri
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
    }
  }
`;

export const GET_EXPLORE = gql`
  query GetExplorePage {
    page(id: "66", idType: DATABASE_ID) {
      id
      slug
      status
      title
      homePage {
        fieldGroupName
        homePageBanner
        homePageHeading
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_ALL_POSTS_SLUGS = gql`
  query GetAllPostSlugs($first: Int) {
    posts(first: $first) {
      nodes {
        slug
        date
        title
        seo {
          title
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORY_SLUGS = gql`
  query GetAllCategorySlugs($first: Int) {
    categories(first: $first) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_DETAIL_POST = gql`
  query DetailPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      content
      date
      postId
      status
      title
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_CATEGORY = gql`
  query DetailCategory($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      blogCategory {
        categoryAboutImage
        categoryBanner
        categoryBlogsHeading
        categoryBriefOverview
        categoryExploreCityName
        categoryHeading
        categorySelectCheckbox
        categoryShortDescription
        categoryTitle
        categoryEventsRepeater {
          categoryEventSideContent
          categoryLink
          categorySubTitle
          categoryEventImage
        }
      }
      slug
      seo {
          canonical
          metaDesc
          title
          opengraphTitle
          opengraphUrl
          twitterDescription
          metaRobotsNofollow
          metaRobotsNoindex
          twitterTitle
          schema {
            raw
          }
        }
      name
    }
  }
`;

export const GET_DETAIL_ABOUT_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      template {
        ... on Template_AboutPage {
          templateName
          aboutPage {
            aboutPageBanner
            aboutPageHeading
            aboutPageBannerSmall
            aboutPageSubHeading
            ourPurpose {
              fieldGroupName
              ourPurposeContent
              ourPurposeTitle
            }
            ourValues {
              fieldGroupName
              ourValuesContent
              ourValuesTitle
              ourValuesDetails {
                fieldGroupName
                ourValuesIconContent
                ourValuesIconTitle
                ourValuesImageIcon
              }
            }
            advantagesRepeater {
              content
              fieldGroupName
              sideImage
              title
            }
            fieldGroupName
          }
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_PARTNER_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_PartnerPage {
          templateName
          partnerWithUsPage {
            excellenceAwardsRepeator {
              excellenceAwardsImages
              fieldGroupName
            }
            fieldGroupName
            partnerWithUsBanner
            partnerWithUsCardsRepeater {
              cardIcon
              cardTitle
              cardTitleCopy
              fieldGroupName
            }
            partnerWithUsHeading
            partnerWithUsChannels {
              fieldGroupName
              partnerWithUsChannelLogo
            }
            partnerWithUsSubHeading
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_PRIVACY_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      content
      modified
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_PrivacyPolicyPage {
          templateName
          privacyPolicyPage {
            fieldGroupName
            privacyPolicyBanner
            privacyPolicyBannerSmall
            privacyPolicyHeading
            privacyPolicySubHeading
            policyContent
            contenRepeator {
              content
              fieldGroupName
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_EVENTS_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      status
      slug
      content
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_EventsPage {
          templateName
          eventsAndCulture {
            eventContent
            eventsBanner
            eventsBannerSmall
            eventsGallery {
              edges {
                node {
                  id
                  mediaItemUrl
                }
              }
            }
            eventsHeading
            eventsSubHeading
            eventsTitle
            fieldGroupName
            ourValuesDetails {
              fieldGroupName
              ourValuesIconContent
              ourValuesIconTitle
              ourValuesImageIcon
            }
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_CORPORATE_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      content
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_CorporateNewPage {
          templateName
          corporatePage {
            corporateBanner
            corporateBannerSmall
            corporateBannerSubHeading
            corporateFeatures {
              corporateFeatureImage
              corporateFeatureTitle
              fieldGroupName
            }
            corporateHappyClients {
              corporateCliientLogo
              fieldGroupName
            }
            corporateHeading
            corporateReviews {
              corporateReviewLogo
              corporateReviewRating
              fieldGroupName
            }
            corporateServices {
              corporateServiceLogo
              corporateServiceName
              fieldGroupName
            }
            corporateSideFormImage
            corporateTestimonials {
              corporateTestimonialContent
              corporateTestimonialLogo
              corporateTestimonialName
              fieldGroupName
            }
            corporateWhyUsGroup {
              corporateWhyUsContent
              corporateWhyUsContentTitle
              fieldGroupName
            }
            fieldGroupName
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_UPSELL_OFFERS_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      status
      slug
      content
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_UpsellLandingPage {
          templateName
          upsellOffersPage {
            fieldGroupName
            offerRepeater {
              fieldGroupName
              offerImage
              offerName
            }
            upsellVideoLink
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_BANK_CREDIT_CARD_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      content
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_BankOffersPage {
          templateName
          bankOffer {
            bankOfferBanner
            bankOfferBannerHeading
            bankOfferBannerLogo
            bankOfferBannerSmall
            bankOfferCardLayoutTitle
            bankOfferCardsLayout {
              bankOfferCardsLayoutContent
              bankOfferCardsLayoutLogoSmall
              fieldGroupName
            }
            bankOfferModalFooter
            bankOfferModalImageData
            bankOfferModalTitle
            fieldGroupName
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_TERMS_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      template {
        ... on Template_TermsandconditionsPage {
          templateName
          termsAndConditions {
            fieldGroupName
            termsAndConditionsBanner
            termsAndConditionsBannerSmall
            termsAndConditionsHeading
            termsAndConditionsSubHeading
            contenRepeator {
              content
              fieldGroupName
              title
            }
          }
          
        }
      }
      modified
      content
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_PRESS_RELEASE_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_PressReleasePage {
          templateName
          pressReleasePage {
            fieldGroupName
            pressReleaseBanner
            pressReleaseData {
              auhor
              date
              fieldGroupName
              imageLink
              link
              logos
              title
            }
            pressReleaseHeading
            pressReleaseShortDescription
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_CONTACT_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      template {
        ... on Template_ContactPage {
          templateName
          contactPage {
            addressMapLink
            contactPageBanner
            contactPageHeading
            contactPageSubHeading
            customerSupportDescription
            customerSupportEmailAddress
            customerSupportPhoneNumber
            customerSupportTitle
            fieldGroupName
            mediaEnquiriesDescription
            mediaEnquiriesEmailAddress
            mediaEnquiriesTitle
            officeAddress
          }
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_CAREER_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      status
      slug
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      template {
        ... on Template_ListingCareer {
          templateName
          careerListingPage {
            bannerlisting
            careerContent
            careerListingGallery {
              nodes {
                mediaItemUrl
              }
            }
            careerTitle
            fieldGroupName
            headinglisting
            shortDescriptionListing
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_TEAM_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      template {
        ... on Template_TeamPage {
          templateName
          teamMembers {
            advisorsAndInvestors {
              fieldGroupName
              investorImage
              investorLinkedinUrl
              investorTitle
            }
            fieldGroupName
            leadershipTeamMembers {
              fieldGroupName
              memberDesignation
              memberImage
              memberLinkedinUrl
              memberName
            }
            managementTeamMembers {
              fieldGroupName
              memberDesignation
              memberImage
              memberLinkedinUrl
              memberName
            }
            teamPageBanner
            teamPageHeading
            teamPageSubHeading
            founderTeamMembers {
              fieldGroupName
              memberDescription
              memberDesignation
              memberImage
              memberLinkedinUrl
              memberName
            }
          }
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_VISA_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      template {
        ... on Template_VisaLandingPage {
          templateName
          visaLandingPage {
            fieldGroupName
            howToRedeem
            offersRepeater {
              fieldGroupName
              offerContent
              offerCouponCode
              offerCouponLable
              offerPropertySlider {
                fieldGroupName
                visaPropertyImage
                visaPropertyLink
                visaPropertyName
              }
              offerTerms {
                fieldGroupName
                offerTermDescription
                offerTermTitle
              }
              offerTitle
              offerTitleCta
            }
            visaLandingBanner
            visaLandingBannerSmall
            visaLandingContactNumber
            visaLandingHeading
            visaTermsAndConditions
          }
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_VISA = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      status
      slug
      visa {
        fieldGroupName
        visaBanner
        visaBannerMobile
        brandCardsHeading
        brandCardsContent
        brandCards {
          brandCardImageLink
          fieldGroupName
          brandLink
        }
        discountContent
        discountHeading
        discountRepeaterCard {
          discountContent
          discountIcon
          discountTitle
          fieldGroupName
        }
        promotionContent
        promotionTerms
        brandCardsMobile {
          brandCardImageLink
          fieldGroupName
          brandLink
        }
      }
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
    }
  }
`;

export const GET_DETAIL_CAMPAIGN_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      status
      slug
      content
      enqueuedStylesheets {
        edges {
          node {
            src
          }
        }
      }
    }
  }
`;

export const GET_DETAIL_PAGE = gql`
  query PageDetail($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      date
      title
      status
      slug
      seo {
        canonical
        metaDesc
        title
        opengraphTitle
        opengraphUrl
        twitterDescription
        metaRobotsNofollow
        metaRobotsNoindex
        twitterTitle
        schema {
          raw
        }
      }
      
    }
  }
`;
