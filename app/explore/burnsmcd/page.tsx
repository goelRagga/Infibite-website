import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDetailPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import EyPageDetail from '@/components/wordpressComponents/EYPage';

const BURNSMCD_META = {
  title: 'Elivaas x BurnsMcD',
  description:
    'Explore Burns and McDonnell exclusive offers and villa stays. Book curated experiences with Elivaas.',
};

export async function generateMetadata(): Promise<Metadata> {
  const { pageDetail } = await getDetailPage('/burnsmcd');
  const page = pageDetail?.page?.seo;
  const slug = page?.slug || 'burnsmcd';
  const baseMetadata = await generatePageSeo({ page, slug });
  return {
    ...baseMetadata,
    title: BURNSMCD_META.title,
    description: BURNSMCD_META.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: BURNSMCD_META.title,
      description: BURNSMCD_META.description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: BURNSMCD_META.title,
      description: BURNSMCD_META.description,
    },
  };
}

export default async function BurnsmcdDetail() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  if (accessToken?.value) {
    redirect('/');
  }

  return (
    <>
      <EyPageDetail
        regexpage='burnsmcd'
        logo={`${process.env.IMAGE_DOMAIN}/burns_7c9f84a071.svg`}
      />
    </>
  );
}
