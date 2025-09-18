import { NextResponse } from 'next/server';
import { contract, signer } from '../../lib/contract';
import { ethers } from 'ethers';

/**
 * Handles GET requests to fetch the token URI for a given NFT.
 * The token ID is expected as a URL query parameter (e.g., /api/get-uri?tokenId=1).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId');

    // Ensure a valid tokenId was provided.
    if (!tokenId) {
      return NextResponse.json({ error: "Token ID is required." }, { status: 400 });
    }

    // Call the tokenURI function on the pre-initialized contract instance.
    const tokenURI = await contract.tokenURI(tokenId);

    // Return the token URI as a JSON response.
    return NextResponse.json({ tokenURI });
  } catch (error) {
    console.error("Failed to fetch token URI:", error);
    return NextResponse.json({ error: "Failed to fetch token URI." }, { status: 500 });
  }
}

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
    console.log(contract.filters)
    const filter = contract.filters.Minted();

    // Call the contract's mint function using the backend's signer.
    console.log(`Attempting to mint a new token to ${to}...`);
    const tx = await contract.mint(to);

    // Wait for the transaction to be mined on the blockchain.
    const receipt = await tx.wait();

    // Query the block for just that event
    const events = await contract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
    let tokenId = null;
    for (const e of events) {
      tokenId = e.args.tokenId.toString();
    }
    console.log(`Mint successful! Transaction Hash: ${tx.hash}`);
    return NextResponse.json({
      success: true,
      tokenId,
      message: `Minted token to address ${to}.`
    });
  } catch (error) {
    console.error("Failed to mint NFT:", error);
    return NextResponse.json({ error: "Failed to mint NFT." }, { status: 500 });
  }
}
