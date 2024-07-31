import Feed from '../../features/Feed/Feed';
import { FeedTypes, Network, UserAccount } from '../../types';

type MyFeedProps = {
  network: Network;
  isPosting: boolean;
  refreshTrigger: number;
};

const MyFeed = ({ isPosting, network, refreshTrigger }: MyFeedProps) => {
  return <Feed feedType={FeedTypes.MY_FEED} isPosting={isPosting} network={network} refreshTrigger={refreshTrigger} />;
};

export default MyFeed;
