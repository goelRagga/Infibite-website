import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { LogOut, LogIn } from 'lucide-react';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import CustomAccordion from '@/components/common/CustomAccordion';
import { Button } from '@/components/ui';
import { SECURITY_DEPOSIT_CONTENT } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { trackEvent } from '@/lib/mixpanel';

// Define the Data interface
interface Data {
  title?: string;
  content?: string;
  // Add other properties of Data if they exist
}

// Define the FAQ interfaces
interface Faq {
  __typename: string;
  question: string;
  answer: string;
}

interface FaqsCategory {
  __typename: string;
  category: string;
  list: Faq[];
}

interface faqs {
  question: string;
  answer: string;
  // Add other properties of faqs if they exist
}

interface VIllaAboutProps {
  data?: Data[] | any;
  faqs?: faqs[] | FaqsCategory[];
  isAbout?: false | boolean;
  is_checkin_out_entered?: boolean;
}
const AboutHome = ({
  data,
  faqs,
  isAbout,
  is_checkin_out_entered = false,
}: VIllaAboutProps) => {
  const [tabValue, setTabValue] = useState('checkin');
  const [tabModalOpen, setTabModalOpen] = useState(false);
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const getSection = (title: string) =>
    data?.sections?.find((s: any) =>
      s.title?.toLowerCase().includes(title.toLowerCase())
    );
  const snapshotContent =
    getSection('Villa Snapshot')?.content ||
    getSection('Property Snapshot')?.content ||
    '';

  // Handle both old and new FAQ data structures
  const mappedFaqItems = (() => {
    if (!faqs) return [];

    // Check if it's the new structure (FaqsCategory[])
    if (Array.isArray(faqs) && faqs.length > 0 && 'category' in faqs[0]) {
      const newFaqs = faqs as FaqsCategory[];
      return newFaqs.flatMap((category, categoryIndex) =>
        category.list.map((faq, faqIndex) => ({
          index: categoryIndex * 100 + faqIndex,
          value: `faq-${categoryIndex}-${faqIndex}`,
          question: faq.question,
          answer: faq.answer,
          category: category.category,
        }))
      );
    }

    // Handle old structure (faqs[])
    const oldFaqs = faqs as faqs[];
    return oldFaqs.map((faq, index) => ({
      index,
      value: `faq-${index}`,
      question: faq.question,
      answer: faq.answer,
      category: null,
    }));
  })();

  // Create base tab items
  const baseTabItems = [
    {
      key: 'checkin',
      label: 'Check-In',
      title: 'Check-In & Check-Out',
      render: () => (
        <div className='space-y-6 text-xs sm:text-sm sm:flex'>
          <div>
            <h6 className='text-md text-accent-red-900 font-semibold flex items-center gap-2 dark:text-accent-yellow-950'>
              <LogIn size={22} /> Check-In
            </h6>
            <ul className='list-disc pl-5 mt-4 space-y-1'>
              <li>
                Check-in: From <strong>02:00 PM</strong> onwards
              </li>
              <li>Please carry a valid ID for verification</li>
              <li>
                Early check-in may be possible upon request, subject to
                availability
              </li>
            </ul>
          </div>
          <div>
            <h6 className='text-md text-accent-red-900 font-semibold flex items-center gap-2 dark:text-accent-yellow-950'>
              <LogOut size={22} className='rotate-180' /> Check-Out
            </h6>
            <ul className='list-disc pl-5 mt-4 space-y-1'>
              <li>
                Check-out: By <strong>11:00 AM</strong>
              </li>
              <li>
                Late check-out requests can be accommodated based on
                availability
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: 'rules',
      label: 'Villa Rules',
      title: 'Villa Rules',
      render: () => (
        <div
          className='text-xs/7 sm:text-sm line-height-12 sm:line-height-20 sm:[&>p]:mb-4 sm:[&>p:last-child]:mb-0'
          dangerouslySetInnerHTML={{
            __html: getSection('House Rules')?.content || '',
          }}
        />
      ),
    },
    {
      key: 'deposit',
      label: 'Security Deposit',
      title: 'Security Deposit',
      render: () => (
        <div className='flex flex-col gap-2 text-justify'>
          <p className='text-md font-semibold text-accent-red-900  dark:text-accent-yellow-950'>
            Security Deposit
          </p>
          <p className='text-xs sm:text-sm font-semibold'>
            Security Deposit : ₹{formatPrice(data?.securityFee || '')}{' '}
          </p>
          <p className='text-xs sm:text-sm '>
            At ELIVAAS, we collect a refundable security deposit of ₹
            {formatPrice(data?.securityFee || '')}
            {SECURITY_DEPOSIT_CONTENT}
          </p>
        </div>
      ),
    },
    {
      key: 'meals',
      label: 'Meals',
      title: 'Meals',
      render: () => (
        <div
          className='text-xs sm:text-sm'
          dangerouslySetInnerHTML={{
            __html: getSection('Meals')?.content || '',
          }}
        />
      ),
    },
  ];

  // Create single FAQ tab with category headings
  const faqTab = {
    key: 'faqs',
    label: 'FAQs',
    title: 'FAQs',
    render: () => {
      // Check if we have categorized FAQs
      if (
        faqs &&
        Array.isArray(faqs) &&
        faqs.length > 0 &&
        'category' in faqs[0]
      ) {
        const categorizedFaqs = faqs as FaqsCategory[];
        return (
          <div className='space-y-6'>
            {categorizedFaqs.map((category, categoryIndex) => (
              <div key={category.category} className='space-y-4'>
                <h3 className='text-md font-semibold text-accent-red-900 dark:text-accent-yellow-950 border-b border-gray-200 dark:border-primary-400 pb-2'>
                  {category.category}
                </h3>
                <CustomAccordion
                  className='dark:border-primary-400'
                  items={category.list.map((faq, faqIndex) => ({
                    index: categoryIndex * 100 + faqIndex,
                    value: `faq-${categoryIndex}-${faqIndex}`,
                    question: faq.question,
                    answer: faq.answer,
                  }))}
                  type='single'
                  collapsible={true}
                />
              </div>
            ))}
          </div>
        );
      }

      // Fallback to original structure
      return (
        <CustomAccordion
          items={mappedFaqItems}
          type='single'
          collapsible={true}
        />
      );
    },
  };

  // Combine all tab items
  const tabItems = [...baseTabItems, faqTab];

  const activeTab =
    tabItems.find((item) => item.key === tabValue) || tabItems[0];

  // Set default tab value
  useEffect(() => {
    if (isMobile) {
      setTabValue('');
    } else {
      setTabValue('checkin');
    }
  }, [isMobile]);

  const readMoreClick = () => {
    trackEvent('property_content_clicked', {
      page_name: 'property_details',
      widget_name: 'About Home',
      widget_type: 'content',
      cta_type: 'read_more',
      is_checkin_out_entered: is_checkin_out_entered,
    });
    setSnapshotModalOpen(true);
  };

  // Map tab keys to cta_type values for tracking
  const getCtaType = (key: string): string => {
    const ctaTypeMap: Record<string, string> = {
      checkin: 'check_in',
      rules: 'villa_rules',
      deposit: 'security_deposit',
      meals: 'meals',
      faqs: 'faqs',
    };
    return ctaTypeMap[key] || key;
  };

  const handleTabClick = (key: string) => {
    trackEvent('property_content_clicked', {
      page_name: 'property_details',
      widget_name: 'About Home',
      widget_type: 'content',
      cta_type: getCtaType(key),
      is_checkin_out_entered: is_checkin_out_entered,
    });
  };

  const tabTriggerClass = `
    text-sm font-semibold rounded-full border px-6 py-2 transition-colors cursor-pointer  dark:border-primary-400 dark:bg-[var(--grey8)]
    text-[var(--brown3)] border-[var(--black6)] dark:text-primary-200
    data-[state=active]:text-white data-[state=active]:bg-[var(--black8)] data-[state=active]:border-[var(--black8)]  dark:data-[state=active]:border-none
    dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[var(--orange7)] dark:data-[state=active]:to-[var(--orange8)]
  `;
  return (
    <Card className='shadow-none border-none p-0 dark:bg-[var(--prive-background)]  '>
      {/* Villa Snapshot */}
      {isAbout && (
        <div className='relative dark:bg-[var(--prive-background)]'>
          <div
            className='line-clamp-6 text-base leading-relaxed text-xs sm:text-sm dark:text-primary-100'
            dangerouslySetInnerHTML={{ __html: snapshotContent }}
          />
          {snapshotContent && (
            <ResponsiveDialogDrawer
              contentClassName='sm:max-w-[792px]! dark:bg-background border-none'
              open={snapshotModalOpen}
              setOpen={setSnapshotModalOpen}
              title='About Home'
              trigger={
                <button
                  className='mt-2 text-sm font-semibold text-accent-red-900 dark:text-[var(--accent-text)] underline cursor-pointer hover:text-accent-red-950'
                  onClick={readMoreClick}
                >
                  Read more
                </button>
              }
            >
              <div className='grid gap-4 text-xs/5 sm:text-sm h-full pb-6 max-h-max! sm:h-[80dvh] overflow-y-auto dark:px-4 py-0'>
                <div dangerouslySetInnerHTML={{ __html: snapshotContent }} />
              </div>
            </ResponsiveDialogDrawer>
          )}
        </div>
      )}

      {/* Mobile: Modal UI */}
      {isMobile ? (
        <>
          <div className=' mt-2 grid grid-cols-2 gap-3 '>
            {tabItems.map(({ key, label }) => (
              <Button
                key={key}
                variant='outline'
                className='shadow-none text-xs font-semibold h-10 rounded-full dark:text-primary-200 sm:dark:text-accent-yellow-950 dark:border-primary-400 dark:bg-[var(--grey8)]  '
                onClick={() => {
                  trackEvent('property_content_clicked', {
                    page_name: 'property_details',
                    widget_name: 'About Home',
                    widget_type: 'content',
                    cta_type: label,
                    is_checkin_out_entered: is_checkin_out_entered,
                  });
                  setTabValue(key);
                  setTabModalOpen(true);
                }}
              >
                {label}
              </Button>
            ))}
          </div>

          <ResponsiveDialogDrawer
            open={tabModalOpen}
            setOpen={setTabModalOpen}
            title={activeTab?.title}
            contentClassName='h-auto!'
          >
            <div className='h-full pb-10 sm:pb-6 sm:h-[80dvh] overflow-y-auto text-sm h-auto!'>
              {activeTab?.render()}
            </div>
          </ResponsiveDialogDrawer>
        </>
      ) : (
        // Desktop: Tabs UI
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          defaultValue='checkin'
          className='w-full flex-col-reverse sm:block dark:bg-[var(--prive-background)]  '
        >
          <TabsList className='contents sm:flex flex-wrap gap-3 bg-transparent p-0 '>
            {tabItems.map(({ key, label }) => (
              <TabsTrigger
                key={key}
                value={key}
                className={tabTriggerClass}
                onClick={() => handleTabClick(key)}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabItems.map(({ key, render }) => (
            <TabsContent
              key={key}
              value={key}
              className='mt-8 text-muted-foreground  '
            >
              {render()}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Card>
  );
};

export default AboutHome;
