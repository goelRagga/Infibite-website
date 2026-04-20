'use client';

import { ReactNode } from 'react';
import { Provider as UrqlProvider } from 'urql';
import CouponProvider from './coupons/CouponProvider';
import { FilterProvider } from './filters';
import { PropertyProvider } from './property';
import { SharedProvider } from './SharedProvider';
import { VASProvider } from './vas-context';
import urqlClient from '@/lib/client/unified-client-manager';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UrqlProvider value={urqlClient}>
      <SharedProvider>
        <VASProvider>
          <CouponProvider>
            <FilterProvider>
              {/* Add other providers here as you implement them */}
              <PropertyProvider>{children}</PropertyProvider>
            </FilterProvider>
          </CouponProvider>
        </VASProvider>
      </SharedProvider>
    </UrqlProvider>
  );
}
