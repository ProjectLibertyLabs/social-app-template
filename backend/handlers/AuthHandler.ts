import axios from 'axios';
import * as Config from '../config/config';

// TODO: Fetch from account-service when the new endpoint is ready
export async function getSiwfRequestConfig() {
  // TODO: This is what this should really look like, but currently the template frontend expects something slightly different
  // return {
  //     providerId: Config.instance().providerId,
  //     proxyUrl: Config.instance().siwfUrl,
  //     frequencyRpcUrl: Config.instance().frequencyHttpUrl,
  //     schemas: ['profile', 'public-follows'],
  //     siwsOptions: {
  //         statement: 'The Social App Gateway is requesting you to sign in',
  //         expiresInMsecs: 300_000,
  //     },
  // }
  const response = await axios.get(`${Config.instance().accountServiceUrl}/accounts/siwf`);
  return {
    siwfUrl: response.data.siwfUrl,
    nodeUrl: response.data.frequencyRpcUrl,
    ipfsGateway: 'http://kubo_ipfs:8080',
    providerId: response.data.providerId,
    schemas: [1, 2, 3, 4, 5, 6, 8],
    network: Config.instance().chainType,
  };
}
