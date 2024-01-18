import { baseUrl } from "./utils";

export const getCollectionMintByName = async (collection_name, is1v1 = false) => {
  let response = await fetch(
    `${baseUrl}/getTitleToCollectionMint/${collection_name}/${is1v1}`
  );
  let data = await response.json();
  return data.collection_mint;
};
