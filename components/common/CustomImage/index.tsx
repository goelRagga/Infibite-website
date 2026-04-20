// prettier-ignore
'use client';
import { BASE64 } from '@/lib/constants';
import { cn, getFilenameFromUrl } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export interface CustomImageProps {
  alt: string;
  src: string;
  srcMobile?: string;
  imageType?: 'svg' | 'png' | 'jpeg' | 'gif' | 'webp' | 'svg';
  width?: number | `${number}`;
  height?: number | `${number}`;
  layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onClick?: () => void;
  quality?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  title?: string;
  maxWidth?: string;
  maxHeight?: string;
  priority?: boolean;
  onLoad?: any;
  format?: string;
  blurDataURL?: string;
  fallbackSrc?: string;
  outFixClass?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({
  alt,
  src,
  srcMobile,
  quality,
  className,
  objectFit = 'cover',
  title,
  onClick,
  width,
  height,
  fill = false,
  priority,
  onLoad,
  format,
  blurDataURL,
  fallbackSrc = `${process.env.IMAGE_DOMAIN}/no_Image_b5126bc85f.svg`,
  outFixClass,
}) => {
  const base64 = BASE64;
  const [currentSrc, setCurrentSrc] = useState<
    'cloudimg' | 'original' | 'fallback'
  >('cloudimg');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 1024);
  }, []);

  if (!mounted) return null;

  const selectedSrc = srcMobile && isMobile ? srcMobile : src;
  const filename = getFilenameFromUrl(selectedSrc);
  const cloudimgUrl =
    selectedSrc && filename
      ? `https://cpjlcwamma.cloudimg.io/${filename}?width=${width}&height=${height}&func=boundmin&force_format=${format ?? 'webp'}&q=${quality ?? 98}`
      : fallbackSrc;

  let imageUrl = cloudimgUrl;
  if (currentSrc === 'original') {
    imageUrl = selectedSrc;
  } else if (currentSrc === 'fallback') {
    imageUrl = fallbackSrc;
  }

  const handleImageError = () => {
    if (currentSrc === 'cloudimg') {
      setCurrentSrc('original');
    } else if (currentSrc === 'original') {
      setCurrentSrc('fallback');
    }
  };

  return (
    <div className={cn('relative w-full h-full', outFixClass)}>
      <Image
        src={imageUrl}
        alt={alt}
        title={title}
        width={width}
        height={height}
        priority={priority}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        style={{
          objectFit: objectFit,
        }}
        quality={quality ? quality : 98}
        placeholder='blur'
        onLoad={onLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
        blurDataURL={blurDataURL ? blurDataURL : base64}
        onClick={onClick}
        fill={fill}
        sizes='100vw'
      />
    </div>
  );
};

export default React.memo(CustomImage);
