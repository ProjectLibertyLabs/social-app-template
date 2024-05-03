import { Handler } from "openapi-backend";
// TODO: Figure out a better way to handle the type checking of the OpenAPI
import { AnnouncementType } from "../../services/dsnp";
import { getSchemaId } from "../../services/announce";
import * as Config from "../../config/config";

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
