import React, { ReactElement, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import { Flex, Popover } from 'antd';
import UserMenu from './UserMenu';
import type { UserAccount } from '../types';
import styles from './Header.module.css';
import Title from 'antd/es/typography/Title';
import LoginScreen from '../login/LoginScreen';
import * as dsnpLink from '../dsnpLink';
import { makeDisplayHandle } from '../helpers/DisplayHandle';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  loggedInAccount?: UserAccount;
  login: (account: UserAccount, providerInfo: dsnpLink.ProviderResponse) => void;
  logout?: () => void;
};

const Header = ({ loggedInAccount, login, logout }: HeaderProps): ReactElement => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      navigate('/');
      logout();
    }
  };

  const handleLogin = (account: UserAccount, providerInfo: dsnpLink.ProviderResponse) => {
    navigate('/');
    login(account, providerInfo);
  };

  return (
    <div className={styles.root}>
      <Flex align={'center'} justify={'space-between'} className={styles.container}>
        <Title level={1} className={styles.title}>
          Social Web Demo
        </Title>
        {loggedInAccount && logout ? (
          <Popover
            className={styles.user}
            placement="bottomRight"
            trigger="click"
            content={<UserMenu logout={handleLogout} />}
          >
            <Flex gap={8}>
              <UserAvatar user={loggedInAccount} avatarSize="small" />
              {makeDisplayHandle(loggedInAccount.handle)}
            </Flex>
          </Popover>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </Flex>
    </div>
  );
};
export default Header;
