import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import LoginScreen from "./login/LoginScreen";

import useStickyState from "./helpers/StickyState";

import * as dsnpLink from "./dsnpLink";
import { Network, User, UserAccount } from "./types";
import Header from "./chrome/Header";
import Feed from "./Feed";
import { Col, ConfigProvider, Layout, Row, Spin } from "antd";
import { getContext, setAccessToken } from "./service/AuthService";
import { Content } from "antd/es/layout/layout";
import { getUserProfile } from "./service/UserProfileService";
import { HeaderProfile } from "./chrome/HeaderProfile";
import { setIpfsGateway } from "./service/IpfsService";
import AuthErrorBoundary from "./AuthErrorBoundary";

const App = (): JSX.Element => {
  const _fakeUser = {
    address: "0x",
    expiresIn: 100,
    accessToken: "23",
    handle: "handle-test",
    dsnpId: 1,
  };
  const [userAccount, setUserAccount] = useStickyState<UserAccount | undefined>(
    undefined,
    "user-account",
  );
  const [feedUser, setFeedUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [accountFollowing, setAccountFollowing] = useState<string[] | null>(
    null,
  );
  const [network, setNetwork] = useState<Network>("testnet");

  const refreshFollowing = async (account: UserAccount) => {
    const userAccountFollows = await dsnpLink.userFollowing(getContext(), {
      dsnpId: account.dsnpId,
    });
    setAccountFollowing(userAccountFollows);
  };

  useEffect(() => {
    if (userAccount) {
      refreshFollowing(userAccount);
    }
  }, [userAccount]);

  if (userAccount) {
    setAccessToken(userAccount.accessToken, userAccount.expires);
  }

  const handleLogin = async (
    account: UserAccount,
    providerInfo: dsnpLink.ProviderResponse,
  ) => {
    setLoading(true);
    setAccessToken(account.accessToken, account.expires);
    providerInfo.ipfsGateway && setIpfsGateway(providerInfo.ipfsGateway);
    setNetwork(providerInfo.network);
    setUserAccount(account);
    refreshFollowing(account);
    setLoading(false);
  };

  const handleLogout = () => {
    setUserAccount(undefined);
  };

  const goToProfile = async (dsnpId?: string) => {
    setLoading(true);
    if (dsnpId) {
      const profile =
        userAccount.dsnpId === dsnpId
          ? userAccount
          : await getUserProfile(dsnpId);
      setFeedUser(profile || undefined);
    } else {
      setFeedUser(undefined);
    }
    setLoading(false);
  };

  const triggerGraphRefresh = () => {
    setTimeout(() => refreshFollowing(userAccount), 14_000);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4473ec",
          colorSuccess: "#29fd47",
          colorWarning: "#ff7f0e",
          colorInfo: "#4473ec",
        },
      }}
    >
      <Layout className={styles.root}>
        <Header account={userAccount} logout={handleLogout} />
        {!userAccount && (
          <Content className={styles.content}>
            <LoginScreen onLogin={handleLogin} />
          </Content>
        )}
        {userAccount && (
          <Content className={styles.content}>
            <Spin spinning={loading}>
              <Row>
                <Col sm={24} md={12} lg={24 - 8}>
                  <AuthErrorBoundary onError={handleLogout}>
                    <Feed
                      network={network}
                      account={userAccount}
                      user={feedUser}
                      goToProfile={goToProfile}
                    />
                  </AuthErrorBoundary>
                </Col>
                <Col sm={24} md={12} lg={8}>
                  <HeaderProfile
                    triggerGraphRefresh={triggerGraphRefresh}
                    account={userAccount}
                    accountFollowing={accountFollowing || []}
                    user={feedUser}
                    goToProfile={goToProfile}
                  />
                </Col>
              </Row>
            </Spin>
          </Content>
        )}
      </Layout>
    </ConfigProvider>
  );
};

export default App;
