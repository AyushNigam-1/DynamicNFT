import { useMemo } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/StudyNFTUpgradeable.json"; // export ABI separately from your build

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
/**
 * Hook to get contract instance.
 * @param {ethers.Signer | null} signer - signer from MetaMask or WalletConnect
 * @returns {ethers.Contract | null} - contract instance connected with signer
 */
export function useContract(signer) {
    return useMemo(() => {
        if (!signer) return null;

        try {
            return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
        } catch (error) {
            console.error("Failed to initialize contract:", error);
            return null;
        }
    }, [signer]);
}
