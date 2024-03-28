import React, { useEffect, useState } from "react";
import { Spin, Row, Col } from "antd";
import * as dsnpLink from "../dsnpLink";
import Login from "./Login";
import { UserAccount } from "../types";
import styles from "./LoginScreen.module.css";

const dsnpLinkCtx = dsnpLink.createContext();

interface LoginScreenProps {
  onLogin: (
    account: UserAccount,
    providerInfo: dsnpLink.ProviderResponse,
  ) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps): JSX.Element => {
  // Assume it has a wallet extension until after we have called enable
  const [isLoading, setIsLoading] = useState(true);
  const [providerInfo, setProviderInfo] = useState<dsnpLink.ProviderResponse>();

  useEffect(() => {
    const getProviderInfo = async () => {
      const fetched = await dsnpLink.authProvider(dsnpLinkCtx, {});
      setProviderInfo(fetched);
      setIsLoading(false);
    };
    getProviderInfo();
  }, [setProviderInfo, setIsLoading]);

  return (
    <div className={styles.root}>
      <Spin tip="Loading" size="large" spinning={isLoading}>
        <Row className={styles.content}>
          {providerInfo && (
            <Col span={24}>
              <Login
                providerId={providerInfo.providerId}
                nodeUrl={providerInfo.nodeUrl}
                siwfUrl={providerInfo.siwfUrl}
                onLogin={(account) => onLogin(account, providerInfo)}
              />
            </Col>
          )}
        </Row>
      </Spin>
    </div>
  );
};

export default LoginScreen;
