import React, { ReactElement } from 'react';
import { RelationshipStatus, User, UserAccount } from '../types';
import GraphChangeButton from './GraphChangeButton';
import { FromTitle } from '../content/FromTitle';
import UserAvatar from '../chrome/UserAvatar';
import styles from './ConnectionsListProfiles.module.css';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'antd';

interface ConnectionsListProfilesProps {
  loggedInAccount: UserAccount;
  connectionsList: User[];
  loggedInAccountConnections: string[];
  triggerGraphRefresh: () => void;
}

const ConnectionsListProfiles = ({
  loggedInAccount,
  connectionsList,
  loggedInAccountConnections,
  triggerGraphRefresh,
}: ConnectionsListProfilesProps): ReactElement => {
  const navigate = useNavigate();

  return (
    <Flex gap={'small'} vertical>
      {connectionsList.map((connectionAccount, index) => (
        <div className={styles.profile} key={connectionAccount.msaId}>
          <UserAvatar user={connectionAccount} avatarSize="small" />
          <div className={styles.name} onClick={() => navigate(`/profile/${connectionAccount.msaId}`)}>
            <FromTitle user={connectionAccount} />
          </div>
          {/* Skip change button for self */}
          {connectionAccount.msaId !== loggedInAccount.msaId && (
            <GraphChangeButton
              key={index}
              triggerGraphRefresh={triggerGraphRefresh}
              connectionAccount={connectionAccount}
              relationshipStatus={
                loggedInAccountConnections.includes(connectionAccount.msaId)
                  ? RelationshipStatus.FOLLOWING
                  : RelationshipStatus.NONE
              }
            />
          )}
        </div>
      ))}
    </Flex>
  );
};
export default ConnectionsListProfiles;
