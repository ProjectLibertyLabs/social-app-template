import { Route, Routes } from 'react-router-dom';
import { Network, UserAccount } from '../types';
import ProfilePage from './Profile/ProfilePage';
import React from 'react';
import Discover from './Discover/Discover';
import MyFeed from './MyFeed/MyFeed';
import Callback from './Callback/Callback';

interface PageRoutesProps {
  loggedInAccount: UserAccount;
  network: Network;
  isPosting: boolean;
  handlePostPublished: () => void;
  refreshTrigger: number;
  showLoginModal: () => void;
  onLogin: (account: UserAccount, providerInfo: any) => void;
}

const PageRoutes = ({
  handlePostPublished,
  loggedInAccount,
  network,
  isPosting,
  refreshTrigger,
  showLoginModal,
  onLogin,
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
              handlePostPublished={handlePostPublished}
              loggedInAccount={loggedInAccount}
            />
          }
        />
        <Route path="/login/callback" element={<Callback onLogin={onLogin} />} />
        {loggedInAccount && (
          <>
            <Route
              path="/my-feed"
              element={
                <MyFeed
                  network={network}
                  isPosting={isPosting}
                  refreshTrigger={refreshTrigger}
                  handlePostPublished={handlePostPublished}
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
                  handlePostPublished={handlePostPublished}
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
