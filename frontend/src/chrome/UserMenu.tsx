import React, { useState } from "react";
import { Button } from "antd";
import styles from "./UserMenu.module.css";

interface UserMenuProps {
  logout: () => void;
}

const UserMenu = ({ logout }: UserMenuProps): JSX.Element => {
  return (
    <Button className={styles.Signout} aria-label="Logout" onClick={logout}>
      Sign Out
    </Button>
  );
};

export default UserMenu;
