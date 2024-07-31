import React, { ReactElement } from 'react';
import { Button } from 'antd';
import styles from './GraphChangeButton.module.css';
import * as dsnpLink from '../../dsnpLink';
import { RelationshipStatus, User } from '../../types';
import { getContext } from '../../service/AuthService';

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
    setIsUpdating(operationStatus.status === 'pending');
    if (operationStatus.status !== 'pending') triggerGraphRefresh();
    return operationStatus;
  };

  const pollGraphChangeState = async (referenceId: string) => {
    // get initial state.
    let operationStatus = await getGraphChangeState(referenceId);
    let intervalCounter = 0;

    // after 6 seconds, we poll 10 times over the course of a minute.
    const intervalId = setInterval(async () => {
      intervalCounter++;
      operationStatus = await getGraphChangeState(referenceId!);
      if (operationStatus.status !== 'pending' || intervalCounter > 10) clearInterval(intervalId);
    }, 6000);
  };

  const changeGraphState = async () => {
    const { referenceId } = isFollowing
      ? await dsnpLink.graphUnfollow(getContext(), { msaId: connectionAccount.msaId })
      : await dsnpLink.graphFollow(getContext(), { msaId: connectionAccount.msaId });

    console.log('referenceId', referenceId);
    if (referenceId) await pollGraphChangeState(referenceId);
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
