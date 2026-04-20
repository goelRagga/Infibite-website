import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDetailPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import EyPageDetail from '@/components/wordpressComponents/EYPage';

const TBO_META = {
  title: 'Elivaas x TBO',
  description:
    'Explore TBO exclusive offers and villa stays. Book curated experiences with Elivaas.',
};

export async function generateMetadata(): Promise<Metadata> {
  const { pageDetail } = await getDetailPage('/tbo');
  const page = pageDetail?.page?.seo;
  const slug = page?.slug || 'tbo';
  const baseMetadata = await generatePageSeo({ page, slug });
  return {
    ...baseMetadata,
    title: TBO_META.title,
    description: TBO_META.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: TBO_META.title,
      description: TBO_META.description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: TBO_META.title,
      description: TBO_META.description,
    },
  };
}

export default async function TboDetail() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  if (accessToken?.value) {
    redirect('/');
  }
  return (
    <>
      <EyPageDetail
        regexpage='tbo'
        logo={`${process.env.IMAGE_DOMAIN}/tbo_svg_b6dc4ac5ff.svg`}
        mobileNumber={'+91 9009823000'}
      />
    </>
  );
}
