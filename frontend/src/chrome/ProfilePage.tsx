import React, { useEffect, useState } from 'react';
import { Profile } from './Profile';
import Feed from '../Feed';
import { FeedTypes, Network, UserAccount } from '../types';
import * as dsnpLink from '../dsnpLink';
import { getContext } from '../service/AuthService';
import { getUserProfile } from '../service/UserProfileService';
import { useLocation } from 'react-router-dom';

interface ProfilePageProps {
  loggedInAccount: UserAccount;
  network: Network;
  isPosting: boolean;
  refreshTrigger: number;
}

const ProfilePage = ({ loggedInAccount, network, isPosting, refreshTrigger }: ProfilePageProps) => {
  let location = useLocation();

  const getCurMsa = () => {
    const pathnameParts = window.location.pathname.split('/');
    return pathnameParts.length === 3 && pathnameParts[1] === 'profile' ? pathnameParts[2] : null;
  };

  const [msaId, setMsaId] = useState(getCurMsa());
  const [profile, setProfile] = useState<UserAccount>();
  const [accountFollowing, setAccountFollowing] = useState<string[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getGraph = async () => {
    if (msaId) {
      const following = await dsnpLink.userFollowing(getContext(), { msaId });
      setAccountFollowing(following);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (msaId) {
        setIsLoading(true);
        const curProfile = await getUserProfile(msaId);
        curProfile && setProfile(curProfile as UserAccount);
        await getGraph();
      }
    };

    fetchUserProfile();
    setIsLoading(false);
  }, [msaId]);

  useEffect(() => {
    const newMsaId = getCurMsa();
    setMsaId(newMsaId);
  }, [location]);

  if (!profile) return <>{`User with msaId ${msaId} was not found.`}</>;

  return (
    <>
      <Profile
        loggedInAccount={loggedInAccount}
        profile={profile}
        getGraph={getGraph}
        isLoading={isLoading}
        accountFollowing={accountFollowing ?? []}
      />
      <Feed
        profile={profile}
        network={network}
        feedType={loggedInAccount.msaId === msaId ? FeedTypes.MY_PROFILE : FeedTypes.OTHER_PROFILE}
        isPosting={isPosting}
        refreshTrigger={refreshTrigger}
      />
    </>
  );
};

export default ProfilePage;
