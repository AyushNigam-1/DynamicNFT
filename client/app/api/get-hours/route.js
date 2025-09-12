// app/api/contract/route.js
import { NextResponse } from 'next/server';
import { contract } from '../../lib/contract';

// GET request to retrieve the HOURS_PER_LEVEL from the contract.
export async function GET() {
    try {
        const hoursPerLevel = await contract.HOURS_PER_LEVEL();
        console.log("HOURS_PER_LEVEL:", hoursPerLevel.toString());

        return NextResponse.json({ hoursPerLevel: hoursPerLevel.toString() });
    } catch (error) {
        console.error("Failed to fetch HOURS_PER_LEVEL:", error);
        return NextResponse.json(
            { error: "Failed to fetch HOURS_PER_LEVEL." },
            { status: 500 }
        );
    }
}

// POST request to call the setHoursPerLevel function on the contract.
export async function POST(request) {
    try {
        const { newHours } = await request.json();

        if (!newHours) {
            return NextResponse.json(
                { error: 'Missing newHours in request body' },
                { status: 400 }
            );
        }

        // Use the already connected contract (with signer)
        const tx = await contract.setHoursPerLevel(newHours);
        const receipt = await tx.wait();

        console.log("Transaction successful:", receipt.hash);

        return NextResponse.json(
            { message: "Transaction successful", transactionHash: receipt.hash },
            { status: 200 }
        );

    } catch (error) {
        console.error("Failed to set HOURS_PER_LEVEL:", error);
        return NextResponse.json(
            { error: 'Failed to set HOURS_PER_LEVEL.', details: error.message },
            { status: 500 }
        );
    }
}
