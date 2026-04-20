// lib/seo/generatePageSeo.ts
import { Metadata } from 'next';

interface SEO {
  title?: string;
  metaDesc?: string;
  metaRobotsNoindex?: 'index' | 'noindex';
  metaRobotsNofollow?: 'follow' | 'nofollow';
  openGraphImage?: {
    sourceUrl?: string;
  };
}

export async function generatePageSeo({
  page,
  slug,
}: {
  page: SEO | undefined;
  slug: string;
}): Promise<Metadata> {
  const seo = page || {};
  const metaImage = seo?.openGraphImage?.sourceUrl;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullPath = slug.startsWith('/') ? slug : `${slug}`;
  const fullUrl = new URL(fullPath, siteUrl).toString();

  return {
    title: seo?.title || 'Default Title',
    description: seo?.metaDesc || 'Default meta description.',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    icons: {
      other: {
        rel: 'metaSvgImage',
        url: 'metaSvgImage',
      },
    },
    robots: {
      index: seo?.metaRobotsNoindex !== 'noindex',
      follow: seo?.metaRobotsNofollow !== 'nofollow',
    },
    appleWebApp: {
      capable: true,
      title: seo?.title || 'Default Title',
      startupImage: 'metaSvgImage',
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      title: seo?.title || 'Default Title',
      description: seo?.metaDesc || 'Default meta description.',
      url: fullUrl,
      type: 'website',
      images: metaImage ? [{ url: metaImage, alt: seo?.title || 'Image' }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || 'Default Title',
      description: seo?.metaDesc || 'Default meta description.',
      images: metaImage ? [metaImage] : [],
    },
  };
}
