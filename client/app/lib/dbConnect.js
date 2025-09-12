import Datastore from 'nedb';

// Use a simple global variable to cache the database instance
let cachedDb = global.nedb;

if (!cachedDb) {
  // If no cached instance exists, create one
  cachedDb = global.nedb = new Datastore({ filename: './local-database.db', autoload: true });
}

// The function now returns the cached database instance directly
async function dbConnect() {
  return cachedDb;
}

export default dbConnect;