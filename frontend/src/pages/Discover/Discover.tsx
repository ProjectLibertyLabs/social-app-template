import Feed from '../../features/Feed/Feed';
import { FeedTypes, Network, UserAccount } from '../../types';

type DiscoverProps = {
  network: Network;
  isPosting: boolean;
  stopPosting: () => void;
  refreshTrigger: number;
  showLoginModal: () => void;
  loggedInAccount: UserAccount;
};

const Discover = ({
  isPosting,
  stopPosting,
  network,
  refreshTrigger,
  showLoginModal,
  loggedInAccount,
}: DiscoverProps) => {
  return (
    <Feed
      feedType={FeedTypes.DISCOVER}
      showLoginModal={showLoginModal}
      isPosting={isPosting}
      stopPosting={stopPosting}
      network={network}
      refreshTrigger={refreshTrigger}
      loggedInAccount={loggedInAccount}
    />
  );
};

export default Discover;
