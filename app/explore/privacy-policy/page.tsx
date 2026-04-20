import { Metadata } from 'next';
import { getPrivacyPage } from '@/lib/wordpress/api';
import { generatePageSeo } from '@/lib/wordpress/seo/generatePageSeo';
import MobileHeader from '@/components/common/MobileHeader';

export async function generateMetadata(): Promise<Metadata> {
  const { privacyDetail } = await getPrivacyPage('/privacy-policy');
  const page = privacyDetail?.page?.seo;
  const slug = page?.slug || 'privacy-policy';
  return await generatePageSeo({ page, slug });
}

export default async function PrivacyPolicyPage() {
  const { privacyDetail, error } = await getPrivacyPage('/privacy-policy');
  const privacyPageData = privacyDetail;
  const contentRepeator =
    privacyPageData?.page?.template?.privacyPolicyPage?.contenRepeator;

  const PrivacyPolicy =
    privacyPageData?.page?.template?.privacyPolicyPage?.privacyPolicyHeading;
  const lastUpdated = privacyPageData?.page?.modified;
  const lastUpdatedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className='lg:hidden'>{<MobileHeader title='Privacy Policy' />}</div>
      <div className='bg-gradient-to-r from-red-500 to-black mx-auto p-5 md:p-10 flex flex-col gap-2'>
        <h1 className='text-white text-xl md:text-4xl font-serif'>
          {PrivacyPolicy}
        </h1>
        <p className='text-xs text-white'>{`Last Updated ${lastUpdatedDate}`}</p>
      </div>
      <div
        className="text-xs md:text-sm text-foreground pt-9 md:pt-10 px-5 md:px-10
          [&_p]:pb-2 [&_p]:text-left 
          [&_h2]:text-[20px] [&_h2]:md:text-[20px] [&_h2]:text-[18px] [&_h2]:font-serif [&_h2]:flex [&_h2]:items-center [&_h2]:mt-4 [&_h2]:mb-3 
          [&_h2_.section-number]:mr-2.5 [&_h2_.section-number]:text-sm [&_h2_.section-number]:w-7 [&_h2_.section-number]:h-7 [&_h2_.section-number]:flex [&_h2_.section-number]:items-center [&_h2_.section-number]:justify-center [&_h2_.section-number]:rounded-full [&_h2_.section-number]:font-semibold [&_h2_.section-number]:text-accent-red-900 [&_h2_.section-number]:bg-accent-red-50 
          [&_h6]:text-[18px] [&_h6]:font-serif [&_h6]:text-foreground [&_h6]:pt-2.5 [&_h6]:pb-1.5 
          [&_.collectionInformationList]:pl-5 [&_.collectionInformationList>li]:mb-2.5 [&_.collectionInformationList>li]:list-disc 
          [&_.rightArrow]:pl-5 [&_.rightArrow]:list-[url('https://d31za8na64dkj7.cloudfront.net/arrow_right_120703032d.svg')] [&_.rightArrow]:list-inside [&_.rightArrow>li]:mt-2.5 
          [&_ol]:list-decimal [&_ol]:pl-8 [&_ol>li]:mt-2.5 [&_ol]:md:pl-8 [&_ol]:pl-5 
          [&_.contactDetails>li]:flex [&_.contactDetails>li]:font-semibold [&_.contactDetails>li>img]:mr-2 [&_.contactDetails>li>a]:flex 
          [&_.fontWeightFive]:font-medium [&_.fontWeightFive]:md:font-medium [&_.fontWeightFive]:font-semibold 
          [&_.alphaList]:list-[lower-alpha] [&_a]:flex [&_img]:w-[14px] [&_img]:pr-1"
        dangerouslySetInnerHTML={{
          __html:
            privacyPageData?.page?.template?.privacyPolicyPage?.policyContent,
        }}
      />
      <div className='mx-auto px-5 py-5 md:px-10 md:py-6 text-foreground text-sm'>
        {Array.isArray(contentRepeator) &&
          contentRepeator.map((item, index) => (
            <div key={index} className='mb-4 md:mb-6'>
              {item?.title && (
                <h2 className='text-[18px] md:text-[20px] font-serif flex items-center mt-4 mb-3'>
                  <span className='mr-2.5 text-sm w-7 h-7 flex items-center justify-center rounded-full font-semibold text-accent-red-900 bg-accent-red-50'>
                    {index + 1}
                  </span>
                  {item.title}
                </h2>
              )}

              {item?.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className='text-xs md:text-sm [&_p]:pb-2 [&_p]:text-foreground [&_h3]:pt-2.5 [&_h3]:pb-2.5 [&_h3]:text-center md:[&_h3]:text-left [&_h2]:text-center md:[&_h2]:text-left [&_a]:flex [&_img]:w-[14px] [&_img]:pr-1'
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
}
