import { Box, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import solana_icon from "../../assets/images/solana_icon.svg";
import { socket } from "../../utils/utils";
import { setAlertIdx } from "../../store/NFTModal";

export default function TipModal({
  show,
  onClose,
  userName,
  ReceiverKey,
  sendDataToParent,
  setLatestTipData,
}) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactionFee, setTransactionFee] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tipCongrats, setTipCongrats] = useState(false);

  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);

  let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fetchBalanceAndFee = async () => {
    try {
      const phantomProvider = window.solana;
      if (!phantomProvider) {
        setErrorMessage("Please install Phantom wallet extension and connect.");
        return;
      }

      const balance = await connection.getBalance(phantomProvider.publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      setCurrentBalance(balanceInSol);

      const { feeCalculator } = await connection.getRecentBlockhash();
      const estimatedFeeLamports = feeCalculator.lamportsPerSignature;
      const estimatedFeeSol = estimatedFeeLamports / LAMPORTS_PER_SOL;
      setTransactionFee(estimatedFeeSol);
    } catch (error) {
      setErrorMessage("Couldn't fetch balance and fee.");
    }
  };

  const sendSol = async () => {
    setIsLoading(true);
    dispatch(
      setAlertIdx({
        info: "Confirming Transaction",
        open: true,
        response: "",
      })
    );
    try {
      const phantomProvider = window.solana;
      const receiverPublicKey = new PublicKey(ReceiverKey);
      const lamportsToSend = Math.floor(amount * LAMPORTS_PER_SOL);
      const { blockhash } = await connection.getRecentBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: phantomProvider.publicKey,
          toPubkey: receiverPublicKey,
          lamports: lamportsToSend,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = phantomProvider.publicKey;

      const signedTransaction = await phantomProvider.signTransaction(
        transaction
      );
      const txId = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      setTransactionStatus(`Transaction successful with id: ${txId}`);
      fetchBalanceAndFee(); // Update balance after successful transaction
      sendDataToParent({ txId, amount, receiverPublicKey });
      onClose();
      dispatch(
        setAlertIdx({
          info: "Transaction Confirmed",
          open: true,
          response: "success",
        })
      );
      setTimeout(() => {
        sendNotificationToServer(receiverPublicKey);
        dispatch(setAlertIdx({ info: "", open: false, response: "success" }));
      }, 1000);
    } catch (error) {
      setTransactionStatus(null);
      setErrorMessage(`Transaction failed: ${error.message}`);
      dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
      setTimeout(() => {
        dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
      }, 1000);
    }

    setIsLoading(false);
  };

  const sendNotificationToServer = (receiverKey) => {
    socket.emit("latest_tip", { receiverKey });
  };

  useEffect(() => {
    socket.on("latest_tip", (data) => {
      setLatestTipData(data[0]);
    });
    // return () => socket.off("latest_tip");
    fetchBalanceAndFee();
    setTipCongrats(true);
  }, [currentBalance, tipCongrats]);

  const setMaxAmount = () => {
    let maxAmount = currentBalance - transactionFee;

    if (maxAmount > 0) {
      // Calculate the floor value up to 3 decimals
      maxAmount = Math.floor(maxAmount * 1000) / 1000;

      // Extract the 4th decimal digit
      const fourthDecimal = Math.floor(maxAmount * 10000) % 10;

      // If the 4th decimal digit is less than 5, reduce the last decimal by 1
      if (fourthDecimal < 5) {
        // Extract the 3rd decimal digit
        const thirdDecimal = Math.floor(maxAmount * 1000) % 10;

        // If the 3rd decimal digit is zero, turn 60 into 59 for example
        if (thirdDecimal === 0) {
          maxAmount = maxAmount - 0.0001;
          maxAmount = (Math.floor(maxAmount * 1000) - 1) / 1000;
        } else {
          maxAmount = maxAmount - 0.0001; // Reduce the last decimal by 1
        }
      }

      // Update the state
      setAmount(maxAmount);
    } else {
      setAmount(0);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      // Regex to allow only numbers and a single decimal point
      setAmount(value);
    }
  };
  const exchangeRate = SOLPrice.data?.priceUsdt;
  const calculateUSD = () => {
    if (amount === "") return "0";
    return (parseFloat(amount) * exchangeRate).toFixed(2); // Round to 2 decimal places
  };

  return (
    <>
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#1C2438",
            boxShadow: 24,
            borderRadius: "24px",
            width: { xs: "300px", sm: "450px", md: "500px", lg: "540px" },
            overflow: { xs: "auto", sm: "auto", md: "auto", lg: "auto" },
            maxHeight: { xs: "450px", sm: "500px", md: "650px", lg: "750px" },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <div className="p-6">
            {/* {error ? (
            <p>Error: {error}</p>
          ) : balance !== null ? (
            <p>Your account balance is: {balance.toFixed(2)} SOL</p>
          ) : (
            <p>Loading...</p>
          )} */}

            {/* <div>
            <h1>Send Solana</h1>
            <p>Current Balance: {currentBalance - transactionFee} SOL</p>
            <p>Estimated Transaction Fee: {transactionFee} SOL</p>
            <input
              type="number"
              placeholder="Amount in SOL"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <button onClick={setMaxAmount}>Max</button>
            <button onClick={sendSol} disabled={isLoading}>
              {isLoading ? "Loading..." : "Send"}
            </button>
            {transactionStatus && <div>{transactionStatus}</div>}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </div> */}

            <div className="flex justify-between items-center">
              <div className="text-gray">
                Tip to
                <span className="text-blue-300 text-blue"> @{userName}</span>
              </div>
              <div>
                <IconButton aria-label="close" size="medium" onClick={onClose}>
                  <CloseIcon sx={{ color: "#6A707F" }} />
                </IconButton>
              </div>
            </div>
            <div className="mt-5 bg-[#06070A] rounded-3xl p-4 text-blue-300">
              <div className="   flex justify-between items-center">
                <div className="text-[6px] md:text-sm text-gray">You tip</div>
                <div className="text-gray">
                  Balance: {currentBalance - transactionFee.toFixed(2)} SOL
                  &nbsp;
                  <button
                    className="bg-blue/25 p-1 text-gray rounded-md text-sm focus:outline-none"
                    onClick={setMaxAmount}
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="flex text-sm md:text-lg justify-between items-center pt-2">
                <div className="flex items-center gap-3">
                  <img src={solana_icon} alt="solana_icon" />
                  <div className="text-gray">SOL</div>
                </div>
                <div>
                  <input
                    placeholder="01"
                    value={amount}
                    // onChange={(e) => setAmount(parseFloat(e.target.value))}
                    onChange={handleAmountChange}
                    className=" w-[5rem] text-end md:w-full bg-transparent focus:outline-none placeholder:text-space-gray text-white"
                  />
                </div>
              </div>
              <div className="flex text-sm md:text-lg justify-between items-center pt-2 text-gray">
                <div className="flex items-center">
                  <h1>Solana</h1>
                </div>
                <div>~${calculateUSD()} </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                disabled={isLoading}
                className=" px-3 py-2 lg:py-3 text-xl lg:px-5 bg-[#5A88FF] text-white rounded-md disabled:bg-gray disabled:cursor-not-allowed"
                onClick={sendSol}
              >
                Tip now
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
