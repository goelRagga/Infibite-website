import AboutPage from '@/components/wordpressComponents/AboutPage';
import { getAboutPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { aboutPage } = await getAboutPage('/about-us');
  const page = aboutPage?.page?.seo;
  const slug = page?.slug || 'about-us';
  return await generatePageSeo({ page, slug });
}

export default async function AboutUsPage() {
  const { aboutPage: aboutPageData } = await getAboutPage('/about-us');
  const aboutPage = aboutPageData?.page;

  return (
    <>
      <AboutPage aboutPage={aboutPage} />
    </>
  );
}
