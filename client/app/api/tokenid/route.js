/ app/api / nft - data / route.js
// This API route handles setting and getting a user's NFT token ID using the App Router syntax.

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';

// GET request to retrieve a token ID for a given user address.
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userAddress = searchParams.get('userAddress');

        if (!userAddress) {
            return NextResponse.json({ error: 'Missing userAddress in query parameters' }, { status: 400 });
        }

        const db = await dbConnect();

        return new Promise((resolve) => {
            db.findOne({ userAddress }, (err, doc) => {
                if (err) {
                    console.error('Database find error:', err);
                    return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
                }
                if (!doc) {
                    return resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
                }
                resolve(NextResponse.json({ userAddress: doc.userAddress, tokenId: doc.tokenId }, { status: 200 }));
            });
        });
    } catch (error) {
        console.error('Internal server error in GET:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

// POST request to set or update a token ID.
export async function POST(request) {
    try {
        const { userAddress, tokenId } = await request.json();

        if (!userAddress || tokenId === undefined) {
            return NextResponse.json({ error: 'Missing userAddress or tokenId in request body' }, { status: 400 });
        }

        const db = await dbConnect();

        return new Promise((resolve) => {
            // Find if a document with the userAddress already exists.
            db.findOne({ userAddress }, (err, doc) => {
                if (err) {
                    console.error('Database find error:', err);
                    return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
                }

                if (doc) {
                    // If the user exists, update their token ID.
                    db.update({ userAddress }, { $set: { tokenId } }, {}, (updateErr, numReplaced) => {
                        if (updateErr) {
                            console.error('Database update error:', updateErr);
                            return resolve(NextResponse.json({ error: 'Failed to update token ID' }, { status: 500 }));
                        }
                        resolve(NextResponse.json({ message: 'Token ID updated successfully', numReplaced }, { status: 200 }));
                    });
                } else {
                    // If the user doesn't exist, insert a new document.
                    db.insert({ userAddress, tokenId }, (insertErr, newDoc) => {
                        if (insertErr) {
                            console.error('Database insert error:', insertErr);
                            return resolve(NextResponse.json({ error: 'Failed to insert new user document' }, { status: 500 }));
                        }
                        resolve(NextResponse.json({ message: 'New user and token ID created successfully', newDoc }, { status: 201 }));
                    });
                }
            });
        });
    } catch (error) {
        console.error('Internal server error in POST:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
