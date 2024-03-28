import React, { useState } from "react";
import { Button, Spin, Form } from "antd";
import Title from "antd/es/typography/Title";
import { getLoginOrRegistrationPayload, setConfig } from "@amplica-labs/siwf";

import * as dsnpLink from "../dsnpLink";
import { UserAccount } from "../types";
import styles from "./Login.module.css";
import { getContext, setAccessToken } from "../service/AuthService";

interface LoginProps {
  onLogin: (account: UserAccount) => void;
  providerId: string;
  nodeUrl: string;
  siwfUrl: string;
}

const Login = ({
  onLogin,
  providerId,
  nodeUrl,
  siwfUrl,
}: LoginProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      setConfig({
        providerId,
        // The url where Wallet-Proxy lives
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
          { name: "broadcast" },
          { name: "reply" },
          { name: "reaction" },
          { name: "profile" },
          { name: "tombstone" },
          { name: "update" },
          { name: "public-follows" },
        ],
      });

      const response = await getLoginOrRegistrationPayload();

      const dsnpLinkNoTokenCtx = getContext();
      const { accessToken, expires } = await dsnpLink.authLogin2(
        dsnpLinkNoTokenCtx,
        {},
        response as dsnpLink.WalletLoginRequest,
      );
      setAccessToken(accessToken, expires);
      const dsnpLinkCtx = getContext();

      // We have to poll for the account creation
      let accountResp: dsnpLink.AuthAccountResponse | null = null;
      const getDsnpAndHandle = async (
        timeout: number,
      ): Promise<null | dsnpLink.AuthAccountResponse> =>
        new Promise((resolve) => {
          setTimeout(async () => {
            const resp = await dsnpLink.authAccount(dsnpLinkCtx, {});
            // Handle the 202 response
            if (resp.size === 0) {
              resolve(null);
            } else {
              resolve(resp);
            }
          }, timeout);
        });
      accountResp = await getDsnpAndHandle(0);
      let tries = 1;
      while (accountResp === null && tries < 10) {
        console.log(
          "Waiting another 3 seconds before getting the account again...",
        );
        accountResp = await getDsnpAndHandle(3_000);
        tries++;
      }
      if (accountResp === null) {
        throw new Error("Account Creation timed out");
      }

      onLogin({
        handle: accountResp.displayHandle || "Anonymous",
        expires,
        accessToken,
        dsnpId: accountResp.dsnpId,
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
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
