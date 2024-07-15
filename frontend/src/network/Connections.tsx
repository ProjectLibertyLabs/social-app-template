import { Flex } from 'antd';
import React, { useState } from 'react';
import { ConnectionsType, User, UserAccount } from '../types';
import ConnectionsModal from './ConnectionsModal';
import styles from './ConnectionsList.module.css';

interface ConnectionsProps {
  accountFollowingList: string[];
  loggedInAccount: UserAccount;
  profile: UserAccount;
  triggerGraphRefresh: () => void;
}

const Connections = ({ loggedInAccount, accountFollowingList, profile, triggerGraphRefresh }: ConnectionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [connectionsType, setConnectionsType] = useState<ConnectionsType>(ConnectionsType.FOLLOWERS);

  const showModal = (type: ConnectionsType) => {
    setIsModalOpen(true);
    setConnectionsType(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log('accountFollowing', accountFollowingList);

  return (
    <>
      <Flex gap={'large'}>
        <div>
          <span className={styles.ConnectionsCount}>{accountFollowingList.length}</span>
          <span className={styles.ConnectionsOpenModal} onClick={() => showModal(ConnectionsType.FOLLOWING)}>
            Following
          </span>
        </div>
        <div>
          <span className={styles.ConnectionsCount}>?</span>
          <span className={styles.ConnectionsOpenModal} onClick={() => showModal(ConnectionsType.FOLLOWERS)}>
            Followers
          </span>
        </div>
      </Flex>

      <ConnectionsModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        triggerGraphRefresh={triggerGraphRefresh}
        loggedInAccount={loggedInAccount}
        accountFollowingList={accountFollowingList}
        connectionsType={connectionsType}
        setConnectionsType={(type: ConnectionsType) => setConnectionsType(type)}
        profile={profile}
      />
    </>
  );
};

export default Connections;
