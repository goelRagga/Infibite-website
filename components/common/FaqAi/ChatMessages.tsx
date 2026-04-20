'use client';

import { cn } from '@/lib/utils';
import { ChatMessage, LoadingPhase } from '@/hooks/useAIFaq';
import { MESSAGE_TYPE } from '@/lib/constants';
import useLoadingPhaseLabel from '@/hooks/useLoadingPhaseLabelAiFaq';
import AIMessageRenderer from './AIMessageRenderer';
import BotLoading from './BotLoading';
import CouponCard from './CouponCard';
import { motion } from 'framer-motion';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  loadingPhase: LoadingPhase | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSuggestionClick?: (suggestion: string) => void;
  onImageClick?: (images: string[], index: number) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  loadingPhase,
  messagesEndRef,
  onSuggestionClick,
  onImageClick,
}) => {
  const { label } = useLoadingPhaseLabel(loadingPhase);

  return (
    <div className='h-full p-4 bg-white overflow-y-auto'>
      <div className='space-y-4'>
        {messages
          .filter((message) => message.type !== MESSAGE_TYPE.SUGGESTIONS)
          .map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.type === MESSAGE_TYPE.USER
                  ? 'justify-end'
                  : 'justify-start'
              )}
            >
              {/* Coupon Card */}
              {message.type === MESSAGE_TYPE.COUPON ? (
                <motion.div
                  className='max-w-[95%] w-full'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CouponCard
                    content={message.content}
                    couponCode={message.couponCode || ''}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className={cn(
                    'max-w-[85%] rounded-lg px-3 py-2 relative rounded-tl-none',
                    message.type === MESSAGE_TYPE.USER
                      ? 'bg-gradient-to-b from-primary-600 to-primary-600 text-white rounded-2xl rounded-tr-none'
                      : 'bg-primary-50 text-gray-800'
                  )}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  {message.type === MESSAGE_TYPE.AI ||
                  message.type === MESSAGE_TYPE.GREETING ? (
                    <AIMessageRenderer
                      content={message.content}
                      onSuggestionClick={onSuggestionClick}
                      onImageClick={onImageClick}
                      isSmallText={message.type === MESSAGE_TYPE.GREETING}
                    />
                  ) : (
                    <p className='text-xs whitespace-pre-wrap '>
                      {message.content}
                    </p>
                  )}

                  <div
                    className={cn(
                      'flex mt-2',
                      message.type === MESSAGE_TYPE.USER
                        ? 'justify-end'
                        : 'justify-start'
                    )}
                  >
                    <p className='text-xs scale-90 opacity-80'>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}

        {/* Loading Indicator */}
        {isLoading && <BotLoading label={label} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
