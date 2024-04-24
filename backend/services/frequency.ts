import { options } from "@frequency-chain/api-augment";
import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";
import * as Config from "../config/config";

// Environment Variables
const frequencyUri = Config.instance().frequencyUrl.toString();
const providerKeyUri = Config.instance().providerSeedPhrase;

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

  const provider = new WsProvider(Config.instance().frequencyUrl.toString());
  _singletonApi = ApiPromise.create({
    provider: provider,
    throwOnConnect: true,
    ...options,
  });

  return _singletonApi;
};

export enum ChainType {
  Dev,
  Rococo,
  Testnet,
  Mainnet,
}

export const getChainType = (): ChainType => {
  if (frequencyUri?.includes("rococo")) return ChainType.Testnet;
  if (
    frequencyUri?.includes("localhost") ||
    frequencyUri?.includes("127.0.0.1") ||
    frequencyUri?.includes("::1")
  )
    return ChainType.Dev;
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
