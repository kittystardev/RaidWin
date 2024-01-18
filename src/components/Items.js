import React from "react";
import MyItem from "./MyItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  baseUrl,
  decodeMetadata,
  getCreatoHash,
  getMetadataAccount,
  parseWiningRound,
} from "../utils/utils";
import { useSelector } from "react-redux";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useEffect } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export default function Items({ pubKeyParam }) {
  const navigate = useNavigate();
  const [nfts, setNFTs] = useState([]);
  const pageNavigate = (page) => {
    navigate(`/${page}`);
  };
  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );

  const getNft = async (publicKey, creatorsHashSet) => {
    let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    let response = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    let mints = await Promise.all(
      response.value
        .filter(
          (accInfo) =>
            accInfo.account.data.parsed.info.tokenAmount.uiAmount !== 0
        )
        .map((accInfo) =>
          getMetadataAccount(accInfo.account.data.parsed.info.mint)
        )
    );
    let mintPubkeys = mints.map((m) => new PublicKey(m));
    let nftMetadata = [];
    for (let j = 0; j < mintPubkeys.length; j += 100) {
      let multipleAccounts = await connection.getMultipleAccountsInfo(
        mintPubkeys.slice(j, j + 100)
      );
      nftMetadata = [
        ...nftMetadata,
        ...multipleAccounts
          .filter((account) => account !== null)
          .map((account) => decodeMetadata(account.data)),
      ];
    }
    const nftData = [];
    nftMetadata.forEach((ele) => {
      // if(ele.tokenStandard?.collection?.key === "5jokzacCKQSrEoCh2PNx2RhB61gkDCCd2ZqNzE98xyNQ")
      nftData.push(ele);
    });

    return await Promise.all(
      nftData
        .filter((nft) => nft.data.uri != "")
        .map(async (nft) => {
          let res = await fetch(nft.data.uri);
          let data = await res.json();
          const creatorHash = getCreatoHash(
            nft.data.creators.map((creator) => creator.address)
          );
          let nftObj = {
            playerName: nft.data.name,
            mint: nft.mint,
            playerImage: data.image,
            creatorHash,
            isPlayable: creatorsHashSet.has(creatorHash),
            collectionMint: creatorsHashSet.get(creatorHash),
          };
          // nftMintName.push(nftObj);
          return nftObj;
        })
    );
  };

  useEffect(() => {
    (async function () {
      if (pubKeyParam != "") {
        try {
          const resp = await fetch(`${baseUrl}/creatorsHash`);
          const creatorsHash = await resp.json();
          const creatorsHashSet = new Map();
          creatorsHash.forEach(({ creatorsHash, collection_mint }) =>
            creatorsHashSet.set(creatorsHash, collection_mint)
          );
          let nfts = await getNft(new PublicKey(pubKeyParam), creatorsHashSet);
          console.log("nftsssss", nfts);
          setNFTs(nfts);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [pubKeyParam]);

  return (
    <div className="flex flex-wrap gap-5">
      {nfts.map((ele, i) => {
        return (
          <MyItem
            name={ele.playerName}
            key={i}
            img={ele.playerImage}
            isPlayable={ele.isPlayable && pubKeyParam === pubKey}
            collectionMint={ele.collectionMint}
          ></MyItem>
        );
      })}
    </div>
  );
}
