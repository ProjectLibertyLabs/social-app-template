import React, { ReactElement } from 'react';
import { Card, Flex, Spin } from 'antd';
import UserAvatar from '../chrome/UserAvatar';
import RelativeTime from '../helpers/RelativeTime';
import ReplyBlock from './ReplyBlock';
import PostHashDropdown from './PostHashDropdown';
import { FromTitle } from './FromTitle';
import { ActivityContentNote } from '@dsnp/activity-content/types';
import { Anchorme } from 'react-anchorme';
import * as dsnpLink from '../dsnpLink';
import { useGetUser } from '../service/UserProfileService';
import { buildDSNPContentURI } from '../helpers/dsnp';
import styles from './Post.module.css';
import { PostLoadingType } from '../types';

type FeedItem = dsnpLink.BroadcastExtended;

type ReplyProps = {
  feedItem: FeedItem;
  isReplying: boolean;
  handleIsPosting: (postLoadingType: PostLoadingType) => void;
};

const Reply = ({ feedItem, isReplying, handleIsPosting }: ReplyProps): ReactElement => {
  const { user, isLoading } = useGetUser(feedItem.fromId);
  const content = JSON.parse(feedItem?.content) as ActivityContentNote;

  return (
    <Card key={feedItem.contentHash} className={styles.card} bordered={true}>
      <Spin tip="Loading" size="large" spinning={isLoading}>
        <Flex gap={12} vertical>
          <Card.Meta
            className={styles.metaInnerBlock}
            avatar={<UserAvatar user={user} avatarSize={'small'} />}
            title={<FromTitle user={user} />}
          />
          <div className={styles.time}>
            <PostHashDropdown hash={feedItem.contentHash} fromId={feedItem.fromId} />
            {content?.published && <RelativeTime published={content?.published} />}
          </div>
          {content && (
            <div className={styles.caption}>
              <Anchorme target="_blank" rel="noreferrer noopener">
                {content?.content}
              </Anchorme>
            </div>
          )}
          <ReplyBlock
            parentURI={buildDSNPContentURI(BigInt(feedItem.fromId), feedItem.contentHash)}
            showReplyInput={false}
            replies={feedItem.replies || []}
            isReplying={isReplying}
            handleIsPosting={handleIsPosting}
          />
        </Flex>
      </Spin>
    </Card>
  );
};

export default Reply;
