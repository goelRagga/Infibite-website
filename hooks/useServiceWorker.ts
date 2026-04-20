import { useEffect, useState, useCallback } from 'react';
import serviceWorkerManager from '@/lib/serviceWorker';

interface ServiceWorkerState {
  isSupported: boolean;
  isActive: boolean;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isActive: false,
  });

  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // Register service worker on mount
  useEffect(() => {
    const registerSW = async () => {
      const reg = await serviceWorkerManager.register();
      setRegistration(reg);

      if (reg) {
        setState((prev) => ({
          ...prev,
          isSupported: true,
          isActive: !!reg.active,
        }));
      }
    };

    registerSW();
  }, []);

  // Cache specific URLs
  const cacheUrls = useCallback(async (urls: string[]) => {
    await serviceWorkerManager.cacheUrls(urls);
  }, []);

  // Clear all caches
  const clearCaches = useCallback(async () => {
    await serviceWorkerManager.clearCaches();
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(async () => {
    return await serviceWorkerManager.getCacheStats();
  }, []);

  // Unregister service worker
  const unregister = useCallback(async () => {
    const result = await serviceWorkerManager.unregister();
    if (result) {
      setState((prev) => ({
        ...prev,
        isActive: false,
      }));
    }
    return result;
  }, []);

  return {
    ...state,
    registration,
    cacheUrls,
    clearCaches,
    getCacheStats,
    unregister,
  };
};
