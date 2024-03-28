import React from "react";
import { Button } from "antd";
import styles from "./GraphChangeButton.module.css";
import * as dsnpLink from "../dsnpLink";
import { RelationshipStatus, User } from "../types";
import { getContext } from "../service/AuthService";

interface GraphChangeButtonProps {
  user: User;
  relationshipStatus: RelationshipStatus;
  triggerGraphRefresh: () => void;
}

const GraphChangeButton = ({
  user,
  relationshipStatus,
  triggerGraphRefresh,
}: GraphChangeButtonProps): JSX.Element => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  const isFollowing = relationshipStatus === RelationshipStatus.FOLLOWING;

  const buttonText = (): string =>
    isUpdating ? "Updating" : isFollowing ? "Unfollow" : "Follow";

  const changeGraphState = async () => {
    setIsUpdating(true);
    if (isFollowing) {
      await dsnpLink.graphUnfollow(getContext(), { dsnpId: user.dsnpId });
    } else {
      await dsnpLink.graphFollow(getContext(), { dsnpId: user.dsnpId });
    }
    triggerGraphRefresh();
  };

  return (
    <Button
      className={styles.root}
      name={buttonText()}
      size="small"
      onClick={changeGraphState}
      loading={isUpdating}
    >
      {buttonText()}
    </Button>
  );
};
export default GraphChangeButton;
