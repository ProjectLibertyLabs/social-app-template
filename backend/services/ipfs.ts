import { blake2b256 } from "@multiformats/blake2/blake2b";
import { CID } from "multiformats/cid";
import { bases } from "multiformats/basics";
import axios from "axios";
import FormData from "form-data";
import { extension as getExtension } from "mime-types";
import { toMultibase } from "@dsnp/activity-content/hash";

export interface FilePin {
  cid: string;
  cidBytes: Uint8Array;
  fileName: string;
  size: number;
  hash: string;
}

const CID_PLACEHOLDER = "[CID]";
// IPFS Kubo API Information
const ipfsEndpoint = process.env.IPFS_ENDPOINT;
const ipfsAuthUser = process.env.IPFS_BASIC_AUTH_USER;
const ipfsAuthSecret = process.env.IPFS_BASIC_AUTH_SECRET;
// IPFS Gateway
const ipfsGateway = process.env.IPFS_GATEWAY;

if (!ipfsEndpoint) {
  throw new Error("IPFS_ENDPOINT env variable is required");
}

if (!ipfsGateway) {
  throw new Error("IPFS_GATEWAY env variable is required");
}

if (!ipfsGateway.includes("[CID]")) {
  throw new Error(
    "IPFS_GATEWAY env variable must have the '[CID]' positioning string.",
  );
}

// Returns the root of the path style IPFS Gateway
export const getIpfsGateway = (): string | undefined => {
  if (ipfsGateway.includes("/ipfs/[CID]")) {
    return ipfsGateway.replace("/ipfs/[CID]", "");
  }
};

const ipfsAuth =
  ipfsAuthUser && ipfsAuthSecret
    ? "Basic " +
      Buffer.from(ipfsAuthUser + ":" + ipfsAuthSecret).toString("base64")
    : "";

const ipfsPinBuffer = async (
  filename: string,
  contentType: string,
  fileBuffer: Buffer,
) => {
  const ipfsAdd = `${ipfsEndpoint}/api/v0/add`;
  const form = new FormData();
  form.append("file", fileBuffer, {
    filename,
    contentType,
  });

  const headers = {
    "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
    Accept: "*/*",
    Connection: "keep-alive",
    authorization: ipfsAuth,
  };

  const response = await axios.post(ipfsAdd, form, { headers });

  const data = response.data;
  if (!data || !data.Hash || !data.Size) {
    throw new Error("Unable to pin file: " + filename);
  }
  // Convert to CID v1 base58btc
  const cid = CID.parse(data.Hash).toV1();

  console.log("Pinned to IPFS: " + cid);
  return {
    cid: cid.toString(bases.base58btc),
    cidBytes: cid.bytes,
    fileName: data.Name,
    size: data.Size,
  };
};

const hashBuffer = async (fileBuffer: Buffer): Promise<string> => {
  const hash = await blake2b256.digest(fileBuffer);
  return toMultibase(hash.bytes, "blake2b-256");
};

export const ipfsPin = async (
  mimeType: string,
  file: Buffer,
): Promise<FilePin> => {
  const hash = await hashBuffer(file);
  const extension = getExtension(mimeType);
  if (extension === false) {
    throw new Error("unknown mimetype: " + mimeType);
  }
  const ipfs = await ipfsPinBuffer(`${hash}.${extension}`, mimeType, file);
  return { ...ipfs, hash };
};

export const ipfsUrl = (cid: string): string => {
  if (ipfsGateway.includes(CID_PLACEHOLDER)) {
    return ipfsGateway.replace(CID_PLACEHOLDER, cid);
  }
  return `https://ipfs.io/ipfs/${cid}`;
};
