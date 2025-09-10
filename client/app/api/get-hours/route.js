import { NextResponse } from 'next/server';
import { contract } from '../../lib/contract';

export async function GET() {
    try {
        const hoursPerLevel = await contract.HOURS_PER_LEVEL();
        console.log(hoursPerLevel)
        return NextResponse.json({ hoursPerLevel: hoursPerLevel.toString() });
    } catch (error) {
        console.error("Failed to fetch HOURS_PER_LEVEL:", error);
        return NextResponse.json({ error: "Failed to fetch HOURS_PER_LEVEL." }, { status: 500 });
    }
}
