import useIsMobile from '@/hooks/useIsMobile';
import { trackEvent } from '@/lib/mixpanel';
import { createOfferCardBg } from '@/lib/utils';
import { DiscountCardProps } from 'discount-card';
import React, { useMemo, useState } from 'react';
import CustomImage from '../CustomImage';
import ResponsiveDialogDrawer from '../ResponsiveDialogDrawer';
import OfferDetailsModal from './OfferDetailsModal';

const BANK_COLORS = {
  hdfc: createOfferCardBg(
    '#F06321',
    'linear-gradient(180deg, #2273ef 0%, #91fff9 100%)',
    'linear-gradient(180deg, #0d1b4d 0%, #123c46 100%)'
  ),
  icici: createOfferCardBg(
    '#ae2531',
    'linear-gradient(180deg, rgb(251 235 233) 0%, rgb(255 205 186) 100%)',
    'linear-gradient(180deg, #151515 0%, #4a1f14 100%)'
  ),
  sbi: createOfferCardBg(
    '#9C1D26',
    'linear-gradient(180deg, #F9EAEB 0%, #FCCED1 100%)',
    'linear-gradient(180deg, #151515 0%, #4c1e22 100%)'
  ),
  axis: createOfferCardBg(
    '#8a244c',
    'linear-gradient(180deg, rgb(255 248 250) 0%, rgb(255 212 215) 100%)',
    'linear-gradient(180deg, #151515 0%, #4b1f2d 100%)'
  ),
  kotak: createOfferCardBg(
    '#7B1FA2',
    'linear-gradient(180deg, #F3E5F5 0%, #E1BEE7 100%)',
    'linear-gradient(180deg, #151515 0%, #372040 100%)'
  ),
  visa: createOfferCardBg(
    '#1f3dcc',
    'linear-gradient(180deg, rgb(247 249 255) 0%, rgb(193 203 255) 100%)',
    'linear-gradient(180deg, #151515 0%, #1d2a55 100%)'
  ),
  yes: createOfferCardBg(
    '#388E3C',
    'linear-gradient(180deg, #E8F5E8 0%, #C8E6C9 100%)',
    'linear-gradient(180deg, #151515 0%, #1f3a20 100%)'
  ),
  indusind: createOfferCardBg(
    '#1976D2',
    'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
    'linear-gradient(180deg, #151515 0%, #1f355c 100%)'
  ),
  indus: createOfferCardBg(
    '#1976D2',
    'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
    'linear-gradient(180deg, #151515 0%, #1f355c 100%)'
  ),
  idfc: createOfferCardBg(
    '#772C08',
    'linear-gradient(180deg, rgb(255 230 232) 0%, rgb(255 180 187) 100%)',
    'linear-gradient(180deg, #151515 0%, #301103 100%)'
  ),
} as const;

const DEFAULT_COLORS = {
  light: {
    borderColor: '#AE285D',
    backgroundColor: 'linear-gradient(180deg, #FFFFFF 0%, #FDD4E4 100%)',
  },
  dark: {
    borderColor: '#772C08',
    backgroundColor: 'linear-gradient(180deg, #151515 0%, #301103 100%)',
  },
} as const;

const DiscountCard: React.FC<DiscountCardProps> = ({
  code,
  title,
  description,
  icon,
  discountPercentage,
  maximumDiscountAllowed,
  minimumNights,
  endDateTime,
  termsAndConditions,
  isPDP = false,
  horizontalPosition,
  shouldLoadImage = true,
  showLogo = true,
  logoTitleInline = false,
}) => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDark =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  // Memoized color calculation based on bank name from title
  const cardColors = useMemo(() => {
    const titleLower = title.toLowerCase();
    const matchedBank = Object.keys(BANK_COLORS).find((bankName) =>
      titleLower.startsWith(bankName)
    );

    if (matchedBank) {
      return isDark
        ? BANK_COLORS[matchedBank as keyof typeof BANK_COLORS].dark
        : BANK_COLORS[matchedBank as keyof typeof BANK_COLORS].light;
    }

    return isDark ? DEFAULT_COLORS.dark : DEFAULT_COLORS.light;
  }, [title, isDark]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    trackEvent('widget_clicked', {
      page_name: isPDP ? 'property_details' : 'homepage',
      widget_name: 'Offers',
      widget_type: 'offers',
      cta_type: 'offer_card',
      vertical_position: 6,
      horizontal_position: horizontalPosition ?? undefined,
      offer_code: code,
    });
  };

  return (
    <>
      <div
        className={`hover:shadow-md md:p-5 p-4 ${logoTitleInline ? 'rounded-2xl pb-3' : 'rounded-3xl'} h-full w-full transition-all duration-300 dark:text-white ${
          isMobile ? 'cursor-pointer' : ''
        }`}
        style={{
          background: cardColors.backgroundColor,
          border: `1px dashed ${cardColors.borderColor}`,
        }}
        onClick={isMobile ? handleOpenModal : undefined}
      >
        {logoTitleInline && showLogo ? (
          <div className='flex items-center gap-1.5 md:gap-2 md:mb-2 mb-1.5 w-full min-w-0'>
            <div className='max-w-[40px] max-h-[24px] md:max-w-[50px] md:max-h-[28px] shrink-0 flex-shrink-0 flex items-center justify-center'>
              {shouldLoadImage ? (
                <CustomImage
                  className='max-w-full max-h-full w-auto h-auto object-contain'
                  src={icon}
                  alt={code}
                  width={50}
                  height={28}
                  priority={false}
                />
              ) : (
                <div className='w-[40px] h-[24px] md:w-[50px] md:h-[28px] bg-gray-200 rounded animate-pulse' />
              )}
            </div>
            <h5
              className='text-xs md:text-sm fontWeightSemibold text-foreground mb-0 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap'
              title={title}
            >
              {title}
            </h5>
          </div>
        ) : (
          <>
            {showLogo && (
              <div className='flex items-center gap-2 md:mb-4 mb-2'>
                {shouldLoadImage ? (
                  <CustomImage
                    className='h-[24px] md:h-[24px] w-[auto]'
                    src={icon}
                    alt={code}
                    width={200}
                    height={isMobile ? 40 : 80}
                    priority={false}
                  />
                ) : (
                  <div className='h-[24px] md:h-[24px] w-[200px] bg-gray-200 rounded animate-pulse' />
                )}
              </div>
            )}
            <div className='mb-1 md:mb-2'>
              <h5
                className={`sm:text-sm text-xs fontWeightSemibold text-foreground mb-0 truncate ${isPDP ? 'md:text-base' : 'md:text-lg md:mb-1'}`}
              >
                {title}
              </h5>
            </div>
          </>
        )}

        <div className='mb-1 md:mb-2'>
          <p
            className='text-foreground line-clamp-2'
            style={{
              fontSize: isMobile ? 'var(--font-size-xs)' : 'var(--text-xs)',
            }}
          >
            {description}
          </p>
        </div>

        <div className='flex'>
          <button
            className='text-accent-red-900 cursor-pointer text-xs font-semibold hover:underline dark:text-[var(--prive2)]'
            onClick={(e) => {
              if (isMobile) {
                e.stopPropagation();
              }
              handleOpenModal();
            }}
          >
            Learn More
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ResponsiveDialogDrawer
          contentClassName='sm:max-w-[792px]! dark:border-[var(--primary-800)]'
          open={isModalOpen}
          setOpen={setIsModalOpen}
          title={'Bank Offer'}
        >
          <OfferDetailsModal
            code={code}
            title={title}
            description={description}
            icon={icon}
            discountPercentage={discountPercentage}
            maximumDiscountAllowed={maximumDiscountAllowed}
            minimumNights={minimumNights}
            endDateTime={endDateTime}
            termsAndConditions={termsAndConditions}
          />
        </ResponsiveDialogDrawer>
      )}
    </>
  );
};

export default DiscountCard;
