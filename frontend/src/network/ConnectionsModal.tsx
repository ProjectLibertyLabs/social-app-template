import { Modal, Tabs, TabsProps } from 'antd';
import React from 'react';
import ConnectionsList from './ConnectionsList';
import { ConnectionsType, User, UserAccount } from '../types';
import { makeDisplayHandle } from '../helpers/DisplayHandle';
import styles from './ConnectionsModal.module.css';

interface ConnectionsModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  account: UserAccount;
  accountFollowingList: string[];
  graphRootUser: User;
  triggerGraphRefresh: () => void;
  connectionsType: ConnectionsType;
  setConnectionsType: (type: ConnectionsType) => void;
}

const ConnectionsModal = ({
  isModalOpen,
  handleCancel,
  account,
  accountFollowingList,
  graphRootUser,
  triggerGraphRefresh,
  connectionsType,
  setConnectionsType,
}: ConnectionsModalProps) => {
  const tabsData: TabsProps['items'] = [
    {
      key: ConnectionsType.FOLLOWING,
      label: (
        <span>
          Following <b>{accountFollowingList.length}</b>
        </span>
      ),
      children: (
        <ConnectionsList
          account={account}
          accountFollowingList={accountFollowingList}
          graphRootUser={graphRootUser}
          triggerGraphRefresh={triggerGraphRefresh}
          isModalOpen={isModalOpen}
        />
      ),
    },
    {
      key: ConnectionsType.FOLLOWERS,
      label: 'Followers',
      children: <div>It is up to the provider to maintain a database and reverse map and save the followers list.</div>,
    },
  ];

  return (
    <Modal
      title={<span className={styles.title}>{makeDisplayHandle(account.handle)}</span>}
      open={isModalOpen}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Tabs
        activeKey={connectionsType}
        items={tabsData}
        onTabClick={(key) => setConnectionsType(key as ConnectionsType)}
        size={'large'}
      />
    </Modal>
  );
};

export default ConnectionsModal;
