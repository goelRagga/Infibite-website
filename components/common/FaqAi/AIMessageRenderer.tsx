'use client';

import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  CornerDownRight,
} from 'lucide-react';

import Image from 'next/image';
import React from 'react';
import Markdown from 'markdown-to-jsx';
import ContactButton from './ContactButton';
import { CarouselTemplate } from '@/components/common/Carousel';
import CustomImage from '@/components/common/CustomImage';
import useIsMobile from '@/hooks/useIsMobile';
import { CouponCard } from '@/components/common/Coupons/CouponCard';
import { DEFAULT_IMAGE } from '@/lib/constants';

interface AIResponseData {
  text_md: string;
  list?: string[];
  images?: string[];
  map_url?: string;
  phone?: string;
  whatsapp?: string;
  urls?: string[];
  contact_info?: {
    map_url?: string;
    phone?: string;
    whatsapp?: string;
    urls?: string[];
  };
  suggestions?: string[];
  valueAdded_services?: Array<{
    id: string;
    name: string;
    description?: string;
    basePrice?: number;
    applicableAdults?: number;
    image?: string;
  }>;
  offers?: Array<{
    code: string;
    title: string;
    description?: string;
    discountPercentage?: number;
    maximumDiscountAllowed?: number;
    minimumNights?: number;
    termsAndConditions?: string;
    endDateTime?: string;
    discountMethod?: string;
    icon?: string;
    image?: string;
  }>;
}

interface AIMessageRendererProps {
  content: string | AIResponseData;
  onSuggestionClick?: (suggestion: string) => void;
  onImageClick?: (images: string[], index: number) => void;
  isSmallText?: boolean;
}

// Small card component for value-added services
const ValueAddedServiceCard = ({ service }: { service: any }) => {
  return (
    <div className='rounded-xl overflow-hidden border border-gray-200 bg-white max-w-xs h-[200px] flex flex-col dark:border-primary-800 dark:bg-[var(--grey8)]'>
      <div className='relative w-full h-32'>
        <div className='overflow-hidden rounded-xl h-full'>
          <CustomImage
            src={service?.image || DEFAULT_IMAGE}
            alt={service?.name || 'Service Image'}
            title={service?.name}
            width={300}
            height={200}
            quality={20}
            className='object-cover h-full w-full'
          />
        </div>
      </div>

      {/* Card Content */}
      <div className='p-3 flex-1 flex flex-col justify-between'>
        <div>
          <h3 className='text-sm font-semibold mb-1 text-foreground line-clamp-2 dark:text-accent-yellow-950'>
            {service.name}
          </h3>
          {service.description && (
            <p className='text-xs text-neutral-700 line-clamp-2 dark:text-white'>
              {service.description}
            </p>
          )}
        </div>
        {service.applicableAdults && (
          <p className='text-xs text-neutral-500 mt-1 line-clamp-1'>
            For {service.applicableAdults} adults
          </p>
        )}
      </div>
    </div>
  );
};

const AIMessageRenderer: React.FC<AIMessageRendererProps> = ({
  content,
  onSuggestionClick,
  onImageClick,
  isSmallText = false,
}) => {
  let parsedData: AIResponseData | null = null;
  const isMobile = useIsMobile();

  const handleImageClick = (index: number) => {
    if (parsedData?.images && onImageClick) {
      onImageClick(parsedData.images, index);
    }
  };

  // Contact button configuration array
  const contactButtonConfig = [
    {
      condition: (contact: any) => contact?.map_url,
      icon: MapPin,
      onClick: (contact: any) => window.open(contact?.map_url, '_blank'),
      title: 'View on Map',
    },
    {
      condition: (contact: any) => contact?.phone,
      icon: Phone,
      onClick: (contact: any) => {
        const phoneNumber = contact?.phone?.startsWith('tel:')
          ? contact?.phone
          : `tel:${contact.phone}`;
        window.location.href = phoneNumber;
      },
      title: 'Call Property',
    },
    {
      condition: (contact: any) => contact?.whatsapp,
      icon: MessageCircle,
      onClick: (contact: any) => {
        let whatsappUrl = contact?.whatsapp;
        if (
          !whatsappUrl?.startsWith('whatsapp://') &&
          !whatsappUrl?.startsWith('https://wa.me/') &&
          !whatsappUrl?.startsWith('wa.me/')
        ) {
          whatsappUrl = `whatsapp://send?phone=${contact?.whatsapp?.replace(/[^0-9]/g, '')}`;
        }
        window.open(whatsappUrl, '_blank');
      },
      title: 'WhatsApp',
    },
    {
      condition: (contact: any) => contact?.urls && contact?.urls?.length > 0,
      icon: ExternalLink,
      onClick: (contact: any) => window.open(contact?.urls?.[0], '_blank'),
      title: 'More Details',
    },
  ];

  // Handle content that is already an object
  if (typeof content === 'object' && content !== null) {
    parsedData = content as unknown as AIResponseData;
  } else if (typeof content === 'string') {
    try {
      // Try to parse the content as JSON
      parsedData = JSON.parse(content);
    } catch {
      // If parsing fails, treat as plain text

      // Check if it's a simple error message
      if (content.includes('I apologize')) {
        return (
          <div className='space-y-3'>
            <div className='text-sm text-gray-800 whitespace-pre-wrap'>
              {content}
            </div>
          </div>
        );
      }

      // Try to handle as plain text
      return (
        <div className='space-y-3'>
          <div className='text-sm text-gray-800 whitespace-pre-wrap'>
            {content}
          </div>
        </div>
      );
    }
  }

  if (!parsedData) {
    return (
      <div className='space-y-3'>
        <div className='text-sm text-gray-800 whitespace-pre-wrap'>
          {typeof content === 'string' ? content : 'Unable to display content.'}
        </div>
      </div>
    );
  }

  // Check if we have any content to display
  const hasContent = Boolean(
    parsedData.text_md ||
      (parsedData.list && parsedData.list.length > 0) ||
      (parsedData.images && parsedData.images.length > 0) ||
      parsedData.map_url ||
      parsedData.phone ||
      parsedData.whatsapp ||
      (parsedData.urls && parsedData.urls.length > 0) ||
      (parsedData.contact_info &&
        (parsedData.contact_info.map_url ||
          parsedData.contact_info.phone ||
          parsedData.contact_info.whatsapp ||
          (parsedData.contact_info.urls &&
            parsedData.contact_info.urls.length > 0)))
  );

  if (!hasContent) {
    return (
      <div className='space-y-3'>
        <div className='text-sm text-gray-600'>
          No content available to display.
        </div>
      </div>
    );
  }

  const contact = {
    map_url: parsedData?.contact_info?.map_url ?? parsedData?.map_url,
    phone: parsedData?.contact_info?.phone ?? parsedData?.phone,
    whatsapp: parsedData?.contact_info?.whatsapp,
    urls: parsedData?.contact_info?.urls ?? parsedData?.urls,
  };

  const hasActions = Boolean(
    contact?.map_url ||
      contact?.phone ||
      contact?.whatsapp ||
      (contact?.urls && contact?.urls.length > 0)
  );

  return (
    <div className='space-y-4'>
      {/* Main text content */}
      {parsedData?.text_md && parsedData?.text_md?.trim() && (
        <div
          className={`text-gray-800 prose prose-sm max-w-none ${isSmallText ? 'text-xs' : 'text-sm'}`}
        >
          <div
            className={`bg-gradient-to-r text-accent-red-900 font-bold flex items-center mb-2 ${isSmallText ? 'text-xs' : 'text-sm'}`}
          >
            <Sparkles
              className={`text-accent-red-900 mr-1 scale-92 ${isSmallText ? 'h-3 w-3' : 'h-4 w-4'}`}
            />{' '}
            Eli
          </div>
          <Markdown
            options={{
              overrides: {
                p: {
                  component: ({ children }) => (
                    <p className='mb-2 last:mb-0'>{children}</p>
                  ),
                },
                strong: {
                  component: ({ children }) => (
                    <strong className='font-semibold text-gray-900'>
                      {children}
                    </strong>
                  ),
                },
                em: {
                  component: ({ children }) => (
                    <em className='italic text-gray-700'>{children}</em>
                  ),
                },
                ul: {
                  component: ({ children }) => (
                    <ul className='list-disc list-inside mb-2 space-y-2'>
                      {children}
                    </ul>
                  ),
                },
                ol: {
                  component: ({ children }) => (
                    <ol className='list-decimal list-inside mb-2 space-y-1'>
                      {children}
                    </ol>
                  ),
                },
                li: {
                  component: ({ children }) => (
                    <li className='text-gray-700'>{children}</li>
                  ),
                },
                h1: {
                  component: ({ children }) => (
                    <h1 className='text-lg font-bold text-gray-900 mb-2'>
                      {children}
                    </h1>
                  ),
                },
                h2: {
                  component: ({ children }) => (
                    <h2 className='text-base font-semibold text-gray-900 mb-2'>
                      {children}
                    </h2>
                  ),
                },
                h3: {
                  component: ({ children }) => (
                    <h3 className='text-sm font-semibold text-gray-900 mb-2'>
                      {children}
                    </h3>
                  ),
                },
                blockquote: {
                  component: ({ children }) => (
                    <blockquote className='border-l-4 border-[var(--color-primary-300)] pl-3 italic text-gray-600'>
                      {children}
                    </blockquote>
                  ),
                },
                code: {
                  component: ({ children }) => (
                    <code className='bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800'>
                      {children}
                    </code>
                  ),
                },
                pre: {
                  component: ({ children }) => (
                    <pre className='bg-gray-100 p-2 rounded text-xs font-mono text-gray-800 overflow-x-auto'>
                      {children}
                    </pre>
                  ),
                },
              },
            }}
          >
            {parsedData.text_md}
          </Markdown>
        </div>
      )}

      {/* List items */}
      {parsedData?.list && parsedData?.list?.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-700)]'>
            {/* <Sparkles className='h-4 w-4' /> */}
            <span>Features & Amenities:</span>
          </div>
          <div className='flex flex-wrap gap-2 max-w-full'>
            {parsedData?.list.map((item, index) => (
              <Badge
                key={index}
                variant='outline'
                className='text-xs border-[var(--color-primary-300)] px-2 py-1 text-[var(--color-primary-700)] bg-white break-words max-w-full whitespace-normal'
              >
                <span title={item} className='break-words whitespace-normal'>
                  {item}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      {parsedData?.images && parsedData?.images?.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-700)]'>
            <ImageIcon className='h-4 w-4' />
            <span>Property Images:</span>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {parsedData?.images?.map((imageUrl, index) => (
              <div
                key={index}
                className='relative aspect-square rounded-lg overflow-hidden flex w-full h-full cursor-pointer hover:opacity-90 transition-opacity'
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={imageUrl}
                  alt={`Property image ${index + 1}`}
                  fill
                  className='object-cover'
                  unoptimized={true}
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  onError={() => {
                    // Handle image loading errors gracefully
                    console.warn(`Failed to load image: ${imageUrl}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Value Added Services */}
      {parsedData?.valueAdded_services &&
        parsedData?.valueAdded_services?.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-700)]'>
              <span className='text-accent-red-900'>Value Added Services:</span>
            </div>
            <CarouselTemplate
              items={parsedData.valueAdded_services}
              slidesPerView={1.2}
              showArrows={false}
              renderItem={(service: any) => (
                <ValueAddedServiceCard service={service} />
              )}
            />
          </div>
        )}

      {/* Offers */}
      {parsedData?.offers && parsedData?.offers?.length > 0 && (
        <>
          <div className='flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-700)]'>
            <span className='text-sm font-medium text-[var(--color-primary-700)]'>
              Special Offers:
            </span>
          </div>
          <CarouselTemplate
            items={parsedData.offers}
            slidesPerView={isMobile ? 1.2 : 1.1}
            showArrows={false}
            renderItem={(offer: any) => (
              <CouponCard
                offer={offer}
                nightCount={0}
                placement='dialog'
                disabled={false}
                hideApplyButton={true}
              />
            )}
          />
        </>
      )}

      {/* Suggestions */}
      {parsedData?.suggestions && parsedData?.suggestions?.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2 text-sm font-medium text-[var(--color-primary-700)]'>
            <span className='text-xs italic text-primary-500 mb-2'>
              Suggestions:
            </span>
          </div>
          <div className='space-y-2'>
            {parsedData?.suggestions?.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className='w-full flex items-top gap-2 text-left text-xs text-secondary-900 bg-white px-3 py-2 rounded-full font-medium cursor-pointer hover:bg-primary-100 shadow-xs hover:border-blue-100 hover:text-secondary-950 transition-all duration-200  hover:shadow-xs'
              >
                <CornerDownRight className='w-3 h-3' /> {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {hasActions && (
        <div className='flex items-center justify-end space-x-2 pt-3'>
          {contactButtonConfig.map((button, index) =>
            button.condition(contact) ? (
              <ContactButton
                key={index}
                icon={button.icon}
                onClick={() => button.onClick(contact)}
                title={button.title}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default AIMessageRenderer;
