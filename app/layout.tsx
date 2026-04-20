import SuspenseLoader from '@/components/common/SuspenseLoader';
import { Toaster } from '@/components/ui/sonner';
import { AppProviders } from '@/contexts/AppProviders';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import type { Metadata, Viewport } from 'next';
import { DM_Serif_Display, Poppins } from 'next/font/google';
import Image from 'next/image';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientSideLayout from './clientLayout';
import './globals.css';
import Auth0ProviderWithNavigation from '@/components/common/Login/Auth0ProviderWithNavigation';

// Optimize font loading with fallbacks and better performance
// preload: false ensures fonts don't block page rendering
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const dmSerif = DM_Serif_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true,
});

const metaTitle =
  'Luxury Villa Vacation Rental: Premium Holiday Homes & Weekend Getaways';
const metaDescription =
  'Discover exclusive Luxury Villas for short rentals. Find the perfect vacation homes or weekend homes. Book your dream homestay with us today!';
const metaImage = 'https://www.elivaas.com/assets/images/icons/png/ogimage.png';
const metaSvgImage =
  'https://www.elivaas.com/assets/images/icons/png/favicon.svg';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.elivaas.com'),
  title: {
    default: metaTitle,
    template: '%s',
  },
  description: metaDescription,
  authors: [{ name: 'ELIVAAS' }],
  creator: 'ELIVAAS',
  publisher: 'ELIVAAS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // icons: {
  //   icon: [
  //     { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' as const },
  //     { url: metaSvgImage, type: 'image/svg+xml' },
  //   ],
  //   apple: [{ url: metaSvgImage, sizes: '180x180', type: 'image/png' }],
  //   shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' as const }],
  // },
  verification: {
    google: 'tO76Qs5w5YKeIhY4JMF2jYHZK_xC8BKdpxYSkk5Vr18',
  },
  alternates: {
    canonical: 'https://www.elivaas.com',
    languages: {
      en: 'https://www.elivaas.com',
      'x-default': 'https://www.elivaas.com',
    },
  },
  appleWebApp: {
    capable: true,
    title: metaTitle,
    startupImage: metaSvgImage,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    type: 'website',
    siteName: 'ELIVAAS',
    url: 'https://www.elivaas.com',
    locale: 'en_US',
    images: [
      {
        url: metaImage,
        alt: metaTitle,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: metaDescription,
    images: [metaImage],
    creator: '@elivaas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'theme-color': '#ffffff',
    'msapplication-TileColor': '#ffffff',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  height: 'device-height',
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${poppins.variable} ${dmSerif.variable} font-sans antialiased`}
      lang='en-IN'
      dir='ltr'
      suppressHydrationWarning
      prefix='og: http://ogp.me/ns#'
      style={{ '--global-scrollbar-buffer': '15px' } as React.CSSProperties}
    >
      <head>
        {/* Critical resource preloading */}
        <link rel='preconnect' as='font' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          as='image'
          href='https://cpjlcwamma.cloudimg.io'
        />

        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          as='font'
          crossOrigin='anonymous'
        />
        <link rel='preconnect' as='script' href='https://static.elfsight.com' />
        <link
          rel='preconnect'
          as='script'
          href='https://connect.facebook.net'
        />
        <link rel='preconnect' href='https://www.googletagmanager.com' />

        {/* DNS prefetch for external domains */}
        <link rel='dns-prefetch' href='//connect.facebook.net' />
        <link rel='dns-prefetch' href='//www.googletagmanager.com' />
        <link rel='dns-prefetch' href='//static.elfsight.com' />
        <link rel='dns-prefetch' href='//dev2-api.hotelzify.com' />
        <link rel='dns-prefetch' href='//www.clarity.ms' />
        <link rel='dns-prefetch' as='image' href='//cpjlcwamma.cloudimg.io' />

        {/* Preload critical assets */}
        <link
          rel='preload'
          href='/favicon.ico'
          as='image'
          type='image/x-icon'
        />

        {/* Manifest and icons */}
        {/* <link rel='manifest' href='/manifest.json' /> */}
        <link rel='icon' href='/favicon.ico' sizes='any' type='image/x-icon' />
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />

        {/* Meta tags */}
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-touch-fullscreen' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-title' content='ELIVAAS' />
        {/* <meta name='mobile-wep-app-capable' content='yes' /> */}
        <meta name='theme-color' content='#fff' />
        <meta name='application-name' content='www.elivaas.com' />
        <meta name='msapplication-navbutton-color' content='#ffffff' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />

        {/* Structured Data - Inline for better SEO */}
        <script
          async
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ELIVAAS',
              url: 'https://www.elivaas.com/',
              alternateName: 'ELIVAAS',
              logo: `${process.env.IMAGE_DOMAIN}/favicon_0038aabb2f.png`,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91 7969469950',
                contactType: 'customer service',
                contactOption: 'TollFree',
                areaServed: 'IN',
                availableLanguage: 'en',
              },
              sameAs: [
                'https://www.facebook.com/stay.elivaas',
                'https://www.instagram.com/stay.elivaas/',
                'https://www.youtube.com/@ElivaasStays',
                'https://www.linkedin.com/company/elivaas/',
              ],
            }),
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'WebSite',
              name: 'ELIVAAS',
              url: 'https://www.elivaas.com/',
              alternateName: 'ELIVAAS',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.elivaas.com/{search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Facebook Pixel - Load with lower priority for better performance */}
        <Script
          strategy='lazyOnload'
          id='facebook-pixel'
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '297497046149024');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Google Ads - Load with lower priority for better performance */}
        <Script
          id='google-ads'
          strategy='lazyOnload'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11348729913');
            `,
          }}
        />

        {/* Third-party scripts - Load with lowest priority */}
        <Script
          src='https://static.elfsight.com/platform/platform.js'
          data-use-service-core
          defer
          strategy='lazyOnload'
          crossOrigin='anonymous'
        />

        {/* Hotelzify tracker - Load with lowest priority */}
        <Script
          src='https://dev2-api.hotelzify.com/hotel/v1/tracker'
          strategy='lazyOnload'
          async
          crossOrigin='anonymous'
        />
      </head>
      <body>
        <Suspense fallback={<SuspenseLoader />}>
          <Auth0ProviderWithNavigation>
            <AppProviders>
              <ThemeProvider
                attribute='class'
                defaultTheme='light'
                enableSystem
                disableTransitionOnChange
              >
                {' '}
                <div
                  className='elfsight-app-937cc9c4-b684-4fcb-b65e-fb9a078c3927'
                  data-elfsight-app-lazy
                />
                <ClientSideLayout>{children}</ClientSideLayout>
                <Toaster />
              </ThemeProvider>
            </AppProviders>
          </Auth0ProviderWithNavigation>
        </Suspense>

        {/* Google Tag Manager */}
        {/* {process.env.GTM_ID && (
          <GoogleTagManager gtmId={`${process.env.GTM_ID}`} />
        )} */}

        <Script
          id='gtm-script'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.GTM_ID}');
    `,
          }}
        />

        <noscript>
          {process.env.GTM_ID && (
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_ID}`}
              height='0'
              width='0'
              style={{ display: 'none', visibility: 'hidden' }}
              loading='lazy'
            ></iframe>
          )}

          <Image
            src='https://www.facebook.com/tr?id=297497046149024&ev=PageView&noscript=1'
            alt={'facebook'}
            height='1'
            width='1'
            style={{ display: 'none', visibility: 'hidden' }}
            loading='lazy'
          />
        </noscript>
        {/* Mixpanel Analytics */}
        <Script
          id='mixpanel-script'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function(f,b){
                if(!b.__SV){
                  var e,g,i,h;
                  window.mixpanel=b;
                  b._i=[];
                  b.init=function(e,f,c){
                    function g(a,d){
                      var b=d.split(".");
                      2==b.length&&(a=a[b[0]],d=b[1]);
                      a[d]=function(){
                        a.push([d].concat(Array.prototype.slice.call(arguments,0)))
                      }
                    }
                    var a=b;
                    "undefined"!==typeof c?a=b[c]=[]:c="mixpanel";
                    a.people=a.people||[];
                    a.toString=function(a){
                      var d="mixpanel";
                      "mixpanel"!==c&&(d+="."+c);
                      a||(d+=" (stub)");
                      return d
                    };
                    a.people.toString=function(){return a.toString(1)+".people (stub)"};
                    i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
                    for(h=0;h<i.length;h++)g(a,i[h]);
                    b._i.push([e,f,c])
                  };
                  b.__SV=1.2;
                  e=f.createElement("script");
                  e.type="text/javascript";
                  e.async=!0;
                  e.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
                  g=f.getElementsByTagName("script")[0];
                  g.parentNode.insertBefore(e,g)
                }
              })(document,window.mixpanel||[]);
              mixpanel.init("${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}", { debug: ${
                process.env.NODE_ENV === 'development'
              } });
            `,
          }}
        />
      </body>
    </html>
  );
}
