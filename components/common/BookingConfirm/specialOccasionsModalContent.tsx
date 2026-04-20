'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Svg from '../Shared/Svg';
import useIsMobile from '@/hooks/useIsMobile';
import { Textarea } from '../../ui/textarea';

const occasionTypes = ['Birthday', 'Anniversary', 'Honeymoon', 'Other'];

interface SpecialOccasionsModalContentProps {
  onClose: () => void;
}

const SpecialOccasionsModalContent: React.FC<
  SpecialOccasionsModalContentProps
> = ({ onClose }) => {
  const [value, setValue] = useState('Birthday');
  const [notSure, setNotSure] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      className='w-full rounded-2xl relative mb-12 md:mb-0 overflow-y-auto h-[calc(75dvh-200px)] md:h-auto'
      style={{ color: 'var(--black3)' }}
    >
      <Tabs value={value} onValueChange={setValue} className='w-full'>
        {!isMobile && (
          <div className='hidden md:block'>
            <TabsList className='flex gap-2 bg-transparent mb-4 p-0 h-auto w-full'>
              {occasionTypes.map((occasion) => (
                <TabsTrigger
                  key={occasion}
                  value={occasion}
                  className='cursor-pointer rounded-3xl px-5 py-5 h-10 text-sm font-normal border border-primary-100 bg-white text-primary-800
                    data-[state=active]:bg-white 
                    data-[state=active]:text-accent-red-900 
                    data-[state=active]:font-semibold 
                    data-[state=active]:border-accent-red-900'
                >
                  {occasion}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        )}

        {isMobile && (
          <div className='grid grid-cols-2 gap-4 md:hidden mb-4 pt-4'>
            {occasionTypes.map((occasion) => (
              <label key={occasion} className='flex items-center gap-2'>
                <Checkbox
                  checked={value === occasion}
                  onCheckedChange={() => setValue(occasion)}
                  className='border border-primary-800'
                />
                <span className='text-sm font-semibold text-foreground'>
                  {occasion}
                </span>
              </label>
            ))}
          </div>
        )}

        {occasionTypes.map((occasion) => (
          <TabsContent key={occasion} value={occasion} className='mt-0'>
            <div className='space-y-2'>
              {/* "Other" Message Input */}
              {occasion === 'Other' && (
                <div>
                  <Textarea
                    rows={2}
                    placeholder='Other Remarks'
                    className='w-full border bg-white rounded-xl px-4 pt-5 pb-1 text-sm text-primary-800 placeholder:text-primary-500 
                    focus:outline-none 
                    focus:ring-0 
                    focus-visible:ring-0
                    focus:shadow-none 
                    focus-visible:shadow-none'
                  />
                </div>
              )}
              {/* Occasion Date */}
              <div className='w-full md:w-1/2 mt-0 mb-5 flex items-center justify-between border border-primary-100 bg-white text-primary-500 rounded-2xl px-6 py-4 text-sm'>
                <span>
                  Select Occasion Date
                  <span style={{ color: 'var(--red1)' }}>*</span>{' '}
                </span>
                <Svg
                  src={`${process.env.IMAGE_DOMAIN}/calendar_month_9399b285ef.svg`}
                  width='16'
                  height='18'
                />
              </div>

              {/* Checkbox */}
              <div className='space-y-1 bg-primary-50 md:bg-transparent rounded-2xl p-4 md:p-0'>
                <label className='flex items-center gap-2'>
                  <Checkbox
                    id='not-sure'
                    checked={notSure}
                    onCheckedChange={(checked) => setNotSure(!!checked)}
                    className='border border-primary-800'
                  />
                  <span className='text-sm font-semibold text-foreground'>
                    Not sure about it yet
                  </span>
                </label>
                <p className='text-xs text-foreground leading-relaxed'>
                  Not sure about the details yet? No worries! Once your booking
                  is complete, our team will reach out to help you plan the
                  perfect special occasion.
                </p>
              </div>

              {/* Buttons */}
              <div className='flex gap-4 justify-center mt-6 fixed bottom-0 w-full bg-white md:bg-transparent py-4 md:static'>
                <Button
                  onClick={onClose}
                  className='text-accent-red-900 bg-white border border-accent-red-900 cursor-pointer w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4'
                >
                  Back
                </Button>
                <Button className='bg-accent-red-900 hover:bg-accent-red-950 text-white w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4'>
                  Save
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SpecialOccasionsModalContent;
