import * as Config from '../config/config';

export function translateContentUrl(url: string) {
  const ipfsUrl = Config.instance().ipfsGatewayUrl;

  if (!ipfsUrl || !url.includes('ipfs.io/')) {
    return url;
  }

  return url.replace(/http[s]{0,1}:\/\/ipfs.io/, ipfsUrl);
}
