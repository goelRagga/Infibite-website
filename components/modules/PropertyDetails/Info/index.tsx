'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import useIsMobile from '@/hooks/useIsMobile';
import {
  Accessibility,
  BedDouble,
  LucideIcon,
  PawPrint,
  ShowerHead,
  Star,
  Users,
} from 'lucide-react';
import PropertyDetailsTypes from '../PropertyDetail.types';
import Brochure from '@/components/common/Brochure';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import SingleBlogPageForm from '@/components/wordpressComponents/WPForms/SingleBlogPageForm';
import BrochureSuccessDrawer from '@/components/common/Brochure/BrochureSuccessDrawer';
import { trackEvent } from '@/lib/mixpanel';
import Cookies from 'js-cookie';

const VillaDetails = ({
  name,
  city,
  location,
  metrics,
  isHighDemand,
  isPetFriendly,
  review,
  propertyId,
  brandedBrochure,
}: PropertyDetailsTypes.InfoSectionProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [successDrawerOpen, setSuccessDrawerOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [showThankYouMessage, setShowThankYouMessage] = useState(true);
  const isAuthenticated = Cookies.get('accessToken') ? true : false;
  const BROCHURE_FORM_STORAGE_KEY = 'brochure_form_submitted';

  const hasFormBeenSubmitted = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(BROCHURE_FORM_STORAGE_KEY) === 'true';
  };

  const markFormAsSubmitted = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BROCHURE_FORM_STORAGE_KEY, 'true');
    }
  };

  const handleBrochureClick = () => {
    if (hasFormBeenSubmitted()) {
      setShowThankYouMessage(false);
      setSuccessDrawerOpen(true);
    } else {
      setFormOpen(true);
      trackEvent('get_brochure');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      markFormAsSubmitted();
    }
  }, [isAuthenticated]);

  const handleFormSuccess = (result: any) => {
    markFormAsSubmitted();
    setFormOpen(false);
    trackEvent('brochure_from_submit');
    // First time submission, show thank you message
    setShowThankYouMessage(true);
    setTimeout(() => {
      setSuccessDrawerOpen(true);
    }, 100);
  };

  const handleFormSubmit = (formData: any) => {
    const phone = formData?.eventDetails?.phone;
    const countryCode = formData?.eventDetails?.countryCode || '+91';

    if (phone) {
      let fullPhoneNumber = phone;
      if (
        countryCode &&
        !phone.startsWith(countryCode.replace(/[^0-9]/g, ''))
      ) {
        const cleanCountryCode = countryCode.replace(/[^0-9]/g, '');
        fullPhoneNumber = `${cleanCountryCode}${phone}`;
      }
      setPhoneNumber(fullPhoneNumber);
    }
  };

  const getMetricValue = (label: string) =>
    metrics?.find((m) => m.name.toLowerCase() === label.toLowerCase())?.value;

  const getBedroomValue = () => {
    const value = getMetricValue('Bedroom') || getMetricValue('Bedrooms');
    return value > 1 ? `${value} bedrooms` : `${value} bedroom`;
  };

  const getBathroomValue = () => {
    const value = getMetricValue('Bathroom') || getMetricValue('Bathrooms');
    return value > 1 ? `${value} bathrooms` : `${value} bathroom`;
  };

  const isMobile = useIsMobile();
  const FeatureCard = ({
    icon: Icon,
    title,
    subtitle,
  }: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
  }) => (
    <div className='flex items-center p-3 sm:p-4 border border-[#DDD2CB] rounded-2xl gap-4 w-full bg-[#FBFAF9] dark:bg-[var(--brown2)]  dark:border-primary-800 '>
      <div className='bg-[#DDD2CB] dark:bg-[var(--black9)] dark:text-[var(--accent-text)] text-primary rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center'>
        <Icon className='w-5 h-5' />
      </div>
      <div className='sm:text-left text-center'>
        <div className='font-semibold text-[var(--grey9)] sm:text-sm text-xs  dark:text-[var(--accent-text)] '>
          {title}
        </div>
        <div className='text-muted-foreground text-xs  sm:text-sm'>
          {subtitle}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card
        className='border-none shadow-none bg-white dark:bg-background m-0 rounded-10 xl:px-0 sm:px-10 px-4'
        id='overview'
      >
        <CardContent className='p-0 space-y-5'>
          {/* Header */}
          <div className='flex gap-2 sm:gap-0 items-start justify-between relative mb-0'>
            <div className='grid gap-1 sm:gap-3 w-full'>
              {isHighDemand && (
                <span
                  className='inline-block w-fit px-3 py-1.5 text-xs font-semibold text-white rounded-full shadow-md overflow-hidden relative'
                  style={{
                    background:
                      'linear-gradient(90deg, #FE8C00 0%, #F83600 100%)',
                  }}
                  // whileHover={{ scale: 1.05 }}
                  // transition={{ duration: 0.2 }}
                >
                  {/* <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  /> */}
                  <span className='relative z-10'>High Demand</span>
                </span>
              )}
              {isMobile ? (
                <h2 className='text-2xl sm:text-3xl xl:text-4xl font-serif text-foreground xl:max-w-3xl '>
                  {name}
                </h2>
              ) : (
                <h1 className='text-2xl sm:text-3xl xl:text-4xl font-serif text-foreground xl:max-w-3xl '>
                  {name}
                </h1>
              )}
            </div>

            {review && (
              <div className='flex items-center font-semibold gap-2 text-sm mt-2 sm:mt-3'>
                <div className='flex items-center'>
                  <Star
                    size={20}
                    strokeWidth={0}
                    className='w-5 h-5 fill-yellow-500 stroke-yellow-500 mr-1'
                  />
                  {review?.rating}
                </div>

                {!isMobile && (
                  <>
                    <div className='w-px h-4 bg-secondary-300' />
                    <div className='text-accent-red-900 hover:text-accent-red-950 dark:text-[var(--accent-text)]'>
                      <a
                        href='#reviews'
                        onClick={(e) => {
                          e.preventDefault();
                          document?.getElementById('reviews')?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }}
                        className='underline cursor-pointer whitespace-nowrap'
                      >
                        {review?.numberOfReviews} Reviews
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-[var(--color-foreground)] text-sm sm:text-base'>
              {location},&nbsp;{city}
            </h2>
            {brandedBrochure && !isMobile && (
              <Brochure
                className='flex-row gap-1 hover:bg-[var(--grey15)] border border-accent-red-900 py-2 md:py-2.5 px-2.5 md:px-5 rounded-md cursor-pointer dark:border-primary-800 dark:bg-[var(--grey7)] dark:hover:bg-[var(--black5)]'
                brochureUrl={brandedBrochure}
                onClick={handleBrochureClick}
                textSize='text-xs dark:text-[var(--accent-text)]! '
              />
            )}
          </div>

          {/* Stats */}
          <div className='flex flex-wrap items-center sm:gap-x-6 gap-x-3 gap-y-2 font-semibold text-sm sm:text-base text-[var(--dawnpink-200)]'>
            {getMetricValue('Guests') && (
              <div className='flex items-center gap-2 text-xs sm:text-sm'>
                <Users className='w-4 h-4 dark:text-primary-200' />
                <span className='dark:text-primary-200'>
                  {getMetricValue('Guests')} guests
                </span>
              </div>
            )}

            {getMetricValue('Guests') && getBedroomValue() && (
              <span className='text-[var(--dawnpink-100)] font-normal text-lg'>
                |
              </span>
            )}

            {getBedroomValue() && (
              <div className='flex items-center gap-2 text-xs sm:text-sm'>
                <BedDouble className='w-4 h-4 dark:text-primary-200' />
                <span className='dark:text-primary-200'>
                  {getBedroomValue()}
                </span>
              </div>
            )}

            {getBedroomValue() && getBathroomValue() && (
              <span className='text-[var(--dawnpink-100)] font-normal text-lg'>
                |
              </span>
            )}

            {getBathroomValue() && (
              <div className='flex items-center gap-2 text-xs sm:text-sm'>
                <ShowerHead className='w-4 h-4 dark:text-primary-200' />
                <span className='dark:text-primary-200'>
                  {getBathroomValue()}
                </span>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className='text-yellow-500 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 '>
            {isPetFriendly && (
              <FeatureCard
                icon={PawPrint}
                title='Pet Friendly'
                subtitle='Your pets deserve a vacation too'
              />
            )}
            <FeatureCard
              icon={Accessibility}
              title='Senior Citizen Friendly'
              subtitle='Designed for a relaxed senior-friendly stay'
            />
          </div>
        </CardContent>
        {brandedBrochure && isMobile && (
          <Brochure
            className='flex-row gap-1 hover:bg-[var(--grey15)] border border-accent-red-900 py-3 md:py-2.5 px-2.5 md:px-5 mt-3 rounded-md cursor-pointer dark:border-primary-800 dark:bg-[var(--grey7)] dark:hover:bg-[var(--black5)]'
            brochureUrl={brandedBrochure}
            onClick={handleBrochureClick}
            textSize='text-xs dark:text-[var(--accent-text)]! '
          />
        )}
      </Card>

      {/* Form Modal */}
      <ResponsiveDialogDrawer
        contentClassName='h-screen h-auto! md:h-[500px]! sm:auto! sm:max-w-[480px]! bg-card gap-0 fixed! bottom-0! dark:bg-[var(--prive-background)] dark:border-primary-800'
        overlayClassName='bg-black/70!'
        title='Send a Request'
        description='Submit the form to get the villa brochure'
        open={formOpen}
        setOpen={setFormOpen}
      >
        <SingleBlogPageForm
          formType='lead'
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
          onSubmit={handleFormSubmit}
          className='relative h-auto overflow-auto pt-0 mb-20 '
        />
      </ResponsiveDialogDrawer>

      {/* Success Drawer */}
      <ResponsiveDialogDrawer
        contentClassName='h-screen h-auto bg-white max-h-[70dvh] min-h-[50vh] md:max-w-[480px]! md:h-auto! overflow-hidden dark:border-primary-800 dark:bg-[var(--prive-background)]'
        overlayClassName='bg-black/70!'
        title='Download Brochure'
        description=''
        open={successDrawerOpen}
        setOpen={setSuccessDrawerOpen}
      >
        <BrochureSuccessDrawer
          brochureUrl={brandedBrochure}
          onClose={() => setSuccessDrawerOpen(false)}
          propertyName={name}
          location={location}
          city={city}
          phoneNumber={phoneNumber}
          showThankYouMessage={showThankYouMessage}
        />
      </ResponsiveDialogDrawer>
    </>
  );
};

export default VillaDetails;
