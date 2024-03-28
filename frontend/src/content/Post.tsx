import React, { useState } from "react";
import { Card, Spin } from "antd";
import UserAvatar from "../chrome/UserAvatar";
import PostMedia from "./PostMedia";
import RelativeTime from "../helpers/RelativeTime";
import ReplyBlock from "./ReplyBlock";
import PostHashDropdown from "./PostHashDropdown";
import { FromTitle } from "./FromTitle";
import {
  ActivityContentNote,
  ActivityContentAttachment,
} from "@dsnp/activity-content/types";
import { Anchorme } from "react-anchorme";
import * as dsnpLink from "../dsnpLink";
import { useGetUser } from "../service/UserProfileService";
import { buildDSNPContentURI } from "../helpers/dsnp";
import styles from "./Post.module.css";

type FeedItem = dsnpLink.BroadcastExtended;

type PostProps = {
  feedItem: FeedItem;
  goToProfile: (dsnpId?: string) => void;
  showReplyInput: boolean;
};

const Post = ({
  feedItem,
  goToProfile,
  showReplyInput,
}: PostProps): JSX.Element => {
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const { user, isLoading } = useGetUser(feedItem.fromId);

  const content = JSON.parse(feedItem?.content) as ActivityContentNote;

  // TODO: validate content as ActivityContentNote or have DSNP Link do it

  const attachments: ActivityContentAttachment[] = content.attachment || [];

  return (
    <Card key={feedItem.contentHash} className={styles.root} bordered={false}>
      <Spin tip="Loading" size="large" spinning={isLoading}>
        <div
          onClick={() => goToProfile(feedItem.fromId)}
          onMouseEnter={() => setIsHoveringProfile(true)}
          onMouseLeave={() => setIsHoveringProfile(false)}
          className={styles.metaBlock}
        >
          <Card.Meta
            className={styles.metaInnerBlock}
            avatar={<UserAvatar user={user} avatarSize={"medium"} />}
            title={<FromTitle user={user} goToProfile={goToProfile} />}
          />
        </div>
        <div className={styles.time}>
          {content?.published && (
            <RelativeTime published={content?.published} postStyle={true} />
          )}
          <PostHashDropdown
            hash={feedItem.contentHash}
            fromId={feedItem.fromId}
          />
        </div>
        <>
          {content && (
            <div className={styles.caption}>
              <Anchorme target="_blank" rel="noreferrer noopener">
                {content?.content}
              </Anchorme>
            </div>
          )}
          {content?.attachment && <PostMedia attachments={attachments} />}
        </>
        <ReplyBlock
          parentURI={buildDSNPContentURI(
            BigInt(feedItem.fromId),
            feedItem.contentHash,
          )}
          showReplyInput={showReplyInput}
          goToProfile={goToProfile}
          replies={feedItem.replies || []}
        />
      </Spin>
    </Card>
  );
};

export default Post;
