import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as Layout from "./layout";
import { connection } from "./connection";
import { sendTxUsingExternalSignature } from "./externalwallet";
import { getProgramId } from "./ids";
import * as BufferLayout from "@solana/buffer-layout";
import { Numberu64 } from "./number";
import { createAssociatedTokenAccount } from "./transactionAta";
import { getAccountInfo } from "./getAccountInfo";

const BN = require("bn.js");

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const getTokenAccountFromMint = async (MintPubKey) => {
  const dataFromChain = await connection.getTokenLargestAccounts(
    new PublicKey(MintPubKey)
  );
  const tokenAccount = dataFromChain.value.filter((a) => a.amount === "1")[0]
    .address;
  return tokenAccount.toString();
};

export const CollectionDataState = BufferLayout.struct([
  BufferLayout.u8("is_initialized"),
  Layout.publicKey("collection_mint"),
  Layout.uint64("nonce"),
]);

export const decodeCollectionData = async (collection_state, is1v1) => {
  const programID = getProgramId(is1v1)
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const stateAccount = await connection.getAccountInfo(collection_state);

  if (stateAccount == null) {
    console.log("State Account not found");
  }

  if (!stateAccount.owner.equals(programID)) {
    console.log("State Account not associated with program");
  }

  const decodedData = CollectionDataState.decode(stateAccount.data);

  return {
    is_initialized: decodedData.is_initialized,
    collection_mint: new PublicKey(decodedData.collection_mint),
    nonce: Numberu64.fromBuffer(decodedData.nonce),
  };
};

export const join_game = async (user, mint, _collection_mint, is1v1, side) => { 
  const programID = getProgramId(is1v1);
  const tokenAccount = await getTokenAccountFromMint(mint);

  const user_token_account = new PublicKey(tokenAccount);

  const Nft_mint = new PublicKey(mint);

  const collection_mint = new PublicKey(_collection_mint);

  const collection_state_account = await PublicKey.findProgramAddress(
    [Buffer.from("collection"), collection_mint.toBuffer()],
    programID
  );
  const collectionDecoded = await decodeCollectionData(
    collection_state_account[0],
    is1v1
  );
  console.log(collectionDecoded.nonce.toString());
  const game_state_account = await PublicKey.findProgramAddress(
    [
      Buffer.from(collectionDecoded.nonce.toString()),
      collection_state_account[0].toBuffer(),
    ],
    programID
  );

  const mint_state = await PublicKey.findProgramAddress(
    [Buffer.from("mints"), game_state_account[0].toBuffer()],
    programID
  );

  console.log("Collection State PDA ", game_state_account[0].toString());
  console.log("Game State PDA", game_state_account[0].toString());
  console.log("Mint State PDA", mint_state[0].toString());
  console.log("SIDEEEEEE", side);

  let transaction1 = new Transaction();

  let game_token_account = await PublicKey.findProgramAddress(
    [
      game_state_account[0].toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      Nft_mint.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  try {
    await getAccountInfo(game_token_account[0]);
  } catch (err) {
    if (err) {
      try {
        let txn = await createAssociatedTokenAccount(
          null,
          true,
          Nft_mint,
          game_state_account[0],
          user
        );
        transaction1.add(txn);
        // count =+ 1;
      } catch (err) {
        console.log(err);
      }
    }
  }
  // const game_token_account = await getOrCreateAssociatedAccount(
  //     game_state_account[0],
  //     Nft_mint,
  //     user,
  // );
  const platform_data_account = await PublicKey.findProgramAddress(
    [Buffer.from("betting_contract")],
    programID
  );
  const initEscrowIx = new TransactionInstruction({
    programId: programID,
    keys: [
      { pubkey: user, isSigner: true, isWritable: false },

      { pubkey: user_token_account, isSigner: false, isWritable: true },

      { pubkey: Nft_mint, isSigner: false, isWritable: true },

      { pubkey: collection_mint, isSigner: false, isWritable: true },

      { pubkey: game_state_account[0], isSigner: false, isWritable: true },

      { pubkey: mint_state[0], isSigner: false, isWritable: true },

      {
        pubkey: collection_state_account[0],
        isSigner: false,
        isWritable: true,
      },

      { pubkey: game_token_account[0], isSigner: false, isWritable: true },

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },

      { pubkey: platform_data_account[0], isSigner: false, isWritable: true },
    ],
    data: Buffer.from(Uint8Array.of(3, ...new BN(side).toArray("le", 8))),
  });

  const signature = await sendTxUsingExternalSignature(
    [transaction1, initEscrowIx],
    connection,
    null,
    [],
    new PublicKey(user)
  );
  return signature;
};

export const MintsState = BufferLayout.struct([
  BufferLayout.u8("is_initialized"),
  Layout.publicKey("mint1"),
  Layout.publicKey("mint2"),
  Layout.publicKey("mint3"),
  Layout.publicKey("mint4"),
  Layout.publicKey("mint5"),
  Layout.publicKey("mint6"),
]);

export const decodeMintsState = async (game_state_account, is1v1 = false) => {
  const programID = getProgramId(is1v1)
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const mint_state = await PublicKey.findProgramAddress(
    [Buffer.from("mints"), new PublicKey(game_state_account).toBuffer()],
    programID
  );

  const stateAccount = await connection.getAccountInfo(mint_state[0]);
  if (stateAccount == null) {
    console.log("State Account not found");
  }

  if (!stateAccount.owner.equals(programID)) {
    console.log("State Account not associated with program");
  }

  const decodedData = MintsState.decode(stateAccount.data);

  return {
    is_initialized: decodedData.is_initialized,
    mint1: new PublicKey(decodedData.mint1),
    mint2: new PublicKey(decodedData.mint2),
    mint3: new PublicKey(decodedData.mint3),
    mint4: new PublicKey(decodedData.mint4),
    mint5: new PublicKey(decodedData.mint5),
    mint6: new PublicKey(decodedData.mint6),
  };
};
