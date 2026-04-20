import DynamicSearchPageContent from '@/components/modules/DynamicSearchPage';
import {
  getEventPropertiesByTag,
  getSeoPage,
  getSeoPageSlugs,
  seoPageResponseMatchesSlug,
} from '@/lib/api';
import { Metadata } from 'next';
import NotFound from '../not-found';

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const { slugs, error } = await getSeoPageSlugs({ revalidate });
  if (error) return [];
  return slugs
    .filter((s) => s.split('/').length !== 2)
    .map((s) => ({ slug: s.split('/') }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = segments.join('/');
  const { data } = await getSeoPage(slug, { revalidate });
  if (!data?.path) return {};
  if (!seoPageResponseMatchesSlug(slug, data)) return {};
  const title = data.path.metaTitle ?? data.seoContent?.title;
  const description = data.path.metaDescription ?? data.seoContent?.description;
  const canonicalUrl = `https://www.elivaas.com/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, type: 'website', url: canonicalUrl },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function DynamicSearchPage({ params }: PageProps) {
  const { slug: segments } = await params;
  const slug = segments.join('/');
  const { data, error } = await getSeoPage(slug, { revalidate });

  if (error || !data) {
    return <NotFound />;
  }

  if (!seoPageResponseMatchesSlug(slug, data)) {
    return <NotFound />;
  }

  const tagSlug = data.path?.slug ?? slug;
  const {
    list: eventListing,
    pageInfo: eventPageInfo,
    error: eventError,
  } = await getEventPropertiesByTag({
    tag: tagSlug,
    page: 0,
    pageSize: 20,
  });

  return (
    <DynamicSearchPageContent
      data={data}
      slug={slug}
      eventListing={eventError ? [] : eventListing}
      eventPageInfo={eventError ? null : eventPageInfo}
      eventTag={tagSlug}
    />
  );
}
