'use strict';

const MongoDbIgniter = require('../dist/index');

const dbDeclaration = require('./db-declaration').dbDeclaration;
const dbDeclaration2 = require('./db-declaration').dbDeclaration2;
const dbDeclaration3 = require('./db-declaration').dbDeclaration3;

async function testInitializeDb(dbDeclaration) {
	try {
		const collectionInitializationResults = await MongoDbIgniter.initializeDb(dbDeclaration);

		collectionInitializationResults.forEach(collectionInitializationResult => {
			console.log(`Initialized collection "${collectionInitializationResult.collectionName}"`);

			if (collectionInitializationResult.indexNames) {
				collectionInitializationResult.indexNames.forEach(indexNames => console.log(`Initialized index "${indexNames}" in collection "${collectionInitializationResult.collectionName}"`));
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

async function runTests() {
	await testInitializeDb(dbDeclaration);
	console.log('\n');
	await testInitializeDb(dbDeclaration2);
	console.log('\n');
	await testInitializeDb(dbDeclaration3);
	process.exit(0);
}

runTests();
