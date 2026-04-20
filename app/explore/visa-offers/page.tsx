import { Metadata } from 'next';
import Script from 'next/script';
import { getVisaPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import VisaPageDetail from '@/components/wordpressComponents/VisaOfferPage';
import Image from 'next/image';

// Static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

// Force static generation
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const { visaDetail } = await getVisaPage('/visa-offers');
  const page = visaDetail?.page?.seo;
  const slug = page?.slug || 'visa-offers';
  return await generatePageSeo({ page, slug });
}

// Pre-render the page at build time
export async function generateStaticParams() {
  return [{}]; // Generate the main visa-offers page
}

export default async function PartnerPage() {
  const { visaDetail } = await getVisaPage('/visa-offers');
  const visaDetailData = visaDetail?.page?.template?.visaLandingPage;

  return (
    <>
      {/* Meta Pixel Code */}
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
            fbq('init', '1565150523616028');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <Image
          src='https://www.facebook.com/tr?id=1565150523616028&ev=PageView&noscript=1'
          alt={'facebook'}
          height='1'
          width='1'
          style={{ display: 'none', visibility: 'hidden' }}
          loading='lazy'
        />
      </noscript>
      <div className=''>
        <VisaPageDetail template={visaDetailData} />
      </div>
    </>
  );
}
