'use client';

import { useEffect, useState } from 'react';

import { noCacheClient } from '@/lib/client/unified-client-manager';

interface DynamicDataWrapperProps<T> {
  query: any;
  variables?: any;
  fallbackData?: T;
  children: (
    data: T | null,
    loading: boolean,
    error: Error | null
  ) => React.ReactNode;
  onError?: (error: Error) => void;
  refetchInterval?: number;
}

export function DynamicDataWrapper<T>({
  query,
  variables,
  fallbackData,
  children,
  onError,
  refetchInterval,
}: DynamicDataWrapperProps<T>) {
  const [data, setData] = useState<T | null>(fallbackData || null);
  const [loading, setLoading] = useState(!fallbackData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await noCacheClient.request<any>(query);

        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch data');

        if (isMounted) {
          setError(error);
          onError?.(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Set up refetch interval if specified
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(fetchData, refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [query, JSON.stringify(variables), refetchInterval]);

  return <>{children(data, loading, error)}</>;
}
