'use client';

import { useAIChat } from '@/hooks/useAIFaq';
import React, { lazy, Suspense, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { createPortal } from 'react-dom';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import RegistrationForm from './RegistrationForm';

import ImageViewerDialog from '@/components/modules/PropertyDetails/Image/ImageViewerDialog';
import { trackEvent } from '@/lib/mixpanel';
const FloatingChatButton = lazy(() => import('./FloatingChatButton'));
interface AIAssistantProps {
  propertyId: string;
  propertyName: string;
  events?: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  propertyId,
  events,
  propertyName,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openImageSlider, setOpenImageSlider] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const {
    question,
    setQuestion,
    isLoading,
    loadingPhase,
    messages,
    messagesEndRef,
    handleSendMessage,
    handleKeyDown,
    isRegistered,
    handleFormSubmit,
    handleRegistrationComplete,
  } = useAIChat({ propertyId });

  const toggleChat = () => {
    // Prevent drawer from closing when image modal is open
    setIsOpen(!isOpen);
  };

  const handleImageClick = (imageUrls: string[], index: number) => {
    setImages(imageUrls);
    setActiveIndex(index);
    setOpenImageSlider(true);
  };

  const handleImageModalClose = () => {
    setOpenImageSlider(false);
    setImages([]);
    setActiveIndex(null);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    // Prevent drawer from closing when image modal is open
    if (!open && openImageSlider) {
      return;
    }

    setIsOpen(open);

    // Close image modal when drawer is closed
    if (!open) {
      setOpenImageSlider(false);
      setImages([]);
      setActiveIndex(null);
      trackEvent('ai_bot_closed', {
        page_name: 'property_details',
        property_id: propertyId,
        property_name: propertyName,
        is_checkin_out_entered: events?.is_checkin_out_entered,
      });
    }
  };

  return (
    <>
      <Suspense fallback={''}>
        <FloatingChatButton onClick={toggleChat} events={events} />
      </Suspense>
      {isOpen && (
        <Drawer open={isOpen} onOpenChange={handleDrawerOpenChange}>
          <DrawerContent className='border-none bg-white! w-full! fixed! bottom-0! h-[92dvh]! after:content-none! sm:h-[80dvh] sm:max-w-[450px]! left-auto! right-0! sm:right-4! bottom-0 rounded-tl-3xl! rounded-tr-3xl! flex flex-col'>
            <DrawerTitle className='sr-only'>AI Property Assistant</DrawerTitle>

            <ChatHeader
              onClose={() => {
                toggleChat();
                trackEvent('ai_bot_closed', {
                  page_name: 'property_details',
                  property_id: propertyId,
                  property_name: propertyName,
                  is_checkin_out_entered: events?.is_checkin_out_entered,
                });
              }}
            />
            {!isRegistered ? (
              <div className='flex-1 min-h-0 overflow-auto'>
                <RegistrationForm
                  onSubmit={handleFormSubmit}
                  onComplete={handleRegistrationComplete}
                />
              </div>
            ) : (
              <>
                <div className='flex-1 min-h-0 overflow-hidden'>
                  <ChatMessages
                    messages={messages}
                    isLoading={isLoading}
                    loadingPhase={loadingPhase}
                    messagesEndRef={messagesEndRef}
                    onSuggestionClick={async (suggestion) => {
                      await handleSendMessage(suggestion);
                    }}
                    onImageClick={handleImageClick}
                  />
                </div>
                <ChatInput
                  question={question}
                  setQuestion={setQuestion}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  onKeyDown={handleKeyDown}
                />
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
      {/* Image Modal - Portal mounted to document.body */}
      {images.length > 0 &&
        typeof window !== 'undefined' &&
        createPortal(
          <ImageViewerDialog
            images={images.map((url) => ({
              url,
              name: 'Property image',
            }))}
            open={openImageSlider}
            onOpenChange={handleImageModalClose}
            initialIndex={activeIndex ?? 0}
          />,
          document.body
        )}
    </>
  );
};

export default AIAssistant;
