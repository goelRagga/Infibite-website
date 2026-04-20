import { Metadata } from 'next';
import { getDetailPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import PetFriendlyPageDetail from '@/components/wordpressComponents/PetFriendlyPage';

export async function generateMetadata(): Promise<Metadata> {
  const { pageDetail } = await getDetailPage('/pet-friendly-villas');
  const page = pageDetail?.page?.seo;
  const slug = page?.slug || 'pet-friendly-villas';
  return await generatePageSeo({ page, slug });
}

export default async function PartnerPage() {
  const { pageDetail, error } = await getDetailPage('/pet-friendly-villas');

  return (
    <>
      <div className=''>
        <PetFriendlyPageDetail />
      </div>
    </>
  );
}
