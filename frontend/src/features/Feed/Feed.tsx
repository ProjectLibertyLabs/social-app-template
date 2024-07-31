import React, { ReactElement } from 'react';
import PostList from '../Posts/PostList';
import { FeedTypes, Network, UserAccount } from '../../types';
import styles from './Feed.module.css';

type FeedProps = {
  isPosting: boolean;
  profile?: UserAccount | undefined;
  network: Network;
  feedType: FeedTypes;
  refreshTrigger: number;
  showLoginModal?: () => void;
};

const Feed = ({ profile, isPosting, network, feedType, refreshTrigger, showLoginModal }: FeedProps): ReactElement => {
  return (
    <div className={styles.root}>
      <PostList
        network={network}
        refreshTrigger={refreshTrigger}
        feedType={feedType}
        profile={profile}
        showLoginModal={showLoginModal}
        isPosting={isPosting}
      />
    </div>
  );
};
export default Feed;
