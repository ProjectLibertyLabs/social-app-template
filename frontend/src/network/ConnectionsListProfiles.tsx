import React, { ReactElement } from 'react';
import { RelationshipStatus, User, UserAccount } from '../types';
import GraphChangeButton from './GraphChangeButton';
import { FromTitle } from '../content/FromTitle';
import UserAvatar from '../chrome/UserAvatar';
import styles from './ConnectionsListProfiles.module.css';

interface ConnectionsListProfilesProps {
  account: UserAccount;
  connectionsList: User[];
  accountFollowing: string[];
  triggerGraphRefresh: () => void;
  goToProfile: (msaId?: string) => void;
}

const ConnectionsListProfiles = ({
  account,
  connectionsList,
  accountFollowing,
  triggerGraphRefresh,
  goToProfile,
}: ConnectionsListProfilesProps): ReactElement => {
  return (
    <>
      {connectionsList.map((user, index) => (
        <div className={styles.profile} key={user.msaId}>
          <UserAvatar user={user} avatarSize="small" />
          <div className={styles.name} onClick={() => goToProfile(user.msaId)}>
            <FromTitle user={user} />
          </div>
          {/* Skip change button for self */}
          {user.msaId !== account.msaId && (
            <GraphChangeButton
              key={index}
              triggerGraphRefresh={triggerGraphRefresh}
              user={user}
              relationshipStatus={
                accountFollowing.includes(user.dsnpId) ? RelationshipStatus.FOLLOWING : RelationshipStatus.NONE
              }
            />
          )}
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
