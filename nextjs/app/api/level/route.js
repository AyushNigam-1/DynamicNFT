import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import database from '../../lib/database';
// Import the pre-initialized contract instance from your external file.
import { contract, signer } from '../../lib/contract';

export async function POST(request) {
  try {
    const db = await database();
    const { to } = await request.json();

    if (!to || !ethers.isAddress(to)) {
      return NextResponse.json({ error: "Invalid recipient address ('to') provided." }, { status: 400 });
    }

    // Fetch total study time (in seconds) from database
    const totalTime = await new Promise((resolve, reject) => {
      db.findOne({ userAddress: to }, (err, doc) => {
        if (err) return reject(err);
        if (!doc) return resolve(0); // default if user not found
        resolve(doc.totalStudyTime || 0);
      });
    });

    console.log("Total time (seconds):", totalTime);

    // Get hoursPerLevel from contract
    const hoursPerLevel = Number(await contract.hoursPerLevel());
    const secondsPerLevel = hoursPerLevel * 3600;

    let newLevel = 1;
    while (totalTime >= secondsPerLevel * newLevel) {
      newLevel++;
    }

    // Correct: solidityPacked encoding
    const messageHash = ethers.keccak256(
      ethers.solidityPacked(
        ["address", "uint256", "uint256", "address"],
        [to, BigInt(totalTime), BigInt(newLevel), contract.target]
      )
    );

    // Correct: sign with EIP-191 prefix
    const signature = await signer.signMessage(ethers.getBytes(messageHash));

    return NextResponse.json({
      success: true,
      totalTime,   // now in seconds
      newLevel,
      signature
    });

  } catch (error) {
    console.error("Error generating signed message:", error);
    return NextResponse.json({ error: "Failed to generate signed message." }, { status: 500 });
  }
}