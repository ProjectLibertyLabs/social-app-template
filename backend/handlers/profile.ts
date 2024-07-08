import { Handler } from 'openapi-backend';
import type * as T from '../types/openapi.js';
import { getApi } from '../services/frequency.js';
import logger from '../logger.js';

export const getProfile: Handler<object> = async (c, _req, res) => {
  // T.Paths.GetProfile.PathParameters
  const msaId = c.request.params.dsnpId;

  if (typeof msaId !== 'string') {
    return res.status(404).send();
  }

  // TODO: Implement something to abstract the Frequency RPC calls
  try {
    const chainApi = await getApi();

    const handle = await chainApi.rpc.handles.getHandleForMsa(msaId);

    const response: T.Paths.GetProfile.Responses.$200 = {
      fromId: msaId,
      contentHash: '',
      content: '',
      timestamp: new Date().toISOString(),
      handle,
    };
    return res.status(200).json(response);
  } catch (err) {
    logger.error({ err });
    return res.status(500).send();
  }
};

export const createProfile: Handler<T.Paths.CreateProfile.RequestBody> = async (
  // T.Paths.CreateProfile.PathParameters
  c,
  req,
  res
) => {
  const response: T.Paths.CreateProfile.Responses.$200 = {
    fromId: '123',
    contentHash: '0xabcd',
    content: '',
    timestamp: new Date().toISOString(),
  };
  return res.status(200).json(response);
};
