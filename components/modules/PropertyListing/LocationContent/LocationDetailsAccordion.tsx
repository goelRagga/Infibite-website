'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import useIsMobile from '@/hooks/useIsMobile';
import { capitalizeInitials, cn } from '@/lib/utils';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { useState } from 'react';

interface CityAccordionProps {
  cityContent: {
    name: string;
    content: string;
  } | null;
}

const LocationDetailsAccordion: React.FC<CityAccordionProps> = ({
  cityContent,
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);

  if (!cityContent) return null;
  return (
    <div className='w-full border-b border-muted/30 bg-[var(--prive3)] px-5 py-4 sm:py-6 md:px-10'>
      <Accordion
        type='single'
        collapsible
        defaultValue='city-details'
        className='w-full'
        onValueChange={(value) => setIsOpen(value === 'city-details')}
      >
        <AccordionItem value='city-details' className='border-0'>
          <AccordionTrigger
            className={cn(
              'text-white text-[20px] md:text-xl font-semibold hover:no-underline cursor-pointer',
              'flex items-center justify-between w-full gap-2',
              '[&>svg]:hidden'
            )}
          >
            <span>{capitalizeInitials(cityContent?.name)}</span>
            <div className='flex-shrink-0'>
              {isOpen ? (
                <CircleMinus className='h-5 w-5 text-white' />
              ) : (
                <CirclePlus className='h-5 w-5 text-white' />
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div
              className={cn(
                // Lists
                '[&_ul]:list-disc [&_ul]:my-4 [&_ul]:pl-8 [&_ul]:text-[var(--secondary-700)] [&_ul]:-ml-4 [&_ul]:text-xs',
                '[&_ol]:list-decimal [&_ol]:my-4 [&_ol]:pl-8 [&_ol]:text-[var(--secondary-700)] [&_ol]:-ml-3 [&_ol]:text-xs',
                '[&_li]:mb-2',

                // Links
                '[&_a]:underline [&_a]:text-inherit hover:[&_a]:underline',

                // Paragraphs
                '[&_p]:mb-4 [&_p]:text-[var(--secondary-700)] [&_p]:text-xs',

                // Headings
                '[&_h1]:mb-2 [&_h1]:text-[var(--secondary-300)]',
                '[&_h2]:mb-2 [&_h2]:text-[var(--secondary-300)]',
                '[&_h3]:mb-2 [&_h3]:text-[var(--secondary-300)]',
                '[&_h4]:mb-2 [&_h4]:text-[var(--secondary-300)]',
                '[&_h5]:mb-2 [&_h5]:text-[var(--secondary-300)]',
                '[&_h6]:mb-2 [&_h6]:text-[var(--secondary-300)]',

                // Table
                '[&_table]:border-collapse [&_table]:my-4 [&_table]:w-full',
                '[&_th]:border [&_th]:border-[rgba(0,0,0,0.1)] [&_th]:p-2',
                '[&_td]:border [&_td]:border-[rgba(0,0,0,0.1)] [&_td]:p-2',

                // Blockquote
                '[&_blockquote]:ml-4 [&_blockquote]:pl-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[rgba(0,0,0,0.1)] [&_blockquote]:italic',

                // Code
                '[&_code]:font-mono [&_code]:py-[0.2em] [&_code]:px-[0.4em] [&_code]:rounded-[3px] [&_code]:bg-[rgba(0,0,0,0.05)]',

                // Images
                '[&_img]:rounded-xl [&_img]:shadow-lg [&_img]:max-w-full [&_img]:h-auto',

                // elements
                '[&_strong]:font-bold',
                '[&_em]:italic',
                '[&_hr]:my-6 [&_hr]:border-gray-300'
              )}
              dangerouslySetInnerHTML={{ __html: cityContent?.content || '' }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LocationDetailsAccordion;
