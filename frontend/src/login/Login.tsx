import React, { ReactElement, useState } from 'react';
import { Button, Spin, Form } from 'antd';
import Title from 'antd/es/typography/Title';
import { getLoginOrRegistrationPayload, setConfig } from '@amplica-labs/siwf';

import * as dsnpLink from '../dsnpLink';
import { UserAccount } from '../types';
import styles from './Login.module.css';
import { getContext } from '../service/AuthService';

/**
 * Props for the Login component.
 */
interface LoginProps {
  /**
   * Callback function to be called when the user logs in.
   * @param account - The user account information.
   */
  onLogin: (account: UserAccount) => void;

  /**
   * The ID of the provider used for authentication.
   */
  providerId: string;

  /**
   * The URL of the Frequency RPC endpoint.
   */
  nodeUrl: string;

  /**
   * The URL of the SIWF/Wallet-Proxy server.
   */
  siwfUrl: string;
}

/**
 * Represents the login component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onLogin - The callback function to be called when the user logs in.
 * @param {string} props.providerId - The ID of the provider.
 * @param {string} props.nodeUrl - The URL of the Frequency RPC endpoint.
 * @param {string} props.siwfUrl - The URL where Wallet-Proxy lives.
 * @returns {JSX.Element} The rendered login component.
 */
const Login = ({ onLogin, providerId, nodeUrl, siwfUrl }: LoginProps): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      // Set the configuration for SIWF
      setConfig({
        providerId,
        // The url where SIWF front-end lives
        proxyUrl: siwfUrl,
        // The Frequency RPC endpoint
        frequencyRpcUrl: nodeUrl,
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

      // This is the first step in the login process.
      // We need to get the payload from SIWF to send to the Wallet-Proxy
      const authPayload = await getLoginOrRegistrationPayload();

      const dsnpLinkNoTokenCtx = getContext();

      // Initiate the SIWF login process with the backend
      // This will return a referenceId that we can use to correlate with the webhook callback response from the backend
      const { msaId, referenceId, accessToken, expires, handle } = await dsnpLink.authLogin(
        dsnpLinkNoTokenCtx,
        {},
        authPayload as dsnpLink.WalletLoginRequest
      );

      // In the Sign Up flow, poll the backend for completion of the account creation
      // In the Sign In flow, we have the accessToken and can skip the polling
      let accountResp: dsnpLink.AuthAccountResponse | null = null;
      // Check to see if we are in the sign-in flow
      // If so, we have the accessToken and can skip the polling
      if (accessToken && expires && msaId) {
        accountResp = {
          accessToken: accessToken,
          expires: expires,
          msaId: msaId,
          handle: handle,
        };
        let resp;
        try {
          resp = await dsnpLink.authAccount(dsnpLinkNoTokenCtx, {
            referenceId: referenceId,
            msaId: msaId,
          });
          accountResp.handle = resp.handle;
        } catch (e) {
          console.error(`Login.tsx::handleLogin: dsnpLink.authAccount: error: ${e}`);
          throw new Error(`Account Sign In Failed: (${e})`);
        }
        onLogin({
          handle: accountResp.handle,
          expires: accountResp.expires,
          accessToken: accountResp.accessToken,
          msaId: accountResp.msaId,
        });
        setIsLoading(false);
        return;
      }

      /**
       * Retrieves the MSA ID and handle asynchronously, used in the SIWF Sign Up flow.
       * @param referenceId - The reference ID.
       * @param timeout - The timeout value in milliseconds.
       * @returns A Promise that resolves to either null or an instance of `dsnpLink.AuthAccountResponse`.
       */
      const getMsaIdAndHandle = async (
        referenceId: string,
        timeout: number
      ): Promise<null | dsnpLink.AuthAccountResponse> =>
        new Promise((resolve) => {
          setTimeout(async () => {
            let resp;
            try {
              // Use the referenceId to poll the backend for the account creation
              resp = await dsnpLink.authAccount(dsnpLinkNoTokenCtx, {
                referenceId: referenceId,
              });
            } catch (e) {
              console.error(`Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount: error: ${e}`);
              throw new Error(`Account Sign In Failed: (${e})`);
            }

            if (resp.size === 0) {
              resolve(null);
            }
            resolve({
              accessToken: resp.accessToken,
              expires: resp.expires,
              msaId: resp.msaId,
              handle: resp.displayHandle,
            });
          }, timeout);
        });
      console.log(`Start polling for SIWF account creation... timeout:(0)`);
      accountResp = await getMsaIdAndHandle(referenceId, 0);
      let tries = 1;
      while (accountResp === null && tries < 10) {
        console.log('Waiting another 3 seconds before getting the account again...');
        accountResp = await getMsaIdAndHandle(referenceId, 3_000);
        tries++;
      }
      if (accountResp === null) {
        throw new Error('Account Creation timed out');
      }

      onLogin({
        handle: accountResp.handle,
        expires: accountResp.expires,
        accessToken: accountResp.accessToken,
        msaId: accountResp.msaId,
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.root}>
      <Title level={2}>Login / Signup to Get Started</Title>
      <div>
        <Form layout="vertical" size="large">
          <Spin tip="Loading" size="large" spinning={isLoading}>
            <Form.Item label="">
              <Button type="primary" onClick={handleLogin}>
                Signup / Login with Frequency
              </Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default Login;
