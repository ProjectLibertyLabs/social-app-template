import React, { ReactElement, useEffect, useState } from 'react';
import { Spin } from 'antd';
import ConnectionsListProfiles from './ConnectionsListProfiles';
import styles from './ConnectionsList.module.css';
import { User, UserAccount } from '../types';
import Title from 'antd/es/typography/Title';
import * as dsnpLink from '../dsnpLink';
import { getContext } from '../service/AuthService';

type ConnectionsListProps = {
  account: UserAccount;
  accountFollowingList: string[];
  graphRootUser: User;
  triggerGraphRefresh: () => void;
  isModalOpen: boolean;
};

const ConnectionsList = ({
  account,
  graphRootUser,
  accountFollowingList,
  triggerGraphRefresh,
  isModalOpen,
}: ConnectionsListProps): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionsList, setConnectionsList] = useState<User[]>([]);

  const fetchConnections = async () => {
    const ctx = getContext();

    const list: User[] = await Promise.all(
      accountFollowingList.map((msaId) =>
        dsnpLink.getProfile(ctx, { msaId: msaId }).then(({ handle, fromId, content }) => {
          try {
            const profile = content ? JSON.parse(content) : {};
            return {
              handle: handle!,
              msaId: fromId,
              profile: profile,
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
    if (isModalOpen) fetchConnections();
  }, [graphRootUser, isModalOpen]);

  return (
    <Spin spinning={isLoading} tip="Loading" size="large">
      <div className={styles.root}>
        <ConnectionsListProfiles
          key={accountFollowingList.length}
          triggerGraphRefresh={triggerGraphRefresh}
          account={account}
          connectionsList={connectionsList}
          accountFollowingList={accountFollowingList}
        />
      </div>
    </Spin>
  );
};

export default ConnectionsList;
