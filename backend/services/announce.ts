import { PassThrough } from "node:stream";
import { parquet } from "@dsnp/frequency-schemas";
import { ParquetWriter } from "@dsnp/parquetjs";
import {
  ChainType,
  getApi,
  getChainType,
  getNonce,
  getProviderKey,
} from "./frequency.js";
import { ipfsPin } from "./ipfs.js";
import {
  AnnouncementType,
  BroadcastAnnouncement,
  ReplyAnnouncement,
} from "./dsnp.js";

const TestnetSchemas = (type: AnnouncementType): number => {
  switch (type) {
    case AnnouncementType.Tombstone:
      return 1;
    case AnnouncementType.Broadcast:
      return 2;
    case AnnouncementType.Reply:
      return 3;
    case AnnouncementType.Reaction:
      return 4;
    case AnnouncementType.Profile:
      return 6;
    case AnnouncementType.Update:
      return 5;
    case AnnouncementType.PublicFollows:
      return 13;
  }
  throw new Error("Unknown Announcement Type");
};

const MainnetSchemas = (type: AnnouncementType): number => {
  switch (type) {
    case AnnouncementType.Tombstone:
      return 1;
    case AnnouncementType.Broadcast:
      return 2;
    case AnnouncementType.Reply:
      return 3;
    case AnnouncementType.Reaction:
      return 4;
    case AnnouncementType.Profile:
      return 5;
    case AnnouncementType.Update:
      return 6;
    case AnnouncementType.PublicFollows:
      return 8;
  }
  throw new Error("Unknown Announcement Type");
};

export const getSchemaId = (type: AnnouncementType): number => {
  if (getChainType() === ChainType.Testnet) {
    return TestnetSchemas(type);
  } else {
    return MainnetSchemas(type);
  }
};

export const publish = async <
  T extends BroadcastAnnouncement | ReplyAnnouncement,
>(
  announcements: Array<T>,
) => {
  console.log(
    `Preparing to publish a batch of announcements. Count: ${announcements.length}`,
  );
  const api = await getApi();

  const announcementType = announcements[0].announcementType;

  const schemaString =
    announcementType === AnnouncementType.Broadcast ? "broadcast" : "reply";

  const [parquetSchema, writerOptions] =
    parquet.fromFrequencySchema(schemaString);

  const publishStream = new PassThrough();
  const parquetBufferAwait = new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    publishStream.on("data", (chunk) => chunks.push(chunk));
    publishStream.on("close", () => {
      resolve(Buffer.concat(chunks));
    });
    publishStream.on("error", reject);
  });

  const writer = await ParquetWriter.openStream(
    parquetSchema,
    publishStream as any,
    writerOptions,
  );

  for await (const announcement of announcements) {
    await writer.appendRow(announcement);
  }

  await writer.close();
  const buf = await parquetBufferAwait;

  // Pin to IPFS
  const { cid, size } = await ipfsPin("application/octet-stream", buf);
  const schemaId = getSchemaId(announcementType);
  const tx = api.tx.messages.addIpfsMessage(schemaId, cid, size);

  // Do NOT wait for all the callbacks. Assume for now that it will work...
  await api.tx.frequencyTxPayment
    .payWithCapacity(tx)
    .signAndSend(
      getProviderKey(),
      { nonce: await getNonce() },
      ({ status, dispatchError }) => {
        if (dispatchError) {
          console.error("ERROR: ", dispatchError.toHuman());
        } else if (status.isInBlock || status.isFinalized) {
          console.log("Message Posted", status.toHuman());
        }
      },
    );
  return;
};
