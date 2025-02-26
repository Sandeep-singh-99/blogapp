import { Connection } from 'mongoose';

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    },

    var mongoClient: { conn: MongoClient | null; promise: Promise<MongoClient> | null };
}

export {}