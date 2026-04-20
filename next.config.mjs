/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // one hour in seconds
  expireTime: 1800,
  images: {
    domains: [
      process.env.IMAGE_DOMAIN || '',
      'd4b28jbnqso5g.cloudfront.net',
      'd31za8na64dkj7.cloudfront.net',
      'd2lhlmuanwy6qz.cloudfront.net',
    ],
    loader: 'custom',
    loaderFile: 'lib/loader.mjs',
    // formats: ['image/webp', 'image/avif'],
    // qualities: [25, 50, 75, 90],
    // minimumCacheTTL: 990,
    // dangerouslyAllowSVG: true,
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'd4b28jbnqso5g.cloudfront.net',
    //     port: '',
    //     search: '',
    //   },
    // ],
  },

  transpilePackages: [
    'embla-carousel-react',
    'mixpanel-browser',
    'lucide-react',
  ],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    GRAPHQL_TOKEN: process.env.GRAPHQL_TOKEN,
    IMAGE_DOMAIN: process.env.IMAGE_DOMAIN,
    CASHFREE_MODE: process.env.CASHFREE_MODE,
    GTM_ID: process.env.GTM_ID,
    GTM_TAG: process.env.GTM_TAG,
    RAZORPAY_KEY: process.env.RAZORPAY_KEY,
    PAYMENT_GATEWAY: process.env.PAYMENT_GATEWAY,
    NEXT_PUBLIC_RETARGETING_SESSION:
      process.env.NEXT_PUBLIC_RETARGETING_SESSION,
    ANALYZE: process.env.ANALYZE,
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    WP_GRAPHQL_URL: process.env.WP_GRAPHQL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CHANNEL_ID: process.env.NEXT_PUBLIC_CHANNEL_ID,
    NEXT_PUBLIC_CHANNEL_ID_SALE: process.env.NEXT_PUBLIC_CHANNEL_ID_SALE,
    NEXT_PUBLIC_CHANNEL_ID_CORPORATE_BNM: process.env.NEXT_PUBLIC_CHANNEL_ID_CORPORATE_BNM,
    NEXT_PUBLIC_LOYALTY_GRAPHQL_URL:
      process.env.NEXT_PUBLIC_LOYALTY_GRAPHQL_URL,
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    ENV_TYPE: process.env.ENV_TYPE,
    NEXT_PUBLIC_HOMEPAGE_GRAPHQL_URL:
      process.env.NEXT_PUBLIC_HOMEPAGE_GRAPHQL_URL,
  },

  async rewrites() {
    return [
      {
        source: '/cloudfront/:path*',
        destination: `${process.env.IMAGE_DOMAIN}/:path*`,
      },
    ];
  },

  async headers() {
    return [
      // ✅ Static assets in /_next/static/*
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // General catch-all route
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=31536000, stale-while-revalidate',
          },
        ],
      },
      {
        source: '/:path*', // apply to all routes
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // ✅ Files inside /public (images, fonts, etc.)
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // City list pages - no caching
      {
        source: '/villas',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
      // Villa detail pages - no caching
      {
        source: '/villa-in-:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
      // City-specific villa pages - no caching
      {
        source: '/villas/villas-in-:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },

  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-Robots-Tag',
  //           // Allow indexing
  //           value: 'index,follow',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/sw.js',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=0, must-revalidate',
  //         },
  //         {
  //           key: 'Service-Worker-Allowed',
  //           value: '/',
  //         },
  //       ],
  //     },
  //     // Cache static assets for better performance
  //     {
  //       source: '/assets/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable', // 1 year
  //         },
  //       ],
  //     },
  //     {
  //       source: '/_next/static/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable', // 1 year
  //         },
  //       ],
  //     },
  //     {
  //       source: '/images/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable', // 1 year
  //         },
  //       ],
  //     },
  //   ];
  // },

  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mjs'],

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };
    }

    // SVG rule
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts|tsx|md)x?$/],
      },
      use: ['@svgr/webpack'],
    });

    // JSON rule
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    // Optimize webpack caching for Vercel deployment
    // if (!dev) {
    //   config.cache = {
    //     type: 'filesystem',
    //     buildDependencies: {
    //       config: [__filename],
    //     },
    //     cacheDirectory: '.next/cache',
    //     compression: 'gzip',
    //     maxAge: 172800000, // 2 days
    //   };
    // } else {
    //   // Disable filesystem cache in development
    //   config.cache = false;
    // }

    // Optimize bundle splitting
    // if (!dev && !isServer) {
    //   config.optimization.splitChunks = {
    //     chunks: 'all',
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name: 'vendors',
    //         chunks: 'all',
    //         priority: 10,
    //       },
    //       common: {
    //         name: 'common',
    //         minChunks: 2,
    //         chunks: 'all',
    //         enforce: true,
    //         priority: 5,
    //       },
    //       default: {
    //         minChunks: 1,
    //         priority: -20,
    //         reuseExistingChunk: true,
    //       },
    //     },
    //   };
    // }

    config.cache = true;
    return config;
  },

  // compress: true,
  // poweredByHeader: false,
  // generateEtags: false,
  // reactStrictMode: true,

  // Optimize for production
  // productionBrowserSourceMaps: false,

  // Enable static optimization
  trailingSlash: false,
};

export default nextConfig;
