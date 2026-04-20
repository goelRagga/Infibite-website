import { Metadata } from 'next';
import { getDetailPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import EyPageDetail from '@/components/wordpressComponents/EYPage';

export async function generateMetadata(): Promise<Metadata> {
  const { pageDetail } = await getDetailPage('/ey');
  const page = pageDetail?.page?.seo;
  const slug = page?.slug || 'ey';
  return await generatePageSeo({ page, slug });
}

const EYDetail: React.FC<{}> = ({}) => {
  return (
    <>
      <EyPageDetail
        regexpage='ey'
        logo={`${process.env.IMAGE_DOMAIN}/ey_Logo_Svg_c1413a5be1.svg`}
      />
    </>
  );
};

export default EYDetail;
