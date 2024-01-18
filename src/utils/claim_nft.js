import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { COMMITMENT, connection } from "./connection";
import {
  sendTxUsingExternalSignature,
  waitForFinalized,
} from "./externalwallet";
import { getProgramId } from "./ids";
import { baseUrl } from "./utils";
import { decodeMintsState } from "./joinGame";
import { createAssociatedTokenAccount } from "./transactionAta";
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
export const claim_nft = async (
  user,
  _collection_mint,
  _game_state_account,
  TreasuryAccount,
  is1v1 = false,
  floorPrice
) => {
  // The caller of this can convert it back to a transaction object:

  console.log("user", user);
  console.log("_collection_mint", _collection_mint);
  console.log("_game_state_account", _game_state_account);
  console.log("TreasuryAccount", TreasuryAccount.toString());

  const collection_mint = new PublicKey(_collection_mint);
  const programID = getProgramId(is1v1);
  await PublicKey.findProgramAddress(
    [Buffer.from("collection"), collection_mint.toBuffer()],
    programID
  );

  const game_state_account = new PublicKey(_game_state_account);

  const mint_state_info = await decodeMintsState(
    game_state_account.toString(),
    is1v1
  );
  const mint1 = new PublicKey(mint_state_info.mint1);
  const mint2 = new PublicKey(mint_state_info.mint2);
  const mint3 = new PublicKey(mint_state_info.mint3);
  const mint4 = new PublicKey(mint_state_info.mint4);
  const mint5 = new PublicKey(mint_state_info.mint5);
  const mint6 = new PublicKey(mint_state_info.mint6);
  // const mint6=new PublicKey(data.mint6).toString();
  const mint_array = is1v1
    ? [mint1, mint2]
    : [mint1, mint2, mint3, mint4, mint5, mint6];
  new BN(1 * 0).toArray("le", 8);

  const { blockhash } = await connection.getLatestBlockhash("finalized");

  let transaction1 = new Transaction({
    recentBlockhash: blockhash,
    feePayer: new PublicKey(user),
  });

  const feed_account = new PublicKey(
    "DGaMbFh9BPZbNVWLygK4m3VhxBaNZkCumbnhpijFroaD"
  );

  await PublicKey.findProgramAddress(
    [Buffer.from("collection_info"), feed_account.toBuffer()],
    programID
  );

  for (var i = 0; i < mint_array.length; i++) {
    let assAcc = await PublicKey.findProgramAddress(
      [
        new PublicKey(user).toBuffer(),
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
            user,
            user
          );
          transaction1.add(txn);
          // count =+ 1;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  const sendData = async () => {
    try {
      const resp = await fetch(`${baseUrl}/claimPartially`, {
        method: "POST",
        body: JSON.stringify({
          user,
          _collection_mint,
          TreasuryAccount,
          _game_state_account,
          is1v1,
          floorPrice,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const {
    data: { transactionBase64, transactionBase641 },
  } = await sendData();

  console.log("user", user);

  const recoveredTransaction = Transaction.from(
    Buffer.from(transactionBase64, "base64")
  );
  Transaction.from(Buffer.from(transactionBase641, "base64"));

  await sendTxUsingExternalSignature(
    [transaction1],
    connection,
    null,
    [],
    new PublicKey(user)
  );

  const SignedTransaction = await window.solana.signTransaction(
    recoveredTransaction
  );

  const SignSignature = await connection.sendRawTransaction(
    SignedTransaction.serialize(),
    {
      skipPreflight: false,
      preflightCommitment: COMMITMENT,
    }
  );

  await waitForFinalized(SignSignature);
  return SignSignature;
};
