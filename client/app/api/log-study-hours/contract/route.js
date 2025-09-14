import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Import the pre-initialized contract instance from your external file.
import { contract } from '../../../lib/contract';

export async function POST(request) {
  // The 'contract' object is now imported and correctly initialized.
  // We can safely remove the old signer check, as it's handled in the import file.

  try {
    const { to, hours } = await request.json();

    // Validate that the provided address and hour are in a valid format.
    if (!to || !ethers.isAddress(to)) {
      return NextResponse.json({ error: "Invalid recipient address ('to') provided." }, { status: 400 });
    }
    if (typeof hours !== 'number' || hours <= 0) {
      return NextResponse.json({ error: "Invalid study hour ('hour') provided." }, { status: 400 });
    }

    // Call the contract's updateStudyTime function using the backend's signer.
    console.log(`Attempting to update study time for ${to}...`);
    const filter = contract.filters.StudyMilestone();

    // After sending tx
    const tx = await contract.updateStudyHours(to, hours);
    const receipt = await tx.wait();

    // Query the block for just that event
    const events = await contract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
    for (const e of events) {
      console.log("Hours:", e.args.totalHours.toString());
      console.log("Level:", e.args.newLevel.toString());
    }

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
