import React, { useEffect, useState } from "react";
import NewPost from "./content/NewPost";
import PostList from "./content/PostList";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { UserAccount, FeedTypes, User, Network } from "./types";
import styles from "./Feed.module.css";

type FeedProps = {
  account: UserAccount;
  user: User | undefined;
  goToProfile: (dsnpId?: string) => void;
  network: Network;
};

const Feed = ({
  account,
  user,
  goToProfile,
  network,
}: FeedProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.DISCOVER);

  if (
    feedType === FeedTypes.DISPLAY_ID_POSTS &&
    user?.dsnpId === account.dsnpId
  ) {
    setFeedType(FeedTypes.MY_POSTS);
  }

  if (feedType === FeedTypes.DISPLAY_ID_POSTS && !user) {
    setFeedType(FeedTypes.DISCOVER);
  }

  const feedNavClassName = (navItemType: FeedTypes) =>
    feedType === navItemType
      ? [styles.navigationItem, styles["navigationItem--active"]].join(" ")
      : styles.navigationItem;

  const resetFeed = () => {
    setFeedType(FeedTypes.DISCOVER);
    goToProfile();
  };

  const showProfile = (dsnpId?: string) => {
    if (dsnpId) {
      setFeedType(FeedTypes.DISPLAY_ID_POSTS);
    } else {
      setFeedType(FeedTypes.DISCOVER);
    }

    goToProfile(dsnpId);
  };

  useEffect(() => {
    setFeedType(FeedTypes.DISPLAY_ID_POSTS);
  }, [user]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <nav className={styles.navigation}>
          {user &&
            [FeedTypes.DISPLAY_ID_POSTS, FeedTypes.MY_POSTS].includes(
              feedType,
            ) && (
              <>
                <div className={styles.backArrow} onClick={() => resetFeed()}>
                  <ArrowLeftOutlined />
                </div>
                <div className={feedNavClassName(FeedTypes.DISPLAY_ID_POSTS)}>
                  @{user.handle}&nbsp;Posts
                </div>
                <div className={styles.navigationSpacer}></div>
              </>
            )}
          <div
            className={feedNavClassName(FeedTypes.DISCOVER)}
            onClick={() => setFeedType(FeedTypes.DISCOVER)}
          >
            Discover
          </div>
          <div className={styles.navigationSpacer}></div>
          <div
            className={feedNavClassName(FeedTypes.MY_FEED)}
            onClick={() => setFeedType(FeedTypes.MY_FEED)}
          >
            My Feed
          </div>
          <div className={styles.navigationSpacer}></div>
          <div
            className={feedNavClassName(FeedTypes.MY_POSTS)}
            onClick={() => {
              goToProfile(account.dsnpId);
              setFeedType(FeedTypes.MY_POSTS);
            }}
          >
            My Posts
          </div>
        </nav>
        <Button
          className={styles.newPostButton}
          onClick={() => setIsModalOpen(true)}
        >
          New Post
        </Button>
        {isModalOpen && (
          <NewPost
            onSuccess={() => {
              setIsModalOpen(false);
              setIsPosting(true);
              setTimeout(() => {
                setRefreshTrigger(Date.now());
                setIsPosting(false);
              }, 14_000);
            }}
            onCancel={() => setIsModalOpen(false)}
            account={account}
          />
        )}
      </div>
      <Spin spinning={isPosting} size="large" />
      <PostList
        network={network}
        refreshTrigger={refreshTrigger}
        feedType={feedType}
        user={user}
        goToProfile={showProfile}
        resetFeed={resetFeed}
      />
    </div>
  );
};
export default Feed;
