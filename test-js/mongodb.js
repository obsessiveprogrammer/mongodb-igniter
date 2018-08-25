'use strict';

const MongoClient = require('mongodb').MongoClient;

// Connect to the MongoDB server
const dbConnection = MongoClient.connect('mongodb://localhost:27017/testdb')

// Close the connection to the MongoDB server if the app terminates or restarts
async function closeMongoDbConnection(event) {
    const db = await dbConnection;
    await db.close();
    console.log(`MongoDB connection closed on ${event}`);
}

process.on('SIGINT', async () => {
    await closeMongoDbConnection('app termination');
    process.exit(0);
});

process.on('SIGUSR2', async () => {
    await closeMongoDbConnection('app restart');
    process.kill(process.pid, 'SIGUSR2');
});

module.exports = dbConnection;
