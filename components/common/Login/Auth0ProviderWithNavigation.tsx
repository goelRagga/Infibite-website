'use client';

import { Auth0Provider } from '@auth0/auth0-react';

import { useRouter } from 'next/navigation';
import React from 'react';
interface Auth0ProviderWithNavigationProps {
  children: React.ReactNode;
}
const Auth0ProviderWithNavigation: React.FC<
  Auth0ProviderWithNavigationProps
> = ({ children }) => {
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '';

  const onRedirectCallback = (appState: any) => {
    router.push(appState?.returnTo || window.location.pathname);
  };

  if (!domain || !clientId || !audience) {
    console.error(
      'Missing Auth0 configuration. Please check your environment variables.'
    );
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri:
          typeof window !== 'undefined' ? window.location.origin : '',
        audience: audience,
        scope: 'openid profile email offline_access',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
      useRefreshTokensFallback={false}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigation;
