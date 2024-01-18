import { PublicKey } from "@solana/web3.js";
export const programID1v1 = new PublicKey(
  "EZZeZ4KThU3gfX4j3r1xD6zYtwo4mBbrMhSsH6VRBUeh"
);
export const programID = new PublicKey(
  "DQwcc7ePUqJU9tmYCgpt2N3wBaxcMDpyoQs1GhTXyCdd"
);
export const platform_data_account1v1 = new PublicKey(
  "3NgMuxZKfC4ctww7STZ9dz9tiiRMVAo29ptyrzNKosHP"
);
export const platform_data_account = new PublicKey(
  "4sfhWjCV3HLJnriddvQWfUgXD8v1oTCRrv1A8C6BbWXK"
);
export const getProgramId = (is1v1) => {
  return is1v1 ? programID1v1 : programID;
};
export const getPlateFormDataAccount = (is1v1) => {
  return is1v1 ? platform_data_account1v1 : platform_data_account;
};
// export const collection_mint = new PublicKey(
//
export const server_seed = new PublicKey(
  "5qD3wQHxDphKt6i8mJc1Rq6tDJL1dJgPGBJjsGDZHnXd"
);
export const client_seed = new PublicKey(
  "Hoc5pSh1dDQsQtn2aj3mFRFdHpqMwaBYyNonyF9eQyWE"
);
export const treasury_accoun = new PublicKey(
  "J8AjdAYf9jji6c8bnH56hwNHtdzovvJMjVmMBeDYY8uZ"
);

export const admin = new PublicKey(
  "5xhNaLiw8WuGeqKT6iy3vdDFuuqhEmsGtN7jL2M3YyS2"
);
