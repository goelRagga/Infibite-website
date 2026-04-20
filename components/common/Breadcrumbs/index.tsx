'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BreadcrumProps } from 'custom-breadcrum';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { truncateText } from '@/lib/utils';

const CustomBreadcrumb: React.FC<BreadcrumProps> = ({ items, className }) => {
  const router = useRouter();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
    label: string
  ) => {
    event.preventDefault();
    if (label === 'Property Detail Page') {
      router.back();
    } else {
      router.push(href);
    }
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items?.map((item, index) => {
          const isLastItem = index === items.length - 1;
          const truncatedLabel = truncateText(item?.label, 5);

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem key={item.href}>
                {isLastItem ? (
                  <BreadcrumbPage className='text-foreground'>
                    {truncatedLabel}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className='font-semibold text-accent-red-900 dark:text-[#EFBF8E] hover:underline'
                    onClick={(e) => handleClick(e, item.href, item.label)}
                  >
                    {truncatedLabel}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem && (
                <BreadcrumbSeparator className='text-primary dark:text-primary-light' />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
