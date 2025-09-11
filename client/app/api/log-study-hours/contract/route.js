import { NextResponse } from 'next/server';
import { dynamicNFTContract } from '../../lib/contract';

/**
 * Handles POST requests to log study hours for a token.
 * The 'tokenId' and 'hoursToAdd' are expected in the request body.
 */
export async function POST(request) {
  try {
    const { tokenId, hoursToAdd } = await request.json();
    
    if (!tokenId || !hoursToAdd) {
      return NextResponse.json({ error: "Token ID and hoursToAdd are required." }, { status: 400 });
    }

    const tx = await dynamicNFTContract.logStudyHours(tokenId, hoursToAdd);
    await tx.wait();

    return NextResponse.json({ 
      success: true, 
      txHash: tx.hash,
      message: `Logged ${hoursToAdd} hours for token with ID ${tokenId}.` 
    });
  } catch (error) {
    console.error("Failed to log study hours:", error);
    return NextResponse.json({ error: "Failed to log study hours." }, { status: 500 });
  }
}
