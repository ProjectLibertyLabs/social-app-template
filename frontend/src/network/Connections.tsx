import { Flex } from 'antd';
import React, { useState } from 'react';
import { ConnectionsType, User, UserAccount } from '../types';
import ConnectionsModal from './ConnectionsModal';
import styles from './ConnectionsList.module.css';

interface ConnectionsProps {
  loggedInAccountConnections: string[];
  curProfileConnections: string[];
  loggedInAccount: UserAccount;
  profile: UserAccount;
  triggerGraphRefresh: () => void;
}

const Connections = ({
  loggedInAccount,
  loggedInAccountConnections,
  profile,
  curProfileConnections,
  triggerGraphRefresh,
}: ConnectionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [connectionsType, setConnectionsType] = useState<ConnectionsType>(ConnectionsType.FOLLOWERS);

  const showModal = (type: ConnectionsType) => {
    setIsModalOpen(true);
    setConnectionsType(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flex gap={'large'}>
        <div>
          <span className={styles.ConnectionsCount}>{curProfileConnections.length}</span>
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
        loggedInAccountConnections={loggedInAccountConnections}
        curProfileConnections={curProfileConnections}
        connectionsType={connectionsType}
        setConnectionsType={(type: ConnectionsType) => setConnectionsType(type)}
        profile={profile}
      />
    </>
  );
};

export default Connections;
