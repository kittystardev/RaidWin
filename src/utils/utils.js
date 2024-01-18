import { BinaryReader, BinaryWriter, deserializeUnchecked } from "borsh";
import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import { Buffer } from "buffer";
import * as Layout from "./layout";
import * as BufferLayout from "@solana/buffer-layout";
import sha256 from "sha256";

import { io } from "socket.io-client";
import { connection } from "./connection";
import { platform_data_account, programID } from "./ids";
import { Numberu64 } from "./number";
import moment from "moment";

import broken from "../assets/images/broken.png";

const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

window.Buffer = Buffer;

export const METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
export const METADATA_PREFIX = "metadata";
const PubKeysInternedMap = new Map();
// Borsh extension for pubkey stuff
BinaryReader.prototype.readPubkey = function () {
  const reader = this;
  const array = reader.readFixedArray(32);
  return new PublicKey(array);
};
BinaryWriter.prototype.writePubkey = function (value) {
  const writer = this;
  writer.writeFixedArray(value.toBuffer());
};
BinaryReader.prototype.readPubkeyAsString = function () {
  const reader = this;
  const array = reader.readFixedArray(32);
  return base58.encode(array);
};
BinaryWriter.prototype.writePubkeyAsString = function (value) {
  const writer = this;
  writer.writeFixedArray(base58.decode(value));
};
const toPublicKey = (key) => {
  if (typeof key !== "string") {
    return key;
  }
  let result = PubKeysInternedMap.get(key);
  if (!result) {
    result = new PublicKey(key);
    PubKeysInternedMap.set(key, result);
  }
  return result;
};
const findProgramAddress = async (seeds, programId) => {
  const result = await PublicKey.findProgramAddress(seeds, programId);
  return [result[0].toBase58(), result[1]];
};
export var MetadataKey;
(function (MetadataKey) {
  MetadataKey[(MetadataKey["Uninitialized"] = 0)] = "Uninitialized";
  MetadataKey[(MetadataKey["MetadataV1"] = 4)] = "MetadataV1";
  MetadataKey[(MetadataKey["EditionV1"] = 1)] = "EditionV1";
  MetadataKey[(MetadataKey["MasterEditionV1"] = 2)] = "MasterEditionV1";
  MetadataKey[(MetadataKey["MasterEditionV2"] = 6)] = "MasterEditionV2";
  MetadataKey[(MetadataKey["EditionMarker"] = 7)] = "EditionMarker";
})(MetadataKey || (MetadataKey = {}));
class Creator {
  constructor(args) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}
class Data {
  constructor(args) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
    this.creators = args.creators;
  }
}
class Metadata {
  constructor(args) {
    this.key = MetadataKey.MetadataV1;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
    this.editionNonce = args.editionNonce;
  }
}
const METADATA_SCHEMA = new Map([
  [
    Data,
    {
      kind: "struct",
      fields: [
        ["name", "string"],
        ["symbol", "string"],
        ["uri", "string"],
        ["sellerFeeBasisPoints", "u16"],
        ["creators", { kind: "option", type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: "struct",
      fields: [
        ["address", "pubkeyAsString"],
        ["verified", "u8"],
        ["share", "u8"],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["updateAuthority", "pubkeyAsString"],
        ["mint", "pubkeyAsString"],
        ["data", Data],
        ["primarySaleHappened", "u8"],
        ["isMutable", "u8"], // bool
      ],
    },
  ],
]);
export async function getMetadataAccount(tokenMint) {
  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        toPublicKey(METADATA_PROGRAM_ID).toBuffer(),
        toPublicKey(tokenMint).toBuffer(),
      ],
      toPublicKey(METADATA_PROGRAM_ID)
    )
  )[0];
}
// eslint-disable-next-line no-control-regex
const METADATA_REPLACE = new RegExp("\u0000", "g");
export const decodeMetadata = (buffer) => {
  try {
    const metadata = deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer);
    metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
    metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
    metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
    return metadata;
  } catch (e) {
    console.log(e);
  }
};

export const getPlayerImages = async (pubKeys) => {
  if (pubKeys.length === 0) return [];
  try {
    const resp = await fetch(`${baseUrl}/getPlayersDetails`, {
      method: "POST",
      body: JSON.stringify(pubKeys),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await resp.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const ws = "wss://wnrs.tools/ws";
export const httpEndpoint = "https://wnrs.tools";
// export const ws = "ws://192.168.29.116:3004/ws";
// export const httpEndpoint = "http://192.168.29.116:3003";
export const baseUrl = `${httpEndpoint}/api`;

export const imagePath = `${httpEndpoint}/`;
export const compressimagePath = `${httpEndpoint}/smNft/`;

// export const creators = ["3VDqXB1KSzL1M5sKNruUGSGGNFAvkqhL5Lu28MU12wuA", "AxFuniPo7RaDgPH6Gizf4GZmLQFc4M5ipckeeZfkrPNn"];
export const creators = [
  "DQLSk2sLMdQxLKj1gFdzK7gwVbWQDqNrajyxFtJ1qYjx",
  "RRUMF9KYPcvNSmnicNMAFKx5wDYix3wjNa6bA7R6xqA",
  "BSLiqdvTiCLSkpRasjBBJQqNHRLuvp4vP2qyzKALjs9W",
];

export const parseWiningRound = (games) => {
  // console.log("parseWiningRound", games);
  const parsedData = [];
  try {
    games.forEach((game) => {
      game.games.forEach((ele, index) => {
        const winner = ele.winner_pubkey[0]._id
          ? ele.winner_pubkey[0]._id
          : ele.winner_pubkey;
        const players = ele.is1v1 ? ele.players.slice(0, 2) : ele.players;
        const winningNFT = players
          .filter((player) => player.player_id !== winner)
          .map((player) => {
            return {
              ...player,
              mint: player.mint?._id,
              mint_name: player.mint?.mint_name,
              mint_image: player.mint?.mint_image,
            };
          });
        const winningAllNFT = players
          .filter((player) => player.player_id)
          .map((player) => {
            return {
              ...player,
              mint: player.mint?._id,
              mint_name: player.mint?.mint_name,
              mint_image: player.mint?.mint_image,
            };
          });
        const winnerIndex = players
          .map((player) => player.player_id)
          .indexOf(winner);

        const updateDate = moment(ele?.updatedAt);
        const expiredTime = updateDate.clone().add({ minutes: 4 }).format();

        // console.log("updatedAt", ele.updatedAt)
        parsedData.push({
          account: ele?.account,
          id: index,
          client_seed: ele?.client_seed,
          User_name: ele?.winner_pubkey[0]?.userName,
          winner_pubkey: winner,
          Winner_image: ele?.winner_pubkey[0]?.profileImage,
          isWithdraw: ele?.isWithdraw,
          signature: ele?.signature,
          collection_mint: ele?.collection_mint,
          winnerMintImage: ele?.players[winnerIndex].mint?._id,
          winningNFT,
          winningAllNFT,
          floorPrice: ele?.floorPrice,
          total: ele?.floorPrice,
          ROI: winningNFT.length * 100,
          updatedAt: ele?.updatedAt,
          is1v1: ele?.is1v1,
          title: ele?.title,
          expiredTime: expiredTime,
          slug: ele?.slug,
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
  return parsedData;
};

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("mint1"),
  publicKey("mint2"),
  publicKey("mint3"),
  publicKey("mint4"),
  publicKey("mint5"),
  publicKey("mint6"),
]);

export const getAddress = (account) => {
  if (!account || account.length === 0) return "";
  return account.slice(0, 5) + "..." + account.slice(-4);
};

export const getCreator = async (collectionMint) => {
  const resp = await fetch(`${baseUrl}/creators/${collectionMint}`);
  return await resp.json();
};
export const fetchPlayerById = async (pubKey) => {
  const resp = await fetch(`${baseUrl}/player/${pubKey}`);
  return await resp.json();
};

export const cacheTime = 10 * 1000 * 1000;

export const getCreatoHash = (creators) => {
  return sha256(JSON.stringify(creators.sort((a, b) => a.localeCompare(b))));
};
export const socket = io(ws, {
  transports: ["websocket"],
});
// export const socket = (token) => {
//   if (token !== "")
//     return io(ws, {
//       transports: ["websocket"],
//       auth: {
//         token
//       }
//     });
//   return io(ws, {
//     transports: ["websocket"],
//   });
// }

export const DummyPubKey = "11111111111111111111111111111111";

const PlatformState = BufferLayout.struct([
  BufferLayout.u8("is_initialized"),
  Layout.publicKey("treasury_pubkey"),
  Layout.uint64("platform_fees"),
  Layout.uint64("penalty_fees"),
  Layout.publicKey("admin"),
]);
export const decodePlatformState = async () => {
  const stateAccount = await connection.getAccountInfo(platform_data_account);
  if (stateAccount == null) {
    console.log("State Account not found");
    process.exit(-1);
  }
  if (!stateAccount.owner.equals(programID)) {
    console.log("State Account not associated with program");
    process.exit(-2);
  }
  const decodedData = PlatformState.decode(stateAccount.data);
  return {
    is_initialized: decodedData.is_initialized,
    treasury_pubkey: new PublicKey(decodedData.treasury_pubkey).toString(),
    platform_fees: Numberu64.fromBuffer(decodedData.platform_fees).toString(),
    penalty_fees: Numberu64.fromBuffer(decodedData.penalty_fees).toString(),
    admin: new PublicKey(decodedData.admin).toString(),
  };
};

export function getWinnerPosition(hash, is1v1) {
  let index = 0;
  let result;
  while (true) {
    result = parseInt(hash.slice(index * 5, index * 5 + 5), 16);
    index += 1;
    if (index * 5 + 5 > 64) {
      result = 9999;
      break;
    }
    if (result < 1000000) {
      break;
    }
  }
  return result % (is1v1 ? 2 : 6);
}

export function getCollectionMint(gameStateArray, is1v1) {
  for (let i = 0; i < gameStateArray.length; i++) {
    if (gameStateArray[i].is1v1 === is1v1) {
      return gameStateArray[i].collection_mint;
    }
  }

  return null; // Return null if no matching gameState is found
}

export function getNumberOfJoined(gameStateArray, is1v1) {
  for (let i = 0; i < gameStateArray.length; i++) {
    if (gameStateArray[i].is1v1 === is1v1) {
      return gameStateArray[i].joined;
    }
  }

  return null; // Return null if no matching gameState is found
}

export const handleImageError = (event) => {
  event.target.src = `${broken}`;
};

export function replaceSlug(str) {
  return str?.trim().replace(/\s+/g, "-");
}
