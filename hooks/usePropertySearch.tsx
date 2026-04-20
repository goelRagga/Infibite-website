import urqlClient from '@/lib/client/unified-client-manager';
import { GET_PROPERTIES_LISTING } from '@/lib/queries';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function usePropertySearch(
  searchValue: string,
  minCharacters: number = 3
) {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isCorporateChannel = Cookies.get('isCorporateChannel');

  useEffect(() => {
    if (!searchValue.trim() || searchValue.trim().length < minCharacters) {
      setProperties([]);
      return;
    }

    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const result = await urqlClient
          .query(
            GET_PROPERTIES_LISTING,
            {
              page: 0,
              pageSize: 12,
              keyword: searchValue.trim(),
            },
            {
              requestPolicy: 'network-only',
              fetchOptions: {
                headers: {
                  'Channel-Id': isCorporateChannel
                    ? isCorporateChannel
                    : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
                },
              },
            }
          )
          .toPromise();

        if (result.error) throw result.error;

        const fetchedProperties = result.data?.propertiesRatesV1?.list || [];
        setProperties(fetchedProperties);
      } catch (error) {
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProperties, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, minCharacters, urqlClient]);

  return { properties, isLoading };
}
