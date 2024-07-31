import React, { ReactElement } from 'react';
import { ActivityContentNote } from '@dsnp/activity-content/types';
import * as dsnpLink from '../../dsnpLink';
import { useGetUser } from '../../service/UserProfileService';
import BroadcastContent from '../BroadcastContent/BroadcastContent';
import BroadcastInfo from '../BroadcastInfo/BroadcastInfo';
import ReplyMeta from './ReplyMeta';
import BroadcastCard from '../BroadcastCard/BroadcastCard';
import { BroadcastCardType } from '../../types';

type FeedItem = dsnpLink.BroadcastExtended;

type ReplyProps = {
  feedItem: FeedItem;
  showLoginModal?: () => void;
};

const Reply = ({ feedItem, showLoginModal }: ReplyProps): ReactElement => {
  const { user, isLoading } = useGetUser(feedItem.fromId);
  const content = JSON.parse(feedItem?.content) as ActivityContentNote;

  return (
    <BroadcastCard key={feedItem.contentHash} broadcastCardType={BroadcastCardType.REPLY} isLoading={isLoading}>
      <ReplyMeta showLoginModal={showLoginModal} user={user} feedItemFromId={feedItem.fromId} />
      <BroadcastInfo feedItem={feedItem} content={content} />
      <BroadcastContent content={content.content} />
    </BroadcastCard>
  );
};

export default Reply;
