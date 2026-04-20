import Link from 'next/link';
import { Metadata } from 'next';
import { serverClient } from '@/lib/client/unified-client-manager';
import {
  GET_DESTINATIONS_LIST,
  GET_PROPERTIES_DETAILS_LIST,
} from '@/lib/queries';
import { getAllPostSlugs } from '@/lib/wordpress/api';
import { capitalizeInitials, formatCityNameLowerCase } from '@/lib/utils';
import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import { getSeoPageSitemapEntries } from '@/lib/api/seo-page';

type Destination = {
  name?: string;
  slug?: string;
  cities?: {
    name?: string;
    slug?: string;
    areas?: { name?: string; slug?: string }[];
  }[];
};

type PropertyItem = {
  slug: string;
  name?: string;
  city?: string;
  citySlug?: string;
};

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Browse all cities, villas, and blog pages on Elivaas.',
};

const getDestinationSlug = (destination: Destination) => {
  if (destination.slug) return destination.slug;
  if (destination.name) return formatCityNameLowerCase(destination.name);
  return '';
};

const getCitySlug = (city?: { name?: string; slug?: string }) => {
  if (!city) return '';
  if (city.slug) return city.slug;
  if (city.name) return formatCityNameLowerCase(city.name);
  return '';
};

const getAreaSlug = (area?: { name?: string; slug?: string }) => {
  if (!area) return '';
  if (area.slug) return area.slug;
  if (area.name) return formatCityNameLowerCase(area.name);
  return '';
};

const fetchAllProperties = async (): Promise<PropertyItem[]> => {
  const pageSize = 100;
  let currentPage = 1;
  let hasNext = true;
  let allProperties: PropertyItem[] = [];

  while (hasNext) {
    const data = await serverClient.request<any>(GET_PROPERTIES_DETAILS_LIST, {
      page: currentPage,
      pageSize,
    });

    const list = data?.propertiesRatesV1?.list || [];
    allProperties = [...allProperties, ...list];

    hasNext = Boolean(data?.propertiesRatesV1?.hasNext);
    currentPage += 1;

    if (!list.length) {
      hasNext = false;
    }
  }

  return allProperties;
};

const SectionHeader = ({ title, href }: { title: string; href?: string }) => {
  const content = (
    <div className='py-3 px-0 text-left font-serif hover:underline text-base font-semibold uppercase tracking-wide text-accent-red-950 sm:text-xl'>
      {title}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className='block'>
        {content}
      </Link>
    );
  }

  return content;
};

const SectionLinks = ({
  links,
  className = '',
}: {
  links: { href: string; label: string }[];
  className?: string;
}) => (
  <ul
    className={`grid grid-cols-1 gap-x-8 gap-y-2 px-0 py-4 text-sm sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 ${className} list-disc list-inside`}
  >
    {links.map((link) => (
      <li key={link.href}>
        <Link
          href={link.href}
          className='text-[#1a1a1a] transition-colors hover:text-black hover:underline'
        >
          {capitalizeInitials(link.label)}
        </Link>
      </li>
    ))}
  </ul>
);

const GroupedLinks = ({
  groupedLinks,
  className = '',
}: {
  groupedLinks: { letter: string; links: { href: string; label: string }[] }[];
  className?: string;
}) => (
  <div className={`px-0 py-4 columns-1 sm:columns-2 gap-20 ${className}`}>
    {groupedLinks.map((group) => (
      <div key={group.letter} className='mb-4 break-inside-avoid'>
        <div className='mb-2 text-base sm:text-xl font-semibold text-accent-red-900 border-b border-secondary-800 pb-2'>
          {group.letter}
        </div>
        <ul className='list-disc list-inside text-sm space-y-3'>
          {group.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className='text-[#1a1a1a] transition-colors hover:text-black hover:underline'
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default async function SitemapHtmlPage() {
  const [
    destinationsResult,
    propertiesResult,
    blogPostsResult,
    seoSitemapResult,
  ] = await Promise.allSettled([
    serverClient.request<any>(GET_DESTINATIONS_LIST),
    fetchAllProperties(),
    getAllPostSlugs(1000),
    getSeoPageSitemapEntries(),
  ]);
  const destinations: Destination[] =
    destinationsResult.status === 'fulfilled'
      ? destinationsResult.value?.destinations || []
      : [];

  const properties: PropertyItem[] =
    propertiesResult.status === 'fulfilled' ? propertiesResult.value : [];

  const seoSitemapEntries =
    seoSitemapResult.status === 'fulfilled' ? seoSitemapResult.value : [];

  const blogPosts: {
    slug: string;
    title?: string;
    seo?: { title?: string };
  }[] =
    blogPostsResult.status === 'fulfilled' ? blogPostsResult.value || [] : [];

  const sortedDestinations = [...destinations].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );

  const propertyLinks = properties
    .filter((property) => property?.slug)
    .map((property: any) => {
      const citySlug =
        property.citySlug || formatCityNameLowerCase(property.city || '');
      return {
        href: `/villa-in-${citySlug}/${property.slug}`,
        label: property?.metaTag?.title
          ? property?.metaTag?.title
          : property.slug,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const groupedPropertyLinks = propertyLinks.reduce(
    (acc, link) => {
      const trimmed = link.label.trim();
      const firstChar = trimmed ? trimmed[0].toUpperCase() : '#';
      const letter = /^[A-Z]$/.test(firstChar) ? firstChar : '#';
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(link);
      return acc;
    },
    {} as Record<string, { href: string; label: string }[]>
  );

  const propertyLetterGroups = Object.keys(groupedPropertyLinks)
    .sort((a, b) => a.localeCompare(b))
    .map((letter) => ({
      letter,
      links: groupedPropertyLinks[letter].sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    }));
  const blogLinks = blogPosts.map((post) => ({
    href: `/explore/blog/${post.slug}`,
    label: post?.seo?.title || post?.title || post.slug.replace(/-/g, ' '),
  }));

  const seoPageLinks = seoSitemapEntries
    .map((entry) => {
      const slug = entry.slug.replace(/^\/+/, '');
      const fallbackLabel = capitalizeInitials(
        slug.replace(/-/g, ' ').replace(/\//g, ' / ')
      );
      return {
        href: `/${slug}`,
        label: entry.bannerTitle || entry.metaTitle || fallbackLabel,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const otherPageLinks = [
    { href: '/explore/about-us', label: 'About Us' },
    { href: '/explore/blogs', label: 'Blogs' },
    { href: '/explore/team', label: 'Our Team' },
    { href: '/explore/contact', label: 'Contact Us' },
    { href: '/explore/press-release', label: 'Press Release' },
    { href: '/explore/partner', label: 'Partner with us' },
    { href: '/explore/corporate-offsite', label: 'Corporate Offsite' },
    { href: '/explore/event', label: 'Event' },
    { href: 'https://careers.elivaas.com/careers', label: 'Careers' },
  ];

  return (
    <div className='mx-auto w-full max-w-[96%] px-4 py-8'>
      <CustomBreadcrumb
        className='pb-4 bg-white'
        items={[
          { label: 'Home', href: '/' },
          { label: 'Sitemap', href: '/sitemap' },
        ]}
      />
      {sortedDestinations.map((destination) => {
        const destinationSlug = getDestinationSlug(destination);
        const destinationHref = destinationSlug
          ? `/villas/villas-in-${destinationSlug}`
          : undefined;

        const cityLinks =
          destination.cities
            ?.filter((city) => city?.name || city?.slug)
            .flatMap((city) => {
              const citySlug = getCitySlug(city);
              const areaLinks =
                city.areas
                  ?.filter((area) => area?.name || area?.slug)
                  .map((area) => {
                    const areaSlug = getAreaSlug(area);
                    return {
                      href: `/villas/villas-in-${areaSlug}`,
                      label: `Villas In ${area?.name || areaSlug}`,
                    };
                  }) || [];

              return [
                {
                  href: `/villas/villas-in-${citySlug}`,
                  label: `Villas In ${city?.name || citySlug}`,
                },
                ...areaLinks,
              ];
            })
            .sort((a, b) => a.label.localeCompare(b.label)) || [];

        if (!destination.name || !cityLinks.length) {
          return null;
        }

        return (
          <section key={destination.name} className='border-b border-[#e6e6e6]'>
            <SectionHeader
              title={`Villas In ${destination.name}`}
              href={destinationHref}
            />
            <SectionLinks links={cityLinks} />
          </section>
        );
      })}

      <section className='border-b border-[#e6e6e6]'>
        <SectionHeader title='Other Pages' />
        <SectionLinks
          links={otherPageLinks}
          className='lg:grid-cols-2 xl:grid-cols-2'
        />
      </section>

      {seoPageLinks.length > 0 && (
        <section className='border-b border-[#e6e6e6]'>
          <SectionHeader title='Explore listings' />
          <SectionLinks
            links={seoPageLinks}
            className='lg:grid-cols-2 xl:grid-cols-2'
          />
        </section>
      )}

      <section className='border-b border-[#e6e6e6]'>
        <SectionHeader title='Luxury Villas' />
        <GroupedLinks groupedLinks={propertyLetterGroups} />
      </section>

      <section className='border-b border-[#e6e6e6]'>
        <SectionHeader title='Explore Blogs' href='/explore/blogs' />
        <SectionLinks
          links={blogLinks}
          className='lg:grid-cols-2 xl:grid-cols-2!'
        />
      </section>
    </div>
  );
}
