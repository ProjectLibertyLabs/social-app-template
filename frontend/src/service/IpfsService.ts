// Must be IPFS Path style
let ipfsGateway: string = "https://ipfs.io";

export const setIpfsGateway = (url: string): void => {
  ipfsGateway = url;
};

export const tryUseIpfsGateway = (ipfsUrl: string): string => {
  if (ipfsUrl.includes("https://ipfs.io/ipfs/")) {
    // Use the gateway instead
    return ipfsUrl.replace("https://ipfs.io", ipfsGateway);
  }
  return ipfsUrl;
};
