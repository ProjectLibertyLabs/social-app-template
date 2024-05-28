import { blake2b256 } from '@multiformats/blake2/blake2b';
import { CID } from 'multiformats/cid';
import { bases } from 'multiformats/basics';
import axios from 'axios';
import FormData from 'form-data';
import { extension as getExtension } from 'mime-types';
import { toMultibase } from '@dsnp/activity-content/hash';
import * as Config from '../config/config';
import logger from '../logger';

export interface FilePin {
  cid: string;
  cidBytes: Uint8Array;
  fileName: string;
  size: number;
  hash: string;
}

// IPFS Kubo API Information
const ipfsEndpoint = Config.instance().ipfsEndpoint;
const ipfsAuthUser = Config.instance().ipfsBasicAuthUser;
const ipfsAuthSecret = Config.instance().ipfsBasicAuthSecret;
// IPFS Gateway
const ipfsGateway = Config.instance().ipfsGatewayUrl;

// Returns the root of the path style IPFS Gateway
export const getIpfsGateway = (): string | undefined => {
  if (ipfsGateway.includes('/ipfs/[CID]')) {
    return ipfsGateway.replace('/ipfs/[CID]', '');
  }
};

const ipfsAuth =
  ipfsAuthUser && ipfsAuthSecret ? 'Basic ' + Buffer.from(ipfsAuthUser + ':' + ipfsAuthSecret).toString('base64') : '';

const ipfsPinBuffer = async (filename: string, contentType: string, fileBuffer: Buffer) => {
  const ipfsAdd = `${ipfsEndpoint}/api/v0/add`;
  const form = new FormData();
  form.append('file', fileBuffer, {
    filename,
    contentType,
  });

  const headers = {
    'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
    Accept: '*/*',
    Connection: 'keep-alive',
    authorization: ipfsAuth,
  };

  const response = await axios.post(ipfsAdd, form, { headers });

  const data = response.data;
  if (!data || !data.Hash || !data.Size) {
    throw new Error('Unable to pin file: ' + filename);
  }
  // Convert to CID v1 base58btc
  const cid = CID.parse(data.Hash).toV1();

  logger.info('Pinned to IPFS: ' + cid);
  return {
    cid: cid.toString(bases.base58btc),
    cidBytes: cid.bytes,
    fileName: data.Name,
    size: data.Size,
  };
};

const hashBuffer = async (fileBuffer: Buffer): Promise<string> => {
  const hash = await blake2b256.digest(fileBuffer);
  return toMultibase(hash.bytes, 'blake2b-256');
};

export const ipfsPin = async (mimeType: string, file: Buffer): Promise<FilePin> => {
  const hash = await hashBuffer(file);
  const extension = getExtension(mimeType);
  if (extension === false) {
    throw new Error('unknown mimetype: ' + mimeType);
  }
  const ipfs = await ipfsPinBuffer(`${hash}.${extension}`, mimeType, file);
  return { ...ipfs, hash };
};
