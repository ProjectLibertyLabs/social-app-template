import { HexString } from "../types";

const DSNP_SCHEMA_REGEX = /^dsnp:\/\//i;

/**
 * DSNPUserId represents a DSNP user id following the DSNP
 * [Identifiers](https://github.com/LibertyDSNP/spec/blob/main/pages/Identifiers.md)
 * specification.
 */
export type DSNPUserId = bigint | number;

/**
 * DSNPContentURI represents a DSNP Content Uri following the DSNP
 * [Identifiers](https://github.com/LibertyDSNP/spec/blob/main/pages/Identifiers.md)
 * specification.
 */
export type DSNPContentURI = string;

/**
 * DSNPUserURI represents a URI targeting a user following the DSNP
 * [Identifiers](https://github.com/LibertyDSNP/spec/blob/main/pages/Identifiers.md)
 * specification.
 */
export type DSNPUserURI = string;

/**
 * isDSNPUserURI validates a given object as a DSNPUserURI.
 *
 * @param uri - The object to validate
 * @returns True of false depending on whether the string is a valid DSNPUserURI
 */
export const isDSNPUserURI = (uri: unknown): uri is DSNPUserURI => {
  if (typeof uri !== "string") return false;
  return uri.match(/^dsnp:\/\/[1-9][0-9]{0,19}$/) !== null;
};

/**
 * isDSNPContentURI() validates a given string as a DSNPContentURI.
 *
 * @param id - The object to validate
 * @returns True of false depending on whether the string is a valid DSNPContentURI
 */
export const isDSNPContentURI = (id: unknown): id is DSNPContentURI => {
  if (typeof id !== "string") return false;
  return id.match(/^dsnp:\/\/[0-9]{1,20}\/0x[0-9a-f]{64}$/) !== null;
};

/**
 * convertToDSNPUserId() converts just about any valid DSNP User URI, BigNumber,
 * hex string, etc... to a proper DSNP User Id.
 *
 * @param value - The unknown value to parse to a DSNP User Id
 * @returns The same value as a properly formatted DSNPUserId
 */
export const convertToDSNPUserId = (value: unknown): DSNPUserId => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(value);

  if (typeof value === "string") {
    if (value.match(/^[1-9][0-9]{0,19}/) || value.match(/^0x[0-9]{1,7}/)) {
      return BigInt(value);
    }

    if (isDSNPUserURI(value)) {
      return BigInt(value.replace(DSNP_SCHEMA_REGEX, ""));
    } else {
      throw new Error("Invalid DSNP Id");
    }
  }
  // Cast or throw?
  return BigInt(String(value));
};

/**
 * convertToDSNPUserURI() converts just about any valid DSNP User id, BigNumber,
 * hex string, etc... to a proper DSNP User URI.
 *
 * @param value - The string
 * @returns The same value as a properly formatted DSNPUserURI
 */
export const convertToDSNPUserURI = (value: unknown): DSNPUserURI => {
  return `dsnp://${convertToDSNPUserId(value)}`;
};

/**
 * buildDSNPContentURI() takes a DSNP user id or URI and a content hash and
 * returns a DSNP Content Uri.
 *
 * @param userIdOrUri - The DSNP user id or URI of the announcing user
 * @param contentHash - The content hash of the announcement posted by the user
 * @returns A DSNP Content Uri for the given announcement
 */
export const buildDSNPContentURI = (
  userIdOrUri: DSNPUserId | DSNPUserURI,
  contentHash: HexString,
): DSNPContentURI => {
  return `dsnp://${convertToDSNPUserId(userIdOrUri)}/${contentHash}`;
};
