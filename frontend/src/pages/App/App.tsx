import React, { ReactElement, useEffect, useState } from 'react';
import styles from './App.module.css';

import useStickyState from '../../helpers/StickyState';

import * as dsnpLink from '../../dsnpLink';
import { Network, UserAccount } from '../../types';
import Header from '../../features/Header/Header';
import { Col, ConfigProvider, Layout, Row, Spin } from 'antd';
import { setAccessToken } from '../../service/AuthService';
import { Content } from 'antd/es/layout/layout';
import { setIpfsGateway } from '../../service/IpfsService';
import AuthErrorBoundary from '../../helpers/AuthErrorBoundary';
import FrequencyWaves from '../../style/frequencyWaves.svg';
import FeedNav from '../../features/FeedNav/FeedNav';
import { BrowserRouter } from 'react-router-dom';
import PageRoutes from '../PageRoutes';
import LoginModal from '../../features/Login/LoginModal';
import { ServerConfiguration } from '@typoas/runtime';
import { setConfig } from '@projectlibertylabs/siwf';

const dsnpLinkCtx = process.env.REACT_APP_BACKEND_URL
  ? dsnpLink.createContext({ serverConfiguration: new ServerConfiguration(process.env.REACT_APP_BACKEND_URL, {}) })
  : dsnpLink.createContext();

const App = (): ReactElement => {
  const [loggedInAccount, setLoggedInAccount] = useStickyState<UserAccount | undefined>(undefined, 'user-account');
  const [loading, setLoading] = useState<boolean>(false);
  const [network, setNetwork] = useState<Network>('testnet');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [providerInfo, setProviderInfo] = useState<dsnpLink.ProviderResponse>();

  if (loggedInAccount) {
    setAccessToken(loggedInAccount.accessToken, loggedInAccount.expires);
  }

  const handleLogin = async (account: UserAccount) => {
    if (!providerInfo) return;
    setLoading(true);
    setAccessToken(account.accessToken, account.expires);
    providerInfo.ipfsGateway && setIpfsGateway(providerInfo.ipfsGateway);
    setNetwork(providerInfo.network);
    setLoggedInAccount(account);
    setLoading(false);
  };

  const handleLogout = () => {
    setLoggedInAccount(undefined);
  };

  const handleIsPosting = () => {
    setIsPosting(true);
    setTimeout(() => {
      setRefreshTrigger(Date.now());
      setIsPosting(false);
    }, 14_000);
  };

  const handleCancel = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (loggedInAccount) setIsLoginModalOpen(false);
  }, [loggedInAccount]);

  useEffect(() => {
    const getProviderInfo = async () => {
      const fetched = await dsnpLink.authProvider(dsnpLinkCtx, {});
      setProviderInfo(fetched);

      // Set the configuration for SIWF
      setConfig({
        providerId: fetched.providerId,
        // The url where SIWF front-end lives
        proxyUrl: fetched.siwfUrl,
        // The Frequency RPC endpoint
        frequencyRpcUrl: fetched.nodeUrl,
        siwsOptions: {
          // The expiration for the SIWS payload.
          expiresInMsecs: 60_000,
        },
        // The Schema name that permissions are being requested.
        // A specified version can be set using the ID attribute.
        // If set to 0 it grabs the latest version for the schema.
        schemas: [
          { name: 'broadcast' },
          { name: 'reply' },
          { name: 'reaction' },
          { name: 'profile' },
          { name: 'tombstone' },
          { name: 'update' },
          { name: 'public-follows' },
        ],
      });
    };
    getProviderInfo();
  }, [setProviderInfo]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5E69FF',
          colorSuccess: '#29fd47',
          colorWarning: '#ff7f0e',
          colorInfo: '#5E69FF',
          fontFamily: 'Poppins, Newake',
        },
      }}
    >
      <BrowserRouter>
        <Spin spinning={!providerInfo}>
          <Layout className={styles.root}>
            <Header loggedInAccount={loggedInAccount} logout={handleLogout} login={handleLogin} />
            <div className={styles.block}>
              <Content className={styles.content}>
                <Spin spinning={loading}>
                  <Row gutter={20}>
                    <Col span={6}>
                      <FeedNav loggedInAccount={loggedInAccount} handleIsPosting={handleIsPosting} />
                    </Col>
                    <Col span={18}>
                      <AuthErrorBoundary onError={() => setLoggedInAccount(undefined)}>
                        <PageRoutes
                          loggedInAccount={loggedInAccount}
                          network={network}
                          isPosting={isPosting}
                          refreshTrigger={refreshTrigger}
                          showLoginModal={() => setIsLoginModalOpen(true)}
                        />
                      </AuthErrorBoundary>
                    </Col>
                  </Row>
                </Spin>
              </Content>
              <LoginModal open={isLoginModalOpen} onLogin={handleLogin} handleCancel={handleCancel} />
            </div>
            <img src={FrequencyWaves} alt={'Frequency Waves'} className={styles.waves} />
          </Layout>
        </Spin>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
