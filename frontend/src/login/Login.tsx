import React, { ReactElement, useState } from 'react';
import { Button, Spin, Form } from 'antd';
import Title from 'antd/es/typography/Title';
import { getLoginOrRegistrationPayload, setConfig } from '@amplica-labs/siwf';

import * as dsnpLink from '../dsnpLink';
import { UserAccount } from '../types';
import styles from './Login.module.css';
import { getContext, setAccessToken } from '../service/AuthService';

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

      // Initiate the login process with SIWF
      // This will return a referenceId that we can use to correlate with the webhook callback response
      const { msaId, referenceId, accessToken, expires } =
        await dsnpLink.authLogin(
          dsnpLinkNoTokenCtx,
          {},
          authPayload as dsnpLink.WalletLoginRequest,
        );
      console.log(
        `Login.tsx::handleLogin: dsnpLink.authLogin: msaId:(${msaId}) referenceId:(${referenceId}) accessToken:(${accessToken}) expires:(${expires}`,
      );
      // TODO: Move access token to after receiving webhook callback response
      // setAccessToken(accessToken, expires);
      // const dsnpLinkCtx = getContext();

      // REMOVE: Should this go somewhere else?
      // We need to request the account creation and then we need to wait for the
      // webhook to be called before we can move on to the next step.
      // 1. Request account creation (SIWF with Account Service TXNs)
      //    returns 202 with referenceId
      // 2. Poll authAccount(getAccount) for account created data (gets msaId,handle)
      //    Backend needs refactor: getAccount should return 202 until account is created
      //    Backend webhook can fill-in msaId and handle
      // 3. Get public key with msaId so that we can:
      // 4. Create the accessToken
      // 5. Set all the data in accountResp for display on the FE

      // const resp = await dsnpLink.authAccount(dsnpLinkCtx, {});
      // This should be a 202 response with a reference ID we can correlate with the webhook

      // We have to poll for the account creation
      let accountResp: dsnpLink.AuthAccountResponse | null = null;
      // Check to see if we are in the sign-in flow
      // If so, we have the accessToken and can skip the polling
      if (accessToken && expires && msaId) {
        accountResp = {
          accessToken: accessToken,
          expires: expires,
          msaId: msaId,
          displayHandle: "",
        };
        let resp;
        try {
          // TODO: Is it important to have the the accessToken here?
          resp = await dsnpLink.authAccount(dsnpLinkNoTokenCtx, {
            referenceId: referenceId,
            msaId: msaId,
          });
          accountResp.displayHandle = resp.displayHandle;
        } catch (e) {
          console.error(
            `Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount: error: ${e}`,
          );
          throw new Error(`Account Sign In Failed: (${e})`);
        }
        console.log(
          `Login.tsx::handleLogin: accountResp: ${JSON.stringify(accountResp)}`,
        );
        onLogin({
          handle: accountResp.displayHandle || "Anonymous",
          expires: accountResp.expires,
          accessToken: accountResp.accessToken,
          msaId: accountResp.msaId,
        });
        setIsLoading(false);
        return;
      }

      const getMsaIdAndHandle = async (
        referenceId: string,
        timeout: number,
      ): Promise<null | dsnpLink.AuthAccountResponse> =>
        new Promise((resolve) => {
          setTimeout(async () => {
            console.log(
              `Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount: timeout: ${timeout}, referenceId: ${referenceId}`,
            );
            let resp;
            try {
              // TODO: Is it important to have the the accessToken here?
              resp = await dsnpLink.authAccount(dsnpLinkNoTokenCtx, {
                referenceId: referenceId,
                msaId: msaId,
              });
            } catch (e) {
              // REMOVE: Account Service is throwing an HTTPException:400, swallow it here
              console.error(
                `Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount: error: ${e}`,
              );
            }
            // Handle the 202 response
            // REMOVE:
            console.log(
              `Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount returns Account Response: ${resp}`,
            );

            if (resp.size === 0) {
              console.log(
                `Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount returns resp.size === 0`,
              );
              resolve(null);
            }
            // if (resp.status === 202) {
            //   console.log(`Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount returns 202`);
            //   resolve(null);
            //   return;
            // } else if (resp.status === 200) {
            console.log(
              `Login.tsx::getMsaIdAndHandle: dsnpLink.authAccount returns 200`,
            );
            // Now we have all the data we need to create the accessToken
            resolve({
              accessToken: resp.accessToken,
              expires: resp.expires,
              msaId: resp.msaId,
              displayHandle: resp.displayHandle,
            });
            return;
            // } else {
            //   // REMOVE: What the hell is in resp?
            //   resolve(null);
            // }
          }, timeout);
        });
      console.log(`Start polling for account creation... timeout:(0)`);
      accountResp = await getMsaIdAndHandle(referenceId, 0);
      let tries = 1;
      while (accountResp === null && tries < 10) {
        console.log(
          "Waiting another 3 seconds before getting the account again...",
        );
        console.log(`Continue polling for account creation... timeout:(3000)`);
        accountResp = await getMsaIdAndHandle(referenceId, 3_000);
        tries++;
      }
      if (accountResp === null) {
        throw new Error('Account Creation timed out');
      }

      console.log(
        `Login.tsx::handleLogin: accountResp: ${JSON.stringify(accountResp)}`,
      );
      onLogin({
        handle: accountResp.displayHandle || "Anonymous",
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
