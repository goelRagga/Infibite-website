import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CustomImage from '@/components/common/CustomImage';

type Experience = {
  title: string;
  description: string;
  image?: string;
  alt?: string;
  area: string;
};

const experiences: Experience[] = [
  {
    title: 'Bonfire Nights',
    description:
      'As dusk settles, gather around a warm, crackling bonfire arranged exclusively at your villa. Enjoy toasted marshmallows, soothing music, and long conversations under a sky full of stars. Its the perfect way to end the day—with warmth, laughter, and a touch of magic.',
    image: `${process.env.IMAGE_DOMAIN}/4af9c71b5728dd92202ce5ec31cb063c1712a3a7_cb36907e82.jpg`,
    alt: 'Bonfire Nights',
    area: 'bonfire',
  },
  {
    title: 'Yacht Cruise',
    description:
      'Set sail aboard a premium private yacht and leave the coastline behind. Unwind with handcrafted cocktails, gourmet bites, and the company of those who matter most. Whether its a sunset celebration or a mid-day escape, this experience offers a rare blend of serenity, indulgence, and scenic beauty just for you.',
    image: `${process.env.IMAGE_DOMAIN}/3217e9f5f0bf271f67076551596b31219f6cd658_09f2670d76.jpg`,
    alt: 'Yacht Cruise',
    area: 'yacht',
  },
  {
    title: 'Hookah Lounge',
    description:
      'Unwind with a personalized hookah experience in your villas open-air lounge—complete with luxe seating, exotic flavors, and atmospheric lighting.',
    image: `${process.env.IMAGE_DOMAIN}/b1d0c46e422596679aaddaf1be16f994235c6790_b7dc75657c.jpg`,
    alt: 'Hookah Lounge',
    area: 'hookah',
  },
  {
    title: 'Private BBQ Experience',
    description:
      'Enjoy a gourmet BBQ evening with a personal chef grilling fresh, marinated delights right at your villa. Perfectly paired with cozy lighting and great company.',
    image: `${process.env.IMAGE_DOMAIN}/b1d0c46e422596679aaddaf1be16f994235c6790_b7dc75657c.jpg`, // No image in screenshot
    area: 'bbq',
  },
  {
    title: 'Sundowner Session',
    description:
      'Celebrate golden hour with a breathtaking sundowner setup on your terrace or garden lawn. Sip on signature cocktails and nibble on handcrafted hors doeuvres as the sun dips below the horizon. Enhanced by soulful music and serene surroundings, its an effortlessly elegant way to welcome the night.',
    image: `${process.env.IMAGE_DOMAIN}/b1d0c46e422596679aaddaf1be16f994235c6790_b7dc75657c.jpg`, // No image in screenshot
    area: 'sundowner',
  },
  {
    title: '',
    description:
      '...and countless more curated experiences, reserved exclusively for guests of ELIVAAS Privé—the finest collection of our most luxurious villas.',
    area: 'more',
  },
];

export default function CuratedExperiencesMasonry() {
  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        md:grid-cols-6
        grid-areas-mobile
        md:[grid-template-areas:'bonfire_yacht_yacht_bbq_hookah_hookah_sundowner_sundowner_more_more']
        md:auto-rows-[minmax(180px,_auto)]
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
                `md:[grid-area:${exp.area}] col-span-2 row-span-1 flex bg-primary border border-accent rounded-2xl overflow-hidden h-full bg-linear-to-r/increasing from-yellow-500 to-[#0D0D0D] p-[1px]`,
                exp.area === 'sundowner' && 'md:[grid-area:sundowner]'
              )}
              style={{ gridArea: exp.area }}
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
                  <h3 className='font-semibold mb-2 font-serif text-xl text-primary-200'>
                    {exp.title}
                  </h3>
                  <p className='text-primary-200 text-sm text-muted-foreground'>
                    {/* {exp.description} */}
                  </p>
                </div>
              </div>
            </div>
          );
        }
        // Default card layout for all other cards
        return (
          <Card
            key={idx}
            className={cn(
              `bg-primary border border-accent rounded-2xl flex flex-col h-full overflow-hidden bg-linear-to-r from-yellow-500 to-[#0D0D0D] p-[1px]`,
              exp.area === 'bonfire' &&
                'md:[grid-area:bonfire] md:row-span-2 bg-linear-to-b',
              exp.area === 'hookah' && 'md:[grid-area:hookah] bg-linear-to-bl',
              exp.area === 'bbq' && 'md:[grid-area:bbq]',
              exp.area === 'more' && 'md:[grid-area:more] bg-linear-to-b'
            )}
            style={
              exp.area === 'bonfire'
                ? { gridArea: 'bonfire' }
                : exp.area === 'hookah'
                  ? { gridArea: 'hookah' }
                  : exp.area === 'bbq'
                    ? { gridArea: 'bbq' }
                    : exp.area === 'more'
                      ? { gridArea: 'more' }
                      : {}
            }
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
                  <h3 className='font-semibold mb-2 font-serif text-xl text-primary-200'>
                    {exp.title}
                  </h3>
                )}
                <p className='text-primary-200 text-sm text-muted-foreground'>
                  {exp.description}
                </p>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
