'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import BannerSection from './BannerSection';
import VillaCard from './VillaCard';
import WhyCardPaw from './WhyCard';
import PartnerSection from '@/components/modules/Home/PartnerSection';
import CopySection from './CopyCard';
import MobileHeader from '@/components/common/MobileHeader';
import ArrowRightWithBorder from '@/assets/arrowRightWithBorder.svg';
import TestimonialCard from './TestimonialCard';
import ReusableCarousel from '@/components/common/ReusableCarousel';
import Link from 'next/link';

const PetFriendlyPageDetail: React.FC<{}> = ({}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const villaCard = [
    {
      image: `${process.env.IMAGE_DOMAIN}/carousel_One_bade3936ce.webp`,
      cityName: 'Queen’s town',
      cityLocation: 'Udaipur, Rajasthan',
      amenities: [{ guest: '12', bedrooom: '6', bathroom: '6' }],
      price: '40,000',
      link: '/villa-in-udaipur/queens-town-6bhk-villa-with-private-pool',
    },
    {
      image: `${process.env.IMAGE_DOMAIN}/sirmour_b55e93b50f.webp`,
      cityName: 'Sirmour Baag',
      cityLocation: 'Sirmour, Kasauli',
      amenities: [{ guest: '3', bedrooom: '1', bathroom: '2' }],
      price: '16,000',
      link: '/villa-in-kasauli/sirmour-baag-merlot-cottage',
    },
    {
      image: `${process.env.IMAGE_DOMAIN}/esh_b0ed06e362.webp`,
      cityName: 'Esh villa',
      cityLocation: 'Delhi NCR',
      amenities: [{ guest: '15', bedrooom: '6', bathroom: '6' }],
      price: '46,000',
      link: '/villa-in-delhi-ncr/esh-luxury-6bhk-villa-with-private-swimming-pool',
    },
    {
      image: `${process.env.IMAGE_DOMAIN}/bludoor_d2f0956959.webp`,
      cityName: 'BluDoor',
      cityLocation: 'Assagao, North Goa',
      amenities: [{ guest: '12', bedrooom: '5', bathroom: '5' }],
      price: '46,000',
      link: '/villa-in-north-goa/bludoor-5bhk-villa-with-private-pool',
    },
  ];
  const whyCard = [
    {
      image: `${process.env.IMAGE_DOMAIN}/one_4ac846026a.webp`,
      title: 'Pet-loving Staff',
      description:
        'Caretakers are trained to pamper pets with love & belly-rubs.',
    },
    {
      image: `${process.env.IMAGE_DOMAIN}/chef_019724933a.webp`,
      title: 'Cuddle Spaces',
      description: 'A space that feels like home with room to roam and cuddle.',
    },
    {
      image: `${process.env.IMAGE_DOMAIN}/four_2d39effcce.png`,
      title: 'Paw-sonalised Meals',
      description: 'Our chefs whip up custom meals your pet will drool over.',
    },
    {
      image: `${process.env.IMAGE_DOMAIN}/two_0cbf005521.webp`,
      title: 'Warm Welcome',
      description: 'Every furry guest receives the VIPaw treatment.',
    },
  ];
  const reviews = [
    {
      rating: 5,
      reviewText:
        'Watching Coco run free in the garden and curl up by the window like she owned the place… it felt like home for her. That means the world to us.',
      userName: 'Naceen Jain',
      userProfilePicture: `${process.env.IMAGE_DOMAIN}/Amara_Twilight_1_f0b26ac8df.webp`,
      starImageUrl: `${process.env.IMAGE_DOMAIN}/start_Icon_7ac9b8e2ff.svg `,
    },
    {
      rating: 5,
      reviewText:
        'We’ve travelled a lot, but this was the first time our trip felt complete—with Whiskey right by our side, truly welcomed and pampered.',
      userName: 'Kanika Agarwal',
      userProfilePicture: `${process.env.IMAGE_DOMAIN}/review_Image_c5eef7808a.svg `,
      starImageUrl: `${process.env.IMAGE_DOMAIN}/start_Icon_7ac9b8e2ff.svg `,
    },
    {
      rating: 5,
      reviewText:
        'ELIVAAS made our first trip with our rescue dog, Simba, so special. He’s usually anxious, but here, he was calm, playful, and so happy. We’ll never forget it.',
      userName: 'Arin Setya',
      userProfilePicture: `${process.env.IMAGE_DOMAIN}/Veera_0a2ae1871c.webp`,
      starImageUrl: `${process.env.IMAGE_DOMAIN}/start_Icon_7ac9b8e2ff.svg `,
    },
    {
      rating: 5,
      reviewText:
        'Komfu and I stayed at ELIVAAS in January—super pet-friendly with tons of space to play. Kofee had a blast, and the staff was just amazing!',
      userName: 'Rehaan Sharma',
      userProfilePicture: `${process.env.IMAGE_DOMAIN}/Amara_Twilight_1_f0b26ac8df.webp`,
      starImageUrl: `${process.env.IMAGE_DOMAIN}/start_Icon_7ac9b8e2ff.svg `,
    },
    {
      rating: 5,
      reviewText:
        'Watching Coco run free in the garden and curl up by the window like she owned the place… it felt like home for her. That means the world to us.',
      userName: 'Ashish Khandewal',
      userProfilePicture: `${process.env.IMAGE_DOMAIN}/Veera_0a2ae1871c.webp`,
      starImageUrl: `${process.env.IMAGE_DOMAIN}/start_Icon_7ac9b8e2ff.svg `,
    },
    {
      rating: 5,
      reviewText:
        'We’ve travelled a lot, but this was the first time our trip felt complete—with Whiskey right by our side, truly welcomed and pampered.',
      userName: 'Ambrish Chopra',
      userProfilePicture: `${process.env.IMAGE_DOMAIN}/Amara_Twilight_1_f0b26ac8df.webp`,
      starImageUrl: `${process.env.IMAGE_DOMAIN}/start_Icon_7ac9b8e2ff.svg `,
    },
  ];

  const partnerWithUsSection = {
    cta: 'Explore Pet-friendly Villas',
    ctaLink: '',
    earnings: '5-Star Reviews from pet parents',
    imageAlt: 'side image',
    imageSrc: `${process.env.IMAGE_DOMAIN}/side_Image_Partner_2d35033dd0.webp`,
    occupancy: '200+ Furry Guests Hosted',
    totalStays: '90+ Pet friendly villas',
    description:
      'We’ve hosted wagging tails & happy paws across India’s most loved destinations.',
    sectionTitle: '',
  };

  const futuristicTitle = 'Fur-tastic Villas for You';
  const whyPawTitle = 'Why do Pets give us a 5-paw rating?';
  const reviewsTitle = 'Tales of Happy Tails/ Hear it from fellow pet parents';

  return (
    <>
      {isTablet && <MobileHeader title='Pet Friendly Villas' />}
      <BannerSection />

      <div className='px-5 md:px-10 mt-10 flex justify-between items-center'>
        <h2
          className='font-serif text-xl md:text-3xl'
          style={{ color: 'var(--black4)' }}
        >
          {futuristicTitle}
        </h2>
        <ArrowRightWithBorder />
      </div>
      <div className='pr-0 md:pr-10'>
        <div className='px-5 md:px-10 py-5 md:py-10 flex gap-4 md:gap-8 no-scrollbar overflow-x-auto scrollbar-hide xl:overflow-x-visible'>
          {villaCard?.map((villa?: any, index?: number) => (
            <div
              className='w-[75%] sm:w-[60%] md:w-[45%] lg:w-[35%] xl:w-[24%] shrink-0 overflow-hidden'
              key={index}
            >
              <Link href={villa?.link} target='_blank' className='w-full'>
                <VillaCard
                  images={villa?.image}
                  cityName={villa?.cityName}
                  cityLocation={villa?.cityLocation}
                  amenities={villa?.amenities}
                  price={villa?.price}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className='px-5 md:px-10 pt-8 md:pt-15 flex justify-between items-center'>
        <h2
          className='font-serif text-xl md:text-3xl'
          style={{ color: 'var(--black4)' }}
        >
          {whyPawTitle}
        </h2>
      </div>

      <div className='px-5 md:px-10 py-8 md:py-10 no-scrollbar flex gap-4 overflow-x-auto scrollbar-hide xl:overflow-x-visible '>
        {whyCard?.map((why?: any, index?: number) => (
          <div
            key={index}
            className='w-[75%] sm:w-[60%] md:w-[45%] lg:w-[35%] xl:w-[24%] shrink-0 overflow-hidden'
          >
            <WhyCardPaw
              image={why?.image}
              title={why?.title}
              description={why?.description}
            />
          </div>
        ))}
      </div>

      <div className='px-5 md:px-10 pt-8 py-8 md:pt-15 flex justify-between items-center'>
        <h2
          className='font-serif text-xl md:text-3xl'
          style={{ color: 'var(--black4)' }}
        >
          {reviewsTitle}
        </h2>
      </div>
      <ReusableCarousel
        className='md:px-10 mb-10'
        mobileViewType='carousel'
        data={reviews}
        renderItem={(review) => (
          <div className='px-4 md:px-4 py-5'>
            <TestimonialCard reviews={review} />
          </div>
        )}
        spacing={{ mobile: 0, tablet: 0, desktop: 0 }}
        slidesPerView={{ mobile: 1.5, tablet: 2.5, desktop: 4 }}
        showArrows={!isMobile}
        showDots={true}
        centerSlides={isMobile ? true : false}
      />

      <div className='mx-5 md:mx-10 mt-15 mb-15'>
        <PartnerSection
          partnerSectionData={partnerWithUsSection}
          isPetFriendlyPage={true}
        />
      </div>

      <div className='mt-10 md:mt-0 px-5 md:px-10 mb-10'>
        <CopySection />
      </div>
    </>
  );
};

export default PetFriendlyPageDetail;
