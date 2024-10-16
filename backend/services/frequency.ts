import { options } from '@frequency-chain/api-augment';
import { WsProvider, ApiPromise } from '@polkadot/api';
import * as Config from '../config/config';

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

  const provider = new WsProvider(Config.instance().frequencyApiWsUrl.toString());
  _singletonApi = ApiPromise.create({
    provider: provider,
    throwOnConnect: true,
    ...options,
  });

  return _singletonApi;
};

export const getCurrentBlockNumber = async (): Promise<number> => {
  const api = await getApi();

  return Number((await api.query.system.number()).toJSON());
};
