import { KEY_VALUE_KEYS } from '@/lib/constants';
import { getKeyValueData, getEventPropertiesByTag } from '@/lib/api';
import EventListingPage from '@/components/wordpressComponents/eventListingPage';

export default async function CorporateOffsiteListing() {
  const [corporateOffsiteListingPageContent] = await Promise.all([
    getKeyValueData<any>(KEY_VALUE_KEYS.CORPORATE_OFFSITE_LISTING_PAGE_CONTENT),
  ]);

  const eventPropertiesByTag = await getEventPropertiesByTag({
    tag: 2,
    page: 0,
    pageSize: 10,
  });

  const redirectionUrl = corporateOffsiteListingPageContent?.data?.redirectUrl;

  return (
    <>
      {eventPropertiesByTag ? (
        <EventListingPage
          isCorporateOffsite={true}
          propertyData={eventPropertiesByTag}
          content={corporateOffsiteListingPageContent}
          redirectUrl={redirectionUrl ?? ''}
          isPartnerSection={false}
          isBannerInfoBox={false}
          isEventSpaces={false}
        />
      ) : (
        <div>No properties found</div>
      )}
    </>
  );
}
