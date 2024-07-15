import styles from '../Feed.module.css';
import { FeedTypes, UserAccount } from '../types';
import { CompassOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { makeDisplayHandle } from '../helpers/DisplayHandle';
import { Flex } from 'antd';
import NewPost from '../NewPost';
import { useNavigate } from 'react-router-dom';

interface FeedNavProps {
  handleIsPosting: () => void;
  loggedInAccount: UserAccount;
}

const FeedNav = ({ handleIsPosting, loggedInAccount }: FeedNavProps) => {
  const navigate = useNavigate();

  const feedNavClassName = (path: string): string => {
    const activeStyles = [styles.navigationItem, styles['navigationItem--active']].join(' ');
    const defaultStyles = styles.navigationItem;
    const currentPath = window.location.pathname;

    const isActive = (condition: boolean) => (condition ? activeStyles : defaultStyles);

    switch (path) {
      case '/':
        return isActive(currentPath === '/');
      case '/my-feed':
        return isActive(currentPath.startsWith('/my-feed'));
      case '/profile':
        return isActive(currentPath.endsWith(`/${loggedInAccount.msaId}`));
      default:
        return defaultStyles;
    }
  };

  return (
    <nav className={styles.navigation}>
      <Flex gap={'large'} vertical={true}>
        <div className={feedNavClassName('/')} onClick={() => navigate('/')}>
          <Flex gap={'small'}>
            <CompassOutlined />
            Discover
          </Flex>
        </div>
        {loggedInAccount && (
          <>
            <div className={feedNavClassName('/my-feed')} onClick={() => navigate('/my-feed')}>
              <Flex gap={'small'}>
                <HomeOutlined />
                My Feed
              </Flex>
            </div>
            <div className={feedNavClassName('/profile')} onClick={() => navigate(`/profile/${loggedInAccount.msaId}`)}>
              <Flex gap={'small'}>
                <UserOutlined />
                Profile
              </Flex>
            </div>
            <NewPost handleIsPosting={handleIsPosting} loggedInAccount={loggedInAccount} />
          </>
        )}
      </Flex>
    </nav>
  );
};

export default FeedNav;
