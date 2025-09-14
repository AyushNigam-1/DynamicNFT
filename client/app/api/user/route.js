import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';

/**
 * Handles GET requests to fetch user data for a specific user ID.
 * The userId is extracted from the URL path.
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userAddress = searchParams.get('userAddress');
        const db = await dbConnect();

        if (!userAddress) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        // Find the user by their wallet address.
        // We use a Promise wrapper to correctly handle NeDB's callback-based findOne method.
        const user = await new Promise((resolve, reject) => {
            db.findOne({ userAddress }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });

        console.log("Fetched user:", user);

        if (user) {
            return NextResponse.json({ success: true, user });
        } else {
            return NextResponse.json({ success: false, message: "User not found." });
        }
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        return NextResponse.json({ error: "Failed to fetch user data." }, { status: 500 });
    }
}
