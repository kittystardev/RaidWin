import React, { createContext, useContext } from "react";
import { useState } from "react";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [discord, setDiscord] = useState({ name: null, avatar: null, id: null });
  const [twitter, setTwitter] = useState({ name: null, id: null });
  return (
    <WalletContext.Provider value={{ discord, setDiscord, twitter, setTwitter }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
