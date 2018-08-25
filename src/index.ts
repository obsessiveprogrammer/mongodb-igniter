/**
 * Module for initializing a MongoDB database from a declarative definition
 */

import { Db, MongoClientOptions, CollectionCreateOptions, IndexOptions, ReplaceOneOptions, ReplaceWriteOpResult, MongoClient, Collection } from 'mongodb';

/**
 * Namespace for the mongodb-igniter module
 */
namespace MongoDbIgniter {
    /**
     * Interface for a declarative MongoDB database definition
     */
    export interface DbDeclaration {
        db: string | Promise<Db>;
        options?: MongoClientOptions;
        collections: CollectionDeclaration[];
    }

    /**
     * Interface for a declarative MongoDB collection definition
     */
    export interface CollectionDeclaration {
        name: string;
        options?: CollectionCreateOptions;
        indexes?: IndexDeclaration[];
        documents?: DocumentDeclaration[];
    }

    /**
     * Interface for a declarative MongoDB index definition
     */
    export interface IndexDeclaration {
        keys: string | Object;
        options?: IndexOptions;
    }

    /**
     * Interface for a declarative MongoDB document definition
     */
    export interface DocumentDeclaration {
        filter: Object;
        data: Object;
        options?: ReplaceOneOptions;
    }

    export interface CollectionInitializationResult {
        collectionName: string;
        indexNames?: string[];
        documentInitializationResults?: ReplaceWriteOpResult[];
    }
}

class MongoDbIgniter {
    /**
     * Initializes a MongoDB database from a declarative DB definition
     * @param dbDeclaration Declarative definition of a DB configuration
     */
    public static async initializeDb(dbDeclaration: MongoDbIgniter.DbDeclaration): Promise<MongoDbIgniter.CollectionInitializationResult[]> {
        if (!dbDeclaration.db) {
            throw new Error('You must provide a "db" property in your DbDeclaration');
        }

        let dbConnection: Db;

        // Get the Db object from the declaration and make sure it's valid
        if (typeof dbDeclaration.db === 'string') {
            dbConnection = await MongoClient.connect(dbDeclaration.db, dbDeclaration.options);
        } else if (await dbDeclaration.db instanceof Db) {
            dbConnection = await dbDeclaration.db;
        } else {
            throw new Error('The "db" parameter must be of type "string" or "Promise<Db>"');
        }

        // Make sure there is at least one collection specified in the declaration
        if (!dbDeclaration.collections || dbDeclaration.collections.length == 0) {
            throw new Error('You must include at least one collection to initialize');
        }

        try {
            const collectionInitializations: Promise<MongoDbIgniter.CollectionInitializationResult>[] = dbDeclaration.collections.map(collection => MongoDbIgniter.initializeCollection(dbConnection, collection));

            return await Promise.all(collectionInitializations);
        } finally {
            if (typeof dbDeclaration.db === 'string') {
                dbConnection.close();
            }
        }
    };

    /**
     * Initializes a MongoDB collection from a declarative configuration
     * @param db A MongoDB database connection
     * @param collectionDeclaration Declarative definition of a collection configuration
     */
    public static async initializeCollection(db: Db, collectionDeclaration: MongoDbIgniter.CollectionDeclaration): Promise<MongoDbIgniter.CollectionInitializationResult> {
        if (!collectionDeclaration.name) {
            throw new Error('You must provide a "name" property for each collection');
        }

        const collection: Collection = await db.createCollection(collectionDeclaration.name, collectionDeclaration.options);

        const collectionInitializationResult: MongoDbIgniter.CollectionInitializationResult = {
            collectionName: collection.collectionName
        };

        if (collectionDeclaration.indexes) {
            const indexInitializations: Promise<string>[] = collectionDeclaration.indexes.map(index => MongoDbIgniter.initializeIndex(collection, index));

            collectionInitializationResult.indexNames = await Promise.all(indexInitializations);
        }

        if (collectionDeclaration.documents) {
            const documentInitializations: Promise<ReplaceWriteOpResult>[] = collectionDeclaration.documents.map(document => MongoDbIgniter.initializeDocument(collection, document));

            collectionInitializationResult.documentInitializationResults = await Promise.all(documentInitializations);
        }

        return collectionInitializationResult;
    }

    public static async initializeIndex(collection: Collection, index: MongoDbIgniter.IndexDeclaration): Promise<string> {
        if (!index.keys) {
            throw new Error('You must provide a "keys" property for each index');
        }

        return collection.createIndex(index.keys, index.options);
    }

    public static async initializeDocument(collection: Collection, document: MongoDbIgniter.DocumentDeclaration): Promise<ReplaceWriteOpResult> {
        if (!document.filter) {
            throw new Error('You must provide a "filter" property for each document');
        }

        if (!document.data) {
            throw new Error('You must provide a "data" property for each document');
        }

        return collection.replaceOne(document.filter, document.data, document.options);
    }
}

export = MongoDbIgniter;
