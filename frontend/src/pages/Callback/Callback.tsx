import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as dsnpLink from '../../dsnpLink';
import { getContext } from '../../service/AuthService';
import { Handle, UserAccount } from '../../types';
import { Content } from 'antd/es/layout/layout';
import { Alert, Button, Space, Spin, Typography } from 'antd';

interface CallbackProps {
  onLogin: (account: UserAccount, providerInfo: dsnpLink.ProviderResponse) => void;
}

interface PollingConfig {
  maxAttempts: number;
  intervalMs: number;
  timeoutMs: number;
}

/**
 * Represents an error that occurs during API calls.
 *
 * @class ApiError
 * @extends {Error}
 */
class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly attempt?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const DEFAULT_POLLING_CONFIG: PollingConfig = {
  maxAttempts: 10,
  intervalMs: 2000,
  timeoutMs: 30000,
};

/**
 * Polls for the account status until the account is created or the polling is aborted.
 *
 * @param {string} accountId - The ID of the account to poll for.
 * @param {PollingConfig} [config={}] - Optional configuration for polling, such as interval and timeout.
 * @returns {Promise<AccountStatus>} A promise that resolves to the account status once the account is created.
 * @throws {Error} If the polling is aborted or an error occurs during polling.
 */
const pollForAccount = async (
  accountId: string,
  config: Partial<PollingConfig> = {}
): Promise<dsnpLink.AuthAccountResponse> => {
  const finalConfig = { ...DEFAULT_POLLING_CONFIG, ...config };
  const startTime = Date.now();

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime > finalConfig.timeoutMs) {
      throw new ApiError(`Polling timed out after ${finalConfig.timeoutMs}ms`, 408, attempt);
    }

    try {
      const response = await getAccountById(accountId);

      if (response && Object.keys(response).length > 0) {
        return response;
      }

      if (attempt < finalConfig.maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, finalConfig.intervalMs));
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === 404) {
        if (attempt === finalConfig.maxAttempts) {
          throw new ApiError(`Account not found after ${attempt} attempts`, 404, attempt);
        }

        await new Promise((resolve) => setTimeout(resolve, finalConfig.intervalMs));
        continue;
      }

      throw error;
    }
  }

  throw new ApiError(`Account not found after ${finalConfig.maxAttempts} attempts`, 404, finalConfig.maxAttempts);
};

interface AuthResult {
  msaId?: string;
  controlKey?: string;
  accessToken: string;
  expires: number;
}

/**
 * Parameters required for authorization.
 *
 * @interface AuthParams
 * @property {string | null} authorizationCode - The authorization code.
 * @property {string | null} authorizationPayload - The authorization payload.
 */
interface AuthParams {
  authorizationCode: string | null;
  authorizationPayload: string | null;
}

/**
 * Verifies the authorization using the provided parameters.
 *
 * @async
 * @function verifyAuthorization
 * @param {AuthParams} params - The parameters required for authorization.
 * @returns {Promise<AuthResult>} A promise that resolves to the authorization result.
 * @throws {ApiError} If the access token cannot be retrieved.
 */
const verifyAuthorization = async (params: AuthParams): Promise<AuthResult> => {
  const { authorizationCode, authorizationPayload } = params;

  const { msaId, controlKey, accessToken, expires } = await dsnpLink.verifyFrequencyAccessAuth(
    getContext(),
    {},
    { authorizationCode, authorizationPayload }
  );

  if (!accessToken) {
    throw new ApiError('Failed to get access token', 401);
  }

  if (!expires) {
    throw new ApiError('Failed to get token expiration', 401);
  }

  return { msaId, controlKey, accessToken, expires: Number(expires) };
};

/**
 * Fetches the account information by account ID.
 *
 * @async
 * @function getAccountById
 * @param {string} accountId - The ID of the account to fetch.
 * @returns {Promise<dsnpLink.AuthAccountResponse>} A promise that resolves to the account information.
 * @throws {ApiError} If the account is not found or another error occurs.
 */
const getAccountById = async (accountId: string): Promise<dsnpLink.AuthAccountResponse> => {
  if (!accountId) {
    throw new ApiError('Account ID is required', 400);
  }

  try {
    const context = getContext();
    const response = await dsnpLink.authAccount(context, { accountId });

    if (!response) {
      throw new ApiError('Account not found', 404);
    }

    return response;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.code === 404) {
      throw new ApiError('Account not found', 404);
    }

    throw new ApiError(error.message || 'Failed to fetch account', error.code || 500);
  }
};

/**
 * Represents the Callback component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onLogin - The callback function to be called when the user logs in.
 * @returns {JSX.Element} The rendered Callback component.
 */
const Callback = ({ onLogin }: CallbackProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Verifying authorization...');

  const fetchAccountWithPolling = async (accountId: string): Promise<dsnpLink.AuthAccountResponse> => {
    try {
      const response = await pollForAccount(accountId, {
        maxAttempts: 5,
        intervalMs: 3000,
        timeoutMs: 20000,
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch account during polling', 500);
    }
  };

  const getProviderInfo = async (): Promise<dsnpLink.ProviderResponse> => {
    const providerInfo = await dsnpLink.authProvider(getContext(), {});

    if (!providerInfo) {
      throw new ApiError('Failed to get provider info', 404);
    }

    return providerInfo;
  };

  const createUserAccount = (msaId: string, handle: Handle, accessToken: string, expires: number): UserAccount => ({
    msaId,
    handle,
    accessToken,
    expires: Number(expires),
  });

  const handleExistingAccount = async (
    msaId: string,
    accessToken: string,
    expires: number,
    providerInfo: dsnpLink.ProviderResponse
  ) => {
    const { handle } = await dsnpLink.authAccount(getContext(), { msaId });
    const userAccount = createUserAccount(msaId, handle, accessToken, expires);
    onLogin(userAccount, providerInfo);
  };

  const handleNewAccount = async (
    controlKey: string,
    accessToken: string,
    expires: number,
    providerInfo: dsnpLink.ProviderResponse
  ) => {
    setStatusMessage('Creating account...');
    const { msaId, handle } = await fetchAccountWithPolling(controlKey);
    const userAccount = createUserAccount(msaId, handle as Handle, accessToken, expires);
    onLogin(userAccount, providerInfo);
  };

  const handleCallback = async () => {
    const authorizationCode = searchParams.get('authorizationCode');
    const authorizationPayload = searchParams.get('authorizationPayload');

    if (!authorizationCode && !authorizationPayload) {
      setError('No authorization code or authorization payload provided');
      return;
    }

    try {
      const { msaId, controlKey, accessToken, expires } = await verifyAuthorization({
        authorizationCode,
        authorizationPayload,
      });

      const providerInfo = await getProviderInfo();

      if (msaId) {
        await handleExistingAccount(msaId, accessToken, expires, providerInfo);
      } else if (controlKey) {
        handleNewAccount(controlKey, accessToken, expires, providerInfo);
      } else {
        throw new Error('Invalid authentication response');
      }

      setStatusMessage('success');
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify authorization';
      setError(errorMessage);
      console.error('Verification error:', error);
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <Content style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        {error ? (
          <>
            <Alert message="Authentication Error" description={error} type="error" showIcon />
            <Button onClick={() => (window.location.href = '/')} type="primary">
              Try Again
            </Button>
          </>
        ) : (
          <>
            <Typography.Title level={3}>{statusMessage}</Typography.Title>
            <Spin size="large" />
          </>
        )}
      </Space>
    </Content>
  );
};

export default Callback;
