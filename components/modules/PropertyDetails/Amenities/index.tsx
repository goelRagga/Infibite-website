import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import { useState } from 'react';
import CustomImage from '@/components/common/CustomImage';
import { Button } from '@/components/ui';
import useIsMobile from '@/hooks/useIsMobile';
import { trackEvent } from '@/lib/mixpanel';

interface NewAmenitiesSectionSectionProps {
  topAmenities?: any;
  amenities?: any;
  is_checkin_out_entered?: boolean;
}

type Amenity = {
  __typename: string;
  icon: string;
  name: string;
  category: string;
};
function groupByCategory(amenities: Amenity[]): Record<string, Amenity[]> {
  return amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.category]) acc[amenity.category] = [];
      acc[amenity.category].push(amenity);
      return acc;
    },
    {} as Record<string, Amenity[]>
  );
}

const AmenitiesSection: React.FC<NewAmenitiesSectionSectionProps> = ({
  topAmenities,
  amenities,
  is_checkin_out_entered = false,
}) => {
  const isMobile = useIsMobile();
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);
  const grouped = groupByCategory(amenities);

  return (
    <div className='border-none shadow-none'>
      <CardContent className='p-0 space-y-4'>
        {/* Popular Features */}
        <div>
          <h5 className='text-[var(--color-secondary-900)] text-sm font-semibold mb-4 dark:text-[var(--brown6)]'>
            Popular Features
          </h5>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
            {topAmenities?.map((item: any) => (
              <Amenity
                key={item?.name}
                icon={
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                    className='dark:invert'
                  />
                }
                label={item.name}
              />
            ))}
          </div>
        </div>

        {/* Room Features */}
        {/* <div>
          <h3 className='text-[var(--color-secondary-900)] text-sm font-semibold mb-4'>
            Room Features
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            <Amenity
              icon={<Umbrella className='w-5 h-5 text-[#543c34]' />}
              label='Blackout Curtains'
            />
            <Amenity
              icon={<Fan className='w-5 h-5 text-[#543c34]' />}
              label='Air Conditioning'
            />
          </div>
        </div> */}

        {/* View All Link */}

        <ResponsiveDialogDrawer
          open={amenitiesModalOpen}
          setOpen={setAmenitiesModalOpen}
          title='Villa Amenities'
          contentClassName='sm:max-w-[792px]! dark:bg-background border-none'
          trigger={
            <button
              className='mt-2 text-sm font-semibold text-accent-red-900 underline cursor-pointer hover:text-accent-red-950 dark:text-[var(--accent-text)]'
              onClick={() => {
                trackEvent('property_content_clicked', {
                  page_name: 'property_details',
                  cta_type: 'view_all_amenities',
                  widget_name: 'Amenities',
                  widget_type: 'amenities',
                  is_checkin_out_entered: is_checkin_out_entered,
                  number_of_amenities: amenities?.length,
                });
                setAmenitiesModalOpen(true);
              }}
            >
              View all {amenities?.length} amenities
            </button>
          }
          footer={
            !isMobile && (
              <div className='flex justify-center'>
                <Button
                  size={'lg'}
                  className='border-accent-red-900 min-w-[180px] text-accent-red-900 rounded-full font-semibold dark:bg-background dark:text-[var(--accent-text)] dark:border-[var(--accent-text)]'
                  variant='outline'
                  color='secondary'
                  onClick={() => setAmenitiesModalOpen(false)}
                >
                  Back
                </Button>
              </div>
            )
          }
        >
          <div className='grid gap-12 text-xs/5 sm:text-sm h-full pb-6 sm:h-[60dvh] overflow-y-auto'>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className='font-semibold text-secondary-900 text-sm sm:text-md mb-4 sticky -top-1 bg-[var(--white3)] z-10 dark:bg-[var(--prive-4)] dark:sm:bg-[var(--prive-4)] dark:text-[var(--accent-text)]'>
                  {category}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-y-9'>
                  {items.map((amenity) => (
                    <Amenity
                      key={amenity.name}
                      icon={
                        <CustomImage
                          format='svg'
                          src={amenity.icon}
                          alt={amenity.name}
                          width={26}
                          height={26}
                          className='object-contain dark:text-white dark:invert'
                        />
                      }
                      label={amenity.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResponsiveDialogDrawer>
      </CardContent>
    </div>
  );
};

function Amenity({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className='flex items-center space-x-2'>
      <div className='flex items-center justify-center  dark:text-primary-100'>
        {icon}
      </div>
      <div className='text-sm text-primary-800 dark:text-primary-100'>
        {label}
      </div>
    </div>
  );
}

export default AmenitiesSection;
