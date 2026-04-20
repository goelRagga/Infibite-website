import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type AccordionItemType = {
  index: number;
  value: string;
  question: React.ReactNode;
  answer: React.ReactNode;
};

type CustomAccordionProps = {
  items: AccordionItemType[] | null;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
};

export default function CustomAccordion({
  items,
  type = 'single',
  collapsible = true,
  className = 'w-full',
}: CustomAccordionProps) {
  return (
    <Accordion type={type} collapsible={collapsible} className={className}>
      {items?.map(({ value, question, answer }) => (
        <AccordionItem
          key={value}
          value={value}
          className='border-bottom dark:border-secondary-950 no-underline'
        >
          <AccordionTrigger className='font-semibold text-xs cursor-pointer dark:hover:text-white no-underline!'>
            {question}
          </AccordionTrigger>
          <AccordionContent className='text-xs'>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
