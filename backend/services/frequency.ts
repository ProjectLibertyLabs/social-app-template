import { options } from "@frequency-chain/api-augment";
import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";

// Environment Variables
const providerUri = process.env.FREQUENCY_NODE;
const publicNodeHttp = process.env.FREQUENCY_PUBLIC_ENDPOINT;
const providerKeyUri = process.env.PROVIDER_KEY_URI;
const frequencyNetwork = process.env.FREQUENCY_NETWORK;
const siwfUrl = process.env.SIWF_URL;
const siwfDomain = process.env.SIWF_DOMAIN;

if (!providerKeyUri) {
  throw new Error("PROVIDER_KEY_URI env variable is required");
}

if (!providerUri) {
  throw new Error("FREQUENCY_NODE env variable is required");
}

if (!publicNodeHttp) {
  throw new Error("FREQUENCY_PUBLIC_ENDPOINT env variable is required");
}

if (
  !frequencyNetwork ||
  !["local", "testnet", "mainnet"].includes(frequencyNetwork)
) {
  throw new Error(
    'FREQUENCY_NETWORK env variable must be one of: "local", "testnet", "mainnet"',
  );
}

if (!siwfUrl) {
  throw new Error("SIWF_URL env variable is required");
}

if (!siwfDomain) {
  throw new Error("SIWF_DOMAIN env variable is required");
}

export const getSiwfUrl = () => siwfUrl;
export const getSiwfDomain = () => siwfDomain;

export const getProviderHttp = () => publicNodeHttp;

export const getNetwork = () =>
  frequencyNetwork as "local" | "testnet" | "mainnet";

export const getProviderKey = () => {
  return new Keyring().addFromUri(providerKeyUri, {}, "sr25519");
};

// Reset
export const disconnectApi = async () => {
  if (_singletonApi === null) return;

  const api = await getApi();
  await api.disconnect();
  _singletonApi = null;
  return;
};

let _singletonApi: null | Promise<ApiPromise> = null;

export const getApi = (): Promise<ApiPromise> => {
  if (_singletonApi !== null) {
    return _singletonApi;
  }

  if (!providerUri) {
    throw new Error("FREQUENCY_NODE env variable is required");
  }

  const provider = new WsProvider(providerUri);
  _singletonApi = ApiPromise.create({
    provider: provider,
    throwOnConnect: true,
    ...options,
  });

  return _singletonApi;
};

export enum ChainType {
  Local,
  Testnet,
  Mainnet,
}

export const getChainType = (): ChainType => {
  if (providerUri?.includes("rococo")) return ChainType.Testnet;
  if (
    providerUri?.includes("localhost") ||
    providerUri?.includes("127.0.0.1") ||
    providerUri?.includes("::1")
  )
    return ChainType.Local;
  return ChainType.Mainnet;
};

let _nonce: [Date, number] | null = null;

export const getNonce = async (): Promise<number> => {
  if (_nonce !== null && _nonce[0].getTime() > Date.now() - 60) {
    _nonce[1]++;
    return _nonce[1];
  }
  const api = await getApi();
  const startNonce = (
    await api.rpc.system.accountNextIndex(getProviderKey().address)
  ).toNumber();
  _nonce = [new Date(), startNonce];
  return startNonce;
};

export const getCurrentBlockNumber = async (): Promise<number> => {
  const api = await getApi();

  return Number((await api.query.system.number()).toJSON());
};
