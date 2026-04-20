import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React from 'react';

type WalletTabItem = {
  value: string;
  title: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  className?: string;
  component: React.ReactNode;
};

type WalletTabGroupProps = {
  tabs: WalletTabItem[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
};

export default function WalletTabGroup({
  tabs,
  defaultValue = tabs[0]?.value,
  onTabChange,
}: WalletTabGroupProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className='w-full'
      onValueChange={onTabChange}
    >
      <TabsList className='grid w-full grid-cols-3 rounded-none md:rounded-xl md:bg-primary-50 bg-primary-50/50 p-0 md:mb-6 h-15 md:h-[52px]'>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'rounded-none md:rounded-2xl transition-all duration-200 py-3 md:py-4 px-2 md:px-4 md:gap-2 cursor-pointer data-[state=active]:bg-red-900 data-[state=active]:font-semibold! data-[state=active]:text-white data-[state=inactive]:text-primary-800 data-[state=active]:typography-label-semibold data-[state=inactive]:typography-label-regular',
              tab.className
            )}
          >
            <div className='flex items-center gap-2'>
              <span>{tab.title}</span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className='p-4 md:py-6'>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
