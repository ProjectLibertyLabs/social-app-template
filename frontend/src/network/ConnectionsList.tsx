import React, { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import ConnectionsListProfiles from "./ConnectionsListProfiles";
import styles from "./ConnectionsList.module.css";
import { User, UserAccount } from "../types";
import Title from "antd/es/typography/Title";
import * as dsnpLink from "../dsnpLink";
import { getContext } from "../service/AuthService";

type ConnectionsListProps = {
  account: UserAccount;
  accountFollowing: string[];
  graphRootUser: User;
  triggerGraphRefresh: () => void;
  goToProfile: (dsnpId?: string) => void;
};

const ConnectionsList = ({
  account,
  graphRootUser,
  accountFollowing,
  triggerGraphRefresh,
  goToProfile,
}: ConnectionsListProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionsList, setConnectionsList] = useState<User[]>([]);

  const fetchConnections = async () => {
    const ctx = getContext();

    const accountFollowingList = await dsnpLink.userFollowing(ctx, {
      dsnpId: graphRootUser.dsnpId,
    });

    const list: User[] = await Promise.all(
      accountFollowingList.map((dsnpId) =>
        dsnpLink
          .getProfile(ctx, { dsnpId })
          .then(({ displayHandle, fromId, content }) => {
            try {
              const profile = content ? JSON.parse(content) : {};
              return {
                handle: displayHandle || "",
                dsnpId: fromId,
                profile: profile,
              };
            } catch (e) {
              console.error(e);
              return {
                handle: displayHandle || "",
                dsnpId: fromId,
                profile: {},
              };
            }
          }),
      ),
    );
    setConnectionsList(list);
    setIsLoading(false);
  };

  // Update again when accountFollowing changes.
  useEffect(() => {
    fetchConnections();
  }, [graphRootUser, accountFollowing]);

  return (
    <Spin spinning={isLoading} tip="Loading" size="large">
      <div className={styles.root}>
        <Title level={3}>Following ({connectionsList.length})</Title>
        <ConnectionsListProfiles
          goToProfile={goToProfile}
          key={accountFollowing.length}
          triggerGraphRefresh={triggerGraphRefresh}
          account={account}
          connectionsList={connectionsList}
          accountFollowing={accountFollowing}
        />
      </div>
    </Spin>
  );
};

export default ConnectionsList;
