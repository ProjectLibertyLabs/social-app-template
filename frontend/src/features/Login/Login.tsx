import React, { ReactElement, useEffect, useState } from 'react';
import { Spin } from 'antd';
import * as dsnpLink from '../../dsnpLink';
import { UserAccount } from '../../types';
import { ServerConfiguration } from '@typoas/runtime';
import LoginForm from './LoginForm';

const dsnpLinkCtx = process.env.REACT_APP_BACKEND_URL
  ? dsnpLink.createContext({ serverConfiguration: new ServerConfiguration(process.env.REACT_APP_BACKEND_URL, {}) })
  : dsnpLink.createContext();

interface LoginScreenProps {
  onLogin: (account: UserAccount, providerInfo: dsnpLink.ProviderResponse) => void;
  loadingState?: boolean;
}

const Login = ({ onLogin, loadingState = true }: LoginScreenProps): ReactElement => {
  // Assume it has a wallet extension until after we have called enable
  const [isLoading, setIsLoading] = useState<boolean>(loadingState);
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
    <Spin tip="Loading" size="large" spinning={isLoading}>
      {providerInfo && (
        <LoginForm
          providerId={providerInfo.providerId}
          nodeUrl={providerInfo.nodeUrl}
          siwfUrl={providerInfo.siwfUrl}
          onLogin={(account) => onLogin(account, providerInfo)}
        />
      )}
    </Spin>
  );
};

export default Login;
