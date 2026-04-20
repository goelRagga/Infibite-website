import { KEY_VALUE_KEYS } from '@/lib/constants';
import { getKeyValueData, getEventPropertiesByTag } from '@/lib/api';
import EventListingPage from '@/components/wordpressComponents/eventListingPage';

export default async function EventListing() {
  const [eventsListingPageContent] = await Promise.all([
    getKeyValueData<any>(KEY_VALUE_KEYS.EVENTS_LISTING_PAGE_CONTENT),
  ]);

  const eventPropertiesByTag = await getEventPropertiesByTag({
    tag: 1,
    page: 0,
    pageSize: 7,
  });

  const redirectionUrl = eventsListingPageContent?.data?.redirectUrl;

  return (
    <>
      {eventPropertiesByTag ? (
        <EventListingPage
          propertyData={eventPropertiesByTag}
          content={eventsListingPageContent}
          redirectUrl={redirectionUrl ?? ''}
        />
      ) : (
        <div>No properties found</div>
      )}
    </>
  );
}
