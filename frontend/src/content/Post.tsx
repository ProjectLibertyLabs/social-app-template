import React, { ReactElement } from 'react';
import { Card, Spin } from 'antd';
import UserAvatar from '../chrome/UserAvatar';
import PostMedia from './PostMedia';
import RelativeTime from '../helpers/RelativeTime';
import ReplyBlock from './ReplyBlock';
import PostHashDropdown from './PostHashDropdown';
import { FromTitle } from './FromTitle';
import { ActivityContentNote, ActivityContentAttachment } from '@dsnp/activity-content/types';
import { Anchorme } from 'react-anchorme';
import * as dsnpLink from '../dsnpLink';
import { useGetUser } from '../service/UserProfileService';
import { buildDSNPContentURI } from '../helpers/dsnp';
import styles from './Post.module.css';
import { useNavigate } from 'react-router-dom';

type FeedItem = dsnpLink.BroadcastExtended;

type PostProps = {
  feedItem: FeedItem;
  showReplyInput: boolean;
  isProfile?: boolean;
  showLoginModal?: () => void;
};

const Post = ({ feedItem, showReplyInput, isProfile, showLoginModal }: PostProps): ReactElement => {
  const navigate = useNavigate();
  const { user, isLoading } = useGetUser(feedItem.fromId);

  const content = JSON.parse(feedItem?.content) as ActivityContentNote;

  // TODO: validate content as ActivityContentNote or have DSNP Link do it

  const attachments: ActivityContentAttachment[] = content.attachment || [];

  return (
    <Card key={feedItem.contentHash} className={styles.card} bordered={true}>
      <Spin tip="Loading" size="large" spinning={isLoading}>
        {!isProfile && (
          <div
            onClick={() =>
              showReplyInput ? navigate(`/profile/${feedItem.fromId}`) : showLoginModal && showLoginModal()
            }
            className={styles.metaBlock}
          >
            <Card.Meta
              className={styles.metaInnerBlock}
              avatar={<UserAvatar user={user} avatarSize={'medium'} />}
              title={<FromTitle user={user} showLoginModal={showLoginModal} isLoggedOut={showReplyInput} />}
            />
          </div>
        )}
        <div className={styles.time}>
          <PostHashDropdown hash={feedItem.contentHash} fromId={feedItem.fromId} />
          {content?.published && <RelativeTime published={content?.published} />}
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
          parentURI={buildDSNPContentURI(BigInt(feedItem.fromId), feedItem.contentHash)}
          showReplyInput={showReplyInput}
          replies={feedItem.replies || []}
        />
      </Spin>
    </Card>
  );
};

export default Post;
