import React, {ReactElement, useEffect, useState} from 'react';
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

  const getGraphChangeState = async (referenceId: string) => {
    const operationStatus = await dsnpLink.graphOperationStatus(getContext(), { referenceId });
    if (operationStatus.status !== 'pending') {
      // Defined in App.tsx to refreshFollowing, triggers an api call to /graph/{msaId}/following
      triggerGraphRefresh();
      setIsUpdating(false);
    } else {
      setIsUpdating(true);
    }
    console.log("operationStatus", operationStatus);
  };

  const changeGraphState = async () => {
    let refId: { referenceId?: string | undefined };
    if (isFollowing) {
      refId = await dsnpLink.graphUnfollow(getContext(), { msaId: connectionAccount.msaId });
    } else {
      refId =await dsnpLink.graphFollow(getContext(), { msaId: connectionAccount.msaId });
    }

    if (refId.referenceId) await getGraphChangeState(refId.referenceId);
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
