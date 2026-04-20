import { Metadata } from 'next';
import { getContactPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import ContactPage from '@/components/wordpressComponents/ContactPage';

export async function generateMetadata(): Promise<Metadata> {
  const { contactDetail } = await getContactPage('/contact');
  const page = contactDetail?.page?.seo;
  const slug = page?.slug || 'contact';
  return await generatePageSeo({ page, slug });
}

export default async function AboutPage() {
  const { contactDetail, error } = await getContactPage('/contact');
  const contactDetailData = contactDetail?.page?.template?.contactPage;

  return (
    <>
      <ContactPage contactPage={contactDetailData} />
    </>
  );
}
