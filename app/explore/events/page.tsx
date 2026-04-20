import { Metadata } from 'next';
import { getEventsPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import EventsPageDetail from '@/components/wordpressComponents/EventsPage';

export async function generateMetadata(): Promise<Metadata> {
  const { eventsDetail } = await getEventsPage('/events');
  const page = eventsDetail?.page?.seo;
  const slug = page?.slug || 'events';
  return await generatePageSeo({ page, slug });
}

export default async function PartnerPage() {
  const { eventsDetail, error } = await getEventsPage('/events');

  const eventsDetailData = eventsDetail?.page?.template?.eventsAndCulture;

  return (
    <>
      <EventsPageDetail template={eventsDetailData} />
    </>
  );
}
