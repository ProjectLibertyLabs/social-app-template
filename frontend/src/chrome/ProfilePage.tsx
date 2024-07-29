import React, { useEffect, useState } from 'react';
import { Profile } from './Profile';
import Feed from '../Feed';
import { FeedTypes, Network, UserAccount } from '../types';
import * as dsnpLink from '../dsnpLink';
import { getContext } from '../service/AuthService';
import { getUserProfile } from '../service/UserProfileService';
import { useLocation } from 'react-router-dom';
import { Spin } from 'antd';

interface ProfilePageProps {
  loggedInAccount: UserAccount;
  network: Network;
  isPosting: boolean;
  refreshTrigger: number;
  isReplying: boolean;
}

const ProfilePage = ({ loggedInAccount, network, isPosting, refreshTrigger, isReplying }: ProfilePageProps) => {
  const location = useLocation();

  const getCurMsa = () => {
    const pathnameParts = window.location.pathname.split('/');
    return pathnameParts.length === 3 && pathnameParts[1] === 'profile' ? pathnameParts[2] : null;
  };

  const [profile, setProfile] = useState<UserAccount>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const msaId = getCurMsa();
    const fetchUserProfile = async () => {
      if (msaId) {
        setIsLoading(true);
        const curProfile = await getUserProfile(msaId);
        curProfile && setProfile(curProfile as UserAccount);
      }
    };

    fetchUserProfile();
    setIsLoading(false);
  }, [location]);

  if (!profile) return <>{`User was not found.`}</>;

  return (
    <Spin tip="Loading" size="large" spinning={isLoading}>
      <Profile loggedInAccount={loggedInAccount} profile={profile} isLoading={isLoading} />
      <Feed
        profile={profile}
        network={network}
        feedType={loggedInAccount.msaId === profile.msaId ? FeedTypes.MY_PROFILE : FeedTypes.OTHER_PROFILE}
        isPosting={isPosting}
        refreshTrigger={refreshTrigger}
        isReplying={isReplying}
      />
    </Spin>
  );
};

export default ProfilePage;
