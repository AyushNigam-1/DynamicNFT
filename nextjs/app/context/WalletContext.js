"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ethers } from "ethers";
import CONTRACT_ABI from "../../out/NFT.sol/StudyNFTUpgradeable.json";

const WalletContext = createContext();
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export function WalletProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const Wallet = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!window.ethereum) throw new Error("MetaMask not installed");

                const provider = new ethers.BrowserProvider(window.ethereum);

                // 1️⃣ Request accounts first
                const accounts = await provider.send("eth_requestAccounts", []);
                if (!accounts || accounts.length === 0) throw new Error("No accounts found");
                const connectedAccount = accounts[0];

                // 2️⃣ Get signer
                const signerInstance = await provider.getSigner();

                // 3️⃣ Get network from provider, not signer
                const network = await provider.getNetwork(); // returns { chainId, name }
                console.log("Connected network:", network);

                console.log(network.chainId)
                if (network.chainId !== 31337n) throw new Error("Switch MetaMask to localhost 31337 network");
                // 4️⃣ Create contract
                const contractInstance = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI.abi,
                    signerInstance
                );

                setAccount(connectedAccount);
                setSigner(signerInstance);
                setContract(contractInstance);

                resolve({ account: connectedAccount, signer: signerInstance, contract: contractInstance });
            } catch (err) {
                reject(err);
            }
        });
    }, []);




    return (
        <WalletContext.Provider value={{ Wallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContext);
}
