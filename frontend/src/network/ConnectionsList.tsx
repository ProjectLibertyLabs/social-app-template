import React, { ReactElement, useEffect, useState } from 'react';
import { Spin } from 'antd';
import ConnectionsListProfiles from './ConnectionsListProfiles';
import styles from './ConnectionsList.module.css';
import { User, UserAccount } from '../types';
import Title from 'antd/es/typography/Title';
import * as dsnpLink from '../dsnpLink';
import { getContext } from '../service/AuthService';

type ConnectionsListProps = {
  loggedInAccount: UserAccount;
  accountFollowingList: string[];
  profile: User;
  triggerGraphRefresh: () => void;
};

const ConnectionsList = ({
  loggedInAccount,
  profile,
  accountFollowingList,
  triggerGraphRefresh,
}: ConnectionsListProps): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionsList, setConnectionsList] = useState<User[]>([]);

  const fetchConnections = async () => {
    const ctx = getContext();

    const list: User[] = await Promise.all(
      accountFollowingList.map((msaId) =>
        dsnpLink.getProfile(ctx, { msaId: msaId }).then(({ handle, fromId, content }) => {
          try {
            const connectionProfile = content ? JSON.parse(content) : {};
            return {
              handle: handle!,
              msaId: fromId,
              profile: connectionProfile,
            };
          } catch (e) {
            console.error(e);
            return {
              handle: handle!,
              msaId: fromId,
              profile: {},
            };
          }
        })
      )
    );
    setConnectionsList(list);
    setIsLoading(false);
  };

  // Update again when accountFollowing changes.
  useEffect(() => {
    fetchConnections();
  }, [profile]);

  return (
    <Spin spinning={isLoading} tip="Loading" size="large">
      <div className={styles.root}>
        <ConnectionsListProfiles
          key={accountFollowingList.length}
          triggerGraphRefresh={triggerGraphRefresh}
          loggedInAccount={loggedInAccount}
          connectionsList={connectionsList}
          accountFollowingList={accountFollowingList}
        />
      </div>
    </Spin>
  );
};

export default ConnectionsList;
