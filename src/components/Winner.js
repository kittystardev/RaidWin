import {
  Box,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import eye from "../assets/images/eye.svg";
import NoDataFound from "../assets/images/no-data-found.svg";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  baseUrl,
  decodeMetadata,
  compressimagePath,
  getMetadataAccount,
  parseWiningRound,
} from "../utils/utils";
import { claim_nft } from "../utils/claim_nft";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useCallback } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 0px 8px 0px",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#131826",
    color: "#6A7080",
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "montserrat",
    borderBottom: "0px",
    opacity: 0.56,
    letterSpacing: "0.05em",
  },

  [`&.${tableCellClasses.body}`]: {
    backgroundColor: "#131826",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.02em",
    padding: "15px 0px 15px 0px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //     backgroundColor: theme.palette.action.hover,
  //     border: 0,
  // },
  // hide last border
  "&:hover": {
    backgroundColor: "#1C2438",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "tr:nth-child td:nth-child(1)": {
    border: 0,
  },
}));

export default function Winner() {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );
  const [rounds, setRounds] = useState([]);
  console.log(rounds);
  console.log("nfts", nfts);

  const sendWithdrawRequest = async (gamId, index, signature) => {
    try {
      const resp = await fetch(`${baseUrl}/withdrawn/${gamId}/${signature}`);
      await resp.json();
      setNFTs(await getNft(new PublicKey(pubKey)));
      setRounds([
        ...rounds.slice(0, index),
        { ...rounds[index], isWithdraw: true },
        ...rounds.slice(index + 1),
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const TreasuryAccount = useSelector(
    (state) => new PublicKey(state.platformSlice.treasury_pubkey)
  );
  const claim = async (collection_mint, game_state_account, index, is1v1) => {
    if (pubKey !== "") {
      try {
        const signature = await claim_nft(
          pubKey,
          collection_mint,
          game_state_account,
          TreasuryAccount,
          is1v1
        );
        sendWithdrawRequest(game_state_account, index, signature);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getNft = async (publicKey) => {
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
      // console.log(ele)
      // if(ele.tokenStandard?.collection?.key === "5jokzacCKQSrEoCh2PNx2RhB61gkDCCd2ZqNzE98xyNQ")
      nftData.push(ele);
    });

    return await Promise.all(
      nftData
        .filter((nft) => nft.data.uri !== "")
        .map(async (nft) => {
          let res = await fetch(nft.data.uri);
          let data = await res.json();
          let nftObj = {
            playerName: nft.data.name,
            mint: nft.mint,
            playerImage: data.image,
          };
          // nftMintName.push(nftObj);
          return nftObj;
        })
    );
  };

  useEffect(() => {
    (async function () {
      if (pubKey !== "") {
        setNFTs(await getNft(new PublicKey(pubKey)));
      }
    })();
  }, [pubKey]);

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const resp = await fetch(`${baseUrl}/getPlayerGameWinning/${pubKey}`);
      const games = await resp.json();
      const parsedGameData = parseWiningRound(games);
      console.log("parsedGameData", parsedGameData);
      setRounds(parsedGameData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [pubKey]);
  useEffect(() => {
    if (pubKey !== "") fetchData();
  }, [fetchData, pubKey]);
  return (
    <div className="justify-between block">
      <div className="block sm:block md:flex lg:flex 2xl:flex justify-between items-center mb-8">
        <div className="text-gray font-black text-2xl tracking-wide">
          Winnings
        </div>
        <div className="flex gap-4 mt-8 md:mt-0">
          <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold">
            Withdrawal History
          </button>
          <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold">
            Deposit
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="mt-8 text-center">
          <span class="w-12 h-12 rounded-full inline-flex items-center justify-center animate-spin">
            <span class="border-4 border-white rounded-full w-12 h-12 animate-prixClipFix"></span>
          </span>
        </div>
      ) : rounds.length <= 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center">
          <img src={NoDataFound} className="h-60 w-60" alt="No data found" />
          <h1 className="text-3xl font-bold mb-4">No Data to Display</h1>
          <p className="text-light-gray">
            There is no data available to show at the moment.
          </p>
        </div>
      ) : (
        <>
          <TableContainer
            sx={{
              display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
              mt: 4,
            }}
          >
            <Table sx={{ border: "none" }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Winnings</StyledTableCell>
                  <StyledTableCell align="left">FloorPrice</StyledTableCell>
                  <StyledTableCell align="left">Total</StyledTableCell>
                  <StyledTableCell align="left">ROI</StyledTableCell>
                  <StyledTableCell align="left">-</StyledTableCell>
                  <StyledTableCell align="right">Withdrawal</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rounds.map((round, index) => {
                  return (
                    <StyledTableRow>
                      <StyledTableCell>
                        <div className="flex gap-1 items-center">
                          {round.winningNFT.map((player) => {
                            return (
                              <img
                                src={`${compressimagePath}${player.mint_image}.png`}
                                className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                                alt=""
                              />
                            );
                          })}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                        <div className="text-space-gray">100 SOL</div>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                        <div className="text-space-gray">$ 100</div>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                        <div className="text-space-gray">100%</div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <img src={eye} alt="" />
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "right" }}>
                        {!round.isWithdraw && (
                          <button
                            onClick={() =>
                              claim(
                                round.collection_mint,
                                round.account,
                                index,
                                round.is1v1
                              )
                            }
                            className="bg-lighter-blue bg-opacity-[0.09] rounded-lg px-6 py-3 text-lighter-blue font-bold text-sm tracking-wide"
                          >
                            Withdraw
                          </button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {rounds.map((round) => (
            <Box
              sx={{
                display: { xs: "block", sm: "block", md: "none", lg: "none" },
                mt: 3,
              }}
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="flex gap-1">
                    {round.winningNFT.map((player) => {
                      return (
                        <img
                          src={player.mint_image}
                          className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                          alt=""
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex mt-6">
                <TableContainer>
                  <Table sx={{ border: "none" }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">
                          FloorPrice
                        </StyledTableCell>
                        <StyledTableCell align="left">Total</StyledTableCell>
                        <StyledTableCell align="left">ROI</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                          <div className="text-space-gray">100 SOL</div>
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                          <div className="text-space-gray">$ 100</div>
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                          <div className="text-space-gray">100%</div>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* </div> */}
                <div className="flex items-center">
                  <div className="bg-yankees-blue w-12 p-4 rounded-2xl">
                    <img src={eye} className="w-5 h-4" alt="" />
                  </div>
                </div>
              </div>
            </Box>
          ))}

          <div className="block sm:block md:flex lg:flex 2xl:flex justify-between items-center my-8">
            <div className="text-gray font-black text-2xl tracking-wide">
              My Items
            </div>
          </div>
          {/* <Grid container spacing={1} sx={{ mt: 4 }}> */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                    {
                        nfts.map(ele => {
                            return <MyItem name={ele.playerName} img={ele.playerImage}></MyItem>
                        })
                    }
                </div> */}

          {/* </Grid> */}
        </>
      )}
    </div>
  );
}
