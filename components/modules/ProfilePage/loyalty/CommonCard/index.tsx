'use client';

import CustomImage from '@/components/common/CustomImage';
import type React from 'react';

interface BenefitMeta {
  name?: string;
  image?: string;
  title?: string;
  description?: string;
}

interface CommonCardData {
  id?: string;
  icon?: string;
  addIcon?: string;
  title?: string;
  value?: string | number;
  description?: string;
  image?: string;
  metadata?: {
    benefits?: BenefitMeta;
  };
  component?: React.ComponentType<any>;
  [key: string]: any;
}

interface CommonCardProps<T> {
  icon?: string;
  addIcon?: string;
  title?: string;
  value?: string | number;
  description?: string;
  category?: string;
  image?: string;
  component?: React.ComponentType<any>;

  data: T[];

  direction?: 'horizontal' | 'vertical' | 'grid';
  contentDirection?: 'horizontal' | 'vertical' | 'responsive';
  columns?: number;

  className?: string;
  iconClassName?: string;
  addIconClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  contentclassname?: string;
  descriptionClassName?: string;
  categoryClassName?: string;
  imageClassName?: string;
  imageClassNameInnerDiv?: string;
  imageClassWidth?: number;
  imageClassHeight?: number;
  cardClassName?: string;
  nameClassName?: string;

  onClick?: (item: T, index: number) => void;
  onIconClick?: (item: CommonCardData, index: number) => void;
  onAddIconClick?: (item: CommonCardData, index: number) => void;
  renderItem?: React.ComponentType<{ item: T; index: number }>;
}

export default function CommonCard<T>({
  icon: singleIcon,
  addIcon: singleAddIcon,
  title: singleTitle,
  value: singleValue,
  description: singleDescription,
  category,
  image: singleImage,
  component: singleComponent,

  data,

  direction = 'vertical',
  contentDirection = 'vertical',
  columns = 1,

  className = '',
  iconClassName = '',
  addIconClassName = '',
  titleClassName = '',
  valueClassName = '',
  descriptionClassName = '',
  nameClassName = '',
  categoryClassName = '',
  contentclassname = '',
  imageClassName,
  imageClassWidth,
  imageClassHeight,
  imageClassNameInnerDiv,
  cardClassName = '',

  onClick,
  onIconClick,
  onAddIconClick,
  renderItem: RenderItemComponent,
}: CommonCardProps<T>) {
  const getLayoutClasses = () => {
    if (direction === 'horizontal') {
      return 'flex flex-row md:gap-4 overflow-x-auto';
    }
    if (direction === 'grid') {
      return `grid md:gap-4 md:mt-0 mt-2  ${
        columns === 2
          ? 'grid-cols-1 md:grid-cols-2 '
          : columns === 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : columns === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1'
      }`;
    }
    return 'flex flex-col gap-4';
  };

  const getContentDirectionClasses = () => {
    if (contentDirection === 'horizontal')
      return 'flex flex-row items-center gap-4 px-5 py-4 md:p-0';
    if (contentDirection === 'vertical') return 'flex flex-col items-center';
    if (contentDirection === 'responsive')
      return 'flex flex-row md:flex-col md:items-center gap-2';
    return '';
  };

  const renderCard = (item: CommonCardData, index: number) => {
    const benefits = item.metadata?.benefits || {};
    const { name, image, title, description } = benefits;

    const displayTitle = title || name || '';
    const displayDesc = description || '';
    const displayImage = image || '';
    const isSvg =
      typeof displayImage === 'string' && displayImage.endsWith('.svg');

    return (
      <div
        key={item.id || index}
        className={`transition-all duration-200 ${cardClassName} ${getContentDirectionClasses()}`}
        onClick={() => onClick?.(item as any, index)}
      >
        {displayImage && (
          <div className={`relative overflow-hidden ${imageClassName}`}>
            <div className={`${imageClassNameInnerDiv}`}>
              <CustomImage
                src={displayImage}
                alt={displayTitle || 'Card image'}
                className='w-full h-full object-cover'
                width={imageClassWidth || 42}
                height={imageClassHeight || 42}
              />
            </div>
          </div>
        )}

        <div className={`${contentclassname} text-center`}>
          {displayTitle && item.category !== 'SPECIAL_MONTHS' && (
            <span className={`${titleClassName} block text-base font-medium`}>
              {displayTitle}
            </span>
          )}

          {name && (
            <span className={`${nameClassName} block text-base font-medium`}>
              {name}
            </span>
          )}

          {displayDesc && (
            <p className={`${descriptionClassName}`}>{displayDesc}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {data.map((item, index) => renderCard(item as CommonCardData, index))}
    </div>
  );
}
