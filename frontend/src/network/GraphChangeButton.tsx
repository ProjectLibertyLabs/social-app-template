import React, { ReactElement } from 'react';
import { Button } from 'antd';
import styles from './GraphChangeButton.module.css';
import * as dsnpLink from '../dsnpLink';
import { RelationshipStatus, User } from '../types';
import { getContext } from '../service/AuthService';

interface GraphChangeButtonProps {
  connectionAccount: User;
  relationshipStatus: RelationshipStatus;
  triggerGraphRefresh: () => void;
}

const GraphChangeButton = ({
  connectionAccount,
  relationshipStatus,
  triggerGraphRefresh,
}: GraphChangeButtonProps): ReactElement => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  const isFollowing = relationshipStatus === RelationshipStatus.FOLLOWING;

  const buttonText = (): string => (isUpdating ? 'Updating' : isFollowing ? 'Unfollow' : 'Follow');

  const changeGraphState = async () => {
    setIsUpdating(true);
    if (isFollowing) {
      await dsnpLink.graphUnfollow(getContext(), { msaId: connectionAccount.msaId });
    } else {
      await dsnpLink.graphFollow(getContext(), { msaId: connectionAccount.msaId });
    }
    // Defined in App.tsx to refreshFollowing, triggers an api call to /graph/{msaId}/following
    triggerGraphRefresh();
  };

  return (
    <Button
      className={styles.root}
      name={buttonText()}
      size="large"
      type={'default'}
      onClick={changeGraphState}
      loading={isUpdating}
    >
      {buttonText()}
    </Button>
  );
};
export default GraphChangeButton;
