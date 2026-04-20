'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  question: string;
  setQuestion: (value: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  question,
  setQuestion,
  isLoading,
  onSendMessage,
  onKeyDown,
}) => {
  return (
    <div className='p-4'>
      <div className='flex items-center bg-white rounded-full border-1 border-primary-200 px-3 py-2'>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='Ask about property'
          className='flex-1 border-0! outline-none! bg-transparent px-1 py-1 md:py-2 md:px-2 text-gray-700 placeholder:text-primary-700 focus:ring-0! focus:outline-none!'
          disabled={isLoading}
        />
        <Button
          onClick={async () => {
            await onSendMessage();
          }}
          disabled={!question.trim() || isLoading}
          size='icon'
          className='h-8 w-8 rounded-full bg-accent-red-900 hover:bg-accent-red-950 text-white shadow-sm hover:shadow-md transition-all duration-200'
        >
          <Send className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
