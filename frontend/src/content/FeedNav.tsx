import styles from '../Feed.module.css';
import { FeedTypes, User } from '../types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import React from 'react';
import { makeDisplayHandle } from '../helpers/DisplayHandle';

interface FeedNavProps {
  feedType: FeedTypes;
  setFeedType: (type: FeedTypes) => void;
  resetFeed: () => void;
  goToMyFeed: () => void;
  user?: User;
}

const FeedNav = ({ feedType, setFeedType, resetFeed, goToMyFeed, user }: FeedNavProps) => {
  const feedNavClassName = (navItemType: FeedTypes) =>
    feedType === navItemType
      ? [styles.navigationItem, styles['navigationItem--active']].join(' ')
      : styles.navigationItem;

  return (
    <nav className={styles.navigation}>
      {user && [FeedTypes.DISPLAY_ID_POSTS, FeedTypes.MY_POSTS].includes(feedType) && (
        <>
          <div className={styles.backArrow} onClick={resetFeed}>
            <ArrowLeftOutlined />
          </div>
          <div className={feedNavClassName(FeedTypes.DISPLAY_ID_POSTS)}>
            @{makeDisplayHandle(user.handle)}&nbsp;Posts
          </div>
        </>
      )}
      <div className={feedNavClassName(FeedTypes.DISCOVER)} onClick={() => setFeedType(FeedTypes.DISCOVER)}>
        Discover
      </div>
      <div className={feedNavClassName(FeedTypes.MY_FEED)} onClick={() => setFeedType(FeedTypes.MY_FEED)}>
        My Feed
      </div>
      <div className={feedNavClassName(FeedTypes.MY_POSTS)} onClick={goToMyFeed}>
        My Posts
      </div>
    </nav>
  );
};

export default FeedNav;
