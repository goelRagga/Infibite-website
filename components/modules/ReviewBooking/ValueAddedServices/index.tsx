'use client';

import { CarouselTemplate } from '@/components/common/Carousel';
import { CarouselTemplate1 } from '@/components/common/Carousel/CardTemplate';
import { Button } from '@/components/ui';
import { useVAS } from '@/contexts/vas-context';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useURLParams } from '@/hooks/useURLParams';
import { Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReviewBookingTypes from '../ReviewBooking.types';
import { SectionTemplate } from '../Section';
import AddOnSelectorModal from './AddOnCardModal';
import AddOnCard from './ServiceCard';

type ValueAddedProps = ReviewBookingTypes.AddOnnServices & {
  onVASChange?: (services: { id: string; quantity: number }[]) => void;
};

export default function ValueAddedServices({
  valueAddedServices,
  onVASChange,
}: ValueAddedProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [vasModalOpen, setVasModalOpen] = useState(false);
  const { selectedCounts, setSelectedCounts } = useVAS();
  const { getParam, updateParams } = useURLParams();
  const serviceParam = getParam('service');

  const handleAdd = (id: string) => {
    setSelectedCounts({ ...selectedCounts, [id]: 1 });
  };

  const handleIncrement = (id: string) => {
    setSelectedCounts({
      ...selectedCounts,
      [id]: (selectedCounts[id] || 0) + 1,
    });
  };

  const handleDecrement = (id: string) => {
    const newCount = (selectedCounts[id] || 0) - 1;
    if (newCount <= 0) {
      const { [id]: _, ...rest } = selectedCounts;
      setSelectedCounts(rest);
    } else {
      setSelectedCounts({ ...selectedCounts, [id]: newCount });
    }
  };

  const selectedItems = valueAddedServices.filter(
    (item: any) => selectedCounts[item.id] > 0
  );

  const selectedVASData = Object.entries(selectedCounts).map(
    ([id, quantity]) => ({
      id,
      quantity,
    })
  );

  useEffect(() => {
    onVASChange?.(selectedVASData);
  }, [selectedCounts]);

  useEffect(() => {
    if (serviceParam) {
      const counts: Record<string, number> = {};
      serviceParam.split(',').forEach((pair: any) => {
        const [id, qty] = pair.split(':');
        if (id && qty && !isNaN(Number(qty))) {
          counts[id] = Number(qty);
        }
      });
      setSelectedCounts(counts);
    }
  }, []);

  return (
    <>
      <SectionTemplate showDefaultArrows id='services'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl sm:text-2xl font-serif'>Upgrade Your Stay</h3>
          <div className='flex items-center'>
            <AddOnSelectorModal
              valueAddedServices={valueAddedServices}
              vasModalOpen={vasModalOpen}
              setVasModalOpen={setVasModalOpen}
              selectedCounts={selectedCounts}
              setSelectedCounts={setSelectedCounts}
            />
          </div>
        </div>

        <div className='relative'>
          {selectedItems.length > 0 ? (
            <>
              <div className='flex items-center justify-between px-0 py-0 dark:bg-none mb-4'>
                <p className='text-sm text-foreground sm:text-base'>
                  Services Selected -{' '}
                  <span className='font-semibold'>{selectedItems.length}</span>
                </p>
                <Button
                  variant='link'
                  size='sm'
                  className='text-sm font-semibold text-accent-red-900 hover:underline dark:text-[var(--red1)] px-0'
                  onClick={() => {
                    setSelectedCounts({});
                    updateParams({ service: null });
                  }}
                >
                  Remove All
                </Button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {selectedItems.map((item: any) => (
                  <AddOnCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    basePrice={item.basePrice}
                    count={selectedCounts[item.id]}
                    onAdd={handleAdd}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    applicableAdults={item.applicableAdults}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <CarouselTemplate
                items={valueAddedServices}
                slidesPerView={isMobile ? 1.3 : isTablet ? 3 : 4}
                showArrows={false}
                renderItem={(item: any) => (
                  <CarouselTemplate1 priority={false} data={item} />
                )}
              />
            </>
          )}
        </div>
      </SectionTemplate>
    </>
  );
}
