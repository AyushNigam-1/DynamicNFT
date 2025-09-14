"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function MetaMaskConnection() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();


  useEffect(() => {
    // Check for cookie on initial load to set the account state
    const savedAccount = Cookies.get("userAccount");
    if (savedAccount) {
      setAccount(savedAccount);
      router.push("/timer"); // Redirect to the timer page if already connected
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install it to connect.");
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);

        // Start the check and registration process
        setStatusMessage("Checking for existing user...");
        setIsProcessing(true);

        // Check if the user exists in the database
        console.log(connectedAccount)
        const checkResponse = await axios.get(`/api/user/?userAddress=${connectedAccount}`);

        if (!checkResponse.data.success) {
          // If the user does not exist, mint an NFT and create a new user record
          setStatusMessage("New user detected. Minting your first NFT and registering you...");
          const mintResponse = await axios.post('/api/nft', { to: connectedAccount });

          if (mintResponse.data.success) {
            setStatusMessage(`Minting complete! Your token ID is ${mintResponse.data.tokenId}.`);
            // Save the account and redirect
            await axios.post('/api/tokenid', { userAddress: connectedAccount, tokenId: mintResponse.data.tokenId });

            Cookies.set('userAccount', connectedAccount, { expires: 7 });
            router.push('/timer');
          } else {
            setError(`Failed to mint NFT: ${mintResponse.data.error}`);
            setIsProcessing(false);
          }
        } else {
          // If the user already exists, just save and redirect
          setStatusMessage("Welcome back! You are already registered.");
          Cookies.set('userAccount', connectedAccount, { expires: 7 });
          console.log("User already registered:", checkResponse.data.user);
          router.push('/timer');
        }
      }
    } catch (err) {
      console.error("User rejected or error connecting:", err);
      setError('Connection failed. Please try again.');
      setIsProcessing(false);
    } finally {
      setIsConnecting(false);

    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-white p-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-gray-700 rounded-2xl shadow-2xl border border-gray-600">
        <h1 className="text-4xl font-extrabold text-center text-teal-400">
          Connect Wallet
        </h1>

        {!account ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-gray-400">
              Connect your MetaMask wallet to get started.
            </p>
            <button
              onClick={connectWallet}
              disabled={isConnecting || isProcessing}
              className={`px-6 py-3 font-semibold text-lg text-gray-800 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 ${isConnecting || isProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'
                }`}
            >
              {isConnecting ? 'Connecting...' : isProcessing ? 'Please wait...' : 'Connect to MetaMask'}
            </button>
            {isProcessing && (
              <p className="text-sm text-gray-400 italic mt-2 animate-pulse">
                {statusMessage}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">Wallet Connected!</p>
            <p className="text-xl font-mono text-teal-400 break-all">
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
