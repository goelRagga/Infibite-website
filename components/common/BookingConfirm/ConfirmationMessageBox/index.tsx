'use client';

import { Button, Separator } from '@/components/ui';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { generateGoogleCalendarUrl } from '@/lib/googleCalendar';
import { motion } from 'framer-motion';
import { formatDateWithFullYear } from '@/components/common/Shared/FormatDate';
import BookingConfirmedIcon from '@/assets/bookingConfirmedCheck.svg';
import IosShareIcon from '@/assets/iosShareButton.svg';
import CalenderIcon from '@/assets/calendarAdd.svg';
import { useState } from 'react';
import { ShareModal } from '@/components/common/ShareModal';
import { DetailMobileHeader } from '@/components/modules/PropertyDetails/Header';

interface ConfirmationMessageBoxProps {
  name?: string;
  bookingId?: string;
  bookedOn?: any;
  checkinDate?: any;
  checkoutDate?: any;
  propertyName?: string;
  propertyLocation?: string;
}

const ConfirmationMessageBox: React.FC<ConfirmationMessageBoxProps> = ({
  name,
  bookingId,
  bookedOn,
  checkinDate,
  checkoutDate,
  propertyName,
  propertyLocation,
}) => {
  const bookedOnD = 'Booked on';
  const bookingID = 'Booking ID';
  const getReadyForYourStay = 'get ready for your stay!';
  const bookingConfirmed = 'Booking Confirmed';
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const shareText = `Check out this amazing ${propertyName} in ${propertyLocation}!`;

  const googleCalendarUrl = generateGoogleCalendarUrl({
    checkinDate: checkinDate || '',
    checkoutDate: checkoutDate || '',
    propertyName: propertyName || '',
    propertyLocation: propertyLocation || '',
  });

  return (
    <div
      className='flex flex-col lg:flex-row items-center justify-between text-white px-4 md:px-10 py-4'
      style={{ background: 'var(--backgroundGradient10)' }}
    >
      <motion.div
        className='flex flex-col lg:flex-row items-center gap-4'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.div
          className='bg-emerald-700 rounded-full p-2'
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            type: 'spring',
            stiffness: 200,
          }}
        >
          <BookingConfirmedIcon />
        </motion.div>
        <div className='text-center lg:text-start'>
          <motion.h5
            className='text-xl md:text-2xl font-serif text-white'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: 0.8 }}
          >
            {bookingConfirmed}
          </motion.h5>
          <motion.p
            className='text-xs md:text-sm text-white'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            Dear {name}, {getReadyForYourStay}
          </motion.p>
        </div>
      </motion.div>
      {isTablet && (
        <Separator
          orientation='horizontal'
          decorative
          className='mt-4 mb-4 w-[90vw] border-b border-white opacity-50'
        />
      )}

      <motion.div
        className='flex flex-col md:flex-row items-center md:items-end gap-2'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className='text-center md:text-right md:mr-4'>
          <motion.p
            className='text-sm pb-0.5 md:p-0'
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            {bookingID}:{' '}
            <span className='text-xs md:text-sm font-semibold'>
              {bookingId}
            </span>
          </motion.p>
          <motion.p
            className='text-xs'
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            {bookedOnD} {formatDateWithFullYear(bookedOn)}
          </motion.p>
        </div>

        <motion.div
          className='flex gap-2 mt-2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 1.8,
              type: 'spring',
              stiffness: 300,
            }}
          >
            {isTablet ? (
              <>
                <DetailMobileHeader
                  name={propertyName}
                  city={propertyLocation}
                  // state={propertyInfo?.state}
                  // metrics={propertyInfo?.metrics}
                  backHref={'backHref'}
                  className='static pl-0 pr-0 w-[40px] h-[40px]'
                  isArrow={false}
                  isBookingConfirmIcon={true}
                />
              </>
            ) : (
              <Button
                className='bg-white hover:bg-[var(--white3)] cursor-pointer flex justify-center items-center h-[40px] w-[40px] p-2 rounded'
                aria-label='Share'
                onClick={() => setShareModalOpen(true)}
              >
                <IosShareIcon />
              </Button>
            )}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 2.0,
              type: 'spring',
              stiffness: 300,
            }}
          >
            <Button
              onClick={() => {
                window.open(googleCalendarUrl, '_blank');
              }}
              className='bg-white hover:bg-[var(--white3)] cursor-pointer flex justify-center items-center h-[40px] w-[40px] p-2 rounded'
              aria-label='Add to Calendar'
            >
              <CalenderIcon />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      {shareModalOpen && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          title={propertyName}
          text={shareText}
        />
      )}
    </div>
  );
};

export default ConfirmationMessageBox;
