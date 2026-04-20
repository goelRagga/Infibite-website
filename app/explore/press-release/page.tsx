import { Metadata } from 'next';
import { getPressReleasePage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import PressReleases from '@/components/wordpressComponents/PressReleases';

export async function generateMetadata(): Promise<Metadata> {
  const { pressReleaseDetail } = await getPressReleasePage('/press-release');
  const page = pressReleaseDetail?.page?.seo;
  const slug = page?.slug || 'press-release';
  return await generatePageSeo({ page, slug });
}

export default async function PressReleasePage() {
  const { pressReleaseDetail, error } =
    await getPressReleasePage('/press-release');

  const pressReleaseData = pressReleaseDetail?.page?.template?.pressReleasePage;

  return (
    <>
      <div className='md:px-10 pb-10'>
        <PressReleases data={pressReleaseData} />
      </div>
    </>
  );
}
