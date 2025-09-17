import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// Load the private key from environment variables.
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const CONTRACT_ADDRESS = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
const RPC_URL = "http://127.0.0.1:8545";

// --- Load the ABI directly from the Foundry artifact ---  
let CONTRACT_ABI;
try {
    const artifactPath = path.join(process.cwd(), 'out', 'DynamicNFT.sol', 'StudyNFT.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    CONTRACT_ABI = artifact.abi;
} catch (error) {
    console.error("Failed to load contract ABI from Foundry artifact:", error);
    CONTRACT_ABI = [
        "function mint(address to)"
    ];
}

// Initialize the provider and a signer for the backend.
export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const signer = new ethers.Wallet(PRIVATE_KEY, provider);
export const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);