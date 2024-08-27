import React, { ReactElement } from 'react';
import PostList from '../Posts/PostList';
import { FeedTypes, Network, UserAccount } from '../../types';
import styles from './Feed.module.css';

type FeedProps = {
  isPosting: boolean;
  stopPosting: () => void;
  profile?: UserAccount | undefined;
  network: Network;
  feedType: FeedTypes;
  refreshTrigger: number;
  showLoginModal?: () => void;
  loggedInAccount: UserAccount;
};

const Feed = ({
  profile,
  isPosting,
  stopPosting,
  network,
  feedType,
  refreshTrigger,
  showLoginModal,
  loggedInAccount,
}: FeedProps): ReactElement => {
  return (
    <div className={styles.root}>
      <PostList
        network={network}
        refreshTrigger={refreshTrigger}
        feedType={feedType}
        profile={profile}
        showLoginModal={showLoginModal}
        isPosting={isPosting}
        stopPosting={stopPosting}
        loggedInAccount={loggedInAccount}
      />
    </div>
  );
};
export default Feed;
