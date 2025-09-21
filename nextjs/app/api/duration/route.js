import { NextResponse } from 'next/server';
import database from '../../lib/database';

// GET: retrieve timeDuration for a given user
// POST: set/update timeDuration for a given user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userAddress = searchParams.get('userAddress');
        const db = await database();
        console.log("Fetching timeDuration for userAddress:", userAddress);
        if (!userAddress) {
            return NextResponse.json({ error: 'userAddress is required' }, { status: 400 });
        }

        const doc = await db.findOne({ userAddress });
        // console.log("Fetched document:", doc);
        if (!doc) {
            return NextResponse.json({ error: 'User not found' }, { status: 201 });
        }

        return new Promise((resolve) => {
            db.findOne({ userAddress }, (err, doc) => {
                if (err) {
                    console.error('Database find error:', err);
                    return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));
                }
                if (!doc) {
                    return resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
                }
                resolve(NextResponse.json({ timeDuration: doc.timeDuration }, { status: 200 }));
            });
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { userAddress, timeDuration } = body;
        const db = await database();

        if (!userAddress || typeof timeDuration !== 'number') {
            return NextResponse.json({ error: 'userAddress and timeDuration are required' }, { status: 400 });
        }

        const doc = await db.findOne({ userAddress });

        if (doc) {
            // Update existing user
            await db.update(
                { userAddress },
                { $set: { timeDuration } },
                { multi: false }
            );
        } else {
            // Insert new user with timeDuration
            await db.insert({ userAddress, timeDuration });
        }

        return NextResponse.json({ message: 'timeDuration set successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
