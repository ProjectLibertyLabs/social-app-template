import React, { ReactElement, useEffect } from 'react';
import Title from 'antd/es/typography/Title';
import Post from './Post';
import * as dsnpLink from '../dsnpLink';
import { User, FeedTypes, Network } from '../types';
import { getContext } from '../service/AuthService';
import styles from './Post.module.css';
import { Button, Card, Flex, Space, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../service/UserProfileService';

const OLDEST_BLOCK_TO_GO_TO: Record<Network, number> = {
  local: 1,
  testnet: 1_635_282,
  mainnet: 1_758_013,
};

type PostListProps = {
  feedType: FeedTypes;
  profile: User | undefined;
  // Uses Date.now to trigger an update
  refreshTrigger: number;
  network: Network;
  showReplyInput: boolean;
  isPosting: boolean;
  showLoginModal?: () => void;
};

type FeedItem = dsnpLink.BroadcastExtended;

const PostList = ({
  feedType,
  profile,
  refreshTrigger,
  network,
  showReplyInput,
  showLoginModal,
  isPosting,
}: PostListProps): ReactElement => {
  const [priorTrigger, setPriorTrigger] = React.useState<number>(refreshTrigger);
  const [priorFeedType, setPriorFeedType] = React.useState<number>(feedType);
  const [priorFeed, setPriorFeed] = React.useState<FeedItem[]>([]);
  const [newestBlockNumber, setNewestBlockNumber] = React.useState<number | null>(null);
  const [oldestBlockNumber, setOldestBlockNumber] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentFeed, setCurrentFeed] = React.useState<FeedItem[]>([]);

  const navigate = useNavigate();

  const postGetPosts = (
    result: dsnpLink.PaginatedBroadcast,
    appendOrPrepend: 'append' | 'prepend',
    priorFeed: FeedItem[]
  ) => {
    // REMOVE: fix result.posts is not iterable error
    const posts = Array.isArray(result.posts) ? result.posts : [];
    setOldestBlockNumber(Math.min(oldestBlockNumber || result.oldestBlockNumber, result.oldestBlockNumber));
    setNewestBlockNumber(Math.max(newestBlockNumber || result.newestBlockNumber, result.newestBlockNumber));

    if (appendOrPrepend === 'append') {
      // Older stuff
      setCurrentFeed([...priorFeed, ...posts]);
    } else {
      // Newer stuff
      setCurrentFeed([...posts, ...priorFeed]);
    }

    if (
      appendOrPrepend === 'append' &&
      posts.length === 0 &&
      result.oldestBlockNumber > OLDEST_BLOCK_TO_GO_TO[network]
    ) {
      // Keep going back in time
      setPriorTrigger(priorTrigger - 1);
    } else {
      // Good for now
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getOlder = refreshTrigger === priorTrigger;
    fetchData(getOlder);
  }, [feedType, profile, priorTrigger]);

  const fetchData = async (getOlder: boolean) => {
    const isAddingMore = priorFeedType === feedType;

    const params = !isAddingMore
      ? {}
      : {
          // Going back in time should be undefined, but forward starts at the oldest
          oldestBlockNumber: getOlder ? undefined : newestBlockNumber ? newestBlockNumber + 1 : undefined,
          // Going back in time should start at our oldest, but going forward is undefined
          newestBlockNumber: getOlder ? (oldestBlockNumber ? oldestBlockNumber - 1 : undefined) : undefined,
        };

    setPriorFeed(priorFeedType === feedType ? currentFeed : []);
    setPriorTrigger(refreshTrigger);

    setPriorFeedType(feedType);
    setIsLoading(true);
    const appendOrPrepend = getOlder ? 'append' : 'prepend';
    switch (feedType) {
      case FeedTypes.MY_FEED:
        postGetPosts(await dsnpLink.getFeed(getContext(), params), appendOrPrepend, priorFeed);
        return;
      case FeedTypes.DISCOVER:
        postGetPosts(await dsnpLink.getDiscover(getContext(), params), appendOrPrepend, priorFeed);
        return;
      case FeedTypes.MY_PROFILE:
      case FeedTypes.OTHER_PROFILE:
        if (!profile) {
          navigate('/');
          return;
        }
        postGetPosts(
          await dsnpLink.getUserFeed(getContext(), {
            dsnpId: profile.msaId,
            ...params,
          }),
          appendOrPrepend,
          priorFeed
        );
        return;
    }
  };

  const hasMore = oldestBlockNumber ? oldestBlockNumber > OLDEST_BLOCK_TO_GO_TO[network] : true;

  return (
    <div className={styles.root}>
      <Spin size="large" spinning={isLoading} className={styles.spinner} />
      {oldestBlockNumber !== undefined && (
        <Flex gap={'middle'} vertical={true}>
          {isPosting && <Card loading={true} className={styles.card} bordered={true} />}
          {currentFeed.map((feedItem, index) => (
            <Post
              key={index}
              feedItem={feedItem}
              showReplyInput={showReplyInput}
              isProfile={feedType === FeedTypes.MY_PROFILE || feedType === FeedTypes.OTHER_PROFILE}
              showLoginModal={showLoginModal}
            />
          ))}
          <Space />
          {hasMore && (
            <div className={styles.loadMoreButtonContainer}>
              <Button
                type="primary"
                onClick={() => {
                  fetchData(true);
                }}
              >
                Load More
              </Button>
            </div>
          )}
          {!hasMore && (
            <div className={styles.endMessageContainer}>
              <Title level={4}>That's all there is!</Title>
            </div>
          )}
        </Flex>
      )}
    </div>
  );
};

export default PostList;
