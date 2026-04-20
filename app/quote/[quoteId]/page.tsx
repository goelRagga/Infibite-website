import { serverClient } from '@/lib/client/unified-client-manager';
import { GET_REVIEW_BOOKING_DETAILS } from '@/lib/queries';

export default async function QuoteRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ quoteId: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { quoteId } = await params;
  const search = await searchParams;

  const queryParams = new URLSearchParams();
  const userParams = ['firstName', 'lastName', 'email', 'mobile', 'city'];
  const campaignParams = ['source', 'medium', 'campaign', 'term', 'content'];

  [...campaignParams, ...userParams].forEach((key) => {
    const value = search[key];
    if (value) queryParams.append(key, value);
  });

  try {
    const data = await serverClient.request<any>(GET_REVIEW_BOOKING_DETAILS, {
      filters: { quoteId },
    });

    const propertyList = data?.propertiesRatesV1?.list || [];

    if (!propertyList.length) {
      console.error('No property data found for quote ID:', quoteId);
      return <MetaRedirect url='/error?reason=property-not-found' />;
    }

    const property = propertyList[0];
    const propertyDataId = property.id;

    if (property.quotes?.length > 0) {
      const propertyQuote = property.quotes[0];
      if (propertyQuote?.checkinDate)
        queryParams.append('checkin', propertyQuote?.checkinDate);
      if (propertyQuote?.checkoutDate)
        queryParams.append('checkout', propertyQuote?.checkoutDate);
      if (propertyQuote?.adults)
        queryParams.append('adults', propertyQuote?.adults);
      if (propertyQuote?.children)
        queryParams.append('children', propertyQuote?.children);
      if (propertyQuote?.couponCode)
        queryParams.append('couponCode', propertyQuote?.couponCode.toString());
      if (propertyQuote?.bankOfferCode)
        queryParams.append(
          'bankOfferCode',
          propertyQuote?.bankOfferCode.toString()
        );
      if (propertyQuote?.cancellationPlan?.ruleId)
        queryParams.append(
          'cancellationPlan',
          propertyQuote?.cancellationPlan?.ruleId.toString()
        );
      if (propertyQuote?.ratePlan?.code)
        queryParams.append(
          'mealPlan',
          propertyQuote?.ratePlan?.code.toString()
        );

      if (Array.isArray(propertyQuote?.vas) && propertyQuote.vas.length > 0) {
        const serviceParams = propertyQuote.vas
          .map((vas: any) => `${vas.id}:${vas.quantity || 1}`)
          .join(',');

        if (serviceParams) {
          queryParams.append('service', serviceParams);
        }
      }
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : '';

    const redirectUrl = `/booking/${propertyDataId}${queryString}`;

    return <MetaRedirect url={redirectUrl} />;
  } catch (error: any) {
    console.error('Error in QuoteRedirectPage:', error);
    return <MetaRedirect url='/' />;
  }
}

function MetaRedirect({ url }: { url: string }) {
  return (
    <html>
      <head>
        <meta httpEquiv='refresh' content={`0;url=${url}`} />
        <title>Redirecting...</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.location.href = "${url}";
          `,
          }}
        />
      </head>
    </html>
  );
}
