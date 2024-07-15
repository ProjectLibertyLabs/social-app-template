import React, { ReactElement, useEffect, useState } from 'react';
import { RelationshipStatus, User, UserAccount } from '../types';
import { Card, Spin } from 'antd';
import styles from './Profile.module.css';
import UserAvatar from '../chrome/UserAvatar';
import { FromTitle } from '../content/FromTitle';
import GraphChangeButton from '../network/GraphChangeButton';
import ConnectionsList from '../network/ConnectionsList';
import { getUserProfile } from '../service/UserProfileService';
import * as dsnpLink from '../dsnpLink';
import { getContext } from '../service/AuthService';
import Connections from '../network/Connections';

interface ProfileProps {
  loggedInAccount: UserAccount;
  profile: UserAccount;
  accountFollowing: string[];
  getGraph: () => void;
  isLoading: boolean;
}

export const Profile = ({
  loggedInAccount,
  profile,
  accountFollowing,
  getGraph,
  isLoading,
}: ProfileProps): ReactElement => {
  const secondary = profile?.profile?.name || '';

  const [profileFollowingList, setProfileFollowingList] = useState<string[]>([]);

  const geProfileGraph = async () => {
    const following = await dsnpLink.userFollowing(getContext(), { msaId: profile.msaId });
    setProfileFollowingList(following);
  };

  useState(() => {
    geProfileGraph();
  });

  return (
    <div className={styles.root}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Card.Meta
            className={styles.metaInnerBlock}
            avatar={<UserAvatar user={profile} avatarSize={'medium'} />}
            title={<FromTitle level={2} user={profile} />}
          />
          <div className={styles.profile}>{secondary ? secondary : 'No Profile'}</div>
          {loggedInAccount.msaId !== profile.msaId && (
            <GraphChangeButton
              key={accountFollowing.length}
              user={profile}
              triggerGraphRefresh={geProfileGraph}
              relationshipStatus={
                profileFollowingList.includes(profile.msaId) ? RelationshipStatus.FOLLOWING : RelationshipStatus.NONE
              }
            />
          )}
          <Connections
            triggerGraphRefresh={getGraph}
            account={profile}
            accountFollowingList={profileFollowingList || []}
            graphRootUser={profile}
          />
        </>
      )}
    </div>
  );
};
