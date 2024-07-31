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
  refreshTrigger: number;
  showLoginModal: () => void;
}

const PageRoutes = ({ loggedInAccount, network, isPosting, refreshTrigger, showLoginModal }: PageRoutesProps) => {
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
            />
          }
        />
        {loggedInAccount && (
          <>
            <Route
              path="/my-feed"
              element={<MyFeed network={network} isPosting={isPosting} refreshTrigger={refreshTrigger} />}
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
          </>
        )}
      </Routes>
    </>
  );
};

export default PageRoutes;
