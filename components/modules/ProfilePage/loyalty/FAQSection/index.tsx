'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title: string;
  questions: FAQItem[];
  className?: string;
}

export default function FAQAccordion({
  title,
  questions,
  className = '',
}: FAQAccordionProps) {
  return (
    <div className={`${className}`}>
      <h2 className='text-xl lg:text-2xl text-foreground font-serif'>
        {title}
      </h2>

      <Accordion
        type='single'
        collapsible
        className='mt-2 space-y-0 border-b border-primary-100'
      >
        {questions?.map((item) => (
          <AccordionItem
            key={item?.id}
            value={item?.id}
            className='border-b border-primary-100'
          >
            <AccordionTrigger className='text-xs font-semibold text-foreground py-3.5 cursor-pointer hover:bg-gray-100 pr-0 hover:no-underline focus:no-underline'>
              {item?.question}
            </AccordionTrigger>
            <AccordionContent className='pb-4 lead-[170%] text-xs text-foreground'>
              {item?.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
