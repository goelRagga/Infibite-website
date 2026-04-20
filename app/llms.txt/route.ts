import { serverClient } from '@/lib/client/unified-client-manager';
import { GET_DESTINATIONS_LIST } from '@/lib/queries';
import { formatCityName, formatCityNameLowerCase } from '@/lib/utils';
import { getSeoPageSitemapEntries } from '@/lib/api/seo-page';
import { buildLlmsTxtContent, type SeoPageEntry } from '@/lib/llms-txt';

/** Cache llms.txt for 24 hour (CDN/edge). Longer = fewer API calls; shorter = fresher content after CMS/destination changes. */
const REVALIDATE_SECONDS = 86400;

export async function GET() {
  const baseUrl = 'https://www.elivaas.com';

  try {
    type AreaItem = {
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
    };
    type CityItem = {
      name?: string;
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
      areas?: AreaItem[];
    };
    type DestItem = {
      name?: string;
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
      cities?: CityItem[];
    };

    const [destinationsResult, seoSitemapResult] = await Promise.allSettled([
      serverClient.request<{ destinations?: DestItem[] }>(
        GET_DESTINATIONS_LIST
      ),
      getSeoPageSitemapEntries(),
    ]);

    const destinations =
      destinationsResult.status === 'fulfilled'
        ? (destinationsResult.value?.destinations ?? [])
        : [];

    const destinationUrls: string[] = [];
    const keyDestinationUrls: string[] = [];
    const mainNavEntries: SeoPageEntry[] = [];

    const fallbackTitle = (name: string) =>
      `Luxury Villas in ${formatCityName(name)}`;
    const fallbackDesc = (name: string) =>
      `Explore luxury villas in ${formatCityName(name)}. Book with ELIVAAS.`;

    destinations.forEach((destination: DestItem) => {
      if (destination.name) {
        const stateSlug = formatCityNameLowerCase(
          destination.name
        )?.toLowerCase();
        if (stateSlug) {
          const stateUrl = `${baseUrl}/villas/villas-in-${stateSlug}`;
          destinationUrls.push(stateUrl);
          keyDestinationUrls.push(stateUrl);
          mainNavEntries.push({
            url: stateUrl,
            metaTitle:
              destination.metaTitle?.trim() || fallbackTitle(destination.name),
            metaDescription:
              destination.metaDescription?.trim() ||
              fallbackDesc(destination.name),
          });
        }
      }
      destination.cities?.forEach((city: CityItem) => {
        if (city.name) {
          const citySlug = formatCityNameLowerCase(city.name)?.toLowerCase();
          if (citySlug) {
            const cityUrl = `${baseUrl}/villas/villas-in-${citySlug}`;
            destinationUrls.push(cityUrl);
            keyDestinationUrls.push(cityUrl);
            mainNavEntries.push({
              url: cityUrl,
              metaTitle: city.metaTitle?.trim() || fallbackTitle(city.name),
              metaDescription:
                city.metaDescription?.trim() || fallbackDesc(city.name),
            });
          }
        }
        city.areas?.forEach((area: AreaItem) => {
          if (area.slug) {
            const areaUrl = `${baseUrl}/villas/villas-in-${area.slug}`;
            destinationUrls.push(areaUrl);
            const displayName = formatCityName(area.slug.replace(/-/g, ' '));
            mainNavEntries.push({
              url: areaUrl,
              metaTitle: area.metaTitle?.trim() || fallbackTitle(displayName),
              metaDescription:
                area.metaDescription?.trim() || fallbackDesc(displayName),
            });
          }
        });
      });
    });

    const seoPageEntriesFromApi: SeoPageEntry[] =
      seoSitemapResult.status === 'fulfilled'
        ? (seoSitemapResult.value ?? []).map((row) => ({
            url: `${baseUrl}/${row.slug.replace(/^\/+/, '')}`,
            metaTitle: row.metaTitle,
            metaDescription: row.metaDescription,
          }))
        : [];

    const body = buildLlmsTxtContent({
      baseUrl,
      destinationUrls: [...new Set(destinationUrls)].sort(),
      keyDestinationUrls: [...new Set(keyDestinationUrls)].sort(),
      seoPageEntries: seoPageEntriesFromApi,
      mainNavEntries: Array.from(
        new Map(mainNavEntries.map((e) => [e.url, e])).values()
      ).sort((a, b) => a.url.localeCompare(b.url)),
    });

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error('[llms.txt] Generation failed:', error);
    return new Response(
      `# ELIVAAS – Luxury Villa Vacation Rentals in India\n## Error generating dynamic content\nWebsite: ${baseUrl}\nContact: support@elivaas.com\n`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
