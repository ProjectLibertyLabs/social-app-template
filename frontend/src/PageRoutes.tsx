import { Route, Routes } from 'react-router-dom';
import Feed from './Feed';
import { FeedTypes, Network, UserAccount } from './types';
import ProfilePage from './chrome/ProfilePage';
import React from 'react';

interface PageRoutesProps {
  loggedInAccount: UserAccount;
  network: Network;
  isPosting: boolean;
  refreshTrigger: number;
}

const PageRoutes = ({ loggedInAccount, network, isPosting, refreshTrigger }: PageRoutesProps) => {
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
              refreshTrigger={refreshTrigger}
            />
          }
        />
        <Route
          path="/my-feed"
          element={
            <Feed
              network={network}
              feedType={FeedTypes.MY_FEED}
              isPosting={isPosting}
              refreshTrigger={refreshTrigger}
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
            />
          }
        />
      </Routes>
    </>
  );
};

export default PageRoutes;
