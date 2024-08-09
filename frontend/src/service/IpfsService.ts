import { getConfig } from '@projectlibertylabs/siwf';

// Must be IPFS Path style
let ipfsGateway: string = 'https://ipfs.io';
let ipfsUAGateway: string = 'http://localhost:8080';

export const setIpfsGateway = (url: string): void => {
  ipfsGateway = url;
};

export const tryUseIpfsGateway = (ipfsUrl: string): string => {
  const { frequencyRpcUrl } = getConfig();
  if (ipfsUrl.includes('https://ipfs.io/ipfs/')) {
    if (frequencyRpcUrl.includes('localhost')) {
      return ipfsUrl.replace('https://ipfs.io', ipfsUAGateway);
    }
    // Use the gateway instead
    return ipfsUrl.replace('https://ipfs.io', ipfsGateway);
  }
  return ipfsUrl;
};
