import React, { ReactElement } from 'react';
import BroadcastMedia from '../BroadcastMedia/BroadcastMedia';
import ReplyList from '../Replies/ReplyList';
import { ActivityContentAttachment, ActivityContentNote } from '@dsnp/activity-content/types';
import * as dsnpLink from '../../dsnpLink';
import { useGetUser } from '../../service/UserProfileService';
import { buildDSNPContentURI } from '../../helpers/dsnp';
import BroadcastInfo from '../BroadcastInfo/BroadcastInfo';
import BroadcastContent from '../BroadcastContent/BroadcastContent';
import PostMeta from './PostMeta';
import BroadcastCard from '../BroadcastCard/BroadcastCard';
import { BroadcastCardType } from '../../types';

type FeedItem = dsnpLink.BroadcastExtended;

type PostProps = {
  feedItem: FeedItem;
  isProfile?: boolean;
  showLoginModal?: () => void;
};

const Post = ({ feedItem, isProfile, showLoginModal }: PostProps): ReactElement => {
  const { user, isLoading } = useGetUser(feedItem.fromId);
  const content = JSON.parse(feedItem?.content) as ActivityContentNote;

  // TODO: validate content as ActivityContentNote or have DSNP Link do it

  const attachments: ActivityContentAttachment[] = content.attachment || [];

  return (
    <BroadcastCard key={feedItem.contentHash} broadcastCardType={BroadcastCardType.POST} isLoading={isLoading}>
      {!isProfile && <PostMeta user={user} showLoginModal={showLoginModal} feedItemFromId={feedItem.fromId} />}
      <BroadcastInfo feedItem={feedItem} content={content} />
      <BroadcastContent content={content.content} />
      {content?.attachment && content?.attachment?.length > 0 && <BroadcastMedia attachments={attachments} />}

      <ReplyList
        parentURI={buildDSNPContentURI(BigInt(feedItem.fromId), feedItem.contentHash)}
        isLoggedOut={!!user}
        showLoginModal={showLoginModal}
        replies={feedItem.replies || []}
      />
    </BroadcastCard>
  );
};

export default Post;
