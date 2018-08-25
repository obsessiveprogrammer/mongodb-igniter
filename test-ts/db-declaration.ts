import { DbDeclaration } from '../dist/db-declaration';

import { dbConnection } from './mongodb';

export const dbDeclaration: DbDeclaration = {
    db: 'mongodb://localhost:27017/testdb',
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
                },
                {
                    keys: { encryptedAccessToken: 1 },
                    options: {
                        name: 'encryptedAccessToken_1',
                        unique: true,
                        background: true
                    }
                },
                {
                    keys: { encryptedRefreshToken: 1 },
                    options: {
                        name: 'encryptedRefreshToken_1',
                        unique: true,
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
                },
                {
                    keys: { googleId: 1 },
                    options: {
                        name: 'googleId_1',
                        unique: true,
                        background: true
                    }
                },
                {
                    keys: { googleId: 1, email: 1 },
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

function deepClone(object: any): any {
    return JSON.parse(JSON.stringify(object));
}

function getDbDeclaration2(dbDeclarationToCopy: DbDeclaration): DbDeclaration {
    const dbDeclaration = deepClone(dbDeclarationToCopy);
    dbDeclaration.options = { appname: 'mongodb-igniter' };
    return dbDeclaration;
}

export const dbDeclaration2: DbDeclaration = getDbDeclaration2(dbDeclaration);

function getDbDeclaration3(dbDeclarationToCopy: DbDeclaration): DbDeclaration {
    const dbDeclaration: DbDeclaration = deepClone(dbDeclarationToCopy);
    dbDeclaration.db = dbConnection;
    return dbDeclaration;
}

export const dbDeclaration3: DbDeclaration = getDbDeclaration3(dbDeclaration);
