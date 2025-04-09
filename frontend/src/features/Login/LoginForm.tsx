import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Spin, Form } from 'antd';
import * as dsnpLink from '../../dsnpLink';
import { UserAccount, Handle } from '../../types';
import { getContext } from '../../service/AuthService';
import { getLoginOrRegistrationPayload, setConfig } from '@projectlibertylabs/siwf';

interface LoginProps {
  onLogin: (account: UserAccount) => void;
  providerId: string;
  nodeUrl: string;
  siwfUrl: string;
}

interface AccountData {
  handle?: Handle;
  expires?: number;
  accessToken?: string;
  msaId?: string;
}

const LoginForm = ({ onLogin, providerId, nodeUrl, siwfUrl }: LoginProps): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState<AccountData>({});


  useEffect(() => {
    const sse = new EventSource(`${process.env.REACT_APP_BACKEND_URL}/auth/events`);
    
    const handleAccountCreated = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        
        if (!data.handle || !data.msaId) {
          return;
        }

        setAccountData(prev => {
          const newData = {
            ...prev,
            handle: data.handle,
            msaId: data.msaId
          };
          return newData;
        });
      } catch (error) {
      }
    };

    sse.addEventListener('account_created', handleAccountCreated);

    return () => {
      sse.removeEventListener('account_created', handleAccountCreated);
      sse.close();
    };
  }, []);

  useEffect(() => {
    const { handle, expires, accessToken, msaId } = accountData;
    
    if (handle && expires && accessToken && msaId) {
      onLogin({
        handle,
        expires,
        accessToken,
        msaId
      });
    }
  }, [accountData, onLogin]);

  const handleLoginSiwaV2 = async () => {
    try {
      const context = getContext();
      const { redirectUrl } = await dsnpLink.authLoginV2SiwfGet(context, {});
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      setConfig({
        providerId,
        proxyUrl: siwfUrl,
        frequencyRpcUrl: nodeUrl,
        siwsOptions: {
          expiresInMsecs: 60_000,
        },
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

      const authPayload = await getLoginOrRegistrationPayload();
      const dsnpLinkNoTokenCtx = getContext();

      const loginResponse = await dsnpLink.authLogin(
        dsnpLinkNoTokenCtx,
        {},
        authPayload as dsnpLink.WalletLoginRequest
      );

      const { msaId, referenceId, accessToken, expires, handle } = loginResponse;
      
      setAccountData(prev => {
        const newData = {
          ...prev,
          handle,
          expires,
          accessToken,
          msaId
        };
        return newData;
      });

      if (accessToken && expires && msaId) {
        try {
          const resp = await dsnpLink.authAccount(dsnpLinkNoTokenCtx, {
            referenceId,
            msaId,
          });
          
          setAccountData(prev => {
            const newData = {
              ...prev,
              handle: resp.handle
            };
            return newData;
          });
        } catch (e) {
          console.error('Account verification failed:', e);
        }
      }
    } catch (e) {
      console.error('Login failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form layout="vertical" size="large">
      <Spin tip="Loading" size="large" spinning={isLoading}>
        <Form.Item label="">
          <div>
            <Button type="primary" onClick={handleLogin}>
              Signup / Login with Frequency
            </Button>
          </div>
          <div style={{ textAlign: 'center' }}>OR</div>
          <div>
            <Button type="primary" onClick={handleLoginSiwaV2}>
              Signup / Login with Frequency V2
            </Button>
          </div>
        </Form.Item>
      </Spin>
    </Form>
  );
};

export default LoginForm;