import { NextResponse } from 'next/server';
import { contract } from '../../lib/contract';

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
