import React, { ReactElement } from 'react';
import PostList from '../PostList/PostList';
import { Spin } from 'antd';
import { FeedTypes, Network, UserAccount } from '../../types';
import styles from './Feed.module.css';

type FeedProps = {
  isPosting: boolean;
  profile?: UserAccount | undefined;
  network: Network;
  feedType: FeedTypes;
  refreshTrigger: number;
  showReplyInput?: boolean;
  showLoginModal?: () => void;
};

const Feed = ({
  profile,
  isPosting,
  network,
  feedType,
  refreshTrigger,
  showReplyInput = true,
  showLoginModal,
}: FeedProps): ReactElement => {
  return (
    <div className={styles.root}>
      <PostList
        network={network}
        refreshTrigger={refreshTrigger}
        feedType={feedType}
        profile={profile}
        showReplyInput={showReplyInput}
        showLoginModal={showLoginModal}
        isPosting={isPosting}
      />
    </div>
  );
};
export default Feed;
