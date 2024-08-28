import React, { ReactElement, useContext, useEffect, useState } from 'react';
import Post from './Post';
import * as dsnpLink from '../../dsnpLink';
import { BroadcastCardType, FeedTypes, Network, User, UserAccount } from '../../types';
import { getContext } from '../../service/AuthService';
import styles from './PostList.module.css';
import { Button, Flex, Space, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import BroadcastCard from '../BroadcastCard/BroadcastCard';
import Title from 'antd/es/typography/Title';

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
  isPosting: boolean;
  stopPosting: () => void;
  showLoginModal?: () => void;
  loggedInAccount: UserAccount;
};

type FeedItem = dsnpLink.BroadcastExtended;

const PostList = ({
  feedType,
  profile,
  refreshTrigger,
  network,
  showLoginModal,
  isPosting,
  stopPosting,
  loggedInAccount,
}: PostListProps): ReactElement => {
  const [priorTrigger, setPriorTrigger] = React.useState<number>(refreshTrigger);
  const [priorFeedType, setPriorFeedType] = React.useState<number>(feedType);
  const [priorFeed, setPriorFeed] = React.useState<FeedItem[]>([]);
  const [newestBlockNumber, setNewestBlockNumber] = React.useState<number | null>(null);
  const [oldestBlockNumber, setOldestBlockNumber] = React.useState<number | null>(null);
  const [currentFeed, setCurrentFeed] = React.useState<FeedItem[]>([]);
  const [isReplying, setIsReplying] = useState<boolean>(false);

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
    }
  };

  useEffect(() => {
    const getOlder = refreshTrigger === priorTrigger;
    fetchData(getOlder);
  }, [feedType, profile, priorTrigger]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3018/content/events');

    eventSource.addEventListener(`announcement`, async function (e) {
      // when the new post is published, update feed.
      await fetchData(false);
      stopPosting();
      setIsReplying(false);
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
      {oldestBlockNumber !== undefined && (
        <Flex gap={'middle'} vertical={true}>
          {isPosting && <BroadcastCard broadcastCardType={BroadcastCardType.POST_LOADING} isLoading={true} />}
          {currentFeed.map((feedItem, index) => (
            <Post
              key={index}
              feedItem={feedItem}
              isProfile={feedType === FeedTypes.MY_PROFILE || feedType === FeedTypes.OTHER_PROFILE}
              showLoginModal={showLoginModal}
              loggedInAccount={loggedInAccount}
              handleIsReplying={() => setIsReplying(true)}
              isReplying={isReplying}
            />
          ))}
          <Space />
          {hasMore ? (
            <div className={styles.loadMoreBlock}>
              <Button
                type="primary"
                onClick={() => {
                  fetchData(true);
                }}
              >
                Load More
              </Button>
            </div>
          ) : (
            <Title level={4} className={styles.endMsg}>
              That's all there is!
            </Title>
          )}
        </Flex>
      )}
    </div>
  );
};

export default PostList;
