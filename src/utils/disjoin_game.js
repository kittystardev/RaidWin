import { PublicKey, Transaction } from "@solana/web3.js";
import { COMMITMENT, connection } from "./connection";
import { waitForFinalized } from "./externalwallet";
import { baseUrl } from "./utils";

export const getTokenAccountFromMint = async (MintPubKey) => {
  const dataFromChain = await connection.getTokenLargestAccounts(
    new PublicKey(MintPubKey)
  );
  const tokenAccount = dataFromChain.value.filter((a) => a.amount === "1")[0]
    .address;
  return tokenAccount.toString();
};

export const disjoin_game = async (
  user,
  mint,
  collection_mint,
  TreasuryAccount,
  is1v1,
  floorPrice
) => {
  console.log("user", user);
  console.log("mint", mint);
  console.log("collection_mint", collection_mint);
  console.log("TreasuryAccount", TreasuryAccount);
  console.log("is1v1", is1v1);
  const sendData = async () => {
    try {
      const resp = await fetch(`${baseUrl}/disjoinPartially`, {
        method: "POST",
        body: JSON.stringify({
          user,
          mint,
          collection_mint,
          TreasuryAccount,
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
    data: { transactionBase64 },
  } = await sendData();

  console.log("user", user);

  const recoveredTransaction = Transaction.from(
    Buffer.from(transactionBase64, "base64")
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
