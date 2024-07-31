import Feed from '../../features/Feed/Feed';
import { FeedTypes, Network } from '../../types';

type DiscoverProps = {
  network: Network;
  isPosting: boolean;
  refreshTrigger: number;
  showReplyInput: boolean;
  showLoginModal: () => void;
};

const Discover = ({ isPosting, network, refreshTrigger, showReplyInput, showLoginModal }: DiscoverProps) => {
  return (
    <Feed
      feedType={FeedTypes.DISCOVER}
      showReplyInput={showReplyInput}
      showLoginModal={showLoginModal}
      isPosting={isPosting}
      network={network}
      refreshTrigger={refreshTrigger}
    />
  );
};

export default Discover;
