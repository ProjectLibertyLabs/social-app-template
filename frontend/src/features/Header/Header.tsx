import React, { ReactElement } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { Flex, Popover } from 'antd';
import type { UserAccount } from '../../types';
import styles from './Header.module.css';
import Title from 'antd/es/typography/Title';
import Login from '../Login/Login';
import * as dsnpLink from '../../dsnpLink';
import { makeDisplayHandle } from '../../helpers/DisplayHandle';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';

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

  // Read the title from the environment variable
  console.log(process.env.REACT_APP_TITLE);
  const title = process.env.REACT_APP_TITLE || 'Social Web Demo';
  const headerBgColor = process.env.REACT_APP_HEADER_BG_COLOR || '#ffffff';

  return (
    <div className={styles.root} style={{ backgroundColor: headerBgColor }}>
      <Flex align={'center'} justify={'space-between'} className={styles.container}>
        <Title level={1} className={styles.title}>
          {title}
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
          <Login onLogin={handleLogin} />
        )}
      </Flex>
    </div>
  );
};
export default Header;
