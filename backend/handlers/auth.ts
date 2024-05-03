import { Handler } from "openapi-backend";
// TODO: Figure out a better way to handle the type checking of the OpenAPI
import type * as T from "../types/openapi.js";
import { getApi } from "../services/frequency.js";
import { AnnouncementType } from "../services/dsnp.js";
import { getSchemaId } from "../services/announce.js";
import { getIpfsGateway } from "../services/ipfs.js";
import * as Config from "../config/config.js";

// Environment Variables
const providerId = Config.instance().providerId;

// Constants
const addProviderSchemas = [
  getSchemaId(AnnouncementType.Broadcast),
  getSchemaId(AnnouncementType.Reaction),
  getSchemaId(AnnouncementType.Reply),
  getSchemaId(AnnouncementType.Tombstone),
  getSchemaId(AnnouncementType.Profile),
  getSchemaId(AnnouncementType.Update),
  getSchemaId(AnnouncementType.PublicFollows),
];
// Make sure they are sorted.
addProviderSchemas.sort();

export const authLogout: Handler<object> = async (_c, _req, res) => {
  return res.status(201);
};

// TODO: Figure out a better way to do this perhaps?
// It provides to the frontend the various direct conenctions it might need
export const authProvider: Handler<object> = async (_c, _req, res) => {
  const response: T.Paths.AuthProvider.Responses.$200 = {
    siwfUrl: Config.instance().siwfUrl.toString(),
    nodeUrl: Config.instance().frequencyHttpUrl,
    ipfsGateway: getIpfsGateway(),
    providerId,
    schemas: addProviderSchemas,
    network: Config.instance().chainType,
  };
  return res.status(200).json(response);
};

// This allows the user to get their logged in MSA.
// TODO: Figure out how to handle the time between when a user signs up and user has an MSA
export const authAccount: Handler<object> = async (c, _req, res) => {
  try {
    const msaId = c.security?.tokenAuth?.msaId;
    if (msaId === null) return res.status(202).send();

    const api = await getApi();
    const handleResp = await api.rpc.handles.getHandleForMsa(msaId);
    // Handle still being created...
    // TODO: Be OK with no handle
    if (handleResp.isEmpty) return res.status(202).send();

    const handle = handleResp.value.toJSON();

    const response: T.Paths.AuthAccount.Responses.$200 = {
      displayHandle: `${handle.base_handle}.${handle.suffix}`,
      dsnpId: msaId,
    };
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
};
