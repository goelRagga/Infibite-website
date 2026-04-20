'use client';

import { useState, useEffect, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useURLParams } from '@/hooks/useURLParams';
import useIsMobile from '@/hooks/useIsMobile';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CancellationPlans({ cancellationPlan }: any) {
  const defaultPlan = cancellationPlan.find((plan: any) => plan.ruleId === '0');
  const [selectedPlan, setSelectedPlan] = useState<any>(defaultPlan);
  const [selectedRuleId, setSelectedRuleId] = useState<string>(
    defaultPlan?.ruleId.toString()
  );
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { updateParams } = useURLParams();
  const hasInitialized = useRef(false);
  const isMobile = useIsMobile();

  const handleAccordionToggle = (planId: string) => {
    setOpenItem(openItem === planId ? null : planId);
  };

  useEffect(() => {
    if (!hasInitialized.current && defaultPlan) {
      hasInitialized.current = true;
      setSelectedPlan(defaultPlan);
      setSelectedRuleId(defaultPlan.ruleId.toString());
    }
  }, [defaultPlan]);

  useEffect(() => {
    if (selectedRuleId) {
      updateParams({ cancellationPlan: selectedRuleId });
    }
  }, [selectedRuleId]);

  const handlePlanSelect = (val: string) => {
    const selected = cancellationPlan.find(
      (plan: any) => plan.ruleId.toString() === val
    );
    setSelectedPlan(selected);
    setSelectedRuleId(val);
  };

  const getPlanDescription = (plan: any) =>
    plan?.discountAmount > 0
      ? 'Best Price, No Looking Back'
      : 'Plans Change? No Worries!';

  const renderBadge = (plan: any) =>
    plan?.discountAmount > 0 ? (
      <Badge className='bg-[var(--color-accent-green-700)] rounded-full text-white font-mono px-2 text-xs'>
        Save ₹{formatPrice(plan?.discountAmount)}
      </Badge>
    ) : (
      <Badge className='bg-secondary-300 rounded-full text-white font-mono px-2 text-xs dark:bg-primary-200 dark:text-primary-800'>
        Full Refund
      </Badge>
    );

  const renderPlanDetails = (plan: any) => (
    <>
      <div className='space-y-1'>
        <p className='font-semibold text-sm dark:text-primary-400'>Benefits</p>
        <p className='text-xs'>
          {plan?.discountAmount > 0
            ? 'Enjoy an exclusive discount on your booking.'
            : 'Standard rate with no additional discounts.'}
        </p>
        {plan?.discountAmount > 0 && (
          <p className='text-sm text-[var(--color-accent-green-700)] font-semibold dark:text-accent-green-500'>
            Savings of ₹{formatPrice(plan?.discountAmount)}
          </p>
        )}
      </div>

      <div className='space-y-1'>
        <p className='font-semibold text-sm dark:text-primary-400'>
          Cancellation Policy
        </p>
        <ul className='text-xs list-disc pl-4 space-y-2'>
          {plan?.messages?.map((msg: string, index: number) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderMobileView = () => (
    <>
      <RadioGroup value={selectedRuleId} onValueChange={handlePlanSelect}>
        <div className='space-y-4'>
          {cancellationPlan.map((plan: any) => {
            const planId = plan.ruleId.toString();
            const isSelected = selectedRuleId === planId;

            return (
              <div
                key={planId}
                className={clsx(
                  'border rounded-xl overflow-hidden relative px-0 py-3 bg-white dark:bg-[var(--grey6)]',
                  isSelected
                    ? 'border-accent-red-900 dark:border-[var(--prive2)]'
                    : 'border-muted dark:border-secondary-950'
                )}
              >
                <div className='absolute top-2 right-2 z-10'>
                  {renderBadge(plan)}
                </div>

                <div className='p-0 sm:p-4 space-y-4'>
                  <div className='flex px-4 items-center space-x-3'>
                    <RadioGroupItem
                      className={cn(
                        'mt-1 h-5 w-5 rounded-full border-2 relative after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-2.5 after:w-2.5 after:rounded-full after:bg-transparen dark:bg-background',
                        'data-[state=checked]:border-accent-red-900 dark:data-[state=checked]:border-accent-yellow-950 data-[state=checked]:after:bg-accent-red-900   dark:data-[state=unchecked]:border-primary-800 dark:data-[state=checked]:after:bg-accent-yellow-950 dark:data-[state=unchecked]:after:bg-background '
                      )}
                      value={planId}
                      id={planId}
                    />
                    <div className='w-full'>
                      <Label
                        htmlFor={planId}
                        className='text-sm font-semibold cursor-pointer block'
                      >
                        {plan.ruleName}
                      </Label>
                      <p className='text-xs font-normal text-muted-foreground mt-0.5 dark:text-primary-400'>
                        {getPlanDescription(plan)}
                      </p>
                    </div>
                  </div>

                  <div className='border-t px-4 py-2 dark:border-primary-800'>
                    <button
                      onClick={() => handleAccordionToggle(planId)}
                      className='flex justify-between items-center w-full text-sm font-semibold text-primary-400 p-0 pt-2 dark:text-primary-100'
                    >
                      <span>
                        {openItem === planId ? 'Less Details' : 'More Details'}
                      </span>
                      <ChevronDown
                        className={clsx(
                          'w-4 h-4 transition-transform duration-200 ease-in-out dark:text-[var(--prive2)]',
                          openItem === planId && 'rotate-180'
                        )}
                      />
                    </button>
                  </div>
                </div>

                {openItem === planId && (
                  <div className='p-4 space-y-4 bg-white dark:bg-[var(--grey6)]'>
                    {renderPlanDetails(plan)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </RadioGroup>

      <p className='text-xs text-muted-foreground mt-2'>
        **Refund if applicable will be processed within 7-9 days
        <br />
        **All bookings for blackout dates like Christmas, New Year etc will be
        non refundable.
      </p>
    </>
  );

  const renderDesktopView = () => (
    <div className='space-y-4'>
      <RadioGroup
        value={selectedRuleId}
        onValueChange={handlePlanSelect}
        className='grid grid-cols-1 md:grid-cols-2 gap-4'
      >
        {cancellationPlan.map((plan: any) => {
          const planId = plan.ruleId.toString();
          const isSelected = selectedRuleId === planId;

          return (
            <Card
              key={planId}
              className={clsx(
                'border rounded-xl transition-shadow p-0 shadow-none bg-white dark:bg-[var(--grey6)]',
                isSelected
                  ? 'border-accent-red-900 dark:border-[var(--prive2)]'
                  : 'border-primary-100 dark:border-secondary-950'
              )}
            >
              <div className='flex items-start justify-between p-4 border-b dark:border-primary-800'>
                <div className='flex items-center space-x-3 w-full'>
                  <RadioGroupItem
                    className={cn(
                      'mt-1 h-5 w-5 rounded-full border-2 relative after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-2.5 after:w-2.5 after:rounded-full after:bg-transparen dark:bg-background',
                      'data-[state=checked]:border-accent-red-900 dark:data-[state=checked]:border-accent-yellow-950 data-[state=checked]:after:bg-accent-red-900   dark:data-[state=unchecked]:border-primary-800 dark:data-[state=checked]:after:bg-accent-yellow-950 dark:data-[state=unchecked]:after:bg-background '
                    )}
                    value={planId}
                    id={planId}
                  />
                  <Label
                    htmlFor={planId}
                    className='text-md font-semibold w-full relative cursor-pointer flex items-center justify-between'
                  >
                    <div>
                      {plan.ruleName}
                      <p className='text-xs font-normal text-muted-foreground dark:text-primary-400'>
                        {getPlanDescription(plan)}
                      </p>
                    </div>
                    {plan?.discountAmount > 0 && (
                      <Badge className='h-6 min-w-5 rounded-full px-2 border-1 border-accent-green-700 bg-[var(--color-accent-green-700)] text-white tabular-nums'>
                        Save ₹{formatPrice(plan?.discountAmount)}
                      </Badge>
                    )}
                  </Label>
                </div>
              </div>

              <CardContent className='p-4 pt-0 space-y-5'>
                {renderPlanDetails(plan)}
              </CardContent>
            </Card>
          );
        })}
      </RadioGroup>

      <p className='text-xs text-muted-foreground mt-2'>
        **Refund if applicable will be processed within 7-9 days
        <br />
        **All bookings for blackout dates like Christmas, New Year etc will be
        non refundable.
      </p>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
}
