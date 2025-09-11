import dbConnect from '../../../lib/dbConnect';
import StudyTime from '../../../models/user';
import { NextResponse } from 'next/server';

/**
 * This API route handles fetching a user's total study time using the GET method.
 * @param {import('next/server').NextRequest} request The incoming request.
 */
export async function GET(request) {
    // Ensure a connection to the database.
    await dbConnect();

    try {
        // Get the userId from the URL search parameters.
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
        }

        // Find the study time record for the user.
        const studyTime = await StudyTime.findOne({ userId });
        console.log(studyTime)
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
    // Ensure a connection to the database.
    await dbConnect();

    try {
        // Get the userId and time from the request body.
        const { userId, timeInSeconds } = await request.json();

        if (!userId || typeof timeInSeconds !== 'number') {
            return NextResponse.json({ success: false, error: 'User ID and time are required.' }, { status: 400 });
        }

        // Find the user's study time record or create a new one.
        const result = await StudyTime.findOneAndUpdate(
            { userId },
            { $inc: { totalStudyTime: timeInSeconds } }, // Increment the total study time.
            {
                new: true, // Return the updated document.
                upsert: true, // Create a new document if one doesn't exist.
                setDefaultsOnInsert: true, // Apply schema defaults on creation.
            }
        );

        return NextResponse.json({ success: true, totalStudyTime: result.totalStudyTime });
    } catch (error) {
        console.error('POST request error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update study time.' }, { status: 500 });
    }
}
