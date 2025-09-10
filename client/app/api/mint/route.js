import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { contract, signer } from '../../lib/contract-utils';

/**
 * Handles POST requests to mint a new Study NFT.
 * Expects the 'to' address of the recipient in the request body.
 */
export async function POST(request) {
  // Check if the backend has a signer to send transactions.
  if (!signer) {
    return NextResponse.json({ error: "Private key not configured on the backend." }, { status: 500 });
  }

  try {
    const { to } = await request.json();
    
    // Validate that the provided address is in a valid format.
    if (!to || !ethers.isAddress(to)) {
      return NextResponse.json({ error: "Invalid recipient address ('to') provided." }, { status: 400 });
    }

    // Call the contract's mint function using the backend's signer.
    console.log(`Attempting to mint a new token to ${to}...`);
    const tx = await contract.mint(to);
    
    // Wait for the transaction to be mined on the blockchain.
    await tx.wait();

    console.log(`Mint successful! Transaction Hash: ${tx.hash}`);
    return NextResponse.json({ 
      success: true, 
      txHash: tx.hash,
      message: `Minted token to address ${to}.` 
    });
  } catch (error) {
    console.error("Failed to mint NFT:", error);
    return NextResponse.json({ error: "Failed to mint NFT." }, { status: 500 });
  }
}
