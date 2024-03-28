import React, { useEffect } from "react";
import Title from "antd/es/typography/Title";
import Post from "./Post";
import * as dsnpLink from "../dsnpLink";
import { User, FeedTypes, Network } from "../types";
import { getContext } from "../service/AuthService";
import styles from "./Post.module.css";
import { Button, Space, Spin } from "antd";

const OLDEST_BLOCK_TO_GO_TO: Record<Network, number> = {
  local: 1,
  testnet: 1_635_282,
  mainnet: 1_758_013,
};

type PostListProps = {
  feedType: FeedTypes;
  user: User | undefined;
  // Uses Date.now to trigger an update
  refreshTrigger: number;
  goToProfile: (dsnpId?: string) => void;
  resetFeed: () => void;
  network: Network;
};

type FeedItem = dsnpLink.BroadcastExtended;

const PostList = ({
  feedType,
  user,
  refreshTrigger,
  goToProfile,
  resetFeed,
  network,
}: PostListProps): JSX.Element => {
  const [priorTrigger, setPriorTrigger] =
    React.useState<number>(refreshTrigger);
  const [priorFeedType, setPriorFeedType] = React.useState<number>(feedType);
  const [newestBlockNumber, setNewestBlockNumber] = React.useState<
    number | null
  >(null);
  const [oldestBlockNumber, setOldestBlockNumber] = React.useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentFeed, setCurrentFeed] = React.useState<FeedItem[]>([]);

  const postGetPosts = (
    result: dsnpLink.PaginatedBroadcast,
    appendOrPrepend: "append" | "prepend",
    priorFeed: FeedItem[],
  ) => {
    setOldestBlockNumber(
      Math.min(
        oldestBlockNumber || result.oldestBlockNumber,
        result.oldestBlockNumber,
      ),
    );
    setNewestBlockNumber(
      Math.max(
        newestBlockNumber || result.newestBlockNumber,
        result.newestBlockNumber,
      ),
    );
    if (appendOrPrepend === "append") {
      // Older stuff
      setCurrentFeed([...priorFeed, ...result.posts]);
    } else {
      // Newer stuff
      setCurrentFeed([...result.posts, ...priorFeed]);
    }

    if (
      appendOrPrepend === "append" &&
      result.posts.length === 0 &&
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
  }, [feedType, user, refreshTrigger, priorTrigger, network]);

  const fetchData = async (getOlder: boolean) => {
    const isAddingMore = priorFeedType === feedType;

    const params = !isAddingMore
      ? {}
      : {
          // Going back in time should be undefined, but forward starts at the oldest
          oldestBlockNumber: getOlder
            ? undefined
            : newestBlockNumber
              ? newestBlockNumber + 1
              : undefined,
          // Going back in time should start at our oldest, but going forward is undefined
          newestBlockNumber: getOlder
            ? oldestBlockNumber
              ? oldestBlockNumber - 1
              : undefined
            : undefined,
        };

    const priorFeed = priorFeedType === feedType ? currentFeed : [];
    setPriorTrigger(refreshTrigger);
    setPriorFeedType(feedType);
    setIsLoading(true);
    const appendOrPrepend = getOlder ? "append" : "prepend";
    switch (feedType) {
      case FeedTypes.MY_FEED:
        postGetPosts(
          await dsnpLink.getFeed(getContext(), params),
          appendOrPrepend,
          priorFeed,
        );
        return;
      case FeedTypes.DISCOVER:
        postGetPosts(
          await dsnpLink.getDiscover(getContext(), params),
          appendOrPrepend,
          priorFeed,
        );
        return;
      case FeedTypes.DISPLAY_ID_POSTS:
      case FeedTypes.MY_POSTS:
        if (!user) return resetFeed();
        postGetPosts(
          await dsnpLink.getUserFeed(getContext(), {
            dsnpId: user.dsnpId,
            ...params,
          }),
          appendOrPrepend,
          priorFeed,
        );
        return;
    }
  };

  const hasMore = oldestBlockNumber
    ? oldestBlockNumber > OLDEST_BLOCK_TO_GO_TO[network]
    : true;

  return (
    <div className={styles.root}>
      {isLoading && <Spin size="large" spinning={true} />}
      {oldestBlockNumber !== undefined && (
        <>
          {currentFeed.map((feedItem, index) => (
            <Post
              key={index}
              feedItem={feedItem}
              showReplyInput={true}
              goToProfile={goToProfile}
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
        </>
      )}
    </div>
  );
};

export default PostList;
