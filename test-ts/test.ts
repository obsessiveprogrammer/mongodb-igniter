import { ReplaceWriteOpResult } from 'mongodb';

import * as MongoDbIgniter from '../dist/index';

import { dbDeclaration, dbDeclaration2, dbDeclaration3 } from './db-declaration';

async function testInitializeDb(dbDeclaration: MongoDbIgniter.DbDeclaration): Promise<void> {
    try {
        const collectionInitializationResults: MongoDbIgniter.CollectionInitializationResult[] = await MongoDbIgniter.initializeDb(dbDeclaration);

        collectionInitializationResults.forEach(collectionInitializationResult => {
            console.log(`Initialized collection "${collectionInitializationResult.collectionName}"`);

            if (collectionInitializationResult.indexNames) {
                collectionInitializationResult.indexNames.forEach(indexName => console.log(`Initialized index "${indexName}" in collection "${collectionInitializationResult.collectionName}"`));
            }

            if (collectionInitializationResult.documentInitializationResults) {
                collectionInitializationResult.documentInitializationResults.forEach(documentInitializationResult => {
                    console.log(`Initialized document in collection "${collectionInitializationResult.collectionName}"`);
                    console.log(`\tDocument: ${JSON.stringify(documentInitializationResult.ops[0])}`);
                    console.log(`\tResult: ${JSON.stringify(documentInitializationResult.result)}`);
                    console.log(`\tConnection: ${documentInitializationResult.connection}`);
                    console.log(`\tMatched Count: ${documentInitializationResult.matchedCount.toString()}`);
                    console.log(`\tModified Count: ${documentInitializationResult.modifiedCount.toString()}`);
                    console.log(`\tUpserted Count: ${documentInitializationResult.upsertedCount.toString()}`);
                    if (documentInitializationResult.upsertedId) {
                        console.log(`\tUpserted ID: ${documentInitializationResult.upsertedId._id}`);
                    }
                });
            }
        });
    } catch(err) {
        console.log(err);
    }
}

async function runTests(): Promise<void> {
    await testInitializeDb(dbDeclaration);
    console.log('\n');
    await testInitializeDb(dbDeclaration2);
    console.log('\n');
    await testInitializeDb(dbDeclaration3);
    process.exit(0);
}

runTests();
