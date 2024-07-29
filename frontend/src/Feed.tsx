import React, { ReactElement } from 'react';
import PostList from './content/PostList';
import { FeedTypes, Network, UserAccount } from './types';
import styles from './Feed.module.css';

type FeedProps = {
  isPosting: boolean;
  profile?: UserAccount | undefined;
  network: Network;
  feedType: FeedTypes;
  refreshTrigger: number;
  showReplyInput?: boolean;
  showLoginModal?: () => void;
  handleIsPosting: () => void;
};

const Feed = ({
  profile,
  isPosting,
  network,
  feedType,
  refreshTrigger,
  showReplyInput = true,
  showLoginModal,
  handleIsPosting
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
        handleIsPosting={handleIsPosting}
      />
    </div>
  );
};
export default Feed;
