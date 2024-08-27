import Feed from '../../features/Feed/Feed';
import { FeedTypes, Network, UserAccount } from '../../types';

type MyFeedProps = {
  network: Network;
  isPosting: boolean;
  stopPosting: () => void;
  refreshTrigger: number;
  loggedInAccount: UserAccount;
};

const MyFeed = ({ isPosting, stopPosting, network, refreshTrigger, loggedInAccount }: MyFeedProps) => {
  return (
    <Feed
      feedType={FeedTypes.MY_FEED}
      isPosting={isPosting}
      stopPosting={stopPosting}
      network={network}
      refreshTrigger={refreshTrigger}
      loggedInAccount={loggedInAccount}
    />
  );
};

export default MyFeed;
