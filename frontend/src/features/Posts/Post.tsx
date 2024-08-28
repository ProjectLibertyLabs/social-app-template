import { ReactElement } from 'react';
import BroadcastMedia from '../BroadcastMedia/BroadcastMedia';
import ReplyList from '../Replies/ReplyList';
import { ActivityContentNote } from '@dsnp/activity-content/types';
import * as dsnpLink from '../../dsnpLink';
import { useGetUser } from '../../service/UserProfileService';
import { buildDSNPContentURI } from '../../helpers/dsnp';
import BroadcastInfo from '../BroadcastInfo/BroadcastInfo';
import BroadcastContent from '../BroadcastContent/BroadcastContent';
import PostMeta from './PostMeta';
import BroadcastCard from '../BroadcastCard/BroadcastCard';
import { BroadcastCardType, UserAccount } from '../../types';

type FeedItem = dsnpLink.BroadcastExtended;

type PostProps = {
  feedItem: FeedItem;
  isProfile?: boolean;
  showLoginModal?: () => void;
  loggedInAccount: UserAccount;
  handleIsReplying: () => void;
  isReplying: boolean;
};

const Post = ({
  feedItem,
  isProfile,
  showLoginModal,
  loggedInAccount,
  handleIsReplying,
  isReplying,
}: PostProps): ReactElement => {
  const { user, isLoading } = useGetUser(feedItem.fromId);
  const content = JSON.parse(feedItem?.content) as ActivityContentNote;

  // TODO: validate content as ActivityContentNote or have DSNP Link do it

  if (!content) return <>Got post with no content</>;

  return (
    <BroadcastCard key={feedItem.contentHash} broadcastCardType={BroadcastCardType.POST} isLoading={isLoading}>
      {!isProfile && <PostMeta user={user} showLoginModal={showLoginModal} feedItemFromId={feedItem.fromId} />}
      <BroadcastInfo feedItem={feedItem} content={content} />
      {content.content && <BroadcastContent content={content.content} />}
      {content.attachment && content.attachment?.length > 0 && <BroadcastMedia attachments={content.attachment} />}
      <ReplyList
        parentURI={buildDSNPContentURI(BigInt(feedItem.fromId), feedItem.contentHash)}
        isLoggedOut={!!loggedInAccount}
        showLoginModal={showLoginModal}
        replies={feedItem.replies || []}
        isReplying={isReplying}
        handleIsReplying={handleIsReplying}
      />
    </BroadcastCard>
  );
};

export default Post;
