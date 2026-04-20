import MyDetails from '@/components/modules/ProfilePage/MyDetails/MyDetails';
import PersonalDetailsPage from './my-profile/page';
export default function MyAccountPage() {
  return (
    <div className='w-full space-y-4'>
      <div className='block lg:hidden '>
        <MyDetails />
      </div>

      <div className='hidden lg:block'>
        <PersonalDetailsPage />
      </div>
    </div>
  );
}
