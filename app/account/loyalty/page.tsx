import LoyaltyMain from '@/components/modules/ProfilePage/loyalty';

const Loyalty = () => {
  return (
    <div className='md:px-5'>
      <LoyaltyMain />
    </div>
  );
};

export default Loyalty;

export const dynamic = 'force-dynamic'; // This page should always be dynamic to ensure fresh data is fetched
export const revalidate = 0; // Disable revalidation for this page
