import gql from 'graphql-tag';

export const GET_HOME_PAGE_CITIES = gql`
  query HomePageCities {
    homePageCitiesSection {
      caption
      sectionTitle
      cityCategories {
        icon
        index
        label
        cities {
          citySlug
          index
          name
          propertyCount
          image {
            mobileImage
            title
            webImage
          }
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_ESCAPE = gql`
  query HomePageEscape {
    homePageEscapeSection {
      caption
      sectionTitle
      mapping_id
      buttonContent {
        link
        text
      }
    }
  }
`;

export const GET_HOME_PAGE_EVENTS = gql`
  query HomePageEvents {
    homePageEventSection {
      caption
      sectionTitle
      events {
        description
        index
        link
        tag
        title
        image {
          mobileImage
          title
          webImage
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_GEMS = gql`
  query HomePageGems {
    homePageGemsSection {
      caption
      sectionTitle
      mapping_id
      buttonContent {
        link
        text
      }
    }
  }
`;

export const GET_HOME_PAGE_METRICS = gql`
  query HomePageMetrics {
    homePageMetricSection {
      caption
      sectionTitle
      Metrics {
        icon
        index
        name
        value
      }
    }
  }
`;

export const GET_HOME_PAGE_OFFERS = gql`
  query HomePageOffers {
    homePageOfferSection {
      caption
      sectionTitle
      Offers {
        title
        termsAndConditions
        subTitle
        propertyId
        offerId
        index
        icon
        description
        code
        channelId
      }
    }
  }
`;

export const GET_HOME_PAGE_PARTNERSHIPS = gql`
  query HomePagePartnerships {
    homePagePartnershipSection {
      buttonContent {
        link
        text
      }
      subtitle
      taglines
      title
      description
      image {
        mobileImage
        title
        webImage
      }
    }
  }
`;

export const GET_HOME_PAGE_SPOTLIGHT = gql`
  query HomePageSpotlight {
    homePageSpotlightSection {
      sectionTitle
      caption
      Spotlights {
        index
        title
        description
        tag
        link
        image {
          mobileImage
          title
          webImage
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_STAR_STAYS = gql`
  query HomePageStarStays {
    homePageStarStaySection {
      sectionTitle
      caption
      homePageStarStays {
      index
      title
      description
      tag
      video {
        thumbnailWeb
        videoWeb
        thumbnailMobile
        videoMobile
      }
    }
    }
  }
`;

export const GET_HOME_PAGE_STORIES = gql`
  query HomePageStories {
    homePageStoriesSection {
      sectionTitle
      caption
      homePageStories {
        index
        title
        description
        tag
        video {
          thumbnailWeb
          videoWeb
          thumbnailMobile
          videoMobile
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_BANNERS = gql`
  query HomePageBanners($target: String!) {
    BannerSection(target: $target) {
       banners {
      ... on BannerImage {
        startDateTime
        endDateTime
        image {
          title
          mobileImage
          webImage
        }
        target
        link
      }
      ... on BannerVideo {
        startDateTime
        endDateTime
        video {
          thumbnailMobile
          thumbnailWeb
          videoMobile
          videoWeb
        }
        target
        link
      }
    }
    }
  }
`;
