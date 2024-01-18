import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  //Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { connection } from "./connection";
import {
  sendTxUsingExternalSignature,
  waitForFinalized,
} from "./externalwallet";
import {
  programID,
  platform_data_account,
} from "./ids";
import { getOrCreateAssociatedAccount } from "./getOrCreateAssociatedAccount";
import { decodeMintsState } from "./joinGame";
import {
  createAssociatedTokenAccount,
} from "./transactionAta";
import { getAccountInfo } from "./getAccountInfo";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const BN = require("bn.js");

export const getTokenAccountFromMint = async (MintPubKey) => {
  const dataFromChain = await connection.getTokenLargestAccounts(
    new PublicKey(MintPubKey)
  );
  const tokenAccount = dataFromChain.value.filter((a) => a.amount === "1")[0]
    .address;
  return tokenAccount.toString();
};
export const claimbyAdminNFT = async (
  admin,
  _collection_mint,
  _game_state_account
) => {
  let transaction = new Transaction();
  const collection_mint = new PublicKey(_collection_mint);

  const collection_state_account = await PublicKey.findProgramAddress(
    [Buffer.from("collection"), collection_mint.toBuffer()],
    programID
  );

  const game_state_account = new PublicKey(_game_state_account);

  const mint_state_info = await decodeMintsState(game_state_account.toString());
  const mint1 = new PublicKey(mint_state_info.mint1);
  const mint2 = new PublicKey(mint_state_info.mint2);
  const mint3 = new PublicKey(mint_state_info.mint3);
  const mint4 = new PublicKey(mint_state_info.mint4);
  const mint5 = new PublicKey(mint_state_info.mint5);
  const mint6 = new PublicKey(mint_state_info.mint6);
  // const mint6=new PublicKey(data.mint6).toString();
  const mint_array = [mint1, mint2, mint3, mint4, mint5, mint6];
  new BN(1 * 0).toArray("le", 8);
  let transaction1 = new Transaction();

  const feed_account = new PublicKey(
    "DGaMbFh9BPZbNVWLygK4m3VhxBaNZkCumbnhpijFroaD"
  );

  await PublicKey.findProgramAddress(
    [Buffer.from("collection_info"), feed_account.toBuffer()],
    programID
  );

  for (let i = 0; i < mint_array.length; i++) {
    let assAcc = await PublicKey.findProgramAddress(
      [
        new PublicKey(admin).toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint_array[i].toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );
    try {
      await getAccountInfo(assAcc[0]);
    } catch (err) {
      if (err) {
        try {
          let txn = await createAssociatedTokenAccount(
            null,
            true,
            mint_array[i],
            admin,
            admin
          );
          transaction1.add(txn);
          // count =+ 1;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  for (let i = 0; i < mint_array.length; i++) {
    let admin_token_account = await PublicKey.findProgramAddress(
      [
        new PublicKey(admin).toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint_array[i].toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );

    // const admin_token_account = await getOrCreateAssociatedAccount(
    //   admin,
    //   mint_array[i],
    //   admin
    // );
    // console.log("admin", admin_token_account[0].toString());

    const game_token_account = await getOrCreateAssociatedAccount(
      game_state_account,
      mint_array[i],
      admin
    );
    const initEscrowIx = new TransactionInstruction({
      programId: programID,
      keys: [
        { pubkey: new PublicKey(admin), isSigner: true, isWritable: true },
        { pubkey: admin_token_account[0], isSigner: false, isWritable: true },
        { pubkey: game_state_account, isSigner: false, isWritable: true },
        {
          pubkey: collection_state_account[0],
          isSigner: false,
          isWritable: false,
        },
        { pubkey: game_token_account, isSigner: false, isWritable: true },
        { pubkey: collection_mint, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: platform_data_account, isSigner: false, isWritable: false },
        // { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.from(Uint8Array.of(8)),
    });
    transaction.add(initEscrowIx);
  }

  const signature = await sendTxUsingExternalSignature(
    [transaction1, transaction],
    connection,
    null,
    [],
    new PublicKey(admin)
  );
  await waitForFinalized(signature);
  return signature;
};
