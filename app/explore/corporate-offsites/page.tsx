import { Metadata } from 'next';
import { getCorporatePage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import PartnerPageDetail from '@/components/wordpressComponents/PartnerPage';
import CorporatePageDetail from '@/components/wordpressComponents/CorporatePage';

export async function generateMetadata(): Promise<Metadata> {
  const { corporateDetail } = await getCorporatePage('/corporate-offsites');
  const page = corporateDetail?.page?.seo;
  const slug = page?.slug || 'corporate-offsites';
  return await generatePageSeo({ page, slug });
}

export default async function PartnerPage() {
  const { corporateDetail, error } = await getCorporatePage(
    '/corporate-offsites'
  );

  const corporateDetailData = corporateDetail?.page?.template?.corporatePage;

  return (
    <>
      <div className=''>
        <CorporatePageDetail template={corporateDetailData} />
      </div>
    </>
  );
}
