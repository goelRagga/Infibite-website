import { getTermsPage } from '@/lib/wordpress/api';

export default async function TermsAndConditionsPage() {
  const { termDetail } = await getTermsPage('/terms-and-conditions');

  const contentRepeator =
    termDetail?.page?.template?.termsAndConditions?.contenRepeator;

  const lastUpdated = termDetail?.page?.modified;
  const lastUpdatedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const termsAndConditionsHeading =
    termDetail?.page?.template?.termsAndConditions?.termsAndConditionsHeading;

  return (
    <>
      <div className='bg-gradient-to-r from-red-500 to-black mx-auto p-5 md:p-10 flex flex-col gap-2'>
        <h1 className='text-white text-xl md:text-4xl font-serif'>
          {termsAndConditionsHeading}
        </h1>
        <p className='text-xs text-white'>{`Last Updated ${lastUpdatedDate}`}</p>
      </div>

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
