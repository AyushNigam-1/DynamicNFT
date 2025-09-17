import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import the pre-initialized contract instance from your external file.
import { contract } from '../../../lib/contract';

export async function POST(request) {
  // The 'contract' object is now imported and correctly initialized.
  // We can safely remove the old signer check, as it's handled in the import file.

  try {
    const { to, level } = await request.json();

    // Validate that the provided address and hour are in a valid format.
    if (!to || !ethers.isAddress(to)) {
      return NextResponse.json({ error: "Invalid recipient address ('to') provided." }, { status: 400 });
    }
    if (typeof level !== 'number' || level <= 0) {
      return NextResponse.json({ error: "Invalid study hour ('hour') provided." }, { status: 400 });
    }

    // Call the contract's updateStudyTime function using the backend's signer.
    console.log(`Attempting to update study time for ${to}...`);
    // After sending tx
    const tx = await contract.setStudyLevel(to, level);
    await tx.wait();

    console.log(`Update successful! Transaction Hash: ${tx.hash}`);
    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      contractAddress: contract.target,
      message: `Updated study time for address ${to}.`
    });

  } catch (error) {
    console.error("Failed to update study time:", error);
    // Log the full error to the console for debugging
    console.error("Full error object:", error);

    // Return a more generic error to the user
    return NextResponse.json({ error: "Failed to update study time on the blockchain." }, { status: 500 });
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    // Validate that the provided address is a valid Ethereum address.
    if (!userAddress || !ethers.isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid user address provided." }, { status: 400 });
    }

    console.log(`Attempting to get level for address: ${userAddress}`);

    // Call the contract's getStudyLevel function to retrieve the level for the address.
    // This assumes the contract has a public view function that returns the level.
    const level = await contract.getStudyLevel(userAddress);

    // The contract function will likely return a BigInt or similar type. Convert it to a number.
    const userLevel = Number(level);

    console.log(`Successfully retrieved level: ${userLevel} for address: ${userAddress}`);

    return NextResponse.json({
      success: true,
      level: userLevel,
      message: `Retrieved study level for address ${userAddress}.`
    });

  } catch (error) {
    console.error("Failed to get study level:", error);
    // Log the full error to the console for debugging.
    console.error("Full error object:", error);

    // Return a more generic error to the user.
    return NextResponse.json({ error: "Failed to retrieve study level from the blockchain." }, { status: 500 });
  }
}