'use client';

import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';
import { phoneNumber, whatsAppNumber } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';

interface ContactCTAProps {
  pageName?: string;
}

const ContactCTA = ({ pageName }: ContactCTAProps) => {
  const isMobile = useIsMobile();
  const description =
    'Still unsure about something? Let our experts take care of that for you.';
  const callUs = 'Call Us';

  return (
    <>
      <div className='flex items-center justify-between'>
        <p className='text-secondary-900 text-sm mt-0 mb-0 dark:text-white'>
          {description}
        </p>
      </div>

      <div className='flex gap-4 '>
        <Link
          href={`tel:${phoneNumber}`}
          onClick={() =>
            trackEvent('contact_us_clicked', {
              cta_type: 'call',
              page_name: pageName,
            })
          }
          className='w-full h-auto'
        >
          <Button className='flex flex-col md:flex-row bg-accent-red-900 py-2 md:py-3 px-2 rounded-lg md:rounded-lg text-white w-full h-full hover:bg-accent-red-950 dark:bg-[var(--accent-background)] dark:text-white '>
            <Phone className='w-4 h-4' />
            {callUs}
          </Button>
        </Link>
        <Link
          href={`https://api.whatsapp.com/send/?phone=${whatsAppNumber}&text=Book+Villa+for+me.&type=phone_number&app_absent=0`}
          className='w-full'
          onClick={() =>
            trackEvent('contact_us_clicked', {
              cta_type: 'message',
              page_name: pageName,
            })
          }
        >
          <Button className='flex flex-col md:flex-row bg-foreground py-2 md:py-3 px-2 rounded-lg md:rounded-lg text-white w-full h-full hover:bg-[var(--brown9)] dark:border-accent-yellow-950 dark:border-1 dark:bg-[var(--grey8)] dark:text-accent-yellow-950'>
            <MessageSquare className='w-4 h-4 dark:text-accent-yellow-950' />
            {isMobile ? 'Message' : 'Message Us (24*7)'}
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ContactCTA;
