import React, { ReactElement, useState } from 'react';
import PostList from './content/PostList';
import { Spin } from 'antd';
import { FeedTypes, User, Network, UserAccount } from './types';
import styles from './Feed.module.css';

type FeedProps = {
  isPosting: boolean;
  profile?: UserAccount | undefined;
  network: Network;
  feedType: FeedTypes;
  refreshTrigger: number;
};

const Feed = ({ profile, isPosting, network, feedType, refreshTrigger }: FeedProps): ReactElement => {
  return (
    <div className={styles.root}>
      <Spin spinning={isPosting} size="large" />
      <PostList network={network} refreshTrigger={refreshTrigger} feedType={feedType} profile={profile} />
    </div>
  );
};
export default Feed;
