import dbConnect from '../../../lib/dbConnect';
import { NextResponse } from 'next/server';

/**
 * This API route handles fetching a user's total study time using the GET method.
 * @param {import('next/server').NextRequest} request The incoming request.
 */
export async function GET(request) {
    // Get the database instance
    const db = await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
        }

        // NeDB's findOne method
        const studyTime = await new Promise((resolve, reject) => {
            db.findOne({ userId }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });

        if (!studyTime) {
            // If no record is found, return a default of 0.
            return NextResponse.json({ success: true, totalStudyTime: 0 });
        }

        return NextResponse.json({ success: true, totalStudyTime: studyTime.totalStudyTime });
    } catch (error) {
        console.error('GET request error:', error);
        return NextResponse.json({ success: false, error: 'Failed to retrieve study time.' }, { status: 500 });
    }
}

/**
 * This API route handles updating a user's total study time using the POST method.
 * @param {import('next/server').NextRequest} request The incoming request.
 */
export async function POST(request) {
    // Get the database instance
    const db = await dbConnect();

    try {
        const { userId, timeInSeconds } = await request.json();

        if (!userId || typeof timeInSeconds !== 'number') {
            return NextResponse.json({ success: false, error: 'User ID and time are required.' }, { status: 400 });
        }

        // NeDB's update with upsert to find and increment or create
        const updatedDoc = await new Promise((resolve, reject) => {
            db.update(
                { userId },
                { $inc: { totalStudyTime: timeInSeconds } },
                { upsert: true, returnUpdatedDocs: true },
                (err, numAffected, newDoc) => {
                    if (err) reject(err);
                    resolve(newDoc);
                }
            );
        });

        return NextResponse.json({ success: true, totalStudyTime: updatedDoc.totalStudyTime });
    } catch (error) {
        console.error('POST request error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update study time.' }, { status: 500 });
    }
}
