'use client';

import Link from 'next/link';
import { NextPage } from 'next';
import { HiPencil, HiDocumentAdd } from 'react-icons/hi';

import { Role } from '../register/types';
import { UserDto } from '@/services/user/dto/user.dto';
import { LoadingSpinner } from '@/shared/loadingSpinner';
import { NavigationTabs } from './components/navigationTabs';
import DashboardLayout from '@/shared/layouts/dashboardLayout';
import { useUserSession } from '@/services/auth/useUserSession';
import { UserProfileForm } from './components/userProfileForm';
import { OrganisationProfileForm } from './components/organisationProfileForm';

const profileUpdateFormFactory = (role: Role, userSession: UserDto) => {
  if (role === Role.USER) {
    return <UserProfileForm userData={userSession} />;
  }

  return <OrganisationProfileForm userData={userSession} />;
};

const Profile: NextPage = () => {
  const userSession = useUserSession();

  return (
    <>
      <DashboardLayout>
        <div className="px-20 relative">
          <NavigationTabs>
            <Link href="/profile" className="flex items-center">
              <HiPencil className="mr-2" size={24} />
              <span>Osnovni podatci</span>
            </Link>
            <Link href="/profile/certificates" className="flex items-center">
              <HiDocumentAdd className="mr-2" size={24} />
              <span>Certifikati</span>
            </Link>
          </NavigationTabs>

          {!userSession ? (
            <LoadingSpinner size={64} color="#de3333" />
          ) : (
            profileUpdateFormFactory(userSession.role, userSession)
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Profile;
