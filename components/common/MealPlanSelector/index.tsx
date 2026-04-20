'use client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { useURLParams } from '@/hooks/useURLParams';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { MealPlanOptionProps, MealPlanSelectorProps } from 'meal-plan';
import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/mixpanel';

const MealPlanOption: React.FC<MealPlanOptionProps> = ({ plan, totalDays }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace('₹', '₹ ');
  };

  const hasDiscount = plan.originalPrice && plan.originalPrice > plan.price;

  return (
    <div className='flex items-start justify-between w-full'>
      <div className='flex-1 min-w-0'>
        <h3 className='font-semibold text-gray-900 text-sm md:text-base dark:text-white'>
          {plan.title}
        </h3>
        <p className='text-xs text-primary-500  sm:text-gray-600 mt-1 dark:text-[var(--prive6)]'>
          {plan.description}
        </p>
      </div>
      <div className='text-right ml-4 flex-shrink-0'>
        <div className='font-semibold text-sm text-gray-900 dark:text-white'>
          {plan.price === 0 ? '₹ 0' : `${formatPrice(plan.price)}`}/night
        </div>
        {hasDiscount && (
          <div className='text-xs text-gray-400 line-through dark:text-secondary-500'>
            {plan.originalPrice && formatPrice(plan.originalPrice)}/night
          </div>
        )}
        <div className='text-xs text-gray-500 dark:text-secondary-400'>
          total for {totalDays} days
        </div>
      </div>
    </div>
  );
};

const MealPlanSelector: React.FC<MealPlanSelectorProps> = ({
  defaultValue,
  totalDays,
  onSelectionChange,
  trigger,
  title = 'Meal Plans',
  mealPlanOptions,
  hasValidDates = true,
  onDateRequiredClick,
  isOpen,
  setIsOpen,
  isLoading = false,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { getParam } = useURLParams();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [tempSelectedPlan, setTempSelectedPlan] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTempSelectedPlan(selectedPlan);
      trackEvent('meals_clicked', {
        page_name: 'property_details',
      });
    }
  }, [isOpen]);

  const selectedPlanData = mealPlanOptions.find(
    (plan) => plan.id === selectedPlan
  );

  const handleTriggerClick = () => {
    if (!hasValidDates && onDateRequiredClick) {
      onDateRequiredClick();
      return;
    }
    setIsOpen(true);
  };

  const DefaultTrigger: React.FC = () => {
    // const formatPrice = (price: number): string => {
    //   return new Intl.NumberFormat('en-IN', {
    //     style: 'currency',
    //     currency: 'INR',
    //     minimumFractionDigits: 0,
    //   })
    //     .format(price)
    //     .replace('₹', '₹ ');
    // };

    // const hasDiscount =
    //   selectedPlanData?.originalPrice &&
    //   selectedPlanData.originalPrice > selectedPlanData.price;

    return (
      <div
        className={cn(
          'flex w-full justify-between items-center text-left h-auto p-4'
        )}
        onClick={handleTriggerClick}
      >
        <div>
          <div className='typography-label-regular text-primary-400 dark:text-[var(--prive2)]'>
            Meals
          </div>
          <div className='typography-label-semibold dark:text-white'>
            {selectedPlanData?.title || 'Select meal plan'}
          </div>
          {/* {selectedPlanData && (
            <div className='text-xs text-gray-500 dark:text-secondary-400'>
              {isLoading ? (
                <span className='text-gray-400'>Updating prices...</span>
              ) : (
                <>
                  {selectedPlanData.price === 0
                    ? '₹ 0'
                    : `${formatPrice(selectedPlanData.price)}`}
                  /night
                  {hasDiscount && (
                    <span className='ml-2 text-gray-400 line-through dark:text-secondary-500'>
                      {selectedPlanData?.originalPrice &&
                        formatPrice(selectedPlanData?.originalPrice)}
                    </span>
                  )}
                </>
              )}
            </div>
          )} */}
        </div>
        <ChevronDown className='text-accent-red-900 dark:text-accent-yellow-950' />
      </div>
    );
  };

  const ContentBody: React.FC<{
    onClose: () => void;
    onApply: () => void;
  }> = ({ onClose, onApply }) => (
    <div className='flex flex-col h-full dark:border-white min-h-[200px] sm:min-h-[400px]'>
      <div className='overflow-y-auto scrollbar-hide no-scrollbar px-1 space-y-4 flex-1 mb-4 sm:mb-0 max-h-[calc(100dvh-270px)]'>
        {/* {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-gray-500 dark:text-secondary-400'>
              Updating meal plan prices...
            </div>
          </div>
        ) : ( */}
        {mealPlanOptions?.length > 0 ? (
          <RadioGroup
            value={tempSelectedPlan}
            onValueChange={(val) => setTempSelectedPlan(val)}
            className='gap-0 border transition-colors dark:border-secondary-950 rounded-xl overflow-hidden'
          >
            {mealPlanOptions?.map((plan, index) => (
              <div key={`${plan.id}-${index}`} className='mb-0'>
                <div
                  className={cn(
                    'flex border-b border-gray-200 dark:border-secondary-950 items-start space-x-3 cursor-pointer p-3 py-6',
                    isTablet ? '' : ' transition-colors',
                    tempSelectedPlan === plan.id && !isTablet
                      ? 'bg-primary-50 dark:bg-[var(--grey6)]'
                      : !isTablet &&
                          'hover:bg-primary-50 dark:hover:bg-[var(--black5)] '
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTempSelectedPlan(plan.id);
                  }}
                >
                  <RadioGroupItem
                    value={plan.id}
                    id={`${plan.id}-${index}`}
                    className={cn(
                      'mt-1 h-5 w-5 rounded-full border-2 relative after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-2.5 after:w-2.5 after:rounded-full after:bg-transparen dark:bg-background',
                      'data-[state=checked]:border-accent-red-900 dark:data-[state=checked]:border-accent-yellow-950 data-[state=checked]:after:bg-accent-red-900   dark:data-[state=unchecked]:border-primary-800 dark:data-[state=checked]:after:bg-accent-yellow-950 dark:data-[state=unchecked]:after:bg-background '
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <MealPlanOption plan={plan} totalDays={totalDays} />
                </div>
                {/* {isMobile && index < mealPlanOptions.length - 1 && (
                <div className='border-b border-gray-200 dark:border-secondary-950 mx-4' />
              )} */}
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className='flex items-center justify-center min-h-[300px] sm:min-h-[400px] flex-1 text-base text-gray-500 dark:text-secondary-400'>
            No meal plan available
          </div>
        )}
        {/* )} */}
      </div>

      <div
        className={cn(
          'sticky bottom-0 flex gap-3 pt-4',
          isTablet
            ? 'px-4 pb-4 border-t dark:border-secondary-950'
            : 'justify-center md:mx-35 sm:mb-4 mt-3'
        )}
      >
        <Button
          variant='outline'
          size={'lg'}
          className={cn(
            'flex-1',
            isTablet
              ? 'rounded-full border-gray-300 py-3 dark:text-[var(--prive2)] dark:bg-background dark:border-[var(--accent-background)]'
              : 'rounded-full border-primary-100 dark:hover:bg-background dark:text-white dark:bg-background dark:border-[var(--accent-background)]'
          )}
          onClick={onClose}
        >
          Back
        </Button>
        {mealPlanOptions.length > 0 && (
          <Button
            size={'lg'}
            className={cn(
              'flex-1 text-white rounded-full',
              isTablet
                ? 'bg-accent-red-900 hover:bg-accent-red-950 dark:bg-[var(--accent-background)] dark:text-white py-3'
                : 'bg-accent-red-900 hover:bg-accent-red-950 dark:bg-[var(--accent-background)] dark:text-white'
            )}
            onClick={onApply}
          >
            {isTablet ? 'Save' : 'Apply'}
          </Button>
        )}
      </div>
    </div>
  );

  const handleApply = () => {
    if (!mealPlanOptions.length) return;
    const planData = mealPlanOptions.find(
      (plan) => plan.id === tempSelectedPlan
    );
    if (planData && onSelectionChange) {
      onSelectionChange(planData);
    }

    // Check if meal plan actually changed (different from previously selected)
    const isMealChanged =
      planData?.title !== 'Property only' && tempSelectedPlan !== selectedPlan;

    setSelectedPlan(tempSelectedPlan);
    trackEvent('meals_applied', {
      is_meal_changed: isMealChanged,
      page_name: 'property_details',
    });
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!mealPlanOptions || mealPlanOptions.length === 0) return;

    const fromURL = getParam('mealPlan');

    if (fromURL) {
      const matched = mealPlanOptions.find((p) => p.code === fromURL);
      if (matched && matched.id !== selectedPlan) {
        setSelectedPlan(matched.id);
      }
    } else if (defaultValue && defaultValue !== selectedPlan) {
      const defaultPlan = mealPlanOptions.find((p) => p.id === defaultValue);
      if (defaultPlan) {
        setSelectedPlan(defaultPlan.id);
      }
    } else if (!selectedPlan) {
      const epPlan = mealPlanOptions.find(
        (plan) => plan.code && plan.code.toLowerCase() === 'ep'
      );
      if (epPlan) {
        setSelectedPlan(epPlan.id);
      } else if (mealPlanOptions.length > 0) {
        const firstPlan = mealPlanOptions[0];
        setSelectedPlan(firstPlan.id);
      }
    }
  }, [mealPlanOptions, defaultValue, getParam]);

  return (
    <>
      <div onClick={handleTriggerClick} className={cn('cursor-pointer')}>
        {trigger || <DefaultTrigger />}
      </div>

      {isTablet ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className='h-[90dvh] flex flex-col bg-white dark:bg-background '>
            <DrawerHeader className='pb-2'>
              <DrawerTitle className='text-center font-semibold text-lg'>
                {title}
              </DrawerTitle>
            </DrawerHeader>
            <div className='flex-1 overflow-hidden pb-4 '>
              <ContentBody onClose={handleClose} onApply={handleApply} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogOverlay className={'backdrop-blur-[2px]!'} />
          <DialogContent className='sm:max-w-3xl max-h-[90dvh] flex flex-col rounded-2xl bg-[var(--white3)]  dark:bg-background border-none'>
            <DialogHeader>
              <DialogTitle className='flex items-center justify-between font-serif typography-h3'>
                {title}
              </DialogTitle>
            </DialogHeader>
            <div className='flex-1 overflow-hidden'>
              <ContentBody onClose={handleClose} onApply={handleApply} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MealPlanSelector;
