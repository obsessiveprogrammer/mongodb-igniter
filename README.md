# mongodb-igniter

A declarative MongoDB initializer

[![NPM](https://nodei.co/npm/mongodb-igniter.png)](https://nodei.co/npm/mongodb-igniter/)

[![Join the chat at https://gitter.im/mongodb-igniter/Lobby](https://badges.gitter.im/mongodb-igniter/Lobby.svg)](https://gitter.im/mongodb-igniter/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Description
The purpose of `mongodb-igniter` is to provide an easy way to initialize your application's baseline MongoDB database content from a declarative object format using Node.js.  It maximizes the use of Node.js's async capabilities to process the initialization very quickly, and returns all results in a neatly organized array of objects.  Both the DB declaration and results object formats leverage the MongoDB native driver object types, for simplicity.  It can initiate its own MongoDB connection, or use an existing one.  The module source is written in TypeScript and exposes all relevant types for consumption by IDEs and/or the TypeScript language.

## Features
* Create a MongoDB database connection or use an existing one
* Create collections with any MongoDB supported options
* Create/update indexes with any MongoDB supported options
* Create/replace documents with any MongoDB supported options (uses `replaceOne`)

## Compatibility
The current version uses the [Node.js MongoDB native driver version 2.2](http://mongodb.github.io/node-mongodb-native/2.2/), and therefore supports up to MongoDB 3.4.  An update to the version 3.0 driver and support for MongoDB 3.6 is forthcoming.

For more information on Node.js MongoDB native driver compatibility, see: https://docs.mongodb.com/ecosystem/drivers/driver-compatibility-reference/#node-js-driver-compatibility

## Installation
These instructions assume you have already installed [Node.js](https://nodejs.org/ "Node.js Home Page"), which includes [NPM](https://www.npmjs.com/ "NPM Home Page").

To install the module, use the following command:

```bash
npm install mongodb-igniter
```

or, if you have created a project with a `package.json` file:

```bash
npm install mongodb-igniter --save
```

## Basic Usage

### Create a Database Declaration

First create a configuration object for your database, collections, indexes, and documents using the following property specifications (click the links for more detailed information on the types):

#### `DbDeclaration`:  The overall declaration for the database configuration

| Property | Type | Description |
|----------|------|-------------|
| db       | `string` or `Promise<Db>` | [MongoDB connection URI](https://docs.mongodb.com/manual/reference/connection-string/) or `Promise` which resolves to MongoDB [Db](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html) type |
| options | `MongoClientOptions` | *Optional*:  Options for the [MongoClient.connect()](http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect) method |
| collections | `CollectionDeclaration[]` | This is an array of a custom type in this module.  Details are in the next table. |

#### `CollectionDeclaration`:  A declaration of a collection to create within the database

| Property | Type | Description |
|----------|------|-------------|
| name | `string` | The name of the collection |
| options | `CollectionCreateOptions` | *Optional*:  Options for the [Db.createCollection()](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection) method |
| indexes | `IndexDeclaration[]` | *Optional*:  This is an array of a custom type in this module.  Details are in the next table. |
| documents | `DocumentDeclaration[]` | *Optional*:  This is an array of a custom type in this module.  Details are two tables down. |

#### `IndexDeclaration`:  A declaration of an index to create within a collection

| Property | Type | Description |
|----------|------|-------------|
| keys | `string` or `Object` | This can be the name of a field to create an ascending index on with default options, or an [object which describes the index](https://docs.mongodb.com/manual/indexes/).  See the `fieldOrSpec` parameter of the [Collection.createIndex()](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#createIndex) method for more information on the object format |
| options | `IndexOptions` | *Optional*:  Options for the [Collection.createIndex()](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#createIndex) method |

#### `DocumentDeclaration`:  A declaration of a document to create or replace within a collection.  `mongo-igniter` uses the Node.js MongoDB native driver's [Collection.replaceOne()](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#replaceOne) method for all declared documents.

| Property | Type | Description |
|----------|------|-------------|
| filter | `Object` | An object which describes the [filter](https://docs.mongodb.com/manual/core/document/#document-query-filter) used to locate the document to replace, if it exists.  See the `filter` parameter of the [Collection.replaceOne()](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#replaceOne) method for more information on the object format |
| data | `Object` | The [document data](https://docs.mongodb.com/manual/core/document/) to insert or replace an existing document with
| options | `ReplaceOneOptions` | *Optional*:  Options for the [Collection.replaceOne()](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#replaceOne) method |

#### Example

The following is an example of a Database Declaration:

```javascript
const dbDeclaration = {
  db: 'mongodb://localhost:27017/testdb', // Remember, you can also use an existing connection of type Promise<Db> here
  options: { appname: 'mongodb-igniter' },
  collections: [
    {
      name: 'clients',
      indexes: [
        {
          keys: { clientIdHash: 1 },
          options: {
            unique: true,
            background: true
          }
        }
      ],
      documents: [
        {
          filter: { name: 'Test Client for Mobile' },
          data: {
            name: "Test Client for Mobile",
            clientIdHash: "rdZBlx68P07di+3XZ8hMROh+GrcN9ccO2W0+cZa39jI=",
            clientSecretHash: "$2a$10$8MTa8EaiqsxBSCqdgIv0O.g1jOEyAGm5RmZzEaPB3DxY0/wcZUhzq",
            trustedClient: true
          },
          options: {
            upsert: true
          }
        },
        {
          filter: { name: 'Test Client for Web' },
          data: {
            name: "Test Client for Web",
            clientIdHash: "jqcQMI4QllIFRyTDuirdu3TVQ2r6rjXR4gfUlsYtCG4=",
            clientSecretHash: "$2a$10$gVDmGvOBrOjk.TF6z1TkkuljtkQNH6Ktxs8/mN9qhce3J8vVEWcum",
            redirectUri: "http://localhost:3000/login",
            trustedClient: true
          },
          options: {
            upsert: true
          }
        }
      ]
    },
    {
      name: 'tokens',
      indexes: [
        {
          keys: { userId: 1, clientIdHash: 1 },
          options: {
            name: 'userId_1_clientIdHash_1',
            unique: true,
            background: true
          }
        },
        {
          keys: { expirationDate: 1 },
          options: {
            name: 'expirationDate_1',
            expireAfterSeconds: 31536000, // 1 year in seconds
            background: true
          }
        }
      ]
    },
    {
      name: 'sessions',
      indexes: [
        {
          keys: { expires: 1 },
          options: {
            expireAfterSeconds: 0,
            background: true
          }
        }
      ]
    },
    {
      name: 'users',
      indexes: [
        {
          keys: { email: 1 },
          options: {
            unique: true,
            background: true
          }
        }
      ]
    },
    {
      name: 'logs',
      options: {
        capped: true,
        size: 1048576 // Capped at 1MB in bytes
      }
    }
  ]
};
```

### Initialize the Database

Once you have the database configuration declared, you can use it to initialize the database.  This module was created *"callback-hell"-free*, so the initialization function returns a `Promise`.

#### Examples

Using `Promise.then()`-style syntax, you could do the following:

```javascript
const MongoDbIgniter = require('mongodb-igniter');

MongoDbIgniter.initializeDb(dbDeclaration)
  .then(result => console.log('MongoDB initialization complete'))
  .catch(err => console.log(`MongoDB initialization failed.  Error: ${err.message}`));
```

or using `async`/`await`:

```javascript
const MongoDbIgniter = require('mongodb-igniter');

async function igniteMongoDB() {
  try {
    await MongoDbIgniter.initializeDb(dbDeclaration);
    console.log('MongoDB initialization complete');
  } catch (err) {
    console.log(`MongoDB initialization failed.  Error: ${err.message}`);
  }
}

igniteMongoDB();
```

This is all you need for basic usage.  Depending on your use case, you may want to log or analyze the results of the initialization operations.  See the next section for more information on this.

## Results

`mongodb-igniter` returns results for all operations it performs in a neatly organized array of objects.  The result is an array of collection initialization results (`CollectionInitializationResult[]`), as described below:

#### `CollectionInitializationResult`:  The result of operations on a single initialized collection

| Property | Type | Description |
|----------|------|-------------|
| collectionName | `string` | The name of the initialized collection |
| indexNames | `string[]` | *This property will only exist if there are indexes initialized.*  It is an array of the initialized index names. |
| documentInitializationResults | `ReplaceWriteOpResult[]` | *This property will only exist if there are documents initialized.*  It is an array of [ReplaceWriteOpResult](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mongodb/index.d.ts#L1138), which is the return object from the [Collection.replaceOne()](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#replaceOne) method. |

For a more detailed example of module usage and processing these result objects, see the [TypeScript test folder](./test-ts) or the [JavaScript test folder](./test-js).