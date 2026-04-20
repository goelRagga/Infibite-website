import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CustomImage from '@/components/common/CustomImage';
import { PriveExperience } from 'api-types';

export default function ServicesSection({
  experiences,
}: {
  experiences: PriveExperience[];
}) {
  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        md:grid-cols-6
        grid-areas-mobile
        md:[grid-template-areas:'bonfire_yacht_bbq_hookah_sundowner']
        md:auto-rows-[minmax(90px,_auto)] sm:mt-16
        "
      style={{
        gridTemplateAreas: `
          "bonfire yacht yacht"
          "bonfire bbq hookah"
          "sundowner sundowner more"
        `,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
      }}
    >
      {experiences.map((exp, idx) => {
        if (exp.area === 'yacht' || exp.area === 'sundowner') {
          // Custom horizontal layout for Yacht Cruise and Sundowner Session
          return (
            <div
              key={idx}
              className={cn(
                `md:[grid-area:${exp.area}] col-span-2 row-span-1 flex h-full rounded-2xl overflow-hidden p-[1px]`,
                exp.area === 'sundowner' && 'md:[grid-area:sundowner]'
              )}
              style={{
                gridArea: exp.area,
                background: 'linear-gradient(90deg, #EFBF8E 0%, #2D1A06 100%)',
              }}
            >
              <div
                className={cn(
                  'bg-[#0D0D0D] h-full w-full flex rounded-2xl overflow-hidden p-2',
                  exp.area === 'sundowner' && 'flex-row-reverse'
                )}
              >
                <div className='relative w-1/2 min-h-[220px] md:min-h-[100%] rounded-2xl overflow-hidden'>
                  <CustomImage
                    src={exp.image!}
                    alt={exp.alt || ''}
                    fill
                    className='object-cover h-full w-full'
                    quality={40}
                  />
                </div>
                <div className='flex flex-col justify-center p-8 w-1/2'>
                  <h3 className='font-semibold mb-2 font-serif text-xl text-[var(--prive2)]'>
                    {exp.title}
                  </h3>
                  <p className='text-primary-200 text-sm text-muted-foreground'>
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          );
        }
        // Default card layout for all other cards
        return (
          <div
            key={idx}
            className={cn(
              `rounded-2xl flex flex-col h-full overflow-hidden p-[1px]`,
              exp.area === 'bonfire' && 'md:[grid-area:bonfire] md:row-span-2',
              exp.area === 'hookah' && 'md:[grid-area:hookah]',
              exp.area === 'bbq' && 'md:[grid-area:bbq]',
              exp.area === 'more' && 'md:[grid-area:more]'
            )}
            style={{
              gridArea:
                exp.area === 'bonfire'
                  ? 'bonfire'
                  : exp.area === 'hookah'
                    ? 'hookah'
                    : exp.area === 'bbq'
                      ? 'bbq'
                      : exp.area === 'more'
                        ? 'more'
                        : undefined,
              background: 'linear-gradient(180deg, #EFBF8E 0%, #2D1A06 100%)',
            }}
          >
            <div
              className={cn(
                'bg-[#0D0D0D] h-full rounded-2xl p-2',
                exp.area === 'more' && 'flex justify-center items-center'
              )}
            >
              {exp.image && (
                <div
                  className={cn(
                    'relative w-full h-50 md:-48 rounded-2xl overflow-hidden',
                    exp.area === 'bonfire' && 'h-120'
                  )}
                >
                  <CustomImage
                    src={exp.image}
                    alt={exp.alt || ''}
                    fill
                    className='object-cover'
                    quality={40}
                  />
                </div>
              )}
              <CardContent className='flex flex-col flex-1 p-6'>
                {exp.title && (
                  <h3 className='font-semibold mb-2 font-serif text-xl text-[var(--prive2)]'>
                    {exp.title}
                  </h3>
                )}
                <p className='text-primary-200 text-sm text-muted-foreground'>
                  {exp.description}
                </p>
              </CardContent>
            </div>
          </div>
        );
      })}
    </div>
  );
}
