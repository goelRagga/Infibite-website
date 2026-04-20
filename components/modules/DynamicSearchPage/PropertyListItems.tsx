'use client';

import NoResults from '@/assets/noResults.svg';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import PropertyCardSkeleton from '@/components/modules/PropertyListing/PropertyCardSkeleton';
import PropertyListingTypes from '@/components/modules/PropertyListing/PropertyListing.types';
import { GET_EVENT_LISTING } from '@/lib/queries';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useClient } from 'urql';
const PropertyCard = dynamic(() => import('@/components/common/PropertyCard'));
const FloatingCta = dynamic(() => import('@/components/common/FloatingCta'));

type GridLayout = '2x2' | '3x3';

export interface EventListingPageInfo {
  currentPage: number;
  pageSize: number;
  totalElementsCount: number;
  pagesCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  liveListingCount?: number;
}

type PropertyListingProps = PropertyListingTypes.Props & {
  initialPageInfo?: EventListingPageInfo | null;
  loadMoreTag?: string | number;
};

const PAGE_SIZE = 20;

export default function PropertyListItems({
  propertiesList,
  initialPageInfo,
  loadMoreTag,
}: PropertyListingProps) {
  const client = useClient();
  const [gridLayout, setGridLayout] = useState<GridLayout>('3x3');
  const [propertiesData, setPropertiesData] = useState(propertiesList || []);
  const [pageInfo, setPageInfo] = useState<EventListingPageInfo | null>(
    initialPageInfo ?? null
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setPropertiesData(propertiesList || []);
    setPageInfo(initialPageInfo ?? null);
  }, [propertiesList, initialPageInfo]);

  const fetchMore = useCallback(async () => {
    if (
      !loadMoreTag ||
      !pageInfo?.hasNext ||
      isLoadingMore ||
      typeof window === 'undefined'
    )
      return;
    setIsLoadingMore(true);
    try {
      const nextPage = pageInfo.currentPage + 1;
      const tag =
        typeof loadMoreTag === 'string' && /^\d+$/.test(loadMoreTag)
          ? parseInt(loadMoreTag, 10)
          : loadMoreTag;
      const result = await client
        .query(GET_EVENT_LISTING, {
          tag,
          page: nextPage,
          pageSize: PAGE_SIZE,
        })
        .toPromise();

      if (result.error) throw result.error;

      const payload = result.data?.propertiesByTag;
      if (payload) {
        setPageInfo({
          currentPage: payload.currentPage,
          pageSize: payload.pageSize,
          totalElementsCount: payload.totalElementsCount,
          pagesCount: payload.pagesCount,
          hasPrevious: payload.hasPrevious,
          hasNext: payload.hasNext,
          liveListingCount: payload.liveListingCount,
        });
        setPropertiesData((prev) => [...prev, ...(payload.list || [])]);
      }
    } catch (err) {
      console.error('Load more event listing failed:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [client, loadMoreTag, pageInfo, isLoadingMore]);

  const handleLoadMore = useCallback(() => {
    if (pageInfo?.hasNext && !isLoadingMore) fetchMore();
  }, [pageInfo?.hasNext, isLoadingMore, fetchMore]);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const isPageScrolledToBottom = useCallback((threshold = 200) => {
    if (typeof window === 'undefined') return false;
    if (mainContentRef.current) {
      const rect = mainContentRef.current.getBoundingClientRect();
      const bottom = rect.bottom + window.scrollY;
      return window.innerHeight + window.scrollY >= bottom - threshold;
    }
    return (
      window.innerHeight + 20 + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - threshold
    );
  }, []);

  const isLoadingMoreRef = useRef(false);
  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  useEffect(() => {
    if (!loadMoreTag || !pageInfo?.hasNext) return;
    const onScroll = () => {
      if (isLoadingMoreRef.current) return;
      if (isPageScrolledToBottom(200)) handleLoadMore();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMoreTag, pageInfo?.hasNext, handleLoadMore, isPageScrolledToBottom]);

  const renderVillaCard = ({ villa }: any) => {
    return (
      <PropertyCard
        key={villa?.id}
        property={{
          ...villa,
        }}
        peram='getquote=true'
        variant={'default'}
        showActionButton={false}
        showBrandLogo={true}
      />
    );
  };

  return (
    <>
      <div className='mx-auto w-full sm:px-4 sm:px-10 sm:py-4'>
        <main className='mx-auto w-full py-0'>
          <div
            className='flex flex-col md:flex-row gap-8 h-full'
            ref={mainContentRef}
          >
            <section className='w-full md:w-4/5 flex flex-col gap-3 m-auto'>
              <div
                className={cn(
                  'grid gap-6 px-3 sm:px-2',
                  gridLayout === '2x2' ? 'lg:grid-cols-2' : 'lg:grid-cols-3',
                  'grid-cols-1 sm:grid-cols-2'
                )}
              >
                {propertiesData.length > 0 ? (
                  propertiesData.map((villa: any, index: number) => {
                    // Calculate animation delay based on current page data only
                    const currentPageIndex = index % 12; // Reset for each page of 12 items
                    const animationDelay = currentPageIndex * 0.1; // 0.1s delay per card

                    return (
                      <motion.div
                        key={villa?.id + index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: animationDelay,
                          ease: 'easeOut',
                        }}
                      >
                        {renderVillaCard({ villa })}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    className='col-span-full flex flex-col justify-center items-center min-h-[60dvh] text-center px-4'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <NoResults />
                    <h2 className='text-2xl md:text-4xl  font-serif font-semibold mt-4'>
                      No results found
                    </h2>
                    <p className='text-xs md:text-base mt-2'>
                      Try adjusting your filters or explore other stunning
                      villas.
                    </p>
                  </motion.div>
                )}
              </div>

              {isLoadingMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='mt-4'
                >
                  <PropertyCardSkeleton gridLayout={gridLayout} />
                </motion.div>
              )}
            </section>
          </div>
        </main>
      </div>

      <Suspense fallback={''}>
        <FloatingCta isPhone={true} isWhatsApp={true} bottom={'90px'} />
      </Suspense>
    </>
  );
}
