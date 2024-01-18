import { Transaction } from "@solana/web3.js";
import { COMMITMENT, connection } from "./connection";

export const sendTxUsingExternalSignature = async (
  instructions,
  connection,
  feePayer,
  signersExceptWallet,
  wallet //this is a public key
) => {
  let tx = new Transaction();
  tx.add(...instructions);
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
  tx.setSigners(
    ...(feePayer
      ? [feePayer.publicKey, wallet] //change user
      : [wallet]), //change user
    ...signersExceptWallet.map((s) => s.publicKey)
  );

  signersExceptWallet.forEach((acc) => {
    //console.log(acc,"................external signer acc");
    tx.partialSign(acc);
  });
  // console.log(tx);
  const signedTransaction = await window.solana.signTransaction(tx);
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    {
      skipPreflight: false,
      preflightCommitment: COMMITMENT,
    }
  );
  return signature;
};
export const waitForFinalized = async (signature) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const { value } = await connection.getSignatureStatuses([signature], {
        searchTransactionHistory: true,
      });
      console.log(value);
      if (value[0] && value[0].confirmationStatus === "finalized") {
        clearInterval(interval);
        resolve(signature);
      }
    }, 1000);
  });
};
