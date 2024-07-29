import { Navigate, Route, Routes } from 'react-router-dom';
import Feed from './Feed';
import { FeedTypes, Network, PostLoadingType, UserAccount } from './types';
import ProfilePage from './chrome/ProfilePage';
import React from 'react';

interface PageRoutesProps {
  loggedInAccount: UserAccount;
  network: Network;
  isPosting: boolean;
  isReplying: boolean;
  refreshTrigger: number;
  showLoginModal: () => void;
  handleIsPosting: (postLoadingType: PostLoadingType) => void;
}

const PageRoutes = ({
  loggedInAccount,
  network,
  isPosting,
  isReplying,
  refreshTrigger,
  showLoginModal,
  handleIsPosting,
}: PageRoutesProps) => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Feed
              network={network}
              feedType={FeedTypes.DISCOVER}
              isPosting={isPosting}
              isReplying={isReplying}
              refreshTrigger={refreshTrigger}
              showReplyInput={!!loggedInAccount}
              showLoginModal={showLoginModal}
              handleIsPosting={handleIsPosting}
            />
          }
        />
        {loggedInAccount && (
          <>
            <Route
              path="/my-feed"
              element={
                <Feed
                  network={network}
                  feedType={FeedTypes.MY_FEED}
                  isPosting={isPosting}
                  refreshTrigger={refreshTrigger}
                  isReplying={isReplying}
                  handleIsPosting={handleIsPosting}
                />
              }
            />
            <Route
              path="/profile/:dsnpId"
              element={
                <ProfilePage
                  network={network}
                  refreshTrigger={refreshTrigger}
                  isPosting={isPosting}
                  loggedInAccount={loggedInAccount}
                  isReplying={isReplying}
                  handleIsPosting={handleIsPosting}
                />
              }
            />
          </>
        )}
      </Routes>
    </>
  );
};

export default PageRoutes;
