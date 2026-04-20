import PropertyListItems from '@/components/modules/DynamicSearchPage/PropertyListItems';
import SearchPageBanner from '@/components/modules/DynamicSearchPage/SearchPageBanner';
import LocationDetailsAccordion from '@/components/modules/PropertyListing/LocationContent/LocationDetailsAccordion';
import type { SeoPageResponse } from '@/lib/api';

export interface EventListingPageInfo {
  currentPage: number;
  pageSize: number;
  totalElementsCount: number;
  pagesCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  liveListingCount?: number;
}

interface DynamicSearchPageContentProps {
  data: SeoPageResponse;
  slug: string;
  eventListing?: any[];
  eventPageInfo?: EventListingPageInfo | null;
  eventTag?: string;
}

function mapSeoBannersToCarousel(banners: SeoPageResponse['banners']) {
  if (!banners?.length) return [];
  const slides: { urlDesktop: string; urlMobile: string }[] = [];
  for (const banner of banners) {
    const mediaList = banner.media ?? [];
    for (const media of mediaList) {
      const m = media as {
        url?: string;
        mobileUrl?: string;
        mobileurl?: string;
      };
      const url = m?.url ?? '';
      const mobileUrl =
        m?.mobileUrl ?? (m as { mobileurl?: string })?.mobileurl ?? url;
      if (url || mobileUrl) {
        slides.push({ urlDesktop: url, urlMobile: mobileUrl });
      }
    }
  }
  return slides;
}

export default function DynamicSearchPageContent({
  data,
  slug,
  eventListing = [],
  eventPageInfo = null,
  eventTag,
}: DynamicSearchPageContentProps) {
  const bannersToShow = mapSeoBannersToCarousel(data.banners);
  const hasBanner = bannersToShow.length > 0;
  const firstBanner = data.banners?.[0];
  const title = firstBanner?.title ?? '';
  const subtitle = firstBanner?.subtitle ?? '';
  const summaryHeading = data.summary?.title?.trim();
  const { seoContent } = data;

  return (
    <>
      <div className='relative mb-5 md:mb-3'>
        {hasBanner && <SearchPageBanner banners={bannersToShow} />}
        {(title || subtitle) && (
          <div
            className={
              hasBanner
                ? 'absolute inset-0 left-0 right-0 top-0 z-10 flex items-center justify-center px-4 pointer-events-none'
                : 'w-full px-4 text-center'
            }
          >
            <div
              className={
                hasBanner
                  ? 'w-full max-w-xl text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]'
                  : 'w-full text-center'
              }
            >
              {title && (
                <h1
                  className={
                    hasBanner
                      ? 'font-serif text-[20px] font-semibold text-white md:text-4xl'
                      : 'font-serif text-[20px] font-semibold md:text-4xl'
                  }
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  className={
                    hasBanner
                      ? 'mt-2 font-serif text-base text-white/90 md:text-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]'
                      : 'mt-2 font-serif text-base text-black/50 md:text-xl'
                  }
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {summaryHeading && (
        <section className='w-full md:w-4/5 flex flex-col gap-3 m-auto'>
          <div className='mx-auto w-full px-4 pb-3 sm:px-10 sm:py-4'>
            <h2 className='text-base font-semibold md:text-xl'>
              {summaryHeading}
            </h2>
          </div>
        </section>
      )}

      {eventListing.length > 0 && (
        <PropertyListItems
          propertiesList={eventListing}
          initialPageInfo={eventPageInfo ?? undefined}
          loadMoreTag={eventTag}
        />
      )}

      {seoContent?.title && seoContent?.description && (
        <LocationDetailsAccordion
          key={slug}
          cityContent={{
            name: seoContent.title,
            content: seoContent.description,
          }}
        />
      )}
    </>
  );
}
