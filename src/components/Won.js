import {
  Box,
  CircularProgress,
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
  handleImageError,
} from "../utils/utils";
import { claim_nft } from "../utils/claim_nft";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connectionString } from "../utils/connection";
import InfoModal from "./modals/InfoModal";
import moment from "moment";
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
export default function Won({ pubKeyParam }) {
  const [nfts, setNFTs] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );
  const [rounds, setRounds] = useState([]);
  const [isWithdrawWinning, setIsWithdrawWinning] = useState(false);

  const sendWithdrawRequest = async (gamId, index, signature) => {
    try {
      const resp = await fetch(`${baseUrl}/withdrawn/${gamId}/${signature}`);
      await resp.json();
      setNFTs(await getNft(new PublicKey(pubKeyParam)));
      setRounds([
        ...rounds.slice(0, index),
        { ...rounds[index], isWithdraw: true, signature },
        ...rounds.slice(index + 1),
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const TreasuryAccount = useSelector(
    (state) => new PublicKey(state.platformSlice.treasury_pubkey)
  );
  const claim = async (
    collection_mint,
    game_state_account,
    index,
    is1v1,
    floorPrice
  ) => {
    setCurrIndex(index);
    if (pubKeyParam !== "") {
      setIsWithdrawWinning(true);
      try {
        const signature = await claim_nft(
          pubKeyParam,
          collection_mint,
          game_state_account,
          TreasuryAccount,
          is1v1,
          floorPrice
        );
        await sendWithdrawRequest(game_state_account, index, signature);
        // console.log(signature)
      } catch (error) {
        console.log(error);
      }
      setCurrIndex(-1);
      setIsWithdrawWinning(false);
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
      if (pubKeyParam !== "") {
        setNFTs(await getNft(new PublicKey(pubKeyParam)));
      }
    })();
  }, [pubKeyParam]);

  const [currentTime, setCurrentTime] = useState();

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const resp = await fetch(
        `${baseUrl}/getPlayerGameWinning/${pubKeyParam}`
      );
      const games = await resp.json();
      const parsedGameData = parseWiningRound(games);
      const currentDate = moment();
      // console.log("currentDate", currentDate);
      setCurrentTime(currentDate);
      setRounds(parsedGameData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [pubKeyParam]);
  useEffect(() => {
    if (pubKeyParam !== "") fetchData();
  }, [fetchData, pubKeyParam]);

  const [open, setOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const ConnectModal = () => setOpen(true);
  const CloseModal = () => setOpen(false);

  // console.log("nfts", nfts);
  // console.log("rounds", rounds);

  return (
    <div>
      <div className="items-center justify-between block mb-8 sm:block md:flex lg:flex 2xl:flex">
        <div className="text-2xl font-black tracking-wide text-gray">
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
                  {pubKey === pubKeyParam && (
                    <StyledTableCell align="right">Withdrawal</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rounds.map((round, index) => {
                  return (
                    <>
                      <StyledTableRow>
                        <StyledTableCell>
                          <div className="flex items-center gap-1">
                            <img
                              src={`${compressimagePath}${round.winnerMintImage}.png`}
                              onError={handleImageError}
                              alt={round.winnerMintImage}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40"
                            />

                            {round.winningNFT.map((player) => {
                              return (
                                <img
                                  src={`${
                                    player.mint
                                      ? `${compressimagePath}${player.mint}.png`
                                      : `${player.mint_image}`
                                  }`}
                                  onError={handleImageError}
                                  alt={player.mint_image}
                                  className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                                />
                              );
                            })}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                          <div className="text-space-gray">
                            {round.floorPrice?.toFixed(2)} SOL
                          </div>
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                          <div className="text-space-gray">$ 100</div>
                        </StyledTableCell>
                        <StyledTableCell sx={{ fontFamily: "montserrat" }}>
                          <div className="text-space-gray">100%</div>
                        </StyledTableCell>
                        <StyledTableCell>
                          <img
                            src={eye}
                            alt="eye"
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedIndex(index);
                              ConnectModal();
                            }}
                          />
                        </StyledTableCell>
                        {pubKey === pubKeyParam && (
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {!round.isWithdraw ? (
                              <button
                                disabled={
                                  isWithdrawWinning ||
                                  !currentTime.isBefore(round.expiredTime)
                                }
                                onClick={() => {
                                  console.log("first");
                                  claim(
                                    round.collection_mint,
                                    round.account,
                                    index,
                                    round.is1v1,
                                    round.floorPrice
                                  );
                                }}
                                className={`${
                                  currentTime.isBefore(round.expiredTime)
                                    ? "bg-lighter-blue text-lighter-blue"
                                    : "bg-light-gray text-space-gray cursor-not-allowed"
                                } bg-opacity-[0.09] rounded-lg px-6 py-3  font-bold text-sm tracking-wide`}
                              >
                                {index !== currIndex ? (
                                  `Withdraw`
                                ) : (
                                  <div className="flex gap-4">
                                    <div>withdrawing</div>
                                    <CircularProgress
                                      sx={{ color: "#579AFF" }}
                                      size={20}
                                    />
                                  </div>
                                )}
                              </button>
                            ) : (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={`https://solscan.io/tx/${round.signature}?cluster=${connectionString}`}
                                className="text-lighter-blue"
                              >
                                View Tx
                              </a>
                            )}
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {rounds.map((round, index) => (
            <Box
              sx={{
                display: { xs: "block", sm: "block", md: "none", lg: "none" },
                mt: 3,
              }}
              key={index}
            >
              {/* <div className="flex justify-between">
            <div className="flex items-center">
              <div className="flex gap-1">
                <img
                  src={`${compressimagePath}${round.winnerMintImage}.png`}
                  alt={round.winnerMintImage}
                  className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat opacity-40"
                />

                {round.winningNFT.map((player) => {
                  return (
                    <img
                      src={`${compressimagePath}${player.mint}.png`}
                      alt={player.mint_image}
                      className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat"
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
                    <StyledTableCell align="left">FloorPrice</StyledTableCell>
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
            <div className="flex items-center">
              <div className="w-12 p-4 bg-yankees-blue rounded-2xl">
                <img
                  src={eye}
                  alt="eye"
                  className="w-5 h-4 cursor-pointer"
                  onClick={() => {
                    setSelectedIndex(index);
                    ConnectModal();
                  }}
                />
              </div>
            </div>
          </div> */}

              <div className="bg-yankees-blue rounded-3xl">
                <div className="px-8">
                  <div className="flex">
                    <img
                      src={`${compressimagePath}${round.winnerMintImage}.png`}
                      onError={handleImageError}
                      alt={round.winnerMintImage}
                      className="w-10 h-10 lg:w-10 lg:h-10 rounded-xl"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        {round.winningNFT.map((player) => {
                          return (
                            <img
                              src={`${
                                player.mint
                                  ? `${compressimagePath}${player.mint}.png`
                                  : `${player.mint_image}`
                              }`}
                              onError={handleImageError}
                              alt={player.mint_image}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                            />
                          );
                        })}
                      </div>
                      <div>
                        {pubKey === pubKeyParam && (
                          <div>
                            {!round.isWithdraw ? (
                              <button
                                disabled={isWithdrawWinning}
                                onClick={() =>
                                  claim(
                                    round.collection_mint,
                                    round.account,
                                    index
                                  )
                                }
                                className="bg-lighter-blue bg-opacity-[0.09] rounded-lg px-6 py-3 text-lighter-blue font-bold text-sm tracking-wide"
                              >
                                {index !== currIndex ? (
                                  `Withdraw`
                                ) : (
                                  <div className="flex gap-4">
                                    <div>withdrawing</div>
                                    <CircularProgress
                                      sx={{ color: "#579AFF" }}
                                      size={20}
                                    />
                                  </div>
                                )}
                              </button>
                            ) : (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={`https://solscan.io/tx/${round.signature}?cluster=${connectionString}`}
                                className="text-lighter-blue"
                              >
                                View Tx
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                      <div>Floor Price</div>
                      <div>ROI</div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm font-semibold leading-6 tracking-wide text-gray">
                      <div>{round.floorPrice?.toFixed(2)} SOL</div>
                      <div>600%</div>
                    </div>
                  </div>
                </div>
                <Box
                  sx={{
                    backgroundColor: " rgba(39, 49, 75, 0.4)",
                    borderRadius: "0px 0px 24px 24px",
                    backdropFilter: "blur(40px)",
                    px: 3,
                    py: 2,
                    display: "block",
                    mt: 2,
                  }}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-space-gray font-bold text-xs uppercase text-opacity-[0.64] tracking-wider">
                        TOTAL
                      </div>
                      <div className="mt-1 text-2xl font-black tracking-wide text-gray">
                        $ 19.75
                      </div>
                    </div>
                    <div className="flex">
                      <img
                        src={eye}
                        alt="eye"
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedIndex(index);
                          ConnectModal();
                        }}
                      />
                    </div>
                  </div>
                </Box>
              </div>
            </Box>
          ))}
          <InfoModal
            open={open}
            onClose={CloseModal}
            roundDetails={rounds[selectedIndex]}
          ></InfoModal>
        </>
      )}
    </div>
  );
}
