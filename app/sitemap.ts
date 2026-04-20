import { MetadataRoute } from 'next';
import { serverClient } from '@/lib/client/unified-client-manager';
import {
  GET_PROPERTIES_DETAILS_LIST,
  GET_DESTINATIONS_LIST,
} from '@/lib/queries';
import { getBackupSitemap } from '@/lib/sitemap-backup';
import { formatCityNameLowerCase } from '@/lib/utils';
import {
  getAllPostSlugs,
  getAboutPage,
  getContactPage,
  getCorporatePage,
  getPartnerPage,
  getDetailPage,
  getPrivacyPage,
  getTermsPage,
  getTeamPage,
  getPressReleasePage,
  getVisaPage,
  getBankCreditCardPage,
} from '@/lib/wordpress/api';
import { getSeoPageSitemapEntries } from '@/lib/api/seo-page';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { aboutPage: aboutPageData } = await getAboutPage('/about-us');
    const { contactDetail } = await getContactPage('/contact');
    const { corporateDetail } = await getCorporatePage('/corporate-offsites');
    const { partnerDetail } = await getPartnerPage('/partner');
    const { pageDetail } = await getDetailPage('/pet-friendly-villas');
    const { privacyDetail } = await getPrivacyPage('/privacy-policy');
    const { termDetail } = await getTermsPage('/terms-and-conditions');
    const { teamDetail } = await getTeamPage('/team');
    const { pressReleaseDetail } = await getPressReleasePage('/press-release');
    const { visaDetail } = await getVisaPage('/visa-offers');
    const { bankDetail } = await getBankCreditCardPage(
      '/applicable-icici-bank-credits-cards'
    );
    const { bankDetail: bankDetailIdfc } = await getBankCreditCardPage(
      '/applicable-idfc-first-credit-cards'
    );
    const { bankDetail: bankDetailAxis } =
      await getBankCreditCardPage('/axis-bank-cards');

    const aboutDate = aboutPageData?.page?.date
      ? new Date(aboutPageData?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const contactDate = contactDetail?.page?.date
      ? new Date(contactDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const corporateDate = corporateDetail?.page?.date
      ? new Date(corporateDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const partnerDate = partnerDetail?.page?.date
      ? new Date(partnerDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const petFriendlyDate = pageDetail?.page?.date
      ? new Date(pageDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const privacyPolicyDate = privacyDetail?.page?.date
      ? new Date(privacyDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const termsAndConditionsDate = termDetail?.page?.date
      ? new Date(termDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const teamDate = teamDetail?.page?.date
      ? new Date(teamDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const pressReleaseDate = pressReleaseDetail?.page?.date
      ? new Date(pressReleaseDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const visaOffersDate = visaDetail?.page?.date
      ? new Date(visaDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const bankCreditIciciCardDate = bankDetail?.page?.date
      ? new Date(bankDetail?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const bankCreditCardIdfcDate = bankDetailIdfc?.page?.date
      ? new Date(bankDetailIdfc?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const bankCreditCardAxisDate = bankDetailAxis?.page?.date
      ? new Date(bankDetailAxis?.page?.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const baseUrl = 'https://www.elivaas.com';

    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/villas`,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/about-us`,
        lastModified: aboutDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/contact`,
        lastModified: contactDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/corporate-offsite`,
        lastModified: corporateDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/blogs`,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/partner`,
        lastModified: partnerDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/corporate-offsite`,
        lastModified: corporateDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/event`,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/pet-friendly-villas`,
        lastModified: petFriendlyDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/privacy-policy`,
        lastModified: privacyPolicyDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/terms-and-conditions`,
        lastModified: termsAndConditionsDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/team`,
        lastModified: teamDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/press-release`,
        lastModified: pressReleaseDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/visa-offers`,
        lastModified: visaOffersDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/applicable-icici-bank-credits-cards`,
        lastModified: bankCreditIciciCardDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/applicable-idfc-first-credit-cards`,
        lastModified: bankCreditCardIdfcDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/explore/axis-bank-cards`,
        lastModified: bankCreditCardAxisDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/prive`,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/villas`,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `https://careers.elivaas.com/careers`,
        lastModified: '2024-12-01',
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    // Fetch all properties with pagination (0-based page index)
    let currentPage = 0;
    const pageSize = 100;
    let hasMoreData = true;
    let allProperties: any[] = [];

    while (hasMoreData) {
      const data = await serverClient.request<any>(
        GET_PROPERTIES_DETAILS_LIST,
        { page: currentPage, pageSize }
      );

      const properties = data?.propertiesRatesV1?.list || [];

      if (properties.length > 0) {
        allProperties = [...allProperties, ...properties];
        currentPage++;

        if (properties.length < pageSize) {
          hasMoreData = false;
        }
      } else {
        hasMoreData = false;
      }
    }

    const properties = allProperties;
    console.log('🏠 Total properties fetched:', properties.length);

    // Generate property detail pages (use citySlug to match property route URLs)
    const propertyRoutes: MetadataRoute.Sitemap = properties
      .filter((property: any) => property?.citySlug && property?.slug)
      .map((property: any) => ({
        url: `${baseUrl}/villa-in-${property.citySlug}/${property.slug}`,
        lastModified: new Date(property.updatedAt || new Date())
          .toISOString()
          .split('T')[0],
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));

    // Fetch destinations with cities and areas
    const destinationsData = await serverClient.request<any>(
      GET_DESTINATIONS_LIST
    );
    const destinations = destinationsData?.destinations || [];

    // Generate state, city and area pages
    const locationRoutes: MetadataRoute.Sitemap = [];

    destinations.forEach((destination: any) => {
      // Add state page (e.g., /villas/villas-in-goa)
      if (destination.name) {
        const stateSlug = formatCityNameLowerCase(
          destination.name
        )?.toLowerCase();
        if (stateSlug) {
          locationRoutes.push({
            url: `${baseUrl}/villas/villas-in-${stateSlug}`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily' as const,
            priority: 0.9,
          });
        }
      }

      destination.cities?.forEach((city: any) => {
        // Add city page - use city name directly (e.g., /villas/villas-in-deramandi)
        if (city.name) {
          const citySlug = formatCityNameLowerCase(city.name)?.toLowerCase();
          if (citySlug) {
            locationRoutes.push({
              url: `${baseUrl}/villas/villas-in-${citySlug}`,
              lastModified: new Date().toISOString().split('T')[0],
              changeFrequency: 'daily' as const,
              priority: 0.9,
            });
          }
        }

        // Add area pages within each city
        city.areas?.forEach((area: any) => {
          if (area.slug && city.name) {
            const citySlug = formatCityNameLowerCase(city.name)?.toLowerCase();
            if (citySlug) {
              locationRoutes.push({
                url: `${baseUrl}/villas/villas-in-${area.slug}`,
                lastModified: new Date().toISOString().split('T')[0],
                changeFrequency: 'daily' as const,
                priority: 0.9,
              });
            }
          }
        });
      });
    });

    console.log(
      '📍 Total location pages (states + cities + areas):',
      locationRoutes.length
    );

    // Fetch all blog posts
    const blogPosts = await getAllPostSlugs(1000); // Fetch up to 1000 blog posts

    // Generate individual blog post pages
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}/explore/blog/${post.slug}`,
      lastModified: post?.date
        ? new Date(post?.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Generate blog listing pages (pagination)
    const FIRST_PAGE_POSTS = 13;
    const POSTS_PER_PAGE = 12;
    const totalBlogPosts = blogPosts.length;
    const totalBlogPages =
      totalBlogPosts <= FIRST_PAGE_POSTS
        ? 1
        : 1 + Math.ceil((totalBlogPosts - FIRST_PAGE_POSTS) / POSTS_PER_PAGE);

    const blogListingRoutes: MetadataRoute.Sitemap = [];

    // Generate pagination routes starting from page 2 (page 1 is /explore/blogs)
    if (totalBlogPages > 1) {
      for (let i = 2; i <= totalBlogPages; i++) {
        blogListingRoutes.push({
          url: `${baseUrl}/explore/blogs/page/${i}`,
          lastModified: new Date().toISOString().split('T')[0],
          changeFrequency: 'daily' as const,
          priority: 0.9,
        });
      }
    }

    console.log('📰 Total blog posts:', blogRoutes.length);
    console.log('📋 Total blog listing pages:', blogListingRoutes.length);

    // Fetch SEO pages (same field-projected API as HTML sitemap / llms.txt)
    const seoPageEntries = await getSeoPageSitemapEntries();
    const seoPageRoutes: MetadataRoute.Sitemap =
      seoPageEntries.length > 0
        ? seoPageEntries.map((entry) => ({
            url: `${baseUrl}/${entry.slug.replace(/^\/+/, '')}`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily' as const,
            priority: 0.9,
          }))
        : [];
    console.log('🌐 Total SEO pages:', seoPageRoutes.length);

    return [
      ...staticRoutes,
      ...propertyRoutes,
      ...locationRoutes,
      ...blogRoutes,
      ...blogListingRoutes,
      ...seoPageRoutes,
    ];
  } catch (error) {
    console.error(
      'Error generating sitemap (API or dynamic generation failed):',
      error
    );
    // Fallback to hardcoded backup sitemap from sitemap---.xml
    return getBackupSitemap();
  }
}
