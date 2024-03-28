import React from "react";
import UserAvatar from "./UserAvatar";
import { Popover } from "antd";
import UserMenu from "./UserMenu";
import type { UserAccount } from "../types";
import styles from "./Header.module.css";
import Title from "antd/es/typography/Title";

type HeaderProps = {
  account?: UserAccount;
  logout?: () => void;
};

const Header = ({ account, logout }: HeaderProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <Title level={1} className={styles.title}>
        Social Web Demo
      </Title>
      {account && logout && (
        <Popover
          className={styles.user}
          placement="bottomRight"
          trigger="click"
          content={<UserMenu logout={logout} />}
        >
          <UserAvatar user={account} avatarSize="small" />
          {account.handle}
        </Popover>
      )}
    </div>
  );
};
export default Header;
