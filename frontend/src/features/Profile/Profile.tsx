import React, { ReactElement, useEffect, useState } from 'react';
import { RelationshipStatus, User, UserAccount } from '../../types';
import { Card, Flex, Spin } from 'antd';
import styles from './Profile.module.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import { FromTitle } from '../FromTitle/FromTitle';
import GraphChangeButton from '../GraphChangeButton/GraphChangeButton';
import ConnectionsList from '../Connections/ConnectionsList';
import { getUserProfile } from '../../service/UserProfileService';
import * as dsnpLink from '../../dsnpLink';
import { getContext } from '../../service/AuthService';
import Connections from '../Connections/Connections';

interface ProfileProps {
  loggedInAccount: UserAccount;
  profile: UserAccount;
  isLoading: boolean;
}

export const Profile = ({ loggedInAccount, profile, isLoading }: ProfileProps): ReactElement => {
  const secondary = profile?.profile?.name || '';

  const [loggedInAccountConnections, setLoggedInAccountConnections] = useState<string[]>([]);
  const [curProfileConnections, setCurProfileConnections] = useState<string[]>([]);

  const setGraph = async () => {
    const loggedInAccountFollowing = await dsnpLink.userFollowing(getContext(), { msaId: loggedInAccount.msaId });
    setLoggedInAccountConnections(loggedInAccountFollowing);

    if (loggedInAccount.msaId === profile.msaId) {
      setCurProfileConnections(loggedInAccountFollowing);
      return;
    } else {
      const curProfileFollowing = await dsnpLink.userFollowing(getContext(), { msaId: profile.msaId });
      setCurProfileConnections(curProfileFollowing);
    }
  };

  useEffect(() => {
    setGraph();
  }, [loggedInAccount, profile]);

  return (
    <div className={styles.root}>
      {isLoading ? (
        <Spin />
      ) : (
        <Flex gap={'large'} vertical>
          <Card.Meta
            className={styles.metaInnerBlock}
            avatar={<UserAvatar user={profile} avatarSize={'medium'} />}
            title={<FromTitle level={2} user={profile} />}
          />
          <div>{secondary ? secondary : 'No Profile'}</div>
          {loggedInAccount.msaId !== profile.msaId && (
            <GraphChangeButton
              key={loggedInAccountConnections.length}
              connectionAccount={profile}
              triggerGraphRefresh={setGraph}
              relationshipStatus={
                loggedInAccountConnections.includes(profile.msaId)
                  ? RelationshipStatus.FOLLOWING
                  : RelationshipStatus.NONE
              }
            />
          )}
          <Connections
            loggedInAccountConnections={loggedInAccountConnections}
            loggedInAccount={loggedInAccount}
            profile={profile}
            curProfileConnections={curProfileConnections}
            triggerGraphRefresh={setGraph}
          />
        </Flex>
      )}
    </div>
  );
};
