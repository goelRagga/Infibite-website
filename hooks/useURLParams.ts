import Cookies from 'js-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface URLParamConfig {
  [key: string]: {
    paramName: string;
    defaultValue?: any;
    transform?: {
      toParam?: (value: any) => string;
      fromParam?: (value: string) => any;
    };
    shouldInclude?: (value: any) => boolean;
  };
}

interface UseURLParamsOptions {
  customConfig?: URLParamConfig;
  preserveChannelId?: boolean;
  scrollBehavior?: boolean;
}

const DEFAULT_PARAM_CONFIGS: URLParamConfig = {
  // Filter params
  city: { paramName: 'city', defaultValue: null },
  checkinDate: { paramName: 'checkin', defaultValue: null },
  checkoutDate: { paramName: 'checkout', defaultValue: null },
  // Guest params
  numberOfGuests: {
    paramName: 'adults',
    defaultValue: 1,
    transform: {
      toParam: (value: number) => value.toString(),
      fromParam: (value: string) => parseInt(value),
    },
    shouldInclude: (value: number) => value !== 1,
  },
  numberOfChildren: {
    paramName: 'children',
    defaultValue: 0,
    transform: {
      toParam: (value: number) => value.toString(),
      fromParam: (value: string) => parseInt(value),
    },
    shouldInclude: (value: number) => value !== 0,
  },
  mealPlan: { paramName: 'mealPlan', defaultValue: null },
  couponCode: { paramName: 'couponCode', defaultValue: null },
  bankOffer: { paramName: 'bankOffer', defaultValue: null },
  wallet: { paramName: 'wallet', defaultValue: null },
  getquote: { paramName: 'getquote', defaultValue: null },
  service: {
    paramName: 'service',
    defaultValue: null,
  },
  cancellationPlan: {
    paramName: 'cancellationPlan',
    defaultValue: null,
  },
  source: { paramName: 'source', defaultValue: null },
  medium: { paramName: 'medium', defaultValue: null },
  campaign: { paramName: 'campaign', defaultValue: null },
  term: { paramName: 'term', defaultValue: null },
  content: { paramName: 'content', defaultValue: null },
  paymentId: { paramName: 'paymentId', defaultValue: null },
};

export function useURLParams(options: UseURLParamsOptions = {}) {
  const {
    customConfig = {},
    preserveChannelId = false,
    scrollBehavior = false,
  } = options;

  const searchParams = useSearchParams();
  const router = useRouter();

  const config = { ...DEFAULT_PARAM_CONFIGS, ...customConfig };

  // Get fresh pathname on each render instead of capturing it once
  const pathname = usePathname();

  const getParam = useCallback(
    <T = any>(key: string): T | null => {
      const paramConfig = config[key];
      if (!paramConfig) return null;

      const urlValue = searchParams.get(paramConfig.paramName);
      if (!urlValue) return paramConfig.defaultValue ?? null;

      if (paramConfig.transform?.fromParam) {
        return paramConfig.transform.fromParam(urlValue);
      }

      return urlValue as T;
    },
    [searchParams, config]
  );

  const getParams = useCallback(
    <T extends Record<string, any>>(keys: (keyof T)[]): Partial<T> => {
      const result: Partial<T> = {};

      keys.forEach((key) => {
        const value = getParam(key as string);
        if (value !== null) {
          result[key] = value;
        }
      });

      return result;
    },
    [getParam]
  );

  const getAllParams = useCallback(() => {
    const result: Record<string, any> = {};

    Object.keys(config).forEach((key) => {
      const paramConfig = config[key];
      const value = getParam(key);
      if (value !== null) {
        result[paramConfig.paramName] = value;
      }
    });

    return result;
  }, [config, getParam]);

  const setParam = useCallback((key: string, value: any) => {
    setParams({ [key]: value });
  }, []);

  const setParams = useCallback(
    (updates: Record<string, any>) => {
      const currentUrl = new URL(window.location.href);
      const currentParams = new URLSearchParams(currentUrl.search);

      const paramsObj = Object.fromEntries(currentParams.entries());

      Object.entries(updates).forEach(([key, value]) => {
        const paramConfig = config[key];
        if (!paramConfig) return;

        const paramName = paramConfig.paramName;
        const shouldInclude = paramConfig.shouldInclude
          ? paramConfig.shouldInclude(value)
          : value !== null &&
            value !== undefined &&
            value !== paramConfig.defaultValue;

        if (shouldInclude) {
          const paramValue = paramConfig.transform?.toParam
            ? paramConfig.transform.toParam(value)
            : String(value);
          currentParams.set(paramName, paramValue);
        } else {
          currentParams.delete(paramName);
        }
      });

      if (preserveChannelId) {
        const channelId = Cookies.get('Channel-Id');
        if (channelId) {
          currentParams.set('channelId', channelId);
        }
      }

      const queryString = currentParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [router, config, preserveChannelId, scrollBehavior, pathname]
  );

  const removeParams = useCallback(
    (keys: string[]) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      keys.forEach((key) => {
        const paramConfig = config[key];
        if (paramConfig) {
          currentParams.delete(paramConfig.paramName);
        }
      });

      if (preserveChannelId) {
        const channelId = Cookies.get('Channel-Id');
        if (channelId) {
          currentParams.set('channelId', channelId);
        }
      }

      const queryString = currentParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [searchParams, router, config, preserveChannelId, scrollBehavior, pathname]
  );

  const clearAllParams = useCallback(() => {
    const newParams = new URLSearchParams();

    if (preserveChannelId) {
      const channelId = Cookies.get('Channel-Id');
      if (channelId) {
        newParams.set('channelId', channelId);
      }
    }

    const queryString = newParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, '', newUrl);
  }, [router, preserveChannelId, scrollBehavior, pathname]);

  const updateParams = useCallback(
    (updates: Record<string, any>) => {
      setParams(updates);
    },
    [setParams]
  );

  const hasParam = useCallback(
    (key: string): boolean => {
      const paramConfig = config[key];
      return paramConfig ? searchParams.has(paramConfig.paramName) : false;
    },
    [searchParams, config]
  );

  const navigateWithParams = (path: string, options?: { scroll?: boolean }) => {
    const currentParams = getAllParams();

    const queryParams = new URLSearchParams();
    Object.entries(currentParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          queryParams.set(key, value.join(','));
        } else {
          queryParams.set(key, String(value));
        }
      }
    });

    const queryString = queryParams.toString();
    const finalUrl = queryString ? `${path}?${queryString}` : path;

    router.push(finalUrl, options || { scroll: false });
  };

  const navigateWithCustomParams = (
    path: string,
    customParams: Record<string, any> = {},
    options?: { scroll?: boolean }
  ) => {
    const currentParams = getAllParams();
    const mergedParams = { ...currentParams, ...customParams };

    const queryParams = new URLSearchParams();
    Object.entries(mergedParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          queryParams.set(key, value.join(','));
        } else {
          queryParams.set(key, String(value));
        }
      }
    });

    const queryString = queryParams.toString();
    const finalUrl = queryString ? `${path}?${queryString}` : path;

    router.push(finalUrl, options || { scroll: false });
  };

  return {
    // Getters
    getParam,
    getParams,
    getAllParams,
    hasParam,

    // Setters
    setParam,
    setParams,
    updateParams,
    removeParams,
    clearAllParams,

    // Utility
    searchParams,
    config,

    //Navigation
    navigateWithParams,
    navigateWithCustomParams,
  };
}
