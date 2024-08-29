import Feed from '../../features/Feed/Feed';
import { FeedTypes, Network, UserAccount } from '../../types';

type MyFeedProps = {
  network: Network;
  isPosting: boolean;
  handlePostPublished: () => void;
  refreshTrigger: number;
  loggedInAccount: UserAccount;
};

const MyFeed = ({ isPosting, handlePostPublished, network, refreshTrigger, loggedInAccount }: MyFeedProps) => {
  return (
    <Feed
      feedType={FeedTypes.MY_FEED}
      isPosting={isPosting}
      handlePostPublished={handlePostPublished}
      network={network}
      refreshTrigger={refreshTrigger}
      loggedInAccount={loggedInAccount}
    />
  );
};

export default MyFeed;
