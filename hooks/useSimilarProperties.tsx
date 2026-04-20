import { Property } from '@/contexts/property/property-types';
import { GET_PROPERTIES_LISTING } from '@/lib/queries';
import { rankPropertiesBySimilarity } from '@/lib/similarProperties/SimilarPropertiesRankingUtil';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { useClient } from 'urql';

type SimilarProperty = Property;

interface UseSimilarPropertiesProps {
  currentPropertyInfo: Property;
  guestsData: any;
  checkin?: string;
  checkout?: string;
  limit?: number;
  applyAutoBankOffer?: boolean;
}

export const useSimilarProperties = ({
  currentPropertyInfo,
  guestsData,
  checkin,
  checkout,
  limit = 5,
  applyAutoBankOffer = true,
}: UseSimilarPropertiesProps) => {
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const client = useClient();
  const isCorporateChannel = Cookies.get('isCorporateChannel');

  const fetchSimilarProperties = useCallback(async () => {
    if (!currentPropertyInfo?.citySlug) return;

    setLoading(true);
    setError(null);

    try {
      const filters = {
        city: currentPropertyInfo.citySlug,
        adults: guestsData?.numberOfGuests || 1,
        children: guestsData?.numberOfChildren || 0,
        ...(checkin &&
          checkout && {
            checkinDate: checkin,
            checkoutDate: checkout,
          }),
        ...(applyAutoBankOffer && {
          applyAutoBankOffer: true,
        }),
      };

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== null && value !== undefined
        )
      );

      const result = await client
        .query(
          GET_PROPERTIES_LISTING,
          {
            page: 0,
            pageSize: 12,
            filters: cleanFilters,
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

      if (result.error) {
        throw result.error;
      }

      if (result.data?.propertiesRatesV1) {
        const candidateProperties = result.data.propertiesRatesV1.list.filter(
          (property: Property) => property?.id !== currentPropertyInfo?.id
        );

        const rankedProperties = rankPropertiesBySimilarity(
          currentPropertyInfo,
          candidateProperties,
          limit
        );

        setSimilarProperties(rankedProperties);
      }
    } catch (err) {
      console.error('Error fetching similar properties:', err);
      setError('Failed to load similar properties');
    } finally {
      setLoading(false);
    }
  }, [
    currentPropertyInfo,
    guestsData?.numberOfGuests,
    guestsData?.numberOfChildren,
    checkin,
    checkout,
    client,
    limit,
  ]);

  useEffect(() => {
    fetchSimilarProperties();
  }, [fetchSimilarProperties]);

  const refetch = useCallback(() => {
    fetchSimilarProperties();
  }, [fetchSimilarProperties]);

  return {
    similarProperties,
    loading,
    error,
    refetch,
  };
};
