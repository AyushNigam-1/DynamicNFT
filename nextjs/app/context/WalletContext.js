// app/context/WalletContext.js
"use client";

import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [signer, setSigner] = useState(null);

    const connectWallet = async () => {
        if (!window.ethereum) throw new Error("MetaMask not installed");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const connectedAccount = accounts[0];

        const signerInstance = await provider.getSigner();

        setAccount(connectedAccount);
        setSigner(signerInstance);

        return { account: connectedAccount, signer: signerInstance };
    };

    return (
        <WalletContext.Provider value={{ account, signer, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}
