import { Db, MongoClient } from 'mongodb';

// Connect to the MongoDB server
export const dbConnection: Promise<Db> = MongoClient.connect('mongodb://localhost:27017/testdb')

// Close the connection to the MongoDB server if the app terminates or restarts
async function closeMongoDbConnection(event: string): Promise<void> {
    const db: Db = await dbConnection;
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
