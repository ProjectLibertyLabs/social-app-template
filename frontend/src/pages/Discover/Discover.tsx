import Feed from '../../features/Feed/Feed';
import { FeedTypes, Network } from '../../types';

type DiscoverProps = {
  network: Network;
  isPosting: boolean;
  refreshTrigger: number;
  showLoginModal: () => void;
};

const Discover = ({ isPosting, network, refreshTrigger, showLoginModal }: DiscoverProps) => {
  return (
    <Feed
      feedType={FeedTypes.DISCOVER}
      showLoginModal={showLoginModal}
      isPosting={isPosting}
      network={network}
      refreshTrigger={refreshTrigger}
    />
  );
};

export default Discover;
