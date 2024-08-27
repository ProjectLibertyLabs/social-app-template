import { Route, Routes } from 'react-router-dom';
import { Network, UserAccount } from '../types';
import ProfilePage from './Profile/ProfilePage';
import React from 'react';
import Discover from './Discover/Discover';
import MyFeed from './MyFeed/MyFeed';

interface PageRoutesProps {
  loggedInAccount: UserAccount;
  network: Network;
  isPosting: boolean;
  stopPosting: () => void;
  refreshTrigger: number;
  showLoginModal: () => void;
}

const PageRoutes = ({
  stopPosting,
  loggedInAccount,
  network,
  isPosting,
  refreshTrigger,
  showLoginModal,
}: PageRoutesProps) => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Discover
              network={network}
              isPosting={isPosting}
              refreshTrigger={refreshTrigger}
              showLoginModal={showLoginModal}
              stopPosting={stopPosting}
              loggedInAccount={loggedInAccount}
            />
          }
        />
        {loggedInAccount && (
          <>
            <Route
              path="/my-feed"
              element={
                <MyFeed
                  network={network}
                  isPosting={isPosting}
                  refreshTrigger={refreshTrigger}
                  stopPosting={stopPosting}
                  loggedInAccount={loggedInAccount}
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
                  stopPosting={stopPosting}
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
