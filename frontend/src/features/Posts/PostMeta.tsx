import { Card } from 'antd';
import styles from './Post.module.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import { FromTitle } from '../FromTitle/FromTitle';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import * as dsnpLink from '../../dsnpLink';

type FeedItemFromId = dsnpLink.BroadcastExtended['fromId'];

interface PostMetaProps {
  showLoginModal?: () => void;
  user: User;
  feedItemFromId: FeedItemFromId;
}

const PostMeta = ({ showLoginModal, user, feedItemFromId }: PostMetaProps) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => (user ? navigate(`/profile/${feedItemFromId}`) : showLoginModal && showLoginModal())}>
      <Card.Meta
        className={styles.metaInnerBlock}
        avatar={<UserAvatar user={user} avatarSize={'medium'} />}
        title={<FromTitle user={user} showLoginModal={showLoginModal} isLoggedOut={!!user} />}
      />
    </div>
  );
};

export default PostMeta;
