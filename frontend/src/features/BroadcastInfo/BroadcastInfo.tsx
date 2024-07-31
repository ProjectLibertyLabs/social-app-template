import styles from './BroadcastInfo.module.css';
import PostHashDropdown from './PostHashDropdown';
import RelativeTime from './RelativeTime';
import React from 'react';
import * as dsnpLink from '../../dsnpLink';
import { ActivityContentNote } from '@dsnp/activity-content/types';

type FeedItem = dsnpLink.BroadcastExtended;

interface BroadcastInfoProps {
  feedItem: FeedItem;
  content: ActivityContentNote;
}

const BroadcastInfo = ({ feedItem, content }: BroadcastInfoProps) => {
  return (
    <div className={styles.root}>
      <PostHashDropdown hash={feedItem.contentHash} fromId={feedItem.fromId} />
      {content?.published && <RelativeTime published={content?.published} />}
    </div>
  );
};

export default BroadcastInfo;
