import { Card } from 'antd';
import styles from '../Posts/Post.module.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import { FromTitle } from '../FromTitle/FromTitle';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as dsnpLink from '../../dsnpLink';
import { User } from '../../types';

type FeedItemFromId = dsnpLink.BroadcastExtended['fromId'];

interface ReplyMetaProps {
  showLoginModal?: () => void;
  user: User;
  feedItemFromId: FeedItemFromId;
}

const ReplyMeta = ({ showLoginModal, user, feedItemFromId }: ReplyMetaProps) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => (showLoginModal ? showLoginModal() : navigate(`/profile/${feedItemFromId}`))}>
      <Card.Meta
        className={styles.metaInnerBlock}
        avatar={<UserAvatar user={user} avatarSize={'small'} />}
        title={<FromTitle user={user} isReply={true} />}
      />
    </div>
  );
};

export default ReplyMeta;
