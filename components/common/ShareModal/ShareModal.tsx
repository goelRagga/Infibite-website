'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { Button } from '@/components/ui';
import { cn, getFilenameFromUrl } from '@/lib/utils';
import { toast } from 'sonner';
import WhatsappIcon from '@/assets/whatsappRed.svg';

const SHARE_PREVIEW_CLOUDIMG = 'https://cpjlcwamma.cloudimg.io';

/** Optimized preview for modal (matches product image pipeline). */
function buildSharePreviewImageSrc(originalUrl: string): string {
  const filename = getFilenameFromUrl(originalUrl);
  if (!filename) return originalUrl;
  return `${SHARE_PREVIEW_CLOUDIMG}/${filename}?width=720&height=600&func=boundmin&force_format=webp&q=20`;
}

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown in header when no preview image; with preview, used as image alt text. */
  title?: string;
  /** Header label when `previewImageSrc` is set (default: Share). */
  modalTitle?: string;
  /** Property / listing hero preview — rounded image below header. */
  previewImageSrc?: string | null;
  previewImageAlt?: string;
  url?: string;
  text?: string;
  showWhatsApp?: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onOpenChange,
  title,
  modalTitle = 'Share',
  previewImageSrc,
  previewImageAlt,
  url,
  text = 'Check out this amazing property!',
  showWhatsApp = true,
}) => {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const allShareOptions = [
    {
      name: 'WhatsApp',
      icon: (
        <WhatsappIcon className='w-12 h-12 scale-140 dark:scale-140 dark:invert' />
      ),
      color: 'border-green-500 text-green-500 hover:bg-green-50',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
        window.open(url, '_blank');
      },
      show: showWhatsApp,
    },
    // {
    //   name: 'Twitter',
    //   icon: (
    //     <Twitter size={48} className='text-blue-400 scale-140 dark:scale-140' />
    //   ),
    //   color: 'border-blue-400 text-blue-400 hover:bg-blue-50',
    //   action: () => {
    //     const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    //     window.open(url, '_blank');
    //   },
    //   show: showTwitter,
    // },
    // {
    //   name: 'Facebook',
    //   icon: (
    //     <Facebook
    //       size={48}
    //       className='text-blue-600 scale-140 dark:scale-140'
    //     />
    //   ),
    //   color: 'border-blue-600 text-blue-600 hover:bg-blue-50',
    //   action: () => {
    //     const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    //     window.open(url, '_blank');
    //   },
    //   show: showFacebook,
    // },
    // {
    //   name: 'Instagram',
    //   icon: (
    //     <Instagram
    //       size={48}
    //       className='text-pink-500 scale-140 dark:scale-140'
    //     />
    //   ),
    //   color: 'border-pink-500 text-pink-500 hover:bg-pink-50',
    //   action: () => {
    //     // Instagram doesn't support direct sharing via URL, so we'll copy the link
    //     handleCopyLink();
    //   },
    //   show: showInstagram,
    // },
    {
      name: 'Copy Link',
      icon: copied ? (
        <Check
          size={48}
          className='text-gray-600 scale-140 dark:text-green-500'
        />
      ) : (
        <Copy
          size={48}
          className='text-gray-600 scale-140 dark:scale-140 dark:text-white'
        />
      ),
      color: 'border-gray-400 text-gray-600 hover:bg-gray-50',
      action: handleCopyLink,
      show: true, // Always show copy link
    },
  ];

  const shareOptions = allShareOptions.filter((option) => option.show);

  const hasPreview = Boolean(previewImageSrc);
  const headerLabel = hasPreview
    ? modalTitle
    : (title ?? modalTitle ?? 'Share');
  const imageAlt = previewImageAlt ?? title ?? modalTitle ?? 'Property preview';
  const previewDisplaySrc = previewImageSrc
    ? buildSharePreviewImageSrc(previewImageSrc)
    : '';

  const shareActionButtons = shareOptions.map((option) => (
    <Button
      size='lg'
      key={option.name}
      variant='ghost'
      className={cn(
        'flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-1 border-gray-200 bg-white p-0 font-medium transition-all duration-200 dark:border-0 dark:bg-[var(--grey7)]! dark:hover:bg-[var(--black5)]!',
        hasPreview &&
          'border-white/40 bg-white/95 shadow-md backdrop-blur-sm dark:bg-white/90'
      )}
      onClick={() => {
        option.action();
        if (option.name !== 'Copy Link') {
          onOpenChange(false);
        }
      }}
      title={option.name}
    >
      {option.icon}
    </Button>
  ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName='z-[200] bg-black/80 backdrop-blur-[3px]!'
        className='z-[210] sm:max-w-[500px] gap-0 overflow-hidden p-0 dark:bg-background dark:border-secondary-950'
      >
        <DialogHeader className='space-y-0 border-b border-gray-200 px-6 py-4 sm:px-8 sm:py-5 dark:border-secondary-950'>
          <DialogTitle className='text-left text-lg font-semibold tracking-tight text-neutral-900 dark:text-white'>
            {headerLabel}
          </DialogTitle>
        </DialogHeader>
        {previewImageSrc ? (
          <div className='bg-white px-6 pb-6 pt-4 sm:px-4 dark:bg-background'>
            <div className='relative aspect-[6/5] w-full h-60 overflow-hidden rounded-md bg-neutral-100 dark:bg-secondary-950'>
              {/* eslint-disable-next-line @next/next/no-img-element -- cloudimg CDN */}
              <img
                src={previewDisplaySrc}
                alt={imageAlt}
                width={720}
                height={600}
                className='h-full w-full object-cover'
                loading='eager'
                decoding='async'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black/35 p-4'>
                <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-5'>
                  {shareActionButtons}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-wrap items-center justify-center gap-4 bg-white px-6 py-8 sm:px-8 dark:bg-background'>
            {shareActionButtons}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
