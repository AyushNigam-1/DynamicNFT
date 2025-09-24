"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useWallet } from "./context/WalletContext";
import { mint } from "./services/nft";


export default function MetaMaskConnection() {
  const { Wallet, account } = useWallet();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // useEffect(() => {
  //   // If account is already stored in cookies, redirect
  //   const savedAccount = Cookies.get("userAccount");
  //   if (savedAccount) {
  //     router.push("/timer");
  //   }
  // }, [router]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError("");

      // 🔹 This comes from WalletContext (sets account & signer globally)
      const { account, contract } = await Wallet();

      // Start the check and registration process
      setStatusMessage("Checking for existing user...");
      setIsProcessing(true);

      // Check if the user exists in the database
      const checkResponse = await axios.get(
        `/api/user/?userAddress=${account}`
      );
      console.log(checkResponse.data);
      if (!checkResponse.data.success) {
        // New user → mint NFT
        setStatusMessage(
          "New user detected. Minting your first NFT and registering you..."
        );

        const { tokenId, success } = await mint(account, contract);

        if (success) {

          await axios.post("/api/tokenid", {
            userAddress: account,
            tokenId: tokenId,
          });

          // Save in cookies
          Cookies.set("userAccount", account, { expires: 7 });
          router.push("/timer");
        } else {
          // setError(`Failed to mint NFT: ${mintResponse.data.error}`);
          setIsProcessing(false);
        }
      } else {
        // Existing user
        setStatusMessage("Welcome back! You are already registered.");
        Cookies.set("userAccount", account, { expires: 7 });
        router.push("/timer");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Connection failed. Please try again.");
      setIsProcessing(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.substring(0, 8);
    const end = address.substring(address.length - 8);
    return `${start}...${end}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 font-mono">
      <div className="w-full max-w-sm p-8 space-y-4 bg-gray-700 rounded-2xl shadow-2xl border border-gray-600">
        <h1 className="text-4xl font-extrabold text-center text-gray-200">
          Connect Wallet
        </h1>

        {!account ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-gray-400">
              Connect your MetaMask wallet to get started.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting || isProcessing}
              className={`px-6 py-3 cursor-pointer font-semibold text-lg text-gray-800 rounded-xl w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 ${isConnecting || isProcessing
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500 hover:text-gray-900"
                }`}
            >
              {isConnecting
                ? "Connecting..."
                : isProcessing
                  ? "Please wait..."
                  : "Connect to MetaMask"}
            </button>
            {isProcessing && (
              <p className="text-sm text-gray-400 italic mt-2 animate-pulse">
                {statusMessage}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center flex flex-col items-center space-y-4">
            <p className="text-gray-400">Wallet Connected!</p>
            <p className="text-xl font-mono text-gray-400 break-all">
              {truncateAddress(account)}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 bg-red-900 bg-opacity-30 p-2 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
