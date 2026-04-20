import { Metadata } from 'next';
import { getPartnerPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import PartnerPageDetail from '@/components/wordpressComponents/PartnerPage';

export async function generateMetadata(): Promise<Metadata> {
  const { partnerDetail } = await getPartnerPage('/partner');
  const page = partnerDetail?.page?.seo;
  const slug = page?.slug || 'partner';
  return await generatePageSeo({ page, slug });
}

export default async function PartnerPage() {
  const { partnerDetail, error } = await getPartnerPage('/partner');

  const partnerDetailData = partnerDetail?.page?.template?.partnerWithUsPage;

  return (
    <>
      <PartnerPageDetail template={partnerDetailData} />
    </>
  );
}
